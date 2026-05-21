const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const mysql = require('mysql2/promise')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uploadDir = path.join(__dirname, 'uploads-nonadeflorist')
app.use('/uploads-nonadeflorist', express.static(uploadDir))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const upload = multer({ storage })

function deleteImageIfExists(imageUrl) {
  if (!imageUrl) return
  try {
    const filePath = path.join(uploadDir, path.basename(imageUrl))
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (err) {
    console.error('Failed to delete image file', err)
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nonade_florist',
})

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(120) UNIQUE NOT NULL
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subcategories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(120) UNIQUE NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      subcategory_id INT NULL,
      name VARCHAR(150) NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      image_url VARCHAR(255),
      description LONGTEXT,
      is_active TINYINT(1) DEFAULT 1,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
    )
  `)

  try {
    await pool.query(
      'ALTER TABLE products ADD COLUMN sort_order INT NOT NULL DEFAULT 0',
    )
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') throw e
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_product_images_product_id (product_id)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS about_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_url VARCHAR(255) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      location VARCHAR(100) NULL,
      message TEXT NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      author VARCHAR(100) NULL,
      message TEXT NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(
    `
    INSERT INTO quotes (author, message, is_active, sort_order)
    SELECT ?, ?, 1, 0
    WHERE NOT EXISTS (SELECT 1 FROM quotes)
  `,
    [
      'Pemilik Nonade Florist',
      'Biasanya aku ngasih shay Thank u ucapan buat semua orang yg udah mampir ke web aku.',
    ],
  )

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value VARCHAR(255) NOT NULL
    )
  `)

  await pool.query(`
    ALTER TABLE settings
    MODIFY setting_value VARCHAR(255) NOT NULL
  `)

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('whatsapp_number', ?)
  `,
    [process.env.DEFAULT_WHATSAPP_NUMBER || '6281234567890'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('operational_hours', ?)
  `,
    ['Senin – Minggu, 09.00 – 20.00 WIB'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('instagram_handle', ?)
  `,
    ['nonadeflorist.smdg'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('landing_logo_url', ?)
  `,
    [''],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('landing_contact_title', ?)
  `,
    ['Contact'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('landing_contact_phone_1', ?)
  `,
    ['0881-0234-69000'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('landing_contact_phone_2', ?)
  `,
    ['0821-1995-5657'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('landing_contact_email', ?)
  `,
    ['Nonfloristsumedang@gmail.com'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('landing_contact_address_title', ?)
  `,
    ['Address'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('landing_contact_address', ?)
  `,
    ['Jl Angrek No 147A kecamatan Sumedang Utara'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_image_url', ?)
    `,
    [''],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_image_url', ?)
    `,
    [''],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_title', ?)
  `,
    ['Studio buket modern dengan sentuhan personal.'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_subtitle', ?)
  `,
    ['About Us'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_paragraph_1', ?)
  `,
    [
      'Nonade Florist berfokus pada buket yang clean, airy, dan feminin. Kami mengutamakan pemilihan warna, tekstur, dan komposisi yang seimbang agar setiap rangkaian terasa hangat dan thoughtful.',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_paragraph_2', ?)
  `,
    [
      'Setiap buket dibuat secara made-to-order untuk memastikan bunga selalu fresh dan tetap selaras dengan cerita yang ingin Anda sampaikan — mulai dari momen romantis, ucapan selamat, hingga gesture kecil penuh perhatian.',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_highlight_1_title', ?)
  `,
    ['Signature Style'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_highlight_1_desc', ?)
  `,
    ['Warna pastel lembut, wrapping minimalis, dan detail pita yang delicate.'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_highlight_2_title', ?)
  `,
    ['Custom Request'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('about_highlight_2_desc', ?)
  `,
    [
      'Bisa menyesuaikan palette warna, ukuran buket, hingga kartu ucapan personal.',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_badge', ?)
  `,
    ['Nonade Florist'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_title', ?)
  `,
    ['Buket bunga kurasi'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_highlight', ?)
  `,
    ['untuk setiap momen manis.'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_description', ?)
  `,
    [
      'Buket Bunga • Papan Bunga • Standing Flower Grand Opening • Wisuda • Wedding • Duka Cita • Flower Box • Hampers Unik • Dibuat dengan bunga segar & kualitas terbaik',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_cta_1_text', ?)
  `,
    ['Lihat koleksi buket'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_cta_1_link', ?)
  `,
    ['/products'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_cta_2_text', ?)
  `,
    ['Konsultasi custom order'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_hero_cta_2_link', ?)
  `,
    ['/contact'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_badge', ?)
  `,
    ['Pilihan cepat'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_title', ?)
  `,
    ['Temukan buket sesuai momennya'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_1_badge', ?)
  `,
    ['Handmade & Custom'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_1_title', ?)
  `,
    ['Rangkaian sesuai cerita Anda'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_1_desc', ?)
  `,
    [
      'Setiap rangkaian dibuat manual dengan detail & bisa request warna, tema, dan budget sesuai kebutuhan Anda.',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_2_badge', ?)
  `,
    ['Same Day Delivery Sumedang'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_2_title', ?)
  `,
    ['Kirim di hari yang sama'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_2_desc', ?)
  `,
    [
      'Pesan hari ini, kirim hari ini. Layanan cepat untuk surprise, ucapan, dan kebutuhan mendadak.',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_3_badge', ?)
  `,
    ['Bunga Segar & Premium Quality'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_3_title', ?)
  `,
    ['Tampilan elegan & tahan lama'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_quick_3_desc', ?)
  `,
    [
      'Menggunakan bunga fresh & material premium agar tampil elegan, rapi, dan tahan lebih lama.',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_badge', ?)
  `,
    ['Kenapa Nonade?'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_title', ?)
  `,
    ['Detail kecil yang membuat buket terasa lebih thoughtful.'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_1_title', ?)
  `,
    ['Konsultasi palette warna'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_1_desc', ?)
  `,
    ['Sesuaikan suasana acara dan preferensi penerima.'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_2_title', ?)
  `,
    ['Kartu ucapan handwritten'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_2_desc', ?)
  `,
    [
      'Pesan pendek yang ditulis rapi menambah sentuhan personal.',
    ],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_3_title', ?)
  `,
    ['Packaging yang fotogenik'],
  )

  await pool.query(
    `
    INSERT IGNORE INTO settings (setting_key, setting_value)
    VALUES ('home_why_3_desc', ?)
  `,
    ['Setiap buket dirancang siap difoto tanpa perlu diatur ulang.'],
  )

  await pool.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_url VARCHAR(255) NOT NULL,
      link_url VARCHAR(255),
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body
  if (
    username === (process.env.ADMIN_USER || 'admin') &&
    password === (process.env.ADMIN_PASSWORD || 'admin123')
  ) {
    return res.json({ token: 'dummy-token', username })
  }
  return res.status(401).json({ message: 'Username atau password salah' })
})

app.get('/api/categories', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name')
  res.json(rows)
})

app.post('/api/categories', async (req, res) => {
  const { name, slug } = req.body
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug) VALUES (?, ?)',
    [name, slug],
  )
  res.status(201).json({ id: result.insertId, name, slug })
})

app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params
  const { name, slug } = req.body
  await pool.query('UPDATE categories SET name=?, slug=? WHERE id=?', [
    name,
    slug,
    id,
  ])
  res.json({ id, name, slug })
})

app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM categories WHERE id=?', [id])
  res.status(204).end()
})

app.get('/api/subcategories', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT s.*, c.name AS category_name
     FROM subcategories s
     JOIN categories c ON c.id = s.category_id
     ORDER BY c.name, s.name`,
  )
  res.json(rows)
})

app.post('/api/subcategories', async (req, res) => {
  const { category_id, name, slug } = req.body
  const [result] = await pool.query(
    'INSERT INTO subcategories (category_id, name, slug) VALUES (?, ?, ?)',
    [category_id, name, slug],
  )
  res.status(201).json({ id: result.insertId, category_id, name, slug })
})

app.put('/api/subcategories/:id', async (req, res) => {
  const { id } = req.params
  const { category_id, name, slug } = req.body
  await pool.query(
    'UPDATE subcategories SET category_id=?, name=?, slug=? WHERE id=?',
    [category_id, name, slug, id],
  )
  res.json({ id, category_id, name, slug })
})

app.delete('/api/subcategories/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM subcategories WHERE id=?', [id])
  res.status(204).end()
})

app.get('/api/products', async (req, res) => {
  const { search = '', sort = 'sort_order_asc' } = req.query
  const searchTerm = String(search).trim()
  const searchCondition = searchTerm
    ? `AND (p.name LIKE ? OR c.name LIKE ? OR s.name LIKE ?)`
    : ''
  const searchParam = searchTerm
    ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    : []

  let orderBy = 'ORDER BY p.sort_order ASC, p.id ASC'
  if (sort === 'sort_order_desc')
    orderBy = 'ORDER BY p.sort_order DESC, p.id DESC'
  else if (sort === 'id_asc') orderBy = 'ORDER BY p.id ASC'
  else if (sort === 'id_desc') orderBy = 'ORDER BY p.id DESC'

  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     WHERE 1=1 ${searchCondition} ${orderBy}`,
    searchParam,
  )
  res.json(rows)
})

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     WHERE p.id = ?`,
    [id],
  )
  if (!rows.length) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' })
  }
  const product = rows[0]
  const [images] = await pool.query(
    'SELECT id, image_url, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [id],
  )
  res.json({
    ...product,
    images,
  })
})

app.post(
  '/api/products',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 8 },
  ]),
  async (req, res) => {
    const {
      category_id,
      subcategory_id,
      name,
      price,
      description,
      is_active,
      sort_order = 0,
    } = req.body
    const imageFiles = [
      ...(req.files?.image || []),
      ...(req.files?.images || []),
    ]

    const mainImageUrl =
      imageFiles.length > 0
        ? `/uploads-nonadeflorist/${imageFiles[0].filename}`
        : null
    const order = Number.isNaN(Number(sort_order)) ? 0 : Number(sort_order)

    const [result] = await pool.query(
      `INSERT INTO products
       (category_id, subcategory_id, name, price, image_url, description, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        subcategory_id || null,
        name,
        price,
        mainImageUrl,
        description,
        is_active ? 1 : 0,
        order,
      ],
    )

    if (imageFiles.length > 0) {
      const values = imageFiles.map((file, index) => [
        result.insertId,
        `/uploads-nonadeflorist/${file.filename}`,
        index,
      ])
      await pool.query(
        `
        INSERT INTO product_images (product_id, image_url, sort_order)
        VALUES ?
      `,
        [values],
      )
    }

    res
      .status(201)
      .json({ id: result.insertId, image_url: mainImageUrl, name })
  },
)

app.put(
  '/api/products/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 8 },
  ]),
  async (req, res) => {
    const { id } = req.params
    const {
      category_id,
      subcategory_id,
      name,
      price,
      description,
      is_active,
      sort_order,
    } = req.body
    const order =
      sort_order !== undefined && !Number.isNaN(Number(sort_order))
        ? Number(sort_order)
        : null

  const [rows] = await pool.query(
    'SELECT image_url FROM products WHERE id = ?',
    [id],
  )
  const currentImage = rows.length ? rows[0].image_url : null

  const imageFiles = [
    ...(req.files?.image || []),
    ...(req.files?.images || []),
  ]

  let imageUrl = req.body.image_url || currentImage || null
  if (imageFiles.length > 0) {
    imageUrl = `/uploads-nonadeflorist/${imageFiles[0].filename}`
  }

  const updateFields =
    order !== null
      ? `category_id=?, subcategory_id=?, name=?, price=?, image_url=?, description=?, is_active=?, sort_order=?`
      : `category_id=?, subcategory_id=?, name=?, price=?, image_url=?, description=?, is_active=?`
  const updateValues =
    order !== null
      ? [
          category_id,
          subcategory_id || null,
          name,
          price,
          imageUrl,
          description,
          is_active ? 1 : 0,
          order,
          id,
        ]
      : [
          category_id,
          subcategory_id || null,
          name,
          price,
          imageUrl,
          description,
          is_active ? 1 : 0,
          id,
        ]
  await pool.query(
    `UPDATE products SET ${updateFields} WHERE id=?`,
    updateValues,
  )

  if (imageFiles.length > 0 && currentImage && currentImage !== imageUrl) {
    const [refRows] = await pool.query(
      'SELECT 1 FROM product_images WHERE product_id = ? AND image_url = ? LIMIT 1',
      [id, currentImage],
    )
    if (refRows.length === 0) {
      deleteImageIfExists(currentImage)
    }
  }

  if (imageFiles.length > 0) {
    const [[{ maxOrder }]] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM product_images WHERE product_id = ?',
      [id],
    )
    let start = maxOrder + 1
    const values = imageFiles.map((file) => {
      const v = [id, `/uploads-nonadeflorist/${file.filename}`, start]
      start += 1
      return v
    })
    await pool.query(
      `
      INSERT INTO product_images (product_id, image_url, sort_order)
      VALUES ?
    `,
      [values],
    )
  }

  res.json({ id, image_url: imageUrl, name })
  },
)

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params

  const [productRows] = await pool.query(
    'SELECT image_url FROM products WHERE id = ?',
    [id],
  )
  const mainImage = productRows.length ? productRows[0].image_url : null

  const [imageRows] = await pool.query(
    'SELECT image_url FROM product_images WHERE product_id = ?',
    [id],
  )

  await pool.query('DELETE FROM product_images WHERE product_id = ?', [id])
  await pool.query('DELETE FROM products WHERE id = ?', [id])

  const allImageUrls = new Set()
  if (mainImage) allImageUrls.add(mainImage)
  for (const row of imageRows) {
    if (row.image_url) {
      allImageUrls.add(row.image_url)
    }
  }

  for (const url of allImageUrls) {
    deleteImageIfExists(url)
  }

  res.status(204).end()
})

