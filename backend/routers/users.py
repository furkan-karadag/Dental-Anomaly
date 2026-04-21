from fastapi import APIRouter, Depends
from ..dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/me")
def update_user_me(user_update: dict, current_user: dict = Depends(get_current_user)):
    # user_update: {"ad": "...", "soyad": "..."} basitce
    from ..database import db_baglan
    conn = db_baglan()
    c = conn.cursor()
    
    # Sadece ad ve soyad guncellenebilir simdilik
    ad = user_update.get("ad", current_user["ad"])
    soyad = user_update.get("soyad", current_user["soyad"])
    
    c.execute("UPDATE doktorlar SET ad=?, soyad=? WHERE id=?", (ad, soyad, current_user["id"]))
    conn.commit()
    conn.close()
    
    return {**current_user, "ad": ad, "soyad": soyad}
