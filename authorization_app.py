from flask import render_template, redirect
from flask_login import login_user
from forms.user import RegisterForm, LoginForm
from data import db_session
from data.users.users import User
from data.mail_verification.temporary_users import TemporaryUser
from data.users.password_complexity_check import password_complexity_check
from settings import app, mail_app, serializer
from data.mail_verification.send_mail import send_verification_email
from data.mail_verification.verification import verify_token
from flask import render_template
from data import db_session


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            return redirect("/")
        temporary_user = db_sess.query(TemporaryUser).filter(TemporaryUser.email == form.email.data).first()
        if temporary_user and temporary_user.check_password(form.password.data):
            message = "Адрес электронной почты ожидает подтверждения"
        else:
            message = "Неправильный логин или пароль"
        return render_template('login.html',
                               message=message,
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)



@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        if form.password.data != form.password_again.data:
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Пароли не совпадают")
        conclusion = password_complexity_check(form.password.data)
        if conclusion:
            return render_template('register.html', title='Регистрация',
                        form=form,
                        message=conclusion) 
        db_sess = db_session.create_session() 
        if db_sess.query(User).filter(User.email == form.email.data).first() or db_sess.query(TemporaryUser).filter(TemporaryUser.email == form.email.data).first():
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Такой пользователь уже есть")
        send_verification_email(form.email.data, f"{form.surname.data} {form.name.data}", mail_app, serializer)
        temporary_user = TemporaryUser(
            name=form.name.data,
            surname=form.surname.data,
            email=form.email.data,
        )
        temporary_user.set_password(form.password.data)
        db_sess.add(temporary_user)
        db_sess.commit()
        return redirect('/login')

    return render_template('register.html', title='Регистрация', form=form)


@app.route('/verify-email/<token>')
def verify_email(token):
    email = verify_token(token, serializer)
    if email:
        db_sess = db_session.create_session()
        temp_user = db_sess.query(TemporaryUser).filter(TemporaryUser.email == email).first()
        new_user = User(
            name=temp_user.name,
            surname=temp_user.surname,
            email=temp_user.email,
            hashed_password=temp_user.hashed_password,
            fullname=f"{temp_user.name} {temp_user.surname}",
        )
        db_sess.delete(temp_user)
        db_sess.add(new_user)
        db_sess.commit()
        return render_template('email_verify.html', message="Верификация прошла успешно!")
    else:
        return render_template('email_verify.html', message="Истек срок действия токена или токен невалиден")
