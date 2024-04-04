def password_complexity_check(password):
    if len(password) < 6:
        return "Пароль слишком короткий"
    if len(password.split()) > 1:
        return "Пароль не должен содержать пробелов"
    has_digits = False
    has_lower = False
    has_upper = False
    has_special = False
    for symbol in password:
        if symbol.isdigit():
            has_digits = True
        if symbol.isupper():
            has_upper = True
        if symbol.islower():
            has_lower = True
        if not (symbol.isdigit() or symbol.isalpha()):
            has_special = True
    if not has_digits:
        return "Пароль должен содержать хотя бы одну цифру"
    if not has_lower:
        return "Пароль должен содержать хотя бы одну строчную букву"
    if not has_upper:
        return "Пароль должен содержать хотя бы одну заглавную букву"
    if not has_special:
        return "Пароль должен содержать хотя бы один спец. символ"
    return None