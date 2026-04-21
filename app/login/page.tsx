"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        })

        if (res?.error) {
            setError("Email atau password salah")
            setLoading(false)
            return
        }

        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-black">Login</h1>
                    <p className="mt-1 text-sm text-neutral-600">
                        Masuk untuk melanjutkan
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-black outline-none focus:border-black/30"
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-black outline-none focus:border-black/30"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-sm text-black">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-black/90 disabled:opacity-60"
                    >
                        {loading ? "Memproses..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}