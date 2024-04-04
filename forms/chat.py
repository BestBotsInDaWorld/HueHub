from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, TextAreaField, SubmitField, EmailField, BooleanField, SelectMultipleField
from wtforms.validators import DataRequired


class ChatForm(FlaskForm):
    description = StringField('Описание')
    friends = SelectMultipleField('Добавить друзей', validators=[DataRequired()], coerce=int)
    submit = SubmitField('Создать чат')
