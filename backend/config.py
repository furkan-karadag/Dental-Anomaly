import os

# Ayarlar
SECRET_KEY = "supersecretkey" # Gerçek projede env'den okuyun
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

# Backend klasörünün tam yolunu al
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Resimleri backend/static/uploads klasörüne kaydedelim
RESIM_KLASORU = os.path.join(BASE_DIR, "static", "uploads")
DB_NAME = os.path.join(BASE_DIR, "dis_klinigi.db")

os.makedirs(RESIM_KLASORU, exist_ok=True)
