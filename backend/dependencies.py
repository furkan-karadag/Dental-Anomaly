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
        ad: str = payload.get("ad")
        soyad: str = payload.get("soyad")
        
        if tc_no is None or doktor_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return {"ad": ad, "soyad": soyad, "tc_no": tc_no, "id": doktor_id}
