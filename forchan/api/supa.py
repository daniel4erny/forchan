import supabase
import os
import uuid
from fastapi import HTTPException, UploadFile
from datetime import datetime, timedelta

IMAGE_BUCKET = "post-images"

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
	async def __getRelKey(self, token: str):
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

		rel_key = response[0]["rel_key"]
		return rel_key

	async def makePost(self, title: str, text: str, board_slug: str, token: str | None, reply_to: int | None = None, image_url: str | None = None):
		allowedBoards = {"technology", "games", "sports"}
		if board_slug not in allowedBoards:
			raise HTTPException(
					status_code=400,
					detail="DONT FUCKING TRY ME BRO (board slug)"
				)

		rel_key = await self.__getRelKey(token) if token else None

		response = await (
			self.client.table("posts")
			.insert({
				"rel_key": rel_key,
				"text": text,
				"title": title,
				"board_slug": board_slug,
				"reply_to": reply_to,
				"image_url": image_url
				})
			.execute()
		)

		return response

	async def uploadImage(self, file: UploadFile):
		allowedTypes = {"image/png", "image/jpeg", "image/gif", "image/webp"}
		if file.content_type not in allowedTypes:
			raise HTTPException(
				status_code=400,
				detail="DONT FUCKING TRY ME BRO (unsupported image type)"
			)

		contents = await file.read()

		maxBytes = 5 * 1024 * 1024
		if len(contents) > maxBytes:
			raise HTTPException(
				status_code=400,
				detail="DONT FUCKING TRY ME BRO (image too big, max 5MB)"
			)

		ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "bin"
		path = f"{uuid.uuid4()}.{ext}"

		await self.client.storage.from_(IMAGE_BUCKET).upload(
			path,
			contents,
			{"content-type": file.content_type}
		)

		url = await self.client.storage.from_(IMAGE_BUCKET).get_public_url(path)

		return {"url": url}

	async def editPost(self, title: str, text: str, token: str, post_id: int):
		rel_key = await self.__getRelKey(token)

		try: 
			response = await (
				self.client.table("posts")
				.update({
					"text": text,
					"title": title,
				})
				.eq("id", post_id)
				.eq("rel_key", rel_key)
				.execute()	
			)

			if not response.data:
				raise HTTPException(
					status_code=400,
					detail="your post was somehow not found"
				)

			return response
		except:
			raise HTTPException(
				status_code=400,
				detail="man idk, probably u are dumb, but there is chance I am dumb so just lets move on and try again"
				)

	async def deletePost(self, token: str, post_id: int):
		rel_key = await self.__getRelKey(token)

		response = await (
			self.client.table("posts")
			.update({
				"title": "deleted",
				"text": "deleted",
				"image_url": None,
				"rel_key": None,
			})
			.eq("rel_key", rel_key)
			.eq("id", post_id)
			.execute()
		)

		if not response.data:
			raise HTTPException(
				status_code=400,
				detail="the post you want to delete is not yours or it doesnt exist"
				)

		else:
			return response

	async def getPostsBoard(self, board_slug: str, page_num: int):
		allowedBoards = {"technology", "games", "sports"}
		if board_slug not in allowedBoards:
			raise HTTPException(
					status_code=400,
					detail="DONT FUCKING TRY ME BRO (board slug)"
				)

		min_lim = page_num * 50
		max_lim = ((page_num + 1) * 50) -1

		response = await (
			self.client.table("posts")
			.select("*")
			.eq("board_slug", board_slug)
			.is_("reply_to", "null")
			.order("created_at", desc=True)
			.range(min_lim, max_lim)
			.execute()
			)

		return response

	async def getPostsReplies(self, post_id: int, page_num: int):
		collected = []
		frontier = [post_id]

		while frontier:
			response = await (
				self.client.table("posts")
				.select("*")
				.in_("reply_to", frontier)
				.order("created_at", desc=False)
				.execute()
			)

			batch = response.dict()["data"]
			if not batch:
				break

			collected.extend(batch)
			frontier = [p["id"] for p in batch]

		return {"data": collected}

	async def getPostsRelKey(self, rel_key: str, page_num: int):
		min_lim = page_num * 50
		max_lim = ((page_num + 1) * 50) -1

		response = await (
			self.client.table("posts")
			.select("*")
			.eq("rel_key", rel_key)
			.order("created_at", desc=True)
			.range(min_lim, max_lim)
			.execute()
		)

		return response

	async def getPostsSessionToken(self, token: str, page_num):
		rel_key = await self.__getRelKey(token)

		min_lim = page_num * 50
		max_lim = ((page_num + 1) * 50) -1

		response = await (
			self.client.table("posts")
			.select("*")
			.eq("rel_key", rel_key)
			.order("created_at", desc=True)
			.range(min_lim, max_lim)
			.execute()
		)

		return response

	async def getPostId(self, post_id: int):
		response = await (
			self.client.table("posts")
			.select("*")
			.eq("id", post_id)
			.execute()
		)

		return response

	async def deleteOldAnonymousPosts(self):
		cutoff = str(datetime.utcnow() - timedelta(days=3))

		response = await (
			self.client.table("posts")
			.delete()
			.is_("rel_key", "null")
			.lt("created_at", cutoff)
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
			"created_at": data[0]["created_at"],
			"rel_key": data[0]["rel_key"]
		}

	async def deleteExpiredTokens(self):
		cutoff = str(datetime.utcnow())

		response = await (
			self.client.table("tokens")
			.delete()
			.lt("vanish_at", cutoff)
			.execute()
		)

		return response

