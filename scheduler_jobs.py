from settings import scheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime, timedelta
from data.mail_verification.temporary_users import TemporaryUser
from data import db_session


@scheduler.scheduled_job(IntervalTrigger(minutes=2))
def delete_expired_users():
    db_sess = db_session.create_session()
    threshold = datetime.now() - timedelta(minutes=5)
    expired_users = db_sess.query(TemporaryUser).filter(TemporaryUser.created_date < threshold).all()
    
    for user in expired_users:
        db_sess.delete(user)
        
    db_sess.commit()
    db_sess.close()