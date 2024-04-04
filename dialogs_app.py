from flask import request, jsonify, render_template, abort
from flask_login import login_required, current_user
from data import db_session
from sqlalchemy.orm import joinedload
from data.users.users import User
from data.chats.dialogs import Dialog, DialogMessage, DialogImage, user_to_dialog
from settings import app, DIALOG_IMAGES_DIR
import os


@app.route("/dialog/<dialog_id>")
@login_required
def dialog(dialog_id):
    try:
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        dialog = db_sess.query(Dialog).get(dialog_id)
        if dialog not in user.dialogs:
            abort(404)
        dialog_user = None
        for relationship in db_sess.query(user_to_dialog).filter(user_to_dialog.c.dialog_id == dialog_id).all():
            if relationship.user_id != current_user.id:
                dialog_user = db_sess.query(User).get(relationship.user_id)
        dialog_messages = sorted(db_sess.query(DialogMessage).options(joinedload(DialogMessage.images)).
                                 filter_by(dialog_id=dialog_id).all(), key=lambda dialog_message: dialog_message.created_date, reverse=True)
        return render_template('dialog.html', user=user, dialog_user=dialog_user, dialog_messages=dialog_messages, dialog_id=dialog_id)
    except Exception as e:
        print(e)
        abort(404)


@app.route('/upload_dialog_message', methods=['POST'])
@login_required
def upload_dialog_message():
    try:
        text = request.form.get('text')
        img_count = request.form.get('img_count')
        dialog_id = int(request.form.get('chat_id'))
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        new_message = DialogMessage(
            content=text,
            user_id=current_user.id,
            user=user,
            dialog_id=dialog_id,
            handling_images=True,
        )
        db_sess.add(new_message)
        db_sess.commit()
        for i in range(1, int(img_count) + 1):
            cur_img = request.files[f'photo_{i}']
            url = f"dialog_message_{str(new_message.id)}_image_{i}.jpg"
            file_path = os.path.join(DIALOG_IMAGES_DIR, url)
            new_dialog_image = DialogImage(
                url=url,
                dialog_id=new_message.id
            )
            new_message.images.append(new_dialog_image)
            cur_img.save(file_path)
            db_sess.add(new_dialog_image)
        new_message.handling_images = False
        dialog = db_sess.query(Dialog).get(dialog_id)
        dialog.last_message = new_message
        dialog.last_update = new_message.created_date
        db_sess.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500



@app.route('/get_dialog', methods=['GET', 'POST'])
@login_required
def get_dialog():
    try:
        dialog_user_id = int(request.form.get('dialogUserId'))
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        dialog_user = db_sess.query(User).get(dialog_user_id)
        dialog =  list(filter(lambda dialog: dialog_user in dialog.users, user.dialogs))
        if dialog:
            return jsonify({'dialogId': dialog[0].id, 'message': 'Success'}), 200
        new_dialog = Dialog()
        new_dialog.users.append(user)
        new_dialog.users.append(dialog_user)
        db_sess.add(new_dialog)
        db_sess.commit()
        return jsonify({'dialogId': new_dialog.id, 'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500


@app.route('/get_last_dialog_messages', methods=['POST'])
@login_required
def get_last_dialog_messages():
    try:
        dialog_id = int(request.form.get('dialogId'))
        last_message_id = int(request.form.get('lastMessageId'))
        db_sess = db_session.create_session()
        dialog = db_sess.query(Dialog).get(dialog_id)
        latest_dialog_messages = filter(lambda message: message.id > last_message_id and message.handling_images == False, dialog.messages)
        fetch_dialog_messages = [{
            'id' : dialog_message.id,
            'content': dialog_message.content,
            'createdDate': dialog_message.created_date.strftime('%Y-%m-%d %H:%M:%S.%f'),
            'userId': dialog_message.user.id,
            'userImg': dialog_message.user.img,
            'userFullname': dialog_message.user.fullname,
            'images': [image.url for image in dialog_message.images]
        } for dialog_message in latest_dialog_messages]
        return jsonify({'messages': fetch_dialog_messages, 
                        'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500