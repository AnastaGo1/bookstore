let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const postponeBtn = document.getElementById('postponeBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const selectAllBtn = document.getElementById('selectAllBtn');
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const cancelOrderBtn = document.getElementById('cancelOrder');

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                Ваша корзина пуста. Перейдите в <a href="index.html">каталог</a>, чтобы добавить товары.
            </div>
        `;
        cartTotal.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <label class="cart-item-checkbox">
            <input type="checkbox" class="item-checkbox" data-id="${item.id}">
            <span class="checkmark"></span>
        </label>
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-author">${item.author}</p>
                <p class="cart-item-price">${item.price}</p>
                <p class="cart-item-stock">В наличии: ${item.stock} шт.</p>
                <div class="cart-item-actions">
                    <button class="btn-wishlist move-to-wishlist">Отложить</button>
                    <button class="btn-remove remove-item">Удалить</button>
                </div>
            </div>
        </div>
    `).join('');

    cartTotal.style.display = 'flex';

    document.querySelectorAll('.move-to-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.cart-item').dataset.id;
            moveToWishlist(itemId);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.cart-item').dataset.id;
            removeFromCart(itemId);
        });
    });

    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateButtons);
    });
}

function moveToWishlist(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        renderCart();
        showNotification('Товар перенесен в отложенное');
    }
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        showNotification('Товар удален из корзины');
    }
}

function updateButtons() {
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    checkoutBtn.disabled = checkedItems.length === 0;
    postponeBtn.disabled = checkedItems.length === 0;
}

// Обработчик для кнопки "Отметить все товары"
selectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });
    
    updateButtons();
});

// Обработчик для кнопки "Очистить корзину"
clearCartBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите полностью очистить корзину?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        showNotification('Корзина очищена');
    }
});

checkoutBtn.addEventListener('click', () => {
    orderModal.classList.add('active');
});

postponeBtn.addEventListener('click', () => {
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    const itemsToMove = Array.from(checkedItems).map(checkbox => checkbox.dataset.id);
    
    if (itemsToMove.length === 0) {
        showNotification('Пожалуйста, отметьте товары для откладывания!');
        return;
    }
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    itemsToMove.forEach(itemId => {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            wishlist.push(cart[itemIndex]);
            cart.splice(itemIndex, 1);
        }
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    renderCart();
    showNotification('Выбранные товары перенесены в отложенное');
});

cancelOrderBtn.addEventListener('click', () => {
    orderModal.classList.remove('active');
});

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    const itemsToRemove = Array.from(checkedItems).map(checkbox => 
        checkbox.dataset.id
    );
    
    if (itemsToRemove.length === 0) {
        showNotification('Пожалуйста, отметьте товары для покупки!');
        return;
    }
    
    cart = cart.filter(item => !itemsToRemove.includes(item.id));
    localStorage.setItem('cart', JSON.stringify(cart));
    
    orderModal.classList.remove('active');
    renderCart();
    showNotification('Ваш заказ успешно оформлен!');
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateButtons();
});