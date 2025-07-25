function loadCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartSummary = document.getElementById("cart-summary");
  const totalPriceEl = document.getElementById("total-price");

  if (cartItems.length === 0) {
    cartSummary.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalPriceEl.textContent = "0.00";
    return;
  }

  cartSummary.innerHTML = "";

  let total = 0;

  cartItems.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <div>
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">x${item.quantity}</span>
      </div>
      <div class="cart-item-subtotal">R$ ${subtotal.toFixed(2)}</div>
    `;

    cartSummary.appendChild(itemDiv);
  });

  totalPriceEl.textContent = total.toFixed(2);
}

function validateName(name) {
  return name.trim().length >= 3;
}

function validateCardNumber(number) {
  const sanitized = number.replace(/\s+/g, '');
  const regex = /^\d{16}$/;
  return regex.test(sanitized);
}

function validateExpiry(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

  const [month, year] = expiry.split('/').map(Number);
  if (month < 1 || month > 12) return false;

  const currentYear = new Date().getFullYear() % 100; // ex: 23 para 2023
  const currentMonth = new Date().getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

function showError(input, message) {
  input.classList.add("error");

  let next = input.nextElementSibling;
  if (next && next.classList.contains("error-message")) {
    next.textContent = message;
  } else {
    const errorMsg = document.createElement("div");
    errorMsg.className = "error-message";
    errorMsg.textContent = message;
    input.parentNode.insertBefore(errorMsg, input.nextSibling);
  }
}

function clearError(input) {
  input.classList.remove("error");
  let next = input.nextElementSibling;
  if (next && next.classList.contains("error-message")) {
    next.remove();
  }
}

function validateForm() {
  const nameInput = document.getElementById("name");
  const cardInput = document.getElementById("card-number");
  const expiryInput = document.getElementById("expiry");
  const cvvInput = document.getElementById("cvv");

  let isValid = true;

  clearError(nameInput);
  clearError(cardInput);
  clearError(expiryInput);
  clearError(cvvInput);

  if (!validateName(nameInput.value)) {
    showError(nameInput, "Por favor, insira um nome válido (mínimo 3 caracteres).");
    isValid = false;
  }

  if (!validateCardNumber(cardInput.value)) {
    showError(cardInput, "Número do cartão inválido (deve conter 16 dígitos).");
    isValid = false;
  }

  if (!validateExpiry(expiryInput.value)) {
    showError(expiryInput, "Validade inválida ou cartão expirado.");
    isValid = false;
  }

  if (!validateCVV(cvvInput.value)) {
    showError(cvvInput, "CVV inválido (3 dígitos).");
    isValid = false;
  }

  return isValid;
}

function formatCardNumber(value) {
  return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d{1,2})/, '$1/$2')
    .slice(0, 5);
}

window.onload = function () {
  loadCartSummary();

  const paymentForm = document.getElementById("payment-form");
  const cardInput = document.getElementById("card-number");
  const expiryInput = document.getElementById("expiry");

  cardInput.addEventListener("input", e => {
    e.target.value = formatCardNumber(e.target.value);
  });

  expiryInput.addEventListener("input", e => {
    e.target.value = formatExpiry(e.target.value);
  });

  paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) return;

    const name = document.getElementById("name").value.trim();

    alert(`Obrigado pela compra, ${name}! Seu pagamento foi processado com sucesso.`);

    localStorage.removeItem("cartItems");

    window.location.href = "index.html";
  });
};
