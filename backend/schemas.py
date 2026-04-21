from pydantic import BaseModel
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class Doktor(BaseModel):
    username: str # TC No olacak
    ad: str
    soyad: str
