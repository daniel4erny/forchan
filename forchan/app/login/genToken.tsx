"use client"

import { useState } from "react"
import CopyButton from "./copyButton"

export default function GenToken() {
  const [token, setToken] = useState("Click to generate token")
  const [err, setErr] = useState("")

  const handleGenerate = async () => {
    setErr("")
    try {
      const res = await fetch("/api/py/user/login")
      const data = await res.json()
      
      if (!res.ok) {
        setErr(data.detail || "wifi ti dako nefacha")
        return
      } 
      
      setToken(data.message)
    } catch (error: any) {
      setErr("wifi ti dako nefacha")
    }
  }
  return (
    <section>
      <h2 className="font-bold mb-2">1. Generate</h2>

      {token === "Click to generate token" ? (
        <p className="mb-3 text-amber-900">{token}</p>
      ) : (
        <p className="mb-3 font-mono break-all">{token}</p>
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
    </section>
  )
}
