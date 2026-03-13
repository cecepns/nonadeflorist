import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Tag,
  Tags,
  Sprout,
  LogOut,
  Quote,
  MessageCircle,
  Settings,
  Image,
} from 'lucide-react'
import { useEffect } from 'react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/categories', label: 'Category', icon: Tag },
  { to: '/admin/subcategories', label: 'Sub Category', icon: Tags },
  { to: '/admin/products', label: 'Product', icon: Sprout },
  { to: '/admin/testimonials', label: 'Testimonial', icon: Quote },
  { to: '/admin/quotes', label: 'Quotes', icon: MessageCircle },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/banners', label: 'Banners', icon: Image },
]

function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('nonade_admin_token')
    if (!token) {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('nonade_admin_token')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 border-r bg-white/80 px-4 py-6 shadow-sm md:flex md:flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Nonade
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Florist Admin
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-3 py-2 transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white/70 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Nonade Florist
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Content Management
            </p>
          </div>
        </header>

        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

