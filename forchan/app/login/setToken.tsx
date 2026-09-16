'use client'

import { useState } from "react"
import setTokenCookie from "@/lib/setTokenCookie"

export default function SetToken() {
	const [tokenIn, setTokenIn] = useState("") 
	const [saved, setSaved] = useState(false)

	const handleSet = async () => {
		await setTokenCookie(tokenIn)
		setSaved(true)
		setTimeout(() => setSaved(false), 2000)
	}

	return (
		<section>
		<h2 className="font-bold mb-2">2. Set your token into cookies</h2>

		<input 
			placeholder="paste your token here"
			onChange={(e) => setTokenIn(e.currentTarget.value)}
			className="block w-full border border-amber-900 px-2 py-1 mb-3 font-mono"
		></input>

		<div className="flex items-center gap-2">
			<button
				onClick={handleSet}
				className="border border-amber-900 bg-amber-400 px-3 py-1 cursor-pointer"
			>
				Set cookie
			</button>
			{saved && <span className="text-amber-900">saved!</span>}
		</div>
		</section>
	)
}