app.put('/api/products/:id/main-image', async (req, res) => {
  const { id } = req.params
  const { image_id } = req.body

  const [rows] = await pool.query(
    'SELECT image_url FROM product_images WHERE id = ? AND product_id = ?',
    [image_id, id],
  )
  if (!rows.length) {
    return res.status(404).json({ message: 'Gambar tidak ditemukan' })
  }

  const imageUrl = rows[0].image_url
  await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [
    imageUrl,
    id,
  ])

  const [productRows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     WHERE p.id = ?`,
    [id],
  )
  const [images] = await pool.query(
    'SELECT id, image_url, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [id],
  )

  res.json({
    ...productRows[0],
    images,
  })
})

app.delete('/api/products/:id/images/:imageId', async (req, res) => {
  const { id, imageId } = req.params

  const [rows] = await pool.query(
    'SELECT image_url FROM product_images WHERE id = ? AND product_id = ?',
    [imageId, id],
  )
  if (!rows.length) {
    return res.status(404).json({ message: 'Gambar tidak ditemukan' })
  }

  const imageUrl = rows[0].image_url

  await pool.query('DELETE FROM product_images WHERE id = ? AND product_id = ?', [
    imageId,
    id,
  ])

  const [productRows] = await pool.query(
    'SELECT image_url FROM products WHERE id = ?',
    [id],
  )
  const currentMain = productRows.length ? productRows[0].image_url : null

  if (currentMain && currentMain === imageUrl) {
    const [nextImages] = await pool.query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC LIMIT 1',
      [id],
    )
    const newMain = nextImages.length ? nextImages[0].image_url : null
    await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [
      newMain,
      id,
    ])
  }

  deleteImageIfExists(imageUrl)

  const [updatedProductRows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     WHERE p.id = ?`,
    [id],
  )
  const [images] = await pool.query(
    'SELECT id, image_url, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [id],
  )

  res.json({
    ...updatedProductRows[0],
    images,
  })
})

