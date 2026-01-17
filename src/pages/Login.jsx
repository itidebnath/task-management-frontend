import { useState } from "react"
import api from "../api/axios"

export default function Login({ switchToSignup, onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const login = async () => {
    if (!email || !password) {
      setMessage("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      const res = await api.post("/api/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)

      onLogin(res.data.role)
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back ✨
        </h2>

        {message && (
          <p className="text-center text-pink-300 text-sm mb-4">
            {message}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 rounded-xl bg-black/30 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 rounded-xl bg-black/30 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3 font-semibold text-slate-900 hover:scale-[1.02] transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={switchToSignup}
          className="mt-4 w-full rounded-xl border border-white/30 py-3 text-white hover:bg-white/10 transition"
        >
          Create new account
        </button>
      </div>
    </div>
  )
}
