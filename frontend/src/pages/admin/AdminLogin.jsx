import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://api.kingcreativestudio.my.id/nonadeflorist'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, {
        username,
        password,
      })
      localStorage.setItem('nonade_admin_token', res.data.token)
      navigate('/admin', { replace: true })
    } catch {
      setError('Username atau password salah.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-3xl border bg-white/90 p-6 shadow-sm">
        <div className="mb-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
            Nonade Florist
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            Admin Panel Login
          </p>
        </div>
        <form className="space-y-3 text-sm" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

