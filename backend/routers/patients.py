from fastapi import APIRouter, Depends, Form, HTTPException
from ..database import db_baglan
from ..dependencies import get_current_user
import sqlite3

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("/hasta_ekle")
def hasta_ekle(
    ad: str = Form(...), 
    soyad: str = Form(...), 
    tc_no: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    conn = db_baglan()
    c = conn.cursor()
    c.execute("INSERT INTO hastalar (ad, soyad, tc_no, doktor_id) VALUES (?, ?, ?, ?)", 
              (ad, soyad, tc_no, current_user["id"]))
    conn.commit()
    yeni_id = c.lastrowid
    conn.close()
    return {"durum": "Başarılı", "hasta_id": yeni_id, "mesaj": f"{ad} {soyad} kaydedildi."}

@router.get("/hastalar")
def hastalari_getir(current_user: dict = Depends(get_current_user)):
    conn = db_baglan()
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Fetch patients with their latest X-ray info using a left join on a subquery
    # Finds the latest rontgen (max id) for each patient
    query = """
        SELECT h.*, r.detections, r.tarih as son_tarih
        FROM hastalar h
        LEFT JOIN rontgenler r ON r.id = (
            SELECT MAX(id) FROM rontgenler WHERE hasta_id = h.id
        )
        WHERE h.doktor_id=?
        ORDER BY h.id DESC
    """
    c.execute(query, (current_user["id"],))
    rows = c.fetchall()
    conn.close()
    
    hastalar_list = []
    import json
    
    for row in rows:
        p = dict(row)
        det_str = p.get("detections")
        status = "Routine Checkup" # Default
        
        if det_str:
            try:
                detections = json.loads(det_str)
                if not detections:
                    status = "Healthy" # Empty list might imply healthy or just nothing found
                else:
                    # Check if any detection is NOT healthy
                    has_issue = any("healthy" not in d.get("class", "").lower() for d in detections)
                    if has_issue:
                        status = "Cavity Detected" # Or "Issue Found"
                    else:
                        status = "Healthy"
            except:
                status = "Routine Checkup"
        
        # If today and just uploaded (processing logic could be complex), assume 'Analysis Ready' if recent?
        # For simplicity:
        p["status"] = status
        hastalar_list.append(p)

    return {"hastalar": hastalar_list}

@router.get("/gecmis/{hasta_id}")
def gecmis_getir(hasta_id: int, current_user: dict = Depends(get_current_user)):
    conn = db_baglan()
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("SELECT * FROM hastalar WHERE id=? AND doktor_id=?", (hasta_id, current_user["id"]))
    hasta = c.fetchone()
    
    if not hasta:
        conn.close()
        raise HTTPException(status_code=403, detail="Bu hastaya erişim yetkiniz yok")

    c.execute("SELECT * FROM rontgenler WHERE hasta_id=? ORDER BY id DESC", (hasta_id,))
    gecmis = c.fetchall()
    conn.close()
    return {"hasta_id": hasta_id, "gecmis": gecmis}

@router.delete("/hasta_sil/{hasta_id}")
def hasta_sil(hasta_id: int, current_user: dict = Depends(get_current_user)):
    conn = db_baglan()
    c = conn.cursor()
    
    # Hastanın bu doktora ait olduğunu kontrol et
    c.execute("SELECT id FROM hastalar WHERE id=? AND doktor_id=?", (hasta_id, current_user["id"]))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=403, detail="Bu hastayı silme yetkiniz yok")
    
    # Önce ilgili röntgen kayıtlarını sil (cascade)
    c.execute("DELETE FROM rontgenler WHERE hasta_id=?", (hasta_id,))
    # Sonra hastayı sil
    c.execute("DELETE FROM hastalar WHERE id=?", (hasta_id,))
    conn.commit()
    conn.close()
    return {"durum": "Silindi", "mesaj": "Hasta ve ilgili kayıtlar silindi."}

@router.delete("/rontgen_sil/{rontgen_id}")
def rontgen_sil(rontgen_id: int, current_user: dict = Depends(get_current_user)):
    conn = db_baglan()
    c = conn.cursor()
    
    # Önce röntgenin bu doktora ait bir hastaya mi ait oldugunu kontrol et
    c.execute("""
        SELECT r.id FROM rontgenler r 
        JOIN hastalar h ON r.hasta_id = h.id 
        WHERE r.id=? AND h.doktor_id=?
    """, (rontgen_id, current_user["id"]))
    
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=403, detail="Silme yetkiniz yok")
        
    c.execute("DELETE FROM rontgenler WHERE id=?", (rontgen_id,))
    conn.commit()
    conn.close()
    return {"durum": "Silindi"}