app.get('/api/public/products', async (req, res) => {
  const { search = '' } = req.query
  const searchTerm = String(search).trim()
  const searchCondition = searchTerm
    ? `AND (p.name LIKE ? OR c.name LIKE ? OR s.name LIKE ?)`
    : ''
  const searchParam = searchTerm
    ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    : []

  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     WHERE p.is_active = 1 ${searchCondition}
     ORDER BY COALESCE(p.sort_order, 0) ASC, p.id ASC`,
    searchParam,
  )
  res.json(rows)
})

app.get('/api/public/products/:id', async (req, res) => {
  const { id } = req.params
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     WHERE p.id = ? AND p.is_active = 1`,
    [id],
  )
  if (!rows.length) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' })
  }
  const product = rows[0]
  const [images] = await pool.query(
    'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [id],
  )
  res.json({
    ...product,
    images,
  })
})

// ADMIN Testimonials
app.get('/api/testimonials', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC',
  )
  res.json(rows)
})

app.post('/api/testimonials', async (req, res) => {
  const { customer_name, location, message, is_active, sort_order } = req.body
  const [result] = await pool.query(
    `INSERT INTO testimonials (customer_name, location, message, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [customer_name, location || null, message, is_active ? 1 : 0, sort_order || 0],
  )
  res.status(201).json({
    id: result.insertId,
    customer_name,
    location,
    message,
    is_active: !!is_active,
    sort_order: sort_order || 0,
  })
})

app.put('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params
  const { customer_name, location, message, is_active, sort_order } = req.body
  await pool.query(
    `UPDATE testimonials
     SET customer_name = ?, location = ?, message = ?, is_active = ?, sort_order = ?
     WHERE id = ?`,
    [customer_name, location || null, message, is_active ? 1 : 0, sort_order || 0, id],
  )
  res.json({
    id,
    customer_name,
    location,
    message,
    is_active: !!is_active,
    sort_order: sort_order || 0,
  })
})

app.delete('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM testimonials WHERE id = ?', [id])
  res.status(204).end()
})

app.get('/api/quotes', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM quotes ORDER BY sort_order ASC, created_at DESC',
  )
  res.json(rows)
})

app.post('/api/quotes', async (req, res) => {
  const { author, message, is_active, sort_order } = req.body
  const [result] = await pool.query(
    `
    INSERT INTO quotes (author, message, is_active, sort_order)
    VALUES (?, ?, ?, ?)
  `,
    [author || null, message, is_active ? 1 : 0, sort_order || 0],
  )
  res.status(201).json({
    id: result.insertId,
    author,
    message,
    is_active: !!is_active,
    sort_order: sort_order || 0,
  })
})

app.put('/api/quotes/:id', async (req, res) => {
  const { id } = req.params
  const { author, message, is_active, sort_order } = req.body

  await pool.query(
    `
    UPDATE quotes
    SET author = ?, message = ?, is_active = ?, sort_order = ?
    WHERE id = ?
  `,
    [author || null, message, is_active ? 1 : 0, sort_order || 0, id],
  )

  res.json({
    id,
    author,
    message,
    is_active: !!is_active,
    sort_order: sort_order || 0,
  })
})

app.delete('/api/quotes/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM quotes WHERE id = ?', [id])
  res.status(204).end()
})

// PUBLIC Testimonials for homepage
app.get('/api/public/testimonials', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM testimonials
     WHERE is_active = 1
     ORDER BY sort_order ASC, created_at DESC`,
  )
  res.json(rows)
})

