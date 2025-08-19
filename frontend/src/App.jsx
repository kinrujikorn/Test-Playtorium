import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [onTop, setOnTop] = useState(null);
  const [seasonal, setSeasonal] = useState({ every: 0, discount: 0 });
  const [totalData, setTotalData] = useState({ total: 0, totalDiscount: 0 });

  const coupons = [
    { couponId: 1, typeId: 1, amount: 50, couponName: "50 THB" },
    { couponId: 2, typeId: 2, percentage: 10, couponName: "10% Off" },
  ];

  const couponTypes = [
    { typeId: 1, typeName: "Fixed" },
    { typeId: 2, typeName: "Percentage" },
  ];

  const categories = [
    { categoryId: 1, categoryName: "Clothing", categoryDiscountPercentage: 15 },
    {
      categoryId: 2,
      categoryName: "Accessories",
      categoryDiscountPercentage: 10,
    },
    {
      categoryId: 3,
      categoryName: "Electronics",
      categoryDiscountPercentage: 0,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:4000/cart");
      setCart(response.data);
    };
    fetchData();
  }, []);

  const calculate = async () => {
    try {
      // Validate cart empty
      if (cart.length === 0) throw new Error("Cart is empty");

      // Validate coupon
      if (coupon) {
        if (coupon.typeId === 1 && typeof coupon.amount !== "number")
          throw new Error("Invalid coupon amount");
        if (coupon.typeId === 2 && typeof coupon.percentage !== "number")
          throw new Error("Invalid coupon percentage");
      }

      // Validate onTop
      if (onTop) {
        if (onTop.type === "points" && onTop.value < 0)
          throw new Error("Invalid points value");
      }

      const campaigns = { coupon, onTop, seasonal };
      const response = await axios.post("http://localhost:4000/calculate", {
        cart,
        campaigns,
      });

      setTotalData({
        total: response.data.total,
        totalDiscount: response.data.totalDiscount,
      });
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    if (cart.length > 0) calculate();
  }, [cart, coupon, onTop, seasonal]);

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      <div className="section">
        <h2>Cart</h2>
        <div className="cart-list">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <span>{item.name}</span>
              <span>{item.price} THB</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Coupons</h2>
        <select
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            setCoupon(
              selectedId ? coupons.find((c) => c.couponId === selectedId) : null
            );
          }}
          value={coupon?.couponId || ""}
        >
          <option value="">Select a coupon</option>
          {coupons.map((c) => (
            <option key={c.couponId} value={c.couponId}>
              {c.couponName}
            </option>
          ))}
        </select>
      </div>

      <div className="section">
        <h2>On Top Discount</h2>
        <select
          onChange={(e) => {
            const type = e.target.value;
            if (type === "") setOnTop(null);
            else if (type === "category")
              setOnTop({
                type: "category",
                categoryId: null,
                percentage: null,
              });
            else if (type === "points") setOnTop({ type: "points", value: 0 });
          }}
          value={onTop?.type || ""}
        >
          <option value="">Select On Top type</option>
          <option value="category">Category Discount</option>
          <option value="points">Points Discount</option>
        </select>

        {onTop?.type === "category" && (
          <select
            onChange={(e) => {
              const selectedCategoryId = Number(e.target.value);
              if (selectedCategoryId) {
                const selected = categories.find(
                  (c) => c.categoryId === selectedCategoryId
                );
                setOnTop({
                  type: "category",
                  categoryId: selected.categoryId,
                  percentage: selected.categoryDiscountPercentage,
                });
              } else {
                setOnTop(null);
              }
            }}
            value={onTop?.categoryId ?? ""}
          >
            <option value="">Select a category discount</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {`${c.categoryDiscountPercentage}% Off ${c.categoryName}`}
              </option>
            ))}
          </select>
        )}

        {onTop?.type === "points" && (
          <div className="points-input">
            <input
              type="text"
              placeholder="Enter points"
              value={onTop.value}
              onChange={(e) =>
                setOnTop({ type: "points", value: Number(e.target.value) || 0 })
              }
            />
            <p>(1 point = 1 THB, max 20% of total price)</p>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Seasonal Discount</h2>

        <div className="seasonal-inputs">
          <div className="input-group">
            <label>Every X THB:</label>
            <input
              type="text"
              placeholder="X"
              value={seasonal.every}
              onChange={(e) =>
                setSeasonal({ ...seasonal, every: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div className="input-group">
            <label>Discount Y THB:</label>
            <input
              type="text"
              placeholder="Y"
              value={seasonal.discount}
              onChange={(e) =>
                setSeasonal({
                  ...seasonal,
                  discount: Number(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="total-discount">
          Total Discount: {totalData.totalDiscount} THB
        </h2>
        <h2 className="total">Total: {totalData.total} THB</h2>
      </div>
    </div>
  );
}

export default App;
