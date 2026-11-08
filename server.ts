import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_USERS, INITIAL_SUBSCRIBERS } from './src/data/initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory and database file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface Database {
  products: typeof INITIAL_PRODUCTS;
  coupons: typeof INITIAL_COUPONS;
  orders: typeof INITIAL_ORDERS;
  reviews: typeof INITIAL_REVIEWS;
  users: typeof INITIAL_USERS;
  subscribers: typeof INITIAL_SUBSCRIBERS;
}

function loadDB(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure all fields exist
      return {
        products: parsed.products || INITIAL_PRODUCTS,
        coupons: parsed.coupons || INITIAL_COUPONS,
        orders: parsed.orders || INITIAL_ORDERS,
        reviews: parsed.reviews || INITIAL_REVIEWS,
        users: parsed.users || INITIAL_USERS,
        subscribers: parsed.subscribers || INITIAL_SUBSCRIBERS,
      };
    }
  } catch (err) {
    console.error('Error reading DB, re-initializing defaults:', err);
  }
  const defaultDB: Database = {
    products: INITIAL_PRODUCTS,
    coupons: INITIAL_COUPONS,
    orders: INITIAL_ORDERS,
    reviews: INITIAL_REVIEWS,
    users: INITIAL_USERS,
    subscribers: INITIAL_SUBSCRIBERS,
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2));
  return defaultDB;
}

