import os
from pymongo import MongoClient
import logging

logger = logging.getLogger("uvicorn")

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("DB_NAME", "agentic_dating")

client = None
db = None

def get_db():
    global client, db
    if db is not None:
        return db
    
    if MONGODB_URI:
        try:
            client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
            # Ping to verify
            client.admin.command('ping')
            db = client[DB_NAME]
            logger.info("Successfully connected to MongoDB Atlas.")
            return db
        except Exception as e:
            logger.warning(f"Failed to connect to MongoDB Atlas: {e}. Falling back to memory storage.")
    
    return None