app.get('/api/public/quotes', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM quotes
     WHERE is_active = 1
     ORDER BY sort_order ASC, created_at DESC`,
  )
  res.json(rows)
})

// ADMIN Banners
app.get('/api/banners', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC',
  )
  res.json(rows)
})

// ADMIN About Images
app.get('/api/about-images', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM about_images ORDER BY sort_order ASC, created_at DESC',
  )
  res.json(rows)
})

app.post(
  '/api/about-images',
  upload.single('image'),
  async (req, res) => {
    const { sort_order } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Gambar wajib diupload' })
    }

    const imageUrl = `/uploads-nonadeflorist/${req.file.filename}`
    const order = Number.isNaN(Number(sort_order)) ? 0 : Number(sort_order)

    const [result] = await pool.query(
      `INSERT INTO about_images (image_url, sort_order)
       VALUES (?, ?)`,
      [imageUrl, order],
    )

    res.status(201).json({
      id: result.insertId,
      image_url: imageUrl,
      sort_order: order,
    })
  },
)

app.delete('/api/about-images/:id', async (req, res) => {
  const { id } = req.params

  const [rows] = await pool.query(
    'SELECT image_url FROM about_images WHERE id = ?',
    [id],
  )
  if (!rows.length) {
    return res.status(404).json({ message: 'Gambar tidak ditemukan' })
  }

  const imageUrl = rows[0].image_url

  await pool.query('DELETE FROM about_images WHERE id = ?', [id])
  deleteImageIfExists(imageUrl)

  res.status(204).end()
})

app.post(
  '/api/banners',
  upload.single('image'),
  async (req, res) => {
    const { link_url, is_active, sort_order } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Gambar banner wajib diupload' })
    }

    const imageUrl = `/uploads-nonadeflorist/${req.file.filename}`

    const [result] = await pool.query(
      `INSERT INTO banners (image_url, link_url, is_active, sort_order)
       VALUES (?, ?, ?, ?)`,
      [imageUrl, link_url || null, is_active ? 1 : 0, sort_order || 0],
    )

    res.status(201).json({
      id: result.insertId,
      image_url: imageUrl,
      link_url: link_url || null,
      is_active: !!is_active,
      sort_order: sort_order || 0,
    })
  },
)

app.put(
  '/api/banners/:id',
  upload.single('image'),
  async (req, res) => {
  const { id } = req.params
  const { link_url, is_active, sort_order, image_url: existingImage } = req.body

  let imageUrl = existingImage || null
  if (req.file) {
    imageUrl = `/uploads-nonadeflorist/${req.file.filename}`
  }

  await pool.query(
    `UPDATE banners
     SET image_url = ?, link_url = ?, is_active = ?, sort_order = ?
     WHERE id = ?`,
    [imageUrl, link_url || null, is_active ? 1 : 0, sort_order || 0, id],
  )

  res.json({
    id,
    image_url: imageUrl,
    link_url: link_url || null,
    is_active: !!is_active,
    sort_order: sort_order || 0,
  })
},
)

app.delete('/api/banners/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM banners WHERE id = ?', [id])
  res.status(204).end()
})

// PUBLIC banners for homepage
app.get('/api/public/banners', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM banners
     WHERE is_active = 1
     ORDER BY sort_order ASC, created_at DESC`,
  )
  res.json(rows)
})

// PUBLIC about images
app.get('/api/public/about-images', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT image_url FROM about_images ORDER BY sort_order ASC, created_at DESC',
  )
  res.json(rows)
})

app.get('/api/settings', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT setting_key AS `key`, setting_value AS `value` FROM settings',
  )
  res.json(rows)
})

app.put('/api/settings/:key', async (req, res) => {
  const { key } = req.params
  const { value } = req.body

  if (typeof value !== 'string') {
    return res.status(400).json({ message: 'Value harus berupa string' })
  }

  await pool.query(
    `
    INSERT INTO settings (setting_key, setting_value)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
  `,
    [key, value.trim()],
  )

  res.json({ key, value: value.trim() })
})

app.post(
  '/api/settings/logo',
  upload.single('logo'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'File logo wajib diupload' })
    }

    const newUrl = `/uploads-nonadeflorist/${req.file.filename}`

    const [rows] = await pool.query(
      'SELECT setting_value FROM settings WHERE setting_key = ?',
      ['landing_logo_url'],
    )
    const previous = rows.length ? rows[0].setting_value : null

    await pool.query(
      `
      INSERT INTO settings (setting_key, setting_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `,
      ['landing_logo_url', newUrl],
    )

    if (
      previous &&
      previous !== newUrl &&
      previous.startsWith('/uploads-nonadeflorist/')
    ) {
      deleteImageIfExists(previous)
    }

    res.json({ key: 'landing_logo_url', value: newUrl })
  },
)

