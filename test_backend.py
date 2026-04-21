import requests
import random

def test_register():
    tc = f"1{random.randint(1000000000, 9999999999)}"
    data = {
        "ad": "Test",
        "soyad": "User",
        "tc_no": tc,
        "password": "password123"
    }
    try:
        print(f"Attempting to register with TC: {tc}")
        # Note: requests.post with data=... sends form-encoded, which FastAPI Form() accepts.
        response = requests.post("http://127.0.0.1:8000/auth/kayit", data=data) 
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("RETURNING_SUCCESS")
        else:
            print("RETURNING_FAILURE")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_register()
