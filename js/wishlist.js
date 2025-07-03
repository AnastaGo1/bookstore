// Хранилище отложенных товаров
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const wishlistItemsContainer = document.getElementById('wishlistItems');
const wishlistTotal = document.getElementById('wishlistTotal');
const moveAllToCartBtn = document.getElementById('moveAllToCartBtn');
const clearWishlistBtn = document.getElementById('clearWishlistBtn');
const selectAllBtn = document.getElementById('selectAllBtn');

// Отображение отложенных товаров
function renderWishlist() {
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = `
            <div class="empty-wishlist-message">
                Ваш список отложенных товаров пуст. Перейдите в <a href="index.html">каталог</a>, чтобы добавить товары.
            </div>
        `;
        wishlistTotal.style.display = 'none';
        return;
    }

    wishlistItemsContainer.innerHTML = wishlist.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <label class="wishlist-item-checkbox">
                <input type="checkbox" class="item-checkbox" data-id="${item.id}">
                <span class="checkmark"></span>
            </label>
            <img src="${item.image}" alt="${item.title}" class="wishlist-item-image">
            <div class="wishlist-item-details">
                <h3 class="wishlist-item-title">${item.title}</h3>
                <p class="wishlist-item-author">${item.author}</p>
                <p class="wishlist-item-price">${item.price}</p>
                <p class="wishlist-item-stock">В наличии: ${item.stock} шт.</p>
                <div class="wishlist-item-actions">
                    <button class="btn-move-to-cart">Перенести в корзину</button>
                    <button class="btn-remove-from-wishlist">Удалить</button>
                </div>
            </div>
        </div>
    `).join('');

    wishlistTotal.style.display = 'flex';

    // Добавляем обработчики для кнопок "Перенести в корзину"
    document.querySelectorAll('.btn-move-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.wishlist-item').dataset.id;
            moveToCart(itemId);
        });
    });

    // Добавляем обработчики для кнопок "Удалить"
    document.querySelectorAll('.btn-remove-from-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.wishlist-item').dataset.id;
            removeFromWishlist(itemId);
        });
    });

    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateButtons);
    });
}

// Перенос товара в корзину
function moveToCart(itemId) {
    const itemIndex = wishlist.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const item = wishlist[itemIndex];
        
        // Добавляем в корзину
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Удаляем из отложенного
        wishlist.splice(itemIndex, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Обновляем отображение
        renderWishlist();
        
        // Показываем уведомление
        showNotification('Товар перенесен в корзину');
    }
}

// Удаление товара из отложенного
function removeFromWishlist(itemId) {
    const itemIndex = wishlist.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        wishlist.splice(itemIndex, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
        showNotification('Товар удален из отложенного');
    }
}

function updateButtons() {
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    moveAllToCartBtn.disabled = checkedItems.length === 0;
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

// Обработчик для кнопки "Очистить отложенное"
clearWishlistBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите полностью очистить отложенное?')) {
        wishlist = [];
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
        showNotification('Отложенное очищено');
    }
});

// Обработчик для кнопки "Перенести все в корзину"
moveAllToCartBtn.addEventListener('click', () => {
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    const itemsToMove = Array.from(checkedItems).map(checkbox => checkbox.dataset.id);
    
    if (itemsToMove.length === 0) {
        showNotification('Пожалуйста, отметьте товары для переноса!');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    itemsToMove.forEach(itemId => {
        const itemIndex = wishlist.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart.push(wishlist[itemIndex]);
            wishlist.splice(itemIndex, 1);
        }
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    renderWishlist();
    showNotification('Выбранные товары перенесены в корзину');
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
    renderWishlist();
    updateButtons();
});