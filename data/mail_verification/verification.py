def generate_verification_token(email, serializer):
    return serializer.dumps(email, salt='email-verification')


def verify_token(token, serializer, expiration=300):
    try:
        email = serializer.loads(token, salt='email-verification', max_age=expiration)
    except:
        return None
    return email
