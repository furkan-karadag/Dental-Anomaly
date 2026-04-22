from fastapi import APIRouter, Depends, Body
from ..dependencies import get_current_user
import sqlite3

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/me")
def update_user_me(
    user_update: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    from ..database import db_baglan
    
    # Debug print
    print(f"DEBUG: update_user_me called for user_id: {current_user['id']} (type: {type(current_user['id'])})")
    print(f"DEBUG: user_update payload: {user_update}")
    print(f"DEBUG: current_user data: {current_user}")

    conn = db_baglan()
    c = conn.cursor()

    # Get new values or fallback to current ones
    ad = user_update.get("ad")
    if ad is None:
        ad = current_user["ad"]
        
    soyad = user_update.get("soyad")
    if soyad is None:
        soyad = current_user["soyad"]

    print(f"DEBUG: Updating to ad='{ad}', soyad='{soyad}'")

    try:
        c.execute("UPDATE doktorlar SET ad=?, soyad=? WHERE id=?", (ad, soyad, current_user["id"]))
        conn.commit()
        rows_affected = c.rowcount
        print(f"DEBUG: Rows affected: {rows_affected}")
    except Exception as e:
        print(f"DEBUG: Database error: {e}")
        rows_affected = 0
    finally:
        conn.close()

    # Return the updated data
    return {
        "id": current_user["id"],
        "tc_no": current_user["tc_no"],
        "ad": ad,
        "soyad": soyad,
        "updated": rows_affected > 0
    }