function saveDB(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

let db = loadDB();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Products REST API
  app.get('/api/products', (req: Request, res: Response) => {
    let list = [...db.products];
    const { category, search, minPrice, maxPrice, sort } = req.query;

    if (category && category !== 'all') {
      if (category === 'outerwear') {
        list = list.filter((p) => p.subcategory.toLowerCase().includes('outerwear') || p.subcategory.toLowerCase().includes('coat'));
      } else if (category === 'tailoring') {
        list = list.filter((p) => p.subcategory.toLowerCase().includes('tailoring') || p.description.toLowerCase().includes('tailor'));
      } else {
        list = list.filter((p) => p.category === category);
      }
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      list = list.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json(list);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.products.find((p) => p.id === req.params.id || p.slug === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: req.body.rating || 5.0,
      reviewsCount: req.body.reviewsCount || 0,
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(newProduct);
    saveDB(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    db.products[index] = { ...db.products[index], ...req.body };
    saveDB(db);
    res.json(db.products[index]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const prevCount = db.products.length;
    db.products = db.products.filter((p) => p.id !== req.params.id);
    if (db.products.length === prevCount) {
      return res.status(404).json({ error: 'Product not found' });
    }
    saveDB(db);
    res.json({ success: true, message: 'Product deleted' });
  });

  // Orders API
  app.get('/api/orders', (req: Request, res: Response) => {
    const email = req.query.email as string | undefined;
    if (email) {
      const userOrders = db.orders.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
      return res.json(userOrders);
    }
    res.json(db.orders);
  });

  app.get('/api/orders/:orderNumber', (req: Request, res: Response) => {
    const order = db.orders.find(
      (o) => o.orderNumber.toLowerCase() === req.params.orderNumber.toLowerCase() || o.id === req.params.orderNumber
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { customer, items, subtotal, discount, couponCode, shipping, total, paymentMethod } = req.body;
    if (!customer || !items || !items.length) {
      return res.status(400).json({ error: 'Customer and items are required' });
    }

    const orderNumber = `NV-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `NV-EXP-${Math.floor(100000 + Math.random() * 900000)}INT`;

    // Decrement stock for purchased items
    for (const item of items) {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      discount: discount || 0,
      couponCode,
      shipping: shipping || 0,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? ('pending' as const) : ('paid' as const),
      status: 'processing' as const,
      trackingNumber,
      timeline: [
        {
          status: 'Order Placed',
          time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          note: paymentMethod === 'cod' ? 'Order confirmed via Cash on Delivery' : 'Payment confirmed & verified',
        },
        {
          status: 'Processing',
          time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          note: 'Sent to Atelier for bespoke inspection and garment packaging',
        },
      ],
    };

    db.orders.unshift(newOrder);
    saveDB(db);
    res.status(201).json(newOrder);
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, note } = req.body;
    const order = db.orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }
    order.timeline.push({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      note: note || `Status updated to ${status}`,
    });
    saveDB(db);
    res.json(order);
  });

  // Coupons API
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        error: `Minimum order amount of $${coupon.minOrder} required for coupon ${coupon.code}`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      coupon,
    });
  });

  app.get('/api/coupons', (_req: Request, res: Response) => {
    res.json(db.coupons);
  });

  app.post('/api/coupons', (req: Request, res: Response) => {
    const newCoupon = {
      id: `c-${Date.now()}`,
      code: req.body.code.toUpperCase().trim(),
      discountType: req.body.discountType || 'percentage',
      value: Number(req.body.value),
      minOrder: Number(req.body.minOrder || 0),
      active: true,
      description: req.body.description || `${req.body.value}${req.body.discountType === 'percentage' ? '%' : '$'} privilege discount`,
    };
    db.coupons.push(newCoupon);
    saveDB(db);
    res.status(201).json(newCoupon);
  });

  app.delete('/api/coupons/:id', (req: Request, res: Response) => {
    db.coupons = db.coupons.filter((c) => c.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // Reviews API
  app.get('/api/reviews/:productId', (req: Request, res: Response) => {
    const reviews = db.reviews.filter((r) => r.productId === req.params.productId);
    res.json(reviews);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { productId, userName, rating, comment } = req.body;
    if (!productId || !userName || !comment) {
      return res.status(400).json({ error: 'Product ID, name, and comment are required' });
    }
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      userName,
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment,
      verified: true,
    };
    db.reviews.unshift(newReview);

    // Update product rating and reviewsCount
    const prod = db.products.find((p) => p.id === productId);
    if (prod) {
      const prodReviews = db.reviews.filter((r) => r.productId === productId);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewsCount = prodReviews.length;
    }

    saveDB(db);
    res.status(201).json(newReview);
  });

  // Subscribers API
  app.get('/api/subscribers', (_req: Request, res: Response) => {
    res.json(db.subscribers);
  });

  app.post('/api/subscribers', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    const existing = db.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({ message: 'Already subscribed', subscriber: existing });
    }
    const newSub = {
      id: `sub-${Date.now()}`,
      email: email.trim().toLowerCase(),
      subscribedAt: new Date().toISOString(),
    };
    db.subscribers.push(newSub);
    saveDB(db);
    res.status(201).json({ message: 'Welcome to the Nova Circle', subscriber: newSub });
  });

  // Admin Analytics & Store Stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalRevenue = db.orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
    const totalOrders = db.orders.length;
    const totalProducts = db.products.length;
    const totalCustomers = db.users.length + db.orders.length;
    const lowStockProducts = db.products.filter((p) => p.stock < 10);
    const pendingOrders = db.orders.filter((o) => o.status === 'pending' || o.status === 'processing');

    const recentOrders = db.orders.slice(0, 5);

    // Monthly revenue simulation data for analytics charts
    const revenueAnalytics = [
      { month: 'Jun', revenue: 14200, orders: 28 },
      { month: 'Jul', revenue: 18900, orders: 36 },
      { month: 'Aug', revenue: 23400, orders: 48 },
      { month: 'Sep', revenue: 31200, orders: 62 },
      { month: 'Oct', revenue: 38600, orders: 74 },
      { month: 'Nov', revenue: totalRevenue + 12400, orders: totalOrders + 18 },
    ];

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      pendingOrdersCount: pendingOrders.length,
      recentOrders,
      revenueAnalytics,
    });
  });

  // Auth Simulation API
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Check if admin
    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@novafashion.com') {
      const admin = db.users.find((u) => u.role === 'admin') || {
        id: 'usr-admin',
        name: 'Nova Atelier Director',
        email: 'admin@novafashion.com',
        role: 'admin' as const,
        wishlist: [],
      };
      return res.json(admin);
    }
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      return res.json(user);
    }
    // Auto register customer if doesn't exist for seamless login
    const newUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email: email.toLowerCase(),
      role: 'customer' as const,
      wishlist: [],
    };
    db.users.push(newUser);
    saveDB(db);
    res.json(newUser);
  });

  // Attach Vite middleware in development
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOVA FASHION Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
