const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
client.collectDefaultMetrics();

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: "UP", service: "quickcommerce-api" });
});

// Prometheus Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Products
app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: "Men's Hoodie",  price: 799,  store: "TrendZone",  eta: "8 mins",  category: "Men" },
    { id: 2, name: "Women's Kurti", price: 499,  store: "FabFashion", eta: "12 mins", category: "Women" },
    { id: 3, name: "Cargo Pants",   price: 999,  store: "UrbanWear",  eta: "10 mins", category: "Men" },
    { id: 4, name: "Floral Dress",  price: 699,  store: "FabFashion", eta: "15 mins", category: "Women" },
    { id: 5, name: "Graphic Tee",   price: 349,  store: "TrendZone",  eta: "8 mins",  category: "Unisex" },
    { id: 6, name: "Denim Jacket",  price: 1299, store: "UrbanWear",  eta: "11 mins", category: "Unisex" }
  ]);
});

// Categories
app.get('/categories', (req, res) => {
  res.json([
    { id: 1, name: "Men",    itemCount: 2 },
    { id: 2, name: "Women",  itemCount: 2 },
    { id: 3, name: "Unisex", itemCount: 2 },
    { id: 4, name: "Sale",   itemCount: 3 }
  ]);
});

// Cart
let cart = [];
app.get('/cart', (req, res) => res.json(cart));
app.post('/cart', (req, res) => {
  cart.push(req.body);
  res.json({ success: true, message: "Item added!", cart });
});
app.delete('/cart', (req, res) => {
  cart = [];
  res.json({ success: true, message: "Cart cleared" });
});

// Orders
app.get('/orders', (req, res) => {
  res.json([
    { id: "ORD001", item: "Men's Hoodie",  status: "Delivered",       eta: "Done" },
    { id: "ORD002", item: "Floral Dress",  status: "Out for Delivery", eta: "5 mins" },
    { id: "ORD003", item: "Graphic Tee",   status: "Processing",       eta: "20 mins" }
  ]);
});

app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));