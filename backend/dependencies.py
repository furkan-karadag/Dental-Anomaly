from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from .config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Giriş yapılamadı",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        tc_no: str = payload.get("sub")
        doktor_id: int = payload.get("id")

        if tc_no is None or doktor_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Güncel ad/soyad bilgilerini her zaman veritabanından oku
    from .database import db_baglan
    conn = db_baglan()
    c = conn.cursor()
    c.execute("SELECT ad, soyad FROM doktorlar WHERE id=?", (doktor_id,))
    row = c.fetchone()
    conn.close()

    if row is None:
        raise credentials_exception

    ad, soyad = row
    return {"ad": ad, "soyad": soyad, "tc_no": tc_no, "id": doktor_id}
