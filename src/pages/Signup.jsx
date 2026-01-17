import { useState } from "react"
import api from "../api/axios"

export default function Signup({ switchToLogin }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const signup = async () => {
    if (!name || !email || !password) {
      setMessage("All fields are required")
      return
    }

    try {
      setLoading(true)

      const res = await api.post("/api/auth/signup", {
        name,
        email,
        password,
      })

      setMessage("Signup successful. Please login.")
      switchToLogin()
    } catch (err) {
      setMessage(err.response?.data?.msg || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account 🌸
        </h2>

        {message && (
          <p className="text-center text-pink-300 text-sm mb-4">
            {message}
          </p>
        )}

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full mb-4 rounded-xl bg-black/30 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-400 transition"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 rounded-xl bg-black/30 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-400 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 rounded-xl bg-black/30 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-400 transition"
        />

        <button
          onClick={signup}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 font-semibold text-slate-900 hover:scale-[1.02] transition disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <button
          onClick={switchToLogin}
          className="mt-4 w-full rounded-xl border border-white/30 py-3 text-white hover:bg-white/10 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}