app.post(
  '/api/settings/home-hero-image',
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'File gambar hero wajib diupload' })
    }

    const newUrl = `/uploads-nonadeflorist/${req.file.filename}`

    const [rows] = await pool.query(
      'SELECT setting_value FROM settings WHERE setting_key = ?',
      ['home_hero_image_url'],
    )
    const previous = rows.length ? rows[0].setting_value : null

    await pool.query(
      `
      INSERT INTO settings (setting_key, setting_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `,
      ['home_hero_image_url', newUrl],
    )

    if (
      previous &&
      previous !== newUrl &&
      previous.startsWith('/uploads-nonadeflorist/')
    ) {
      deleteImageIfExists(previous)
    }

    res.json({ key: 'home_hero_image_url', value: newUrl })
  },
)

app.post(
  '/api/settings/home-why-image',
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'File gambar wajib diupload' })
    }

    const newUrl = `/uploads-nonadeflorist/${req.file.filename}`

    const [rows] = await pool.query(
      'SELECT setting_value FROM settings WHERE setting_key = ?',
      ['home_why_image_url'],
    )
    const previous = rows.length ? rows[0].setting_value : null

    await pool.query(
      `
      INSERT INTO settings (setting_key, setting_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `,
      ['home_why_image_url', newUrl],
    )

    if (
      previous &&
      previous !== newUrl &&
      previous.startsWith('/uploads-nonadeflorist/')
    ) {
      deleteImageIfExists(previous)
    }

    res.json({ key: 'home_why_image_url', value: newUrl })
  },
)

