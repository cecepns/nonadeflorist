import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://api.kingcreativestudio.my.id/nonadeflorist'

function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [operationalHours, setOperationalHours] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [landingLogoUrl, setLandingLogoUrl] = useState('')
  const [landingContactTitle, setLandingContactTitle] = useState('')
  const [landingContactPhone1, setLandingContactPhone1] = useState('')
  const [landingContactPhone2, setLandingContactPhone2] = useState('')
  const [landingContactEmail, setLandingContactEmail] = useState('')
  const [landingContactAddressTitle, setLandingContactAddressTitle] = useState('')
  const [landingContactAddress, setLandingContactAddress] = useState('')
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutSubtitle, setAboutSubtitle] = useState('')
  const [aboutParagraph1, setAboutParagraph1] = useState('')
  const [aboutParagraph2, setAboutParagraph2] = useState('')
  const [aboutHighlight1Title, setAboutHighlight1Title] = useState('')
  const [aboutHighlight1Desc, setAboutHighlight1Desc] = useState('')
  const [aboutHighlight2Title, setAboutHighlight2Title] = useState('')
  const [aboutHighlight2Desc, setAboutHighlight2Desc] = useState('')
  const [homeHeroBadge, setHomeHeroBadge] = useState('')
  const [homeHeroTitle, setHomeHeroTitle] = useState('')
  const [homeHeroHighlight, setHomeHeroHighlight] = useState('')
  const [homeHeroDescription, setHomeHeroDescription] = useState('')
  const [homeHeroCta1Text, setHomeHeroCta1Text] = useState('')
  const [homeHeroCta1Link, setHomeHeroCta1Link] = useState('')
  const [homeHeroCta2Text, setHomeHeroCta2Text] = useState('')
  const [homeHeroCta2Link, setHomeHeroCta2Link] = useState('')
  const [homeQuickBadge, setHomeQuickBadge] = useState('')
  const [homeQuickTitle, setHomeQuickTitle] = useState('')
  const [homeQuick1Badge, setHomeQuick1Badge] = useState('')
  const [homeQuick1Title, setHomeQuick1Title] = useState('')
  const [homeQuick1Desc, setHomeQuick1Desc] = useState('')
  const [homeQuick2Badge, setHomeQuick2Badge] = useState('')
  const [homeQuick2Title, setHomeQuick2Title] = useState('')
  const [homeQuick2Desc, setHomeQuick2Desc] = useState('')
  const [homeQuick3Badge, setHomeQuick3Badge] = useState('')
  const [homeQuick3Title, setHomeQuick3Title] = useState('')
  const [homeQuick3Desc, setHomeQuick3Desc] = useState('')
  const [homeWhyBadge, setHomeWhyBadge] = useState('')
  const [homeWhyTitle, setHomeWhyTitle] = useState('')
  const [homeWhy1Title, setHomeWhy1Title] = useState('')
  const [homeWhy1Desc, setHomeWhy1Desc] = useState('')
  const [homeWhy2Title, setHomeWhy2Title] = useState('')
  const [homeWhy2Desc, setHomeWhy2Desc] = useState('')
  const [homeWhy3Title, setHomeWhy3Title] = useState('')
  const [homeWhy3Desc, setHomeWhy3Desc] = useState('')
  const [homeHeroImageUrl, setHomeHeroImageUrl] = useState('')
  const [homeWhyImageUrl, setHomeWhyImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/api/settings`)
      .then((res) => {
        const getValue = (key) =>
          res.data.find((item) => item.key === key)?.value || ''

        setWhatsappNumber(getValue('whatsapp_number'))
        setOperationalHours(getValue('operational_hours'))
        setInstagramHandle(getValue('instagram_handle'))
        setLandingLogoUrl(getValue('landing_logo_url'))
        setLandingContactTitle(getValue('landing_contact_title') || 'Contact')
        setLandingContactPhone1(
          getValue('landing_contact_phone_1') || '0881-0234-69000',
        )
        setLandingContactPhone2(getValue('landing_contact_phone_2') || '0821-1995-5657')
        setLandingContactEmail(
          getValue('landing_contact_email') || 'Nonfloristsumedang@gmail.com',
        )
        setLandingContactAddressTitle(
          getValue('landing_contact_address_title') || 'Address',
        )
        setLandingContactAddress(
          getValue('landing_contact_address') ||
            'Jl Angrek No 147A kecamatan Sumedang Utara',
        )
        setAboutTitle(getValue('about_title'))
        setAboutSubtitle(getValue('about_subtitle'))
        setAboutParagraph1(getValue('about_paragraph_1'))
        setAboutParagraph2(getValue('about_paragraph_2'))
        setAboutHighlight1Title(getValue('about_highlight_1_title'))
        setAboutHighlight1Desc(getValue('about_highlight_1_desc'))
        setAboutHighlight2Title(getValue('about_highlight_2_title'))
        setAboutHighlight2Desc(getValue('about_highlight_2_desc'))
        setHomeHeroBadge(getValue('home_hero_badge'))
        setHomeHeroTitle(getValue('home_hero_title'))
        setHomeHeroHighlight(getValue('home_hero_highlight'))
        setHomeHeroDescription(getValue('home_hero_description'))
        setHomeHeroCta1Text(
          getValue('home_hero_cta_1_text') || 'Lihat koleksi buket',
        )
        setHomeHeroCta1Link(getValue('home_hero_cta_1_link') || '/products')
        setHomeHeroCta2Text(
          getValue('home_hero_cta_2_text') || 'Konsultasi custom order',
        )
        setHomeHeroCta2Link(
          getValue('home_hero_cta_2_link') || '/contact',
        )
        setHomeQuickBadge(getValue('home_quick_badge'))
        setHomeQuickTitle(getValue('home_quick_title'))
        setHomeQuick1Badge(getValue('home_quick_1_badge'))
        setHomeQuick1Title(getValue('home_quick_1_title'))
        setHomeQuick1Desc(getValue('home_quick_1_desc'))
        setHomeQuick2Badge(getValue('home_quick_2_badge'))
        setHomeQuick2Title(getValue('home_quick_2_title'))
        setHomeQuick2Desc(getValue('home_quick_2_desc'))
        setHomeQuick3Badge(getValue('home_quick_3_badge'))
        setHomeQuick3Title(getValue('home_quick_3_title'))
        setHomeQuick3Desc(getValue('home_quick_3_desc'))
        setHomeWhyBadge(getValue('home_why_badge'))
        setHomeWhyTitle(getValue('home_why_title'))
        setHomeWhy1Title(getValue('home_why_1_title'))
        setHomeWhy1Desc(getValue('home_why_1_desc'))
        setHomeWhy2Title(getValue('home_why_2_title'))
        setHomeWhy2Desc(getValue('home_why_2_desc'))
        setHomeWhy3Title(getValue('home_why_3_title'))
        setHomeWhy3Desc(getValue('home_why_3_desc'))
        setHomeHeroImageUrl(getValue('home_hero_image_url'))
        setHomeWhyImageUrl(getValue('home_why_image_url'))
      })
      .catch(() => {
        // ignore, keep default empty state
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await Promise.all([
        axios.put(`${API_URL}/api/settings/whatsapp_number`, {
          value: whatsappNumber,
        }),
        axios.put(`${API_URL}/api/settings/operational_hours`, {
          value: operationalHours,
        }),
        axios.put(`${API_URL}/api/settings/instagram_handle`, {
          value: instagramHandle,
        }),
        axios.put(`${API_URL}/api/settings/landing_logo_url`, {
          value: landingLogoUrl,
        }),
        axios.put(`${API_URL}/api/settings/landing_contact_title`, {
          value: landingContactTitle,
        }),
        axios.put(`${API_URL}/api/settings/landing_contact_phone_1`, {
          value: landingContactPhone1,
        }),
        axios.put(`${API_URL}/api/settings/landing_contact_phone_2`, {
          value: landingContactPhone2,
        }),
        axios.put(`${API_URL}/api/settings/landing_contact_email`, {
          value: landingContactEmail,
        }),
        axios.put(`${API_URL}/api/settings/landing_contact_address_title`, {
          value: landingContactAddressTitle,
        }),
        axios.put(`${API_URL}/api/settings/landing_contact_address`, {
          value: landingContactAddress,
        }),
        axios.put(`${API_URL}/api/settings/about_title`, {
          value: aboutTitle,
        }),
        axios.put(`${API_URL}/api/settings/about_subtitle`, {
          value: aboutSubtitle,
        }),
        axios.put(`${API_URL}/api/settings/about_paragraph_1`, {
          value: aboutParagraph1,
        }),
        axios.put(`${API_URL}/api/settings/about_paragraph_2`, {
          value: aboutParagraph2,
        }),
        axios.put(`${API_URL}/api/settings/about_highlight_1_title`, {
          value: aboutHighlight1Title,
        }),
        axios.put(`${API_URL}/api/settings/about_highlight_1_desc`, {
          value: aboutHighlight1Desc,
        }),
        axios.put(`${API_URL}/api/settings/about_highlight_2_title`, {
          value: aboutHighlight2Title,
        }),
        axios.put(`${API_URL}/api/settings/about_highlight_2_desc`, {
          value: aboutHighlight2Desc,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_badge`, {
          value: homeHeroBadge,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_title`, {
          value: homeHeroTitle,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_highlight`, {
          value: homeHeroHighlight,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_description`, {
          value: homeHeroDescription,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_cta_1_text`, {
          value: homeHeroCta1Text,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_cta_1_link`, {
          value: homeHeroCta1Link,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_cta_2_text`, {
          value: homeHeroCta2Text,
        }),
        axios.put(`${API_URL}/api/settings/home_hero_cta_2_link`, {
          value: homeHeroCta2Link,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_badge`, {
          value: homeQuickBadge,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_title`, {
          value: homeQuickTitle,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_1_badge`, {
          value: homeQuick1Badge,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_1_title`, {
          value: homeQuick1Title,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_1_desc`, {
          value: homeQuick1Desc,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_2_badge`, {
          value: homeQuick2Badge,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_2_title`, {
          value: homeQuick2Title,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_2_desc`, {
          value: homeQuick2Desc,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_3_badge`, {
          value: homeQuick3Badge,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_3_title`, {
          value: homeQuick3Title,
        }),
        axios.put(`${API_URL}/api/settings/home_quick_3_desc`, {
          value: homeQuick3Desc,
        }),
        axios.put(`${API_URL}/api/settings/home_why_badge`, {
          value: homeWhyBadge,
        }),
        axios.put(`${API_URL}/api/settings/home_why_title`, {
          value: homeWhyTitle,
        }),
        axios.put(`${API_URL}/api/settings/home_why_1_title`, {
          value: homeWhy1Title,
        }),
        axios.put(`${API_URL}/api/settings/home_why_1_desc`, {
          value: homeWhy1Desc,
        }),
        axios.put(`${API_URL}/api/settings/home_why_2_title`, {
          value: homeWhy2Title,
        }),
        axios.put(`${API_URL}/api/settings/home_why_2_desc`, {
          value: homeWhy2Desc,
        }),
        axios.put(`${API_URL}/api/settings/home_why_3_title`, {
          value: homeWhy3Title,
        }),
        axios.put(`${API_URL}/api/settings/home_why_3_desc`, {
          value: homeWhy3Desc,
        }),
      ])
      setMessage('Pengaturan berhasil disimpan.')
    } catch {
      setMessage('Gagal menyimpan pengaturan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Pengaturan Umum
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border bg-white/90 p-4 text-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Nomor WhatsApp (tanpa +, contoh: 6281234567890)
          </label>
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Jam Operasional (contoh: Senin – Minggu, 09.00 – 20.00 WIB)
          </label>
          <input
            value={operationalHours}
            onChange={(e) => setOperationalHours(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Username Instagram (tanpa @, contoh: nonadeflorist)
          </label>
          <input
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Header & Logo
          </h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Upload Logo (gambar akan disimpan di server)
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const data = new FormData()
                data.append('logo', file)
                try {
                  const res = await axios.post(
                    `${API_URL}/api/settings/logo`,
                    data,
                    {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    },
                  )
                  if (res.data?.value) {
                    setLandingLogoUrl(res.data.value)
                    setMessage('Logo berhasil diupload.')
                  }
                } catch {
                  setMessage('Gagal mengupload logo.')
                }
              }}
              className="w-full text-xs text-slate-600"
            />
            {landingLogoUrl && (
              <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <img
                  src={`${API_URL}${landingLogoUrl}`}
                  alt="Logo saat ini"
                  className="h-10 w-auto rounded-md object-contain"
                />
                <p className="text-[11px] text-slate-500">
                  Logo saat ini. Upload baru untuk mengganti.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Landing - Contact Section
          </h3>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Judul kolom kiri (misal: Contact)
              </label>
              <input
                value={landingContactTitle}
                onChange={(e) => setLandingContactTitle(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Judul kolom kanan (misal: Address)
              </label>
              <input
                value={landingContactAddressTitle}
                onChange={(e) => setLandingContactAddressTitle(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Nomor CP 1
              </label>
              <input
                value={landingContactPhone1}
                onChange={(e) => setLandingContactPhone1(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Nomor CP 2 (opsional)
              </label>
              <input
                value={landingContactPhone2}
                onChange={(e) => setLandingContactPhone2(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Email
              </label>
              <input
                type="email"
                value={landingContactEmail}
                onChange={(e) => setLandingContactEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Alamat
              </label>
              <input
                value={landingContactAddress}
                onChange={(e) => setLandingContactAddress(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            About Page
          </h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Subtitle (badge atas)
            </label>
            <input
              value={aboutSubtitle}
              onChange={(e) => setAboutSubtitle(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Judul utama
            </label>
            <input
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Deskripsi paragraf 1
            </label>
            <textarea
              rows={3}
              value={aboutParagraph1}
              onChange={(e) => setAboutParagraph1(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Deskripsi paragraf 2
            </label>
            <textarea
              rows={3}
              value={aboutParagraph2}
              onChange={(e) => setAboutParagraph2(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Kartu highlight 1 - judul
              </label>
              <input
                value={aboutHighlight1Title}
                onChange={(e) => setAboutHighlight1Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu highlight 1 - deskripsi
              </label>
              <textarea
                rows={2}
                value={aboutHighlight1Desc}
                onChange={(e) => setAboutHighlight1Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Kartu highlight 2 - judul
              </label>
              <input
                value={aboutHighlight2Title}
                onChange={(e) => setAboutHighlight2Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu highlight 2 - deskripsi
              </label>
              <textarea
                rows={2}
                value={aboutHighlight2Desc}
                onChange={(e) => setAboutHighlight2Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Home - Hero
          </h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Badge kecil (misal: Nonade Florist)
            </label>
            <input
              value={homeHeroBadge}
              onChange={(e) => setHomeHeroBadge(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Judul utama
            </label>
            <input
              value={homeHeroTitle}
              onChange={(e) => setHomeHeroTitle(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Highlight judul (teks berwarna)
            </label>
            <input
              value={homeHeroHighlight}
              onChange={(e) => setHomeHeroHighlight(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Deskripsi hero
            </label>
            <textarea
              rows={3}
              value={homeHeroDescription}
              onChange={(e) => setHomeHeroDescription(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div className="pt-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              CTA Hero (Tombol)
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Tombol 1 - teks
                </label>
                <input
                  value={homeHeroCta1Text}
                  onChange={(e) => setHomeHeroCta1Text(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Tombol 1 - link
                </label>
                <input
                  value={homeHeroCta1Link}
                  onChange={(e) => setHomeHeroCta1Link(e.target.value)}
                  disabled={loading}
                  placeholder="/products"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Tombol 2 - teks
                </label>
                <input
                  value={homeHeroCta2Text}
                  onChange={(e) => setHomeHeroCta2Text(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Tombol 2 - link
                </label>
                <input
                  value={homeHeroCta2Link}
                  onChange={(e) => setHomeHeroCta2Link(e.target.value)}
                  disabled={loading}
                  placeholder="/contact"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Gambar hero (upload untuk mengganti)
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const data = new FormData()
                data.append('image', file)
                try {
                  const res = await axios.post(
                    `${API_URL}/api/settings/home-hero-image`,
                    data,
                    {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    },
                  )
                  if (res.data?.value) {
                    setHomeHeroImageUrl(res.data.value)
                    setMessage('Gambar hero berhasil diupload.')
                  }
                } catch {
                  setMessage('Gagal mengupload gambar hero.')
                }
              }}
              className="w-full text-xs text-slate-600"
            />
            {homeHeroImageUrl && (
              <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <img
                  src={`${API_URL}${homeHeroImageUrl}`}
                  alt="Gambar hero saat ini"
                  className="h-16 w-auto rounded-md object-cover"
                />
                <p className="text-[11px] text-slate-500">
                  Gambar hero saat ini. Upload baru untuk mengganti.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Home - Highlight Kategori
          </h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Badge kecil
            </label>
            <input
              value={homeQuickBadge}
              onChange={(e) => setHomeQuickBadge(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Judul section
            </label>
            <input
              value={homeQuickTitle}
              onChange={(e) => setHomeQuickTitle(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Kartu 1 - badge
              </label>
              <input
                value={homeQuick1Badge}
                onChange={(e) => setHomeQuick1Badge(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu 1 - judul
              </label>
              <input
                value={homeQuick1Title}
                onChange={(e) => setHomeQuick1Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu 1 - deskripsi
              </label>
              <textarea
                rows={2}
                value={homeQuick1Desc}
                onChange={(e) => setHomeQuick1Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Kartu 2 - badge
              </label>
              <input
                value={homeQuick2Badge}
                onChange={(e) => setHomeQuick2Badge(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu 2 - judul
              </label>
              <input
                value={homeQuick2Title}
                onChange={(e) => setHomeQuick2Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu 2 - deskripsi
              </label>
              <textarea
                rows={2}
                value={homeQuick2Desc}
                onChange={(e) => setHomeQuick2Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Kartu 3 - badge
              </label>
              <input
                value={homeQuick3Badge}
                onChange={(e) => setHomeQuick3Badge(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu 3 - judul
              </label>
              <input
                value={homeQuick3Title}
                onChange={(e) => setHomeQuick3Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Kartu 3 - deskripsi
              </label>
              <textarea
                rows={2}
                value={homeQuick3Desc}
                onChange={(e) => setHomeQuick3Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Home - Kenapa Nonade
          </h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Badge kecil
            </label>
            <input
              value={homeWhyBadge}
              onChange={(e) => setHomeWhyBadge(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Judul section
            </label>
            <input
              value={homeWhyTitle}
              onChange={(e) => setHomeWhyTitle(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Poin 1 - judul
              </label>
              <input
                value={homeWhy1Title}
                onChange={(e) => setHomeWhy1Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Poin 1 - deskripsi
              </label>
              <textarea
                rows={2}
                value={homeWhy1Desc}
                onChange={(e) => setHomeWhy1Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Poin 2 - judul
              </label>
              <input
                value={homeWhy2Title}
                onChange={(e) => setHomeWhy2Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Poin 2 - deskripsi
              </label>
              <textarea
                rows={2}
                value={homeWhy2Desc}
                onChange={(e) => setHomeWhy2Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Poin 3 - judul
              </label>
              <input
                value={homeWhy3Title}
                onChange={(e) => setHomeWhy3Title(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
              <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">
                Poin 3 - deskripsi
              </label>
              <textarea
                rows={2}
                value={homeWhy3Desc}
                onChange={(e) => setHomeWhy3Desc(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Gambar section (upload untuk mengganti)
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const data = new FormData()
                data.append('image', file)
                try {
                  const res = await axios.post(
                    `${API_URL}/api/settings/home-why-image`,
                    data,
                    {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    },
                  )
                  if (res.data?.value) {
                    setHomeWhyImageUrl(res.data.value)
                    setMessage('Gambar section berhasil diupload.')
                  }
                } catch {
                  setMessage('Gagal mengupload gambar section.')
                }
              }}
              className="w-full text-xs text-slate-600"
            />
            {homeWhyImageUrl && (
              <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <img
                  src={`${API_URL}${homeWhyImageUrl}`}
                  alt="Gambar section saat ini"
                  className="h-20 w-auto rounded-md object-cover"
                />
                <p className="text-[11px] text-slate-500">
                  Gambar section saat ini. Upload baru untuk mengganti.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {message && (
            <p className="text-xs text-slate-600">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={saving || loading}
            className="ml-auto rounded-full bg-primary-500 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings

