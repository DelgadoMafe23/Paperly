
// Base de datos de productos
const products = [
  { id: 1, name: 'Pack Scrapbook', price: 30000, img: 'Fotos/packsb.jpg' },
  { id: 2, name: 'Planner', price: 30000, img: 'Fotos/planner.jpg' },
  { id: 3, name: 'Stickers', price: 30000, img: 'Fotos/journal.jpg' },
  { id: 4, name: 'Repuesto para hojas de folder', price: 10000, img: 'Fotos/hojasfolder.jpg' },
  { id: 5, name: 'Block de notas', price: 15000, img: 'Fotos/blockdenotas.jpg' },
  { id: 6, name: 'Bolígrafos', price: 12000, img: 'Fotos/lapiceros.jpg' },
];

const toggleCartBtn = document.getElementById('toggleCartBtn');
const cartDropdown = document.getElementById('cartDropdown');

toggleCartBtn.addEventListener('click', () => {
  cartDropdown.classList.toggle('hidden');
});

const checkoutBtn = document.getElementById('checkoutBtn');

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío 🛒');
    return;
  }

  // Aquí puedes redirigir o mostrar un mensaje
  alert('Redirigiendo al proceso de pago...');
  // Ejemplo de redirección:
  // window.location.href = 'pago.html';
});


// Estado del carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');

// Renderizar productos
function renderProducts() {
  const rows = [];
  let row = [];

  products.forEach((product, index) => {
    const cardHTML = `
      <div class="col-sm-4">
        <div class="panel panel-primary">
          <div class="panel-heading">${product.name}</div>
          <div class="panel-body">
            <img src="${product.img}" class="img-responsive" style="width:100%" alt="${product.name}">
          </div>
          <div class="panel-footer">
            ${product.price.toLocaleString('es-CO')} COP
            <button class="btn btn-success btn-sm pull-right" onclick="addToCart(${product.id})">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    `;

    row.push(cardHTML);

    if ((index + 1) % 3 === 0 || index === products.length - 1) {
      rows.push(`<div class="row">${row.join('')}</div>`);
      row = [];
    }
  });

  productsGrid.innerHTML = rows.join('');
}
// Cerrar carrito al hacer clic fuera
document.addEventListener('click', (event) => {
  const isClickInsideCart = cartDropdown.contains(event.target);
  const isClickOnButton = toggleCartBtn.contains(event.target);

  // Si haces clic fuera del carrito y del botón, lo cierra
  if (!isClickInsideCart && !isClickOnButton) {
    cartDropdown.classList.add('hidden');
  }
});

// Agregar producto al carrito
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            ...product,
             quantity: 1 
            });
    }

    saveCart();
    renderCart();
}

// Remover producto del carrito
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

// Actualizar cantidad
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;    
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// Renderizar carrito
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>El carrito está vacío.</p>';
    cartTotal.textContent = 'Total: $0.00';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong> - $${item.price.toFixed(2)}
        </div>
        <div class="quantity-controls">
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
            Eliminar
        </button>
        </div>
        <div>$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');

  // Calcular total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}   

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Vaciar carrito
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

// Eventos Listeners
clearCartBtn.addEventListener('click', clearCart);

// Inicializar la aplicación
function init() {
  renderProducts();
  renderCart();
}

// Hacer las funciones disponibles globalmente para los event listeners en HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

// Iniciar la aplicación
init();