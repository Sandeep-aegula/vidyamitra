from supabase import create_client, Client
from app.core.config import settings
from typing import Optional

def get_supabase_client() -> Optional[Client]:
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        print("Warning: Supabase credentials not found. Database features will be disabled.")
        return None
        
    try:
        url: str = settings.SUPABASE_URL
        key: str = settings.SUPABASE_KEY
        return create_client(url, key)
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")
        return None

supabase: Optional[Client] = get_supabase_client()
