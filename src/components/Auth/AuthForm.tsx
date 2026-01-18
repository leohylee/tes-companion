"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

interface AuthFormProps {
  onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError(result.error)
        } else {
          onSuccess?.()
        }
      } else {
        // Register
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Registration failed")
        } else {
          // Auto login after registration
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })

          if (result?.error) {
            setError(result.error)
          } else {
            onSuccess?.()
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tes-darker p-4">
      <div className="w-full max-w-md rounded-lg border border-tes-gold/20 bg-tes-dark p-8 shadow-2xl">
        {/* Logo/Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-tes-gold">
            TES: Betrayal of the Second Era
          </h1>
          <p className="mt-1 text-sm text-tes-parchment/50">Companion App</p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => {
              setIsLogin(true)
              setError("")
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              isLogin
                ? "bg-tes-gold/20 text-tes-gold"
                : "text-tes-parchment/50 hover:text-tes-parchment"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setError("")
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              !isLogin
                ? "bg-tes-gold/20 text-tes-gold"
                : "text-tes-parchment/50 hover:text-tes-parchment"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm text-tes-parchment/70">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-tes-gold/20 bg-tes-darker px-4 py-2 text-tes-parchment placeholder-tes-parchment/30 focus:border-tes-gold/50 focus:outline-none"
                placeholder="Your name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-tes-parchment/70">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-tes-gold/20 bg-tes-darker px-4 py-2 text-tes-parchment placeholder-tes-parchment/30 focus:border-tes-gold/50 focus:outline-none"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-tes-parchment/70">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-tes-gold/20 bg-tes-darker px-4 py-2 text-tes-parchment placeholder-tes-parchment/30 focus:border-tes-gold/50 focus:outline-none"
              placeholder={isLogin ? "Enter password" : "Min 6 characters"}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-tes-gold/20 py-3 font-medium text-tes-gold transition-colors hover:bg-tes-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}
