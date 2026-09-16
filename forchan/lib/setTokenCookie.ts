'use server'

import { cookies } from "next/headers"

export default async function setTokenCookie(token: string) {
	const cookie_store = await cookies()
	cookie_store.set("token", token)
}	