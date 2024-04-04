from flask_mail import Message
from flask import url_for
from .verification import generate_verification_token


def send_verification_email(email, name, mail_app, serializer):
    token = generate_verification_token(email, serializer)
    verification_url = url_for('verify_email', token=token, _external=True)
    
    msg = Message('Завершение регистрации на HueHub', sender="huehubmessenger@gmail.com", recipients=[email])
    msg.body = f'{name}, перейдите по ссылке для завершения регистрации: {verification_url}'
    mail_app.send(msg)