import os
from dotenv import load_dotenv

profile = os.getenv("profile", "test")
env_file = f".env.{profile}"
load_dotenv(env_file)

db_host = os.environ["db_host"]
db_user = os.environ["db_user"]
db_password = os.environ["db_password"]
database = os.getenv("database", "llm_eval")
