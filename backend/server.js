import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON body

// Test Case 1
const cart = [
  { id: 1, name: "T-Shirt", price: 350, categoryId: 1 },
  { id: 2, name: "Hat", price: 250, categoryId: 2 },
];
// Test Case 2
// const cart = [
//   { id: 1, name: "T-Shirt", price: 350, categoryId: 1 },
//   { id: 2, name: "Hat", price: 250, category: 2 },
// ];

// Test Case 3
// const cart = [
//   { id: 1, name: "T-Shirt", price: 350, categoryId: 1 },
//   { id: 2, name: "Hoodie", price: 700, categoryId: 1 },
//   { id: 3, name: "Watch", price: 850, categoryId: 3 },
//   { id: 4, name: "Bag", price: 640, categoryId: 2 },
// ];

// Test Case 4
// const cart = [
//   { id: 1, name: "T-Shirt", price: 350, categoryId: 1 },
//   { id: 2, name: "Hat", price: 250, categoryId: 2 },
//   { id: 3, name: "Belt", price: 230, categoryId: 2 },
// ];

// Test Case 5
// const cart = [
//   { id: 1, name: "T-Shirt", price: 350, categoryId: 1 },
//   { id: 2, name: "Hat", price: 250, categoryId: 2 },
//   { id: 3, name: "Belt", price: 230, categoryId: 2 },
// ];

function calculateTotal(cart, campaigns) {
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  let totalDiscount = 0; // เพิ่มตัวแปรเก็บส่วนลดรวม

  // Coupon
  if (campaigns.coupon) {
    const coupon = campaigns.coupon;
    let discount = 0;
    if (coupon.typeId === 1) {
      // Fixed
      discount = coupon.amount;
    } else if (coupon.typeId === 2) {
      // Percentage
      discount = (total * coupon.percentage) / 100;
    }
    total -= discount;
    totalDiscount += discount;
  }

  // On Top
  if (campaigns.onTop) {
    const onTop = campaigns.onTop;
    let discount = 0;
    if (onTop.type === "category") {
      discount = cart.reduce((sum, item) => {
        if (item.categoryId === onTop.categoryId) {
          return sum + (item.price * onTop.percentage) / 100;
        }
        return sum;
      }, 0);
    } else if (onTop.type === "points") {
      const maxDiscount = total * 0.2;
      discount = onTop.value > maxDiscount ? maxDiscount : onTop.value;
    }
    total -= discount;
    totalDiscount += discount;
  }

  // Seasonal
  if (campaigns.seasonal) {
    const { every, discount } = campaigns.seasonal;
    if (every > 0 && discount > 0) {
      const times = Math.floor(total / every);
      const seasonalDiscount = times * discount;
      total -= seasonalDiscount;
      totalDiscount += seasonalDiscount;
    }
  }

  return {
    total: total > 0 ? total : 0,
    totalDiscount: totalDiscount > 0 ? totalDiscount : 0,
  };
}

// Get Cart
app.get("/cart", (req, res) => {
  try {
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to get cart" });
  }
});

// Calculate Total
app.post("/calculate", (req, res) => {
  try {
    const { cart, campaigns } = req.body;
    const result = calculateTotal(cart, campaigns);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
