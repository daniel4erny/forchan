import supabase
import os

class UserDB:
	def __init__(self, client) -> None:
		self.__client = client

	@classmethod
	async def create(cls):
		URL = os.environ.get("SUPA_URL")
		KEY = os.environ.get("SUPA_KEY")

		if not URL or not KEY:
			raise ValueError("SUPA_URL nebo SUPA_KEY chybí v .env souboru!")

		client = await supabase.create_async_client(URL, KEY)

		return cls(client)

	def hello(self):
		return "wroks"