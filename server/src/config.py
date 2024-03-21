import os
from dotenv import load_dotenv


load_dotenv()

SECRET_KEY = os.environ['JWT_AUTH_SECRET_KEY']  
ALGORITHM = os.environ['JWT_ALGORITHM']