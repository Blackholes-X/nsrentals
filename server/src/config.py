import os
from dotenv import load_dotenv


load_dotenv()

SECRET_KEY = os.environ['JWT_AUTH_SECRET_KEY']  
ALGORITHM = os.environ['JWT_ALGORITHM']
OPENAI_MODEL = "gpt-3.5-turbo-0125"

# OPENAI_MODEL = "gpt-3.5-turbo-1106"
OPENAI_SCRAPE_MODEL = "gpt-4-1106-preview"	
TOKEN_LIMIT = 115000
