from flask import render_template, request, abort, jsonify
from flask_login import login_required, current_user
from forms.chat import ChatForm
from data import db_session
from data.users.users import User
from data.chats.chats import Chat, ChatMessage, ChatImage
from settings import app, CHAT_IMAGES_DIR
from requests_app import load_user
from flask import render_template
from sqlalchemy.orm import joinedload
import json
import os


def chat_last_message(chat):
    if chat.last_message:
        return chat.last_message.content
    return ''


def chat_last_message_user(chat):
    if chat.last_message:
        return chat.last_message.user.fullname + ': '
    return ''


@app.route('/chats', methods=['GET'])
@login_required
def chats():
    form = ChatForm()
    user = load_user(current_user.id)
    form.friends.choices = [(friend.id, friend.name, friend.surname, friend.img) for friend in user.friends]
    dialogs = [([member.fullname for member in dialog.users if member != user][0],
                [member.img for member in dialog.users if member != user][0],
                dialog,
                f"{chat_last_message_user(dialog)}{chat_last_message(dialog)}") for dialog in user.dialogs]
    chats = [(chat.title,
              chat.img,
              chat,
              f"{chat_last_message_user(chat)}{chat_last_message(chat)}") for chat in user.chats]
    chat_list = sorted((dialogs + chats), key=lambda item: item[2].last_update, reverse=True)
    return render_template('chat.html', form=form, user=user, chat_list=chat_list)


@app.route('/get_chats', methods=['GET'])
def get_chats():
    user = load_user(current_user.id)
    dialogs = [{"title": [member.fullname for member in dialog.users if member != user][0],
                "img": [member.img for member in dialog.users if member != user][0],
                "id": dialog.id,
                "chat_url": dialog.chat_url,
                "avatar_dir": dialog.avatar_dir,
                "last_message": chat_last_message(dialog),
                "last_message_user": chat_last_message_user(dialog),
                "last_update": dialog.last_update.strftime('%Y-%m-%d %H:%M:%S.%f')} for dialog in user.dialogs]
    chats = [{"title": chat.title,
              "img": chat.img,
              "id": chat.id,
              "chat_url": chat.chat_url,
              "avatar_dir": chat.avatar_dir,
              "last_message": chat_last_message(chat),
              "last_message_user": chat_last_message_user(chat),
              "last_update": chat.last_update.strftime('%Y-%m-%d %H:%M:%S.%f')} for chat in user.chats]
    chat_list = sorted((dialogs + chats), key=lambda item: item["last_update"], reverse=True)
    return jsonify(chat_list)


@app.route('/create_chat', methods=['POST'])
@login_required
def create_chat():
    db_sess = db_session.create_session()
    data = json.loads(request.data)
    checked_friends = data.get('checkedFriends', [])
    if not checked_friends:
        return jsonify({'message': 'No friends selected'})
    title = data.get('title', '')
    description = data.get('description', '')
    user = db_sess.query(User).get(current_user.id)
    new_chat = Chat(title=title, description=description, owner=user.id)
    user.chats.append(new_chat)
    for user_id in checked_friends:
        user = db_sess.query(User).get(user_id)
        user.chats.append(new_chat)
    db_sess.add(new_chat)
    db_sess.commit()
    return jsonify({'message': 'Success'})



@app.route("/chat/<chat_id>")
@login_required
def chat(chat_id):
    try:
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        chat = db_sess.query(Chat).get(chat_id)
        if chat not in user.chats:
            abort(404)
        chat_messages = sorted(db_sess.query(ChatMessage).options(joinedload(ChatMessage.images)).
                                 filter_by(chat_id=chat_id).all(), key=lambda chat_message: chat_message.created_date, reverse=True)
        return render_template('group.html', user=user, chat_messages=chat_messages, chat=chat)
    except Exception as e:
        print(e)
        abort(404)


@app.route('/upload_chat_message', methods=['POST'])
@login_required
def upload_chat_message():
    try:
        text = request.form.get('text')
        img_count = request.form.get('img_count')
        chat_id = int(request.form.get('chat_id'))
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        new_message = ChatMessage(
            content=text,
            user_id=current_user.id,
            user=user,
            chat_id=chat_id,
            handling_images=True,
        )
        db_sess.add(new_message)
        db_sess.commit()
        for i in range(1, int(img_count) + 1):
            cur_img = request.files[f'photo_{i}']
            url = f"chat_message_{str(new_message.id)}_image_{i}.jpg"
            file_path = os.path.join(CHAT_IMAGES_DIR, url)
            new_chat_image = ChatImage(
                url=url,
                chat_id=new_message.id
            )
            new_message.images.append(new_chat_image)
            cur_img.save(file_path)
            db_sess.add(new_chat_image)
        new_message.handling_images = False
        chat = db_sess.query(Chat).get(chat_id)
        chat.last_message = new_message
        chat.last_update = new_message.created_date
        db_sess.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500
    

@app.route('/get_last_chat_messages', methods=['POST'])
@login_required
def get_last_chat_messages():
    try:
        chat_id= int(request.form.get('chatId'))
        last_message_id = int(request.form.get('lastMessageId'))
        db_sess = db_session.create_session()
        chat = db_sess.query(Chat).get(chat_id)
        latest_chat_messages = filter(lambda message: message.id > last_message_id and message.handling_images == False, chat.messages)
        fetch_chat_messages = [{
            'id' : chat_message.id,
            'content': chat_message.content,
            'createdDate': chat_message.created_date.strftime('%Y-%m-%d %H:%M:%S.%f'),
            'userId': chat_message.user.id,
            'userImg': chat_message.user.img,
            'userFullname': chat_message.user.fullname,
            'images': [image.url for image in chat_message.images]
        } for chat_message in latest_chat_messages]
        return jsonify({'messages': fetch_chat_messages, 
                        'message': 'Success'}), 200 
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500