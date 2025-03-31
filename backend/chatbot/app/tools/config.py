from dotenv import load_dotenv
import os
# Load environment variables
load_dotenv()

# Configuration
CONNECTION_POSTGRES = os.getenv("CONNECTION_POSTGRES")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")