// Exercise 2: Intelligent Shopping Cart with Rule-Driven Discounts

// 1) Product Array with name, price, quantity + category
const products = [
  { id: 1, name: "Milk 1L", price: 55, category: "Grocery" },
  { id: 2, name: "Basmati Rice 5kg", price: 620, category: "Grocery" },
  { id: 3, name: "Headphones", price: 1499, category: "Electronics" },
  { id: 4, name: "Smart Watch", price: 2499, category: "Electronics" },
  { id: 5, name: "T-Shirt", price: 499, category: "Fashion" },
  { id: 6, name: "Jeans", price: 1199, category: "Fashion" },
  { id: 7, name: "Notebook Pack", price: 199, category: "Stationery" },
  { id: 8, name: "Pen Set", price: 149, category: "Stationery" },
];

// CART STATE
let cart = []; // {id, name, price, category, qty}
let appliedCoupon = ""; // store valid coupon string

// DOM
const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const emptyCart = document.getElementById("emptyCart");

const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const discountDetails = document.getElementById("discountDetails");

const couponInput = document.getElementById("couponInput");
const couponMsg = document.getElementById("couponMsg");

const timeChip = document.getElementById("timeChip");
const dayChip = document.getElementById("dayChip");

document.getElementById("applyCouponBtn").addEventListener("click", applyCoupon);
document.getElementById("clearCartBtn").addEventListener("click", clearCart);
document.getElementById("checkoutBtn").addEventListener("click", checkout);

// UTIL: currency format
const money = (n) => `₹${Math.round(n)}`;

// Render Products
function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach((p) => {
    const badgeClass =
      p.category === "Electronics" ? "badge green"
      : p.category === "Fashion" ? "badge yellow"
      : p.category === "Grocery" ? "badge"
      : "badge red";

    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <div class="p-top">
        <div>
          <div class="p-title">${p.name}</div>
          <div class="p-cat">${p.category}</div>
        </div>
        <div class="${badgeClass}">${p.category}</div>
      </div>

      <div class="p-actions">
        <div class="p-price">${money(p.price)}</div>
        <button class="btn btn-primary" data-id="${p.id}">Add to Cart</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => addToCart(p.id));
    productGrid.appendChild(card);
  });
}

// Add to cart
function addToCart(productId) {
  const p = products.find((x) => x.id === productId);

  const found = cart.find((x) => x.id === productId);
  if (found) found.qty += 1;
  else cart.push({ ...p, qty: 1 });

  renderCart();
}

// Remove item
function removeItem(productId) {
  cart = cart.filter((x) => x.id !== productId);
  renderCart();
}

// Update quantity dynamically
function updateQty(productId, newQty) {
  const item = cart.find((x) => x.id === productId);
  if (!item) return;

  // prevent invalid qty
  if (isNaN(newQty) || newQty < 1) newQty = 1;
  if (newQty > 99) newQty = 99;

  item.qty = newQty;
  renderCart();
}

// Clear cart
function clearCart() {
  cart = [];
  appliedCoupon = "";
  couponInput.value = "";
  couponMsg.textContent = "Cart cleared.";
  renderCart();
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty. Add products first!");
    return;
  }
  alert("✅ Checkout successful!\n(For lab exercise, this is a demo checkout.)");
}

// ================================
// 3) DISCOUNT RULES (JS CONDITIONS)
// ================================
// Bulk Discount Rule:
// - If any product quantity >= 5 => 10% off on that item's total
//
// Category Discount Rule:
// - If Electronics total >= 3000 => 8% off electronics
// - If Grocery total >= 1000 => 5% off grocery
//
// Time Discount Rule:
// - If between 18:00 and 21:00 => 5% off entire cart (happy hours)
//
// Coupon (String Validation):
// - SAVE10 => 10% off entire cart
// - FOOD5 => 5% off grocery items
// - WELCOME15 => 15% off cart if subtotal >= 2000
//
// Multiple discounts can stack but max total discount capped at 35%

function computeDiscounts(subtotal) {
  let discounts = [];
  let discountAmount = 0;

  // ---- Bulk Discount (per item) ----
  let bulkDisc = 0;
  cart.forEach((item) => {
    if (item.qty >= 5) {
      const itemTotal = item.price * item.qty;
      bulkDisc += itemTotal * 0.10;
    }
  });
  if (bulkDisc > 0) {
    discounts.push({ label: "Bulk Discount (10% on qty ≥ 5)", amount: bulkDisc });
    discountAmount += bulkDisc;
  }

  // ---- Category Discounts ----
  const electronicsTotal = cart
    .filter((x) => x.category === "Electronics")
    .reduce((s, x) => s + x.price * x.qty, 0);

  const groceryTotal = cart
    .filter((x) => x.category === "Grocery")
    .reduce((s, x) => s + x.price * x.qty, 0);

  if (electronicsTotal >= 3000) {
    const d = electronicsTotal * 0.08;
    discounts.push({ label: "Electronics Discount (8% over ₹3000)", amount: d });
    discountAmount += d;
  }

  if (groceryTotal >= 1000) {
    const d = groceryTotal * 0.05;
    discounts.push({ label: "Grocery Discount (5% over ₹1000)", amount: d });
    discountAmount += d;
  }

  // ---- Time Discount ----
  const now = new Date();
  const hour = now.getHours();
  const isHappyHour = hour >= 18 && hour <= 21;
  if (isHappyHour && subtotal > 0) {
    const d = subtotal * 0.05;
    discounts.push({ label: "Happy Hours Discount (5% 6PM-9PM)", amount: d });
    discountAmount += d;
  }

  // ---- Coupon Discount (using string methods parse/validate) ----
  const coupon = appliedCoupon;

  if (coupon.length > 0) {
    // string cleanup
    const cleaned = coupon.trim().toUpperCase();

    // validate coupon structure
    // Must be 4 to 12 chars, only A-Z0-9 allowed
    const validStructure =
      cleaned.length >= 4 &&
      cleaned.length <= 12 &&
      [...cleaned].every((ch) => (ch >= "A" && ch <= "Z") || (ch >= "0" && ch <= "9"));

    if (validStructure) {
      if (cleaned === "SAVE10") {
        const d = subtotal * 0.10;
        discounts.push({ label: "Coupon SAVE10 (10% off cart)", amount: d });
        discountAmount += d;
      } else if (cleaned === "FOOD5") {
        const d = groceryTotal * 0.05;
        discounts.push({ label: "Coupon FOOD5 (5% off Grocery)", amount: d });
        discountAmount += d;
      } else if (cleaned === "WELCOME15") {
        if (subtotal >= 2000) {
          const d = subtotal * 0.15;
          discounts.push({ label: "Coupon WELCOME15 (15% off cart)", amount: d });
          discountAmount += d;
        } else {
          discounts.push({ label: "WELCOME15 (needs subtotal ≥ ₹2000)", amount: 0 });
        }
      } else {
        discounts.push({ label: `Coupon "${cleaned}" not recognized`, amount: 0 });
      }
    } else {
      discounts.push({ label: "Invalid coupon format (A-Z0-9 only)", amount: 0 });
    }
  }

  // ---- CAP discount to avoid negative total ----
  // Max 35% of subtotal
  const maxAllowed = subtotal * 0.35;
  if (discountAmount > maxAllowed) {
    discounts.push({
      label: "Discount Cap Applied (Max 35%)",
      amount: discountAmount - maxAllowed,
      capNote: true
    });
    discountAmount = maxAllowed;
  }

  return { discounts, discountAmount };
}

// Apply coupon
function applyCoupon() {
  let code = couponInput.value;

  // 4) String methods parse and validate
  // remove spaces, convert
  code = code.trim().replaceAll(" ", "").toUpperCase();

  if (code.length === 0) {
    appliedCoupon = "";
    couponMsg.textContent = "Coupon cleared.";
    renderCart();
    return;
  }

  // Must start with a letter to be valid (simple condition)
  if (!(code[0] >= "A" && code[0] <= "Z")) {
    couponMsg.textContent = "❌ Invalid coupon: must start with a letter.";
    appliedCoupon = "";
    renderCart();
    return;
  }

  appliedCoupon = code;
  couponMsg.textContent = `✅ Coupon "${appliedCoupon}" applied (if valid).`;
  renderCart();
}

// Render cart
function renderCart() {
  // empty view
  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartList.innerHTML = "";
  } else {
    emptyCart.style.display = "none";
  }

  cartList.innerHTML = "";

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-left">
        <div class="cart-name">${item.name}</div>
        <div class="cart-meta">${item.category} • ${money(item.price)} each</div>
        <div class="cart-meta"><b>${money(item.price * item.qty)}</b> total</div>
      </div>

      <div class="cart-controls">
        <div class="qty-box">
          <button class="btn mini" data-dec>−</button>
          <input type="number" min="1" max="99" value="${item.qty}" />
          <button class="btn mini" data-inc>+</button>
        </div>
        <button class="btn btn-danger mini" data-remove>Remove</button>
      </div>
    `;

    const input = div.querySelector("input");

    div.querySelector("[data-inc]").addEventListener("click", () => {
      updateQty(item.id, item.qty + 1);
    });

    div.querySelector("[data-dec]").addEventListener("click", () => {
      updateQty(item.id, item.qty - 1);
    });

    input.addEventListener("input", () => {
      updateQty(item.id, parseInt(input.value));
    });

    div.querySelector("[data-remove]").addEventListener("click", () => removeItem(item.id));

    cartList.appendChild(div);
  });

  // totals
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  subtotalEl.textContent = money(subtotal);

  // 5) apply multiple discounts
  const { discounts, discountAmount } = computeDiscounts(subtotal);
  const total = Math.max(subtotal - discountAmount, 0);

  // discount lines
  discountDetails.innerHTML = "";
  if (discounts.length === 0) {
    discountDetails.innerHTML = `<div class="disc-line"><span>No discounts applied</span><b>${money(0)}</b></div>`;
  } else {
    discounts.forEach((d) => {
      const cls = d.capNote ? "disc-red" : "disc-green";
      discountDetails.innerHTML += `
        <div class="disc-line ${cls}">
          <span>${d.label}</span>
          <b>- ${money(d.amount)}</b>
        </div>
      `;
    });
  }

  totalEl.textContent = money(total);

  // refresh time chip
  setTimeChips();
}

// Time UI
function setTimeChips() {
  const now = new Date();
  const hours = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, "0");
  const day = now.toLocaleDateString(undefined, { weekday: "long" });

  dayChip.textContent = day;
  if (hours >= 18 && hours <= 21) timeChip.textContent = `⏰ Happy Hours (${hours}:${mins})`;
  else timeChip.textContent = `🕒 Current Time ${hours}:${mins}`;
}

// Init
renderProducts();
renderCart();

// Live time update (for time discounts)
setInterval(() => {
  renderCart();
}, 30000);
