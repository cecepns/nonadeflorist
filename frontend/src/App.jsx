import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import LandingLayout from './layouts/LandingLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import CategoryManagement from './pages/admin/CategoryManagement.jsx'
import SubcategoryManagement from './pages/admin/SubcategoryManagement.jsx'
import ProductManagement from './pages/admin/ProductManagement.jsx'
import AdminTestimonials from './pages/admin/AdminTestimonials.jsx'
import AdminQuotes from './pages/admin/AdminQuotes.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminBanners from './pages/admin/AdminBanners.jsx'
import ProductDetail from './pages/ProductDetail.jsx'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-quart',
      once: true,
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="subcategories" element={<SubcategoryManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="banners" element={<AdminBanners />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
