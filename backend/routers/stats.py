from fastapi import APIRouter, Depends
from ..database import db_baglan
from ..dependencies import get_current_user
from datetime import datetime
import json

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/dashboard")
def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    conn = db_baglan()
    conn.row_factory = lambda cursor, row: row[0] # Helper to get single values
    c = conn.cursor()

    # 1. Total Patients belonging to this doctor
    c.execute("SELECT COUNT(*) FROM hastalar WHERE doktor_id = ?", (current_user["id"],))
    total_patients = c.fetchone() or 0

    # 2. Done Today
    # Assuming 'tarih' is stored as YYYY-MM-DD or datetime string.
    # We will try to match the prefix of today's date.
    today_str = datetime.now().strftime("%d-%m-%Y")
    
    # We need to join with hastalar to ensure we only count this doctor's patients' x-rays
    c.execute("""
        SELECT COUNT(*) 
        FROM rontgenler r
        JOIN hastalar h ON r.hasta_id = h.id
        WHERE h.doktor_id = ? AND r.tarih LIKE ?
    """, (current_user["id"], f"{today_str}%"))
    done_today = c.fetchone() or 0

    # 3. Pending AI / Requires Review
    # Logic: Detections exist and contain non-healthy findings.
    # We will search for detections not equal to empty array '[]'
    # And maybe we can assume they are "pending review" if they are recent?
    # For now, let's just count "Issues Found Today" as "Requires Review" 
    # OR simply count TOTAL X-rays that have detections but maybe define "Pending" as "Analyzed within last 24h"
    # Let's stick to user's "Requires review" label which often means "AI found something".
    
    # Simpler logic for now: Count of all x-rays for this doctor that have non-empty detections.
    # To make it more "active dashboard" like, let's limit to recent uploads with issues.
    
    c.execute("""
        SELECT detections 
        FROM rontgenler r
        JOIN hastalar h ON r.hasta_id = h.id
        WHERE h.doktor_id = ?
    """, (current_user["id"],))
    
    all_detections = c.fetchall() # This returns a list of strings due to row_factory override? 
    # Wait, row_factory override above might be risky if I select multiple columns later.
    # Let's reset row_factory for the list fetch or just handle it.
    
    pending_ai_count = 0
    # Ideally checking string content in SQL is faster but detections is JSON text.
    # content like "Caries" or "Abscess"
    
    # Let's fix the row_factory first, it was a bit hacky for the counts.
    pass

    conn.close()
    
    # Re-open or use cleaner logic
    conn = db_baglan()
    c = conn.cursor()
    
    # Refetch cleanly
    c.execute("SELECT COUNT(*) FROM hastalar WHERE doktor_id = ?", (current_user["id"],))
    total_patients = c.fetchone()[0]

    c.execute("""
        SELECT COUNT(*) 
        FROM rontgenler r
        JOIN hastalar h ON r.hasta_id = h.id
        WHERE h.doktor_id = ? AND r.tarih LIKE ?
    """, (current_user["id"], f"{today_str}%"))
    done_today = c.fetchone()[0]
    
    # For Pending AI: Count scans where AI detected issues (not healthy)
    # This acts as "Requires Review"
    c.execute("""
        SELECT detections 
        FROM rontgenler r
        JOIN hastalar h ON r.hasta_id = h.id
        WHERE h.doktor_id = ? AND r.detections IS NOT NULL AND r.detections != '[]'
    """, (current_user["id"],))
    
    rows = c.fetchall()
    pending_ai_count = 0
    
    for row in rows:
        det_str = row[0]
        if not det_str: continue
        try:
            det_list = json.loads(det_str)
            # Check if any detection is NOT healthy
            # If any class contains "Caries" or "Abscess" => Requires Review
            has_issue = any(
                "healthy" not in d.get("class", "").lower() 
                for d in det_list
            )
            if has_issue:
                pending_ai_count += 1
        except:
            pass

    conn.close()

    return {
        "total_patients": total_patients,
        "pending_ai": pending_ai_count,
        "done_today": done_today
    }
