//Cart

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


//Add to cart
function addToCart(productCard) {
    const name = productCard.querySelector(".product-title").textContent;
    const priceText = productCard.querySelector(".product-price").textContent;
    const price = parseFloat(priceText.replace("$", ""));
    const imgSrc = productCard.querySelector(".product-img").src;
    
    const existingItem = cartItems.find((item) => item.name === name);
    if (existingItem){
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name,
            price,
            quantity: 1,
            image: imgSrc,

        })
    }
    updateLocalStorage();
    updateCartCount();
    showToast(`${name} added to cart!`);
}


//Remove from cart
function removeItem(name){
    cartItems = cartItems.filter((item) => item.name !== name);
    updateLocalStorage();
    updateCartCount();
    if (document.getElementById("cartItems")) {
        displayCartItem();
    }
}


//Update cart count icon
function updateCartCount(){
    const countElement = document.getElementById("cart-count");
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    if (countElement) {
        countElement.textContent = itemCount;
    }
}




//Display cart items on cart.
function displayCartItem(){
    const cartContainer = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    if(!cartContainer) return;

    cartContainer.innerHTML = ""; // Clear previous items
    let total = 0


    cartItems.forEach((item)=>{
        const itemTotal = item.price * item.quantity
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = ` 
        <img src="${item.image}" alt="${item.name}">
           <div class="cart-title-price">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">${itemTotal.toFixed(2)}</div>
           </div>
           <div class="quantity-controls">
            <button onclick = "changeQuantity('${item.name}', -1)">
                <i class="ri-subtract-line"></i>
            </button>
            <input type="text" name="" class="cart-item-quantity" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}', this.value)" readonly>
            <button onclick = "changeQuantity('${item.name}', 1)">
                <i class="ri-add-line"></i>
            </button>
           </div>
           <div class="remove-from-cart" onclick="removeItem('${item.name}')">
            <i class="ri-delete-bin-line"></i>
           </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    if (totalElement) {
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}


//Quantioty change
function changeQuantity(name, delta) {
    const item = cartItems.find((item) => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeItem(name);
        } else {
            updateLocalStorage();
            updateCartCount();
            displayCartItem();
        }
    }
    
}

//Save cart in LocalStorage
function updateLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}


//Load cart on page load
window.onload = function (){
    updateCartCount();
    if (document.getElementById("cartItems")) {
        displayCartItem();
    }
    createToastContainer();
};


//Toast Notification
function createToastContainer(){
    if (document.getElementById("toast-container")) return;

    const toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
}

function showToast(message){
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    //show animation
    setTimeout(() => {
        toast.classList.add("toast-show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => {
            if(container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}