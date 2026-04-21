import sqlite3
from .config import DB_NAME

def db_baglan():
    return sqlite3.connect(DB_NAME)

def tablolari_kur():
    conn = db_baglan()
    c = conn.cursor()
    # Hastalar Tablosu
    c.execute('''CREATE TABLE IF NOT EXISTS hastalar 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  ad TEXT, soyad TEXT, tc_no TEXT)''')
    
    # Doktorlar Tablosu
    c.execute('''CREATE TABLE IF NOT EXISTS doktorlar 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  tc_no TEXT UNIQUE, 
                  ad TEXT,
                  soyad TEXT,
                  password_hash TEXT)''')

    # Hastalar tablosuna doktor_id ekle (Eğer yoksa)
    try:
        c.execute("ALTER TABLE hastalar ADD COLUMN doktor_id INTEGER")
    except sqlite3.OperationalError:
        pass # Zaten var

    # Röntgenler Tablosu
    c.execute('''CREATE TABLE IF NOT EXISTS rontgenler 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  hasta_id INTEGER, 
                  dosya_yolu TEXT, 
                  rapor TEXT, 
                  tarih TEXT,
                  detections TEXT)''')
    
    # Mevcut tabloya ekle (migration)
    try:
        c.execute("ALTER TABLE rontgenler ADD COLUMN detections TEXT")
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()
