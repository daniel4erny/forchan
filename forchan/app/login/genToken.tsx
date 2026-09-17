"use client"

import { useState } from "react"
import CopyButton from "./copyButton"

type tokenResponse = {
  vanish_at: string,
  token: string
}

export default function GenToken() {
  const [token, setToken] = useState("Click to generate token")
  const [err, setErr] = useState("")
  const [vanish, setVanish] = useState("")

  const handleGenerate = async () => {
    setErr("")
    try {
      const res = await fetch("/api/py/user/login", {
        "method": "POST"
      })
      const data: tokenResponse = await res.json()
      
      if (!res.ok) {
        setErr("wifi ti dako nefacha")
        return
      } 
      
      setToken(data.token)

      const date = new Date(data.vanish_at)
      const readable = date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC'
      });

      setVanish(readable)

    } catch (error: any) {
      setErr(error.detail || "wifi ti dako nefacha")
    }
  }

  return (
    <section>
      <h2 className="font-bold mb-2">1. Generate</h2>

      {token === "Click to generate token" ? (
        <p className="mb-3 text-amber-900">{token}</p>
      ) : (
        <p className="mb-3 break-all">{token}</p>
      )}

      {err && <p className="mb-3 text-red-800">{err}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={handleGenerate}
          className="border border-amber-900 bg-amber-400 px-3 py-1 cursor-pointer"
        >
          Generate Token
        </button>
        {token !== "Click to generate token" && <CopyButton textToCopy={token} />}
      </div>
      {vanish && "token expires at: " + vanish}
    </section>
  )
}
