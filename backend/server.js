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
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value VARCHAR(255) NOT NULL
    )
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

app.get('/api/products', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     ORDER BY p.id DESC`,
  )
  res.json(rows)
})

app.post(
  '/api/products',
  upload.single('image'),
  async (req, res) => {
    const { category_id, subcategory_id, name, price, description, is_active } =
      req.body
    const imageUrl = req.file
      ? `/uploads-nonadeflorist/${req.file.filename}`
      : null

    const [result] = await pool.query(
      `INSERT INTO products
       (category_id, subcategory_id, name, price, image_url, description, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        subcategory_id || null,
        name,
        price,
        imageUrl,
        description,
        is_active ? 1 : 0,
      ],
    )

    res
      .status(201)
      .json({ id: result.insertId, image_url: imageUrl, name })
  },
)

app.put(
  '/api/products/:id',
  upload.single('image'),
  async (req, res) => {
    const { id } = req.params
    const { category_id, subcategory_id, name, price, description, is_active } =
      req.body

  const [rows] = await pool.query(
    'SELECT image_url FROM products WHERE id = ?',
    [id],
  )
  const currentImage = rows.length ? rows[0].image_url : null

  let imageUrl = req.body.image_url || currentImage || null
  if (req.file) {
    imageUrl = `/uploads-nonadeflorist/${req.file.filename}`
  }

  await pool.query(
    `UPDATE products
     SET category_id=?, subcategory_id=?, name=?, price=?, image_url=?, description=?, is_active=?
     WHERE id=?`,
    [
      category_id,
      subcategory_id || null,
      name,
      price,
      imageUrl,
      description,
      is_active ? 1 : 0,
      id,
    ],
  )

  if (req.file && currentImage && currentImage !== imageUrl) {
    deleteImageIfExists(currentImage)
  }

  res.json({ id, image_url: imageUrl, name })
  },
)

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params
  const [rows] = await pool.query(
    'SELECT image_url FROM products WHERE id = ?',
    [id],
  )
  const currentImage = rows.length ? rows[0].image_url : null

  await pool.query('DELETE FROM products WHERE id=?', [id])

  if (currentImage) {
    deleteImageIfExists(currentImage)
  }
  res.status(204).end()
})

app.get('/api/public/products', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS subcategory_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories s ON s.id = p.subcategory_id
     WHERE p.is_active = 1
     ORDER BY p.id DESC`,
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
  res.json(rows[0])
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

// PUBLIC Testimonials for homepage
app.get('/api/public/testimonials', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM testimonials
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

app.get('/api/settings', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT setting_key AS `key`, setting_value AS `value` FROM settings',
  )
  res.json(rows)
})

app.put('/api/settings/:key', async (req, res) => {
  const { key } = req.params
  const { value } = req.body

  if (typeof value !== 'string' || !value.trim()) {
    return res.status(400).json({ message: 'Value tidak boleh kosong' })
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

app.get('/api/public/settings', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT setting_key, setting_value FROM settings WHERE setting_key IN (?, ?)',
    ['whatsapp_number', 'operational_hours'],
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

  res.json({ whatsapp_number: whatsapp, operational_hours: operationalHours })
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

