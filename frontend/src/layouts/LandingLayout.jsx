import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Leaf,
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../utils/apiConfig'

// const categories = [
//   {
//     name: 'Signature Bouquets',
//     slug: 'signature',
//     children: [
//       { name: 'Romantic Roses', slug: 'romantic-roses' },
//       { name: 'Pastel Dreams', slug: 'pastel-dreams' },
//       { name: 'Elegant White', slug: 'elegant-white' },
//     ],
//   },
//   {
//     name: 'Occasions',
//     slug: 'occasions',
//     children: [
//       { name: 'Birthday', slug: 'birthday' },
//       { name: 'Anniversary', slug: 'anniversary' },
//       { name: 'Graduation', slug: 'graduation' },
//     ],
//   },
// ]

function LandingLayout() {
  const location = useLocation()
  // const [openDropdown, setOpenDropdown] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')

  const isActive = (path) =>
    location.pathname === path
      ? 'text-primary-600'
      : 'text-slate-700 hover:text-primary-500'

  useEffect(() => {
    axios
      .get(`${API_URL}/api/public/settings`)
      .then((res) => {
        if (res.data?.landing_logo_url) {
          setLogoUrl(res.data.landing_logo_url)
        }
        if (res.data?.whatsapp_number) {
          setWhatsappNumber(res.data.whatsapp_number)
        }
      })
      .catch(() => {
        // ignore
      })
  }, [])

  const renderLogo = () => {
    if (logoUrl) {
      return (
        <img
          src={`${API_URL}${logoUrl}`}
          alt="Nonade Florist"
          className="h-12 w-auto"
        />
      )
    }
    return (
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
          NF
        </div>
        <span className="text-sm font-semibold text-slate-900">
          Nonade Florist
        </span>
      </div>
    )
  }

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) return
    const base = 'https://wa.me'
    const number = whatsappNumber.replace(/[^0-9]/g, '')
    const text = encodeURIComponent(
      'Halo Nonade Florist, saya ingin tanya seputar buket & custom order.',
    )
    window.open(`${base}/${number}?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden pt-20">
      <header className="fixed top-0 inset-x-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            {renderLogo()}
          </Link>

          <nav className="hidden items-center gap-4 text-xs font-medium md:flex md:gap-6 md:text-sm">
            <Link to="/" className={isActive('/')}>
              Home
            </Link>
            {/* <div
              className="relative"
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1 ${isActive('/products')}`}
              >
                Product
                <ChevronDown className="h-4 w-4" />
              </button>
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border bg-white p-3 text-xs shadow-lg">
                  {categories.map((cat) => (
                    <div key={cat.slug} className="mb-2 last:mb-0">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {cat.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.children.map((child) => (
                          <Link
                            key={child.slug}
                            to={`/products?category=${cat.slug}&sub=${child.slug}`}
                            className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            <Link to="/about" className={isActive('/about')}>
              About Us
            </Link>
            <Link to="/contact" className={isActive('/contact')}>
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="hidden items-center gap-1.5 rounded-full bg-primary-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-600 md:inline-flex md:text-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Catalog</span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-slate-200 p-1.5 text-slate-700 hover:border-primary-200 hover:text-primary-600 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white/95 md:hidden">
            <div className="mx-auto max-w-6xl px-4 py-3 space-y-2 text-sm">
              <nav className="flex flex-col gap-2">
                <Link
                  to="/"
                  className={isActive('/')}
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={isActive('/about')}
                  onClick={() => setMobileOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={isActive('/contact')}
                  onClick={() => setMobileOpen(false)}
                >
                  Contact Us
                </Link>
              </nav>
              <div className="pt-2">
                <Link
                  to="/products"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Catalog</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <section className="border-t bg-primary-50/40">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <div className="rounded-3xl border border-primary-100 bg-primary-50/80 p-6 shadow-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
                    Contact
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-primary-600" />
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <a
                        href="tel:0881023469000"
                        className="font-medium hover:text-primary-700"
                      >
                        0881-0234-69000
                      </a>
                      <span className="text-slate-300">/</span>
                      <a
                        href="tel:082119955657"
                        className="font-medium hover:text-primary-700"
                      >
                        0821-1995-5657
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-primary-600" />
                    <a
                      href="mailto:Nonfloristsumedang@gmail.com"
                      className="break-all font-medium hover:text-primary-700"
                    >
                      Nonfloristsumedang@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:border-l md:border-primary-100 md:pl-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
                    Address
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary-600" />
                  <span className="leading-relaxed">
                    Jl Angrek No 147A kecamatan Sumedang Utara
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Nonade Florist. All rights reserved.</p>
        </div>
      </footer>

      {whatsappNumber && (
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-sm font-medium text-white shadow-lg shadow-[#25D366]/40 hover:bg-[#1ebe57] md:bottom-6 md:right-6"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default LandingLayout

