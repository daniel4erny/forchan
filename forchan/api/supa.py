import supabase
import os
from fastapi import HTTPException
from datetime import datetime, timedelta

class db:
	def __init__(self, client) -> None:
		self.client: supabase.AsyncClient = client

	@classmethod
	async def create(cls):
		URL = os.environ.get("SUPA_URL")
		KEY = os.environ.get("SUPA_KEY")

		if not URL or not KEY:
			raise ValueError("SUPA_URL nebo SUPA_KEY chybí v .env souboru!")

		client = await supabase.create_async_client(URL, KEY)

		return cls(client)

class PostDB(db):
	async def makePost(self, title: str, text: str, board_slug: str, token: str):
		allowedBoards = ["technology", "games", "sports"]
		if board_slug not in allowedBoards:
			raise HTTPException(
					status_code=400,
					detail="DONT FUCKING TRY ME BRO (board slug)"
				)

		response = await (
				self.client.table("tokens")
				.select("*")
				.eq("session_token", token)
				.execute()
			)

		response = response.dict()["data"]

		if len(response) == 0:
			raise HTTPException(
					status_code=400,
					detail="DONT FUCKING TRY ME BRO (invalid token)"
				)

		rel_token = response[0]["rel_token"]

		response = await (
			self.client.table("posts")
			.insert({
				"rel_token": rel_token,
				"text": text,
				"title": title,
				"board_slug": board_slug
				})
			.execute()
		)

		return response



class UserDB(db):
	async def regToken(self):
		response = await (
			self.client.table("tokens")
			.insert({})
			.select()
			.execute()
		)

		response = response.dict()["data"][0]
		created_at = response["created_at"]
		vanish_at = datetime.fromisoformat(created_at)
		vanish_at += timedelta(days=30)
		vanish_at = str(vanish_at)

		token = response["session_token"]

		final_res = await (
		    self.client.table("tokens")
		    .update({"vanish_at": vanish_at})
		    .eq("session_token", token)
		    .execute()
		)

		final_res = final_res.dict()["data"][0]

		return {
			"token": final_res["session_token"],
			"vanish_at": final_res["vanish_at"]		
		}

	async def checkToken(self, token: str):
		response = await (
			self.client.table("tokens")
			.select("*")
			.eq("session_token", token)
			.execute()
		)

		data = response.dict().get("data", [])
		if not data:
			raise HTTPException(status_code=404, detail="Token not found")

		return {
			"vanish_at": data[0]["vanish_at"],
			"created_at": data[0]["created_at"]
		}