app.get('/api/public/settings', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT setting_key, setting_value FROM settings',
  )

  const getValue = (key, fallback) => {
    const row = rows.find((r) => r.setting_key === key)
    return row ? row.setting_value : fallback
  }

  const whatsapp = getValue('whatsapp_number', '6281234567890')
  const operationalHours = getValue(
    'operational_hours',
    'Senin – Minggu, 09.00 – 20.00 WIB',
  )
  const instagramHandle = getValue('instagram_handle', 'nonadeflorist.smdg')
  const landingLogoUrl = getValue('landing_logo_url', '')
  const homeHeroImageUrl = getValue('home_hero_image_url', '')
  const homeWhyImageUrl = getValue('home_why_image_url', '')

  const landingContactTitle = getValue('landing_contact_title', 'Contact')
  const landingContactPhone1 = getValue(
    'landing_contact_phone_1',
    '0881-0234-69000',
  )
  const landingContactPhone2 = getValue(
    'landing_contact_phone_2',
    '0821-1995-5657',
  )
  const landingContactEmail = getValue(
    'landing_contact_email',
    'Nonfloristsumedang@gmail.com',
  )
  const landingContactAddressTitle = getValue(
    'landing_contact_address_title',
    'Address',
  )
  const landingContactAddress = getValue(
    'landing_contact_address',
    'Jl Angrek No 147A kecamatan Sumedang Utara',
  )

  const aboutTitle = getValue(
    'about_title',
    'Studio buket modern dengan sentuhan personal.',
  )
  const aboutSubtitle = getValue('about_subtitle', 'About Us')
  const aboutParagraph1 = getValue(
    'about_paragraph_1',
    'Nonade Florist berfokus pada buket yang clean, airy, dan feminin. Kami mengutamakan pemilihan warna, tekstur, dan komposisi yang seimbang agar setiap rangkaian terasa hangat dan thoughtful.',
  )
  const aboutParagraph2 = getValue(
    'about_paragraph_2',
    'Setiap buket dibuat secara made-to-order untuk memastikan bunga selalu fresh dan tetap selaras dengan cerita yang ingin Anda sampaikan — mulai dari momen romantis, ucapan selamat, hingga gesture kecil penuh perhatian.',
  )
  const aboutHighlight1Title = getValue('about_highlight_1_title', 'Signature Style')
  const aboutHighlight1Desc = getValue(
    'about_highlight_1_desc',
    'Warna pastel lembut, wrapping minimalis, dan detail pita yang delicate.',
  )
  const aboutHighlight2Title = getValue('about_highlight_2_title', 'Custom Request')
  const aboutHighlight2Desc = getValue(
    'about_highlight_2_desc',
    'Bisa menyesuaikan palette warna, ukuran buket, hingga kartu ucapan personal.',
  )

  const homeHeroBadge = getValue('home_hero_badge', 'Nonade Florist')
  const homeHeroTitle = getValue('home_hero_title', 'Buket bunga kurasi')
  const homeHeroHighlight = getValue(
    'home_hero_highlight',
    'untuk setiap momen manis.',
  )
  const homeHeroDescription = getValue(
    'home_hero_description',
    'Buket Bunga • Papan Bunga • Standing Flower Grand Opening • Wisuda • Wedding • Duka Cita • Flower Box • Hampers Unik • Dibuat dengan bunga segar & kualitas terbaik',
  )

  const homeHeroCta1Text = getValue(
    'home_hero_cta_1_text',
    'Lihat koleksi buket',
  )
  const homeHeroCta1Link = getValue(
    'home_hero_cta_1_link',
    '/products',
  )
  const homeHeroCta2Text = getValue(
    'home_hero_cta_2_text',
    'Konsultasi custom order',
  )
  const homeHeroCta2Link = getValue(
    'home_hero_cta_2_link',
    '/contact',
  )

  const homeQuickBadge = getValue('home_quick_badge', 'Pilihan cepat')
  const homeQuickTitle = getValue(
    'home_quick_title',
    'Temukan buket sesuai momennya',
  )
  const homeQuick1Badge = getValue('home_quick_1_badge', 'Handmade & Custom')
  const homeQuick1Title = getValue(
    'home_quick_1_title',
    'Rangkaian sesuai cerita Anda',
  )
  const homeQuick1Desc = getValue(
    'home_quick_1_desc',
    'Setiap rangkaian dibuat manual dengan detail & bisa request warna, tema, dan budget sesuai kebutuhan Anda.',
  )
  const homeQuick2Badge = getValue(
    'home_quick_2_badge',
    'Same Day Delivery Sumedang',
  )
  const homeQuick2Title = getValue(
    'home_quick_2_title',
    'Kirim di hari yang sama',
  )
  const homeQuick2Desc = getValue(
    'home_quick_2_desc',
    'Pesan hari ini, kirim hari ini. Layanan cepat untuk surprise, ucapan, dan kebutuhan mendadak.',
  )
  const homeQuick3Badge = getValue(
    'home_quick_3_badge',
    'Bunga Segar & Premium Quality',
  )
  const homeQuick3Title = getValue(
    'home_quick_3_title',
    'Tampilan elegan & tahan lama',
  )
  const homeQuick3Desc = getValue(
    'home_quick_3_desc',
    'Menggunakan bunga fresh & material premium agar tampil elegan, rapi, dan tahan lebih lama.',
  )

  const homeWhyBadge = getValue('home_why_badge', 'Kenapa Nonade?')
  const homeWhyTitle = getValue(
    'home_why_title',
    'Detail kecil yang membuat buket terasa lebih thoughtful.',
  )
  const homeWhy1Title = getValue(
    'home_why_1_title',
    'Konsultasi palette warna',
  )
  const homeWhy1Desc = getValue(
    'home_why_1_desc',
    'Sesuaikan suasana acara dan preferensi penerima.',
  )
  const homeWhy2Title = getValue(
    'home_why_2_title',
    'Kartu ucapan handwritten',
  )
  const homeWhy2Desc = getValue(
    'home_why_2_desc',
    'Pesan pendek yang ditulis rapi menambah sentuhan personal.',
  )
  const homeWhy3Title = getValue(
    'home_why_3_title',
    'Packaging yang fotogenik',
  )
  const homeWhy3Desc = getValue(
    'home_why_3_desc',
    'Setiap buket dirancang siap difoto tanpa perlu diatur ulang.',
  )

  res.json({
    whatsapp_number: whatsapp,
    operational_hours: operationalHours,
    instagram_handle: instagramHandle,
    landing_logo_url: landingLogoUrl,
    landing_contact: {
      title: landingContactTitle,
      phone_1: landingContactPhone1,
      phone_2: landingContactPhone2,
      email: landingContactEmail,
      address_title: landingContactAddressTitle,
      address: landingContactAddress,
    },
    about: {
      subtitle: aboutSubtitle,
      title: aboutTitle,
      paragraph_1: aboutParagraph1,
      paragraph_2: aboutParagraph2,
      highlights: [
        {
          title: aboutHighlight1Title,
          description: aboutHighlight1Desc,
          variant: 'primary',
        },
        {
          title: aboutHighlight2Title,
          description: aboutHighlight2Desc,
          variant: 'accent',
        },
      ],
    },
    home_hero: {
      badge: homeHeroBadge,
      title: homeHeroTitle,
      highlight: homeHeroHighlight,
      description: homeHeroDescription,
      image_url: homeHeroImageUrl,
      cta_1: {
        text: homeHeroCta1Text,
        link: homeHeroCta1Link,
      },
      cta_2: {
        text: homeHeroCta2Text,
        link: homeHeroCta2Link,
      },
    },
    home_quick: {
      badge: homeQuickBadge,
      title: homeQuickTitle,
      cards: [
        {
          badge: homeQuick1Badge,
          title: homeQuick1Title,
          description: homeQuick1Desc,
          variant: 'primary',
        },
        {
          badge: homeQuick2Badge,
          title: homeQuick2Title,
          description: homeQuick2Desc,
          variant: 'neutral',
        },
        {
          badge: homeQuick3Badge,
          title: homeQuick3Title,
          description: homeQuick3Desc,
          variant: 'accent',
        },
      ],
    },
    home_why: {
      badge: homeWhyBadge,
      title: homeWhyTitle,
      bullets: [
        {
          title: homeWhy1Title,
          description: homeWhy1Desc,
        },
        {
          title: homeWhy2Title,
          description: homeWhy2Desc,
        },
        {
          title: homeWhy3Title,
          description: homeWhy3Desc,
        },
      ],
      image_url: homeWhyImageUrl,
    },
  })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan pada server' })
})

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend Nonade Florist running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize database', err)
    process.exit(1)
  })

