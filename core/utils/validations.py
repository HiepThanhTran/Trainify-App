import re

import unidecode
from rest_framework.exceptions import ValidationError


def validate_user_account(user):
    if user.account:
        raise ValidationError({'detail': 'Người dùng đã có tài khoản'})
    return True


def validate_email(code, first_name, email):
    first_name = re.escape(unidecode.unidecode(first_name).lower().replace(' ', ''))
    pattern = f"^{code}{first_name}@ou\.edu\.vn$"

    if not email or not bool(re.match(pattern, email.strip())):
        raise ValidationError({'email': 'Vui lòng nhập email trường cấp'})
    return True


def validate_password(password):
    if not password or len(password) < 8:
        raise ValidationError({'password': 'Mật khẩu phải có ít nhất 8 ký tự'})
    return True


def validate_file_with_format(file, fformat):
    if not file:
        raise ValidationError({'detail': 'Không tìm thấy file!'})
    if not format or not file.name.endswith(fformat):
        raise ValidationError({'detail': f'Vui lòng upload file có định dạng là {fformat}'})

    return True
