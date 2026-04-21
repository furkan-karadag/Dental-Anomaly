from fastapi import APIRouter, UploadFile, File, Depends
from ultralytics import YOLO
from PIL import Image
import io
import os
import json
import datetime
from ..database import db_baglan
from ..config import RESIM_KLASORU
from ..dependencies import get_current_user

router = APIRouter(prefix="/analysis", tags=["Analysis"])

# Model Yükleme (Global olarak bir kere yüklenmeli, burada veya main'de)
# Not: Modeli burada yüklüyoruz ama path'e dikkat etmeli. 
# best.pt backend klasöründe olacaksa "backend/best.pt" veya sadece "best.pt" (cwd'ye bağlı)
try:
    # cwd backend ise
    if os.path.exists("best.pt"):
        model = YOLO("best.pt")
    # cwd proj root ise ve backend/best.pt ise
    elif os.path.exists("backend/best.pt"):
        model = YOLO("backend/best.pt")
    else:
        # Fallback for dev environment quirks
        model = YOLO("../best.pt") 
    print("✅ Model Başarıyla Yüklendi!")
except Exception as e:
    print(f"❌ HATA: best.pt bulunamadı! {e}")
    model = None

@router.post("/analiz_et/{hasta_id}")
async def analiz_et(hasta_id: int, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not model:
        return {"hata": "Model yüklenemedi"}

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        results = model.predict(image, conf=0.25)
        result = results[0]
        
        # Save Clean Image (Original)
        tarih_saat = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        dosya_adi = f"hasta_{hasta_id}_{tarih_saat}.jpg"
        kayit_yolu = os.path.join(RESIM_KLASORU, dosya_adi)
        image.save(kayit_yolu)
        
        detections = []
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            
            detections.append({
                "class": class_name,
                "confidence": int(conf * 100),
                "box": [x1, y1, x2, y2]
            })
        
        # Rapor özeti (eski uyumluluk için text olarak da tutalım)
        ozet_string = ", ".join([f"{d['class']} (%{d['confidence']})" for d in detections])
        
        # JSON verisini string olarak sakla (sqlite basitligi icin)
        detections_json = json.dumps(detections)

        conn = db_baglan()
        c = conn.cursor()
        tarih_formatli = datetime.datetime.now().strftime("%d-%m-%Y %H:%M")
        
        # detections kolonunu eklememiz lazım db şemasına, şimdilik rapor alanına json gömmeyelim
        # rapor alanını özet, yeni bir kolon 'detaylar' ekleyebiliriz veya rapor alanını genişletebiliriz.
        # Basitlik için rapor alanına özet string, detayları ayrı tutalım veya 
        # en kolayı: database.py'de tabloyu guncelleyelim.
        
        # Şimdilik mevcut sütunlarla idare edelim, ama en dogrusu schema update.
        # User db drop/create kabul ederse schema update, etmezse hack.
        # User önceki adımda db resetlendiği için sorun olmaz.
        
        c.execute("INSERT INTO rontgenler (hasta_id, dosya_yolu, rapor, tarih, detections) VALUES (?, ?, ?, ?, ?)",
                  (hasta_id, dosya_adi, ozet_string, tarih_formatli, detections_json))
        conn.commit()
        conn.close()

        return {
            "durum": "Analiz Tamamlandı",
            "resim_url": f"/static/{dosya_adi}",
            "rapor": [f"{d['class']} (%{d['confidence']})" for d in detections],
            "detections": detections
        }
    except Exception as e:
        return {"hata": str(e)}
