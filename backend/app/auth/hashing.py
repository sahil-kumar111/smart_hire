import bcrypt


def hash_password(password: str) -> str:
    """
    Convert a plain-text password into a secure bcrypt hash.
    Truncates at 72 bytes per standard bcrypt specification.
    """
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify whether the entered password matches the stored bcrypt hash.
    """
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(
            pwd_bytes,
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False