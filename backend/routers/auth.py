from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
import sqlite3
from datetime import timedelta
from ..database import db_baglan
from ..security import verify_password, get_password_hash, create_access_token
from ..config import ACCESS_TOKEN_EXPIRE_MINUTES
from ..schemas import Token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/kayit")
def register(
    ad: str = Form(...),
    soyad: str = Form(...),
    tc_no: str = Form(...), 
    password: str = Form(...)
):
    conn = db_baglan()
    c = conn.cursor()
    # TC No kontrolü
    c.execute("SELECT * FROM doktorlar WHERE tc_no=?", (tc_no,))
    if c.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Bu TC Kimlik No ile kayıt zaten var")
    
    hashed_pass = get_password_hash(password)
    c.execute("INSERT INTO doktorlar (ad, soyad, tc_no, password_hash) VALUES (?, ?, ?, ?)", 
              (ad, soyad, tc_no, hashed_pass))
    conn.commit()
    conn.close()
    return {"durum": "Başarılı", "mesaj": "Kayıt oluşturuldu"}

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = db_baglan()
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    # form_data.username burada TC No taşıyacak
    c.execute("SELECT * FROM doktorlar WHERE tc_no=?", (form_data.username,))
    user = c.fetchone()
    conn.close()

    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="TC Kimlik No veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # sub olarak TC No, ek olarak ad soyad ve id
    access_token = create_access_token(
        data={"sub": user["tc_no"], "id": user["id"], "ad": user["ad"], "soyad": user["soyad"]}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
