// Хранилище корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция для показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Функция добавления в корзину
function addToCart(bookId, title, author, image, price, stock) {
    // Проверяем, нет ли уже этой книги в корзине
    const existingItem = cart.find(item => item.id === bookId);
    
    if (!existingItem) {
        cart.push({
            id: bookId,
            title,
            author,
            image,
            price,
            stock
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('Товар добавлен в корзину');
        
        // Обновляем иконку корзины
        const cartIcon = document.querySelector(`.cart-icon[data-id="${bookId}"]`);
        if (cartIcon) {
            cartIcon.classList.add('active');
            cartIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        }
    } else {
        showNotification('Этот товар уже в корзине');
    }
}

// Функция для добавления в отложенное
function addToWishlist(bookId, title, author, image, price, stock) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Проверяем, нет ли уже этой книги в отложенном
    const existingItem = wishlist.find(item => item.id === bookId);
    
    if (!existingItem) {
        wishlist.push({
            id: bookId,
            title,
            author,
            image,
            price,
            stock
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Товар добавлен в отложенное');
        
        // Обновляем иконку сердечка
        const heartBtn = document.querySelector(`.heart-btn[data-id="${bookId}"]`);
        if (heartBtn) {
            heartBtn.classList.add('active');
            heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    } else {
        showNotification('Этот товар уже в отложенном');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Добавляем обработчики для сердечек
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const bookId = btn.dataset.id;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const card = e.target.closest('.book-card, .genre-book, .choice-book');
            const title = card.querySelector('.book-title')?.textContent || 
                         card.querySelector('.genre-label')?.textContent;
            const author = card.querySelector('.book-author')?.textContent || 'Неизвестный автор';
            const image = card.querySelector('img').src;
            const price = Math.floor(Math.random() * 1000) + 100;
            const stock = Math.floor(Math.random() * 10) + 1;
            
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const existingItem = wishlist.find(item => item.id === bookId);
            
            if (existingItem) {
                // Удаляем из отложенного
                wishlist = wishlist.filter(item => item.id !== bookId);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
                showNotification('Товар удален из отложенного');
            } else {
                // Добавляем в отложенное
                addToWishlist(
                    bookId,
                    title,
                    author,
                    image,
                    `${price} ₽`,
                    stock
                );
            }
        });
    });
    
    // Проверяем, какие товары уже в отложенном и отмечаем сердечки
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.forEach(item => {
        const heartBtn = document.querySelector(`.heart-btn[data-id="${item.id}"]`);
        if (heartBtn) {
            heartBtn.classList.add('active');
            heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });

    // Уведомления в шапке
    const notifyLink = document.querySelector('.user-nav a[href="#"]:first-child');
    if (notifyLink) {
        const notificationsDropdown = document.createElement('div');
        notificationsDropdown.className = 'notifications-dropdown';
        
        // Проверяем есть ли уведомления
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        
        if (notifications.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'notification-item';
            emptyItem.textContent = 'Нет уведомлений';
            notificationsDropdown.appendChild(emptyItem);
        } else {
            notifications.forEach(notif => {
                const item = document.createElement('div');
                item.className = `notification-item ${notif.read ? '' : 'unread'}`;
                item.innerHTML = `
                    <div>${notif.text}</div>
                    <div class="time">${notif.time}</div>
                `;
                notificationsDropdown.appendChild(item);
            });
        }
        
        notifyLink.appendChild(notificationsDropdown);
        
        notifyLink.addEventListener('click', (e) => {
            e.preventDefault();
            notificationsDropdown.classList.toggle('active');
        });
        
        // Закрываем dropdown при клике вне его
        document.addEventListener('click', (e) => {
            if (!notifyLink.contains(e.target)) {
                notificationsDropdown.classList.remove('active');
            }
        });
    }

    // Подсказки в подвале
    const helpItems = document.querySelectorAll('.footer-col li a');
    helpItems.forEach(item => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        
        if (item.textContent.includes('Как сделать заказ')) {
            tooltip.textContent = 'Добавьте товар в корзину: нажав на "купить" или перенеся из отложенного, в корзине будет доступна кнопка "заказать"';
        } else if (item.textContent.includes('Курьерская доставка')) {
            tooltip.textContent = 'Доставим по всей России абсолютно бесплатно!';
        } else if (item.textContent.includes('Хотите у нас работать?')) {
            tooltip.textContent = 'Заполните форму для подачи заявки на работу';
        } else if (item.textContent.includes('Сертификаты')) {
            tooltip.textContent = 'Подарочные сертификаты на покупку книг';
        } else if (item.textContent.includes('Предзаказ')) {
            tooltip.textContent = 'Оформите предзаказ на ожидаемые книги';
        } else if (item.textContent.includes('Поддержка')) {
            tooltip.textContent = 'У вас возникла проблема? Сообщите нам!';
        }
        
        if (tooltip.textContent) {
            item.parentNode.appendChild(tooltip);
        }
    });

    // Модальные окна для подвала
    const supportModal = createModal('supportModal', `
        <h3 class="modal-title">Обращение в поддержку</h3>
        <form id="supportForm">
            <div class="form-group">
                <label for="supportName">Ваше имя</label>
                <input type="text" id="supportName" required>
            </div>
            <div class="form-group">
                <label for="supportEmail">Email</label>
                <input type="email" id="supportEmail" required>
            </div>
            <div class="form-group">
                <label for="supportMessage">Опишите вашу проблему</label>
                <textarea id="supportMessage" required></textarea>
            </div>
            <div class="form-group">
                <label for="supportScreenshot">Прикрепить скриншот (если есть)</label>
                <input type="file" id="supportScreenshot">
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn cancel" onclick="closeModal('supportModal')">Отменить</button>
                <button type="submit" class="modal-btn confirm">Отправить</button>
            </div>
        </form>
    `);

    const workModal = createModal('workModal', `
        <h3 class="modal-title">Заявка на работу</h3>
        <form id="workForm">
            <div class="form-group">
                <label for="workName">Имя и фамилия</label>
                <input type="text" id="workName" required>
            </div>
            <div class="form-group">
                <label for="workAddress">Ваш адрес</label>
                <input type="text" id="workAddress" required>
            </div>
            <div class="form-group">
                <label for="workPhone">Номер телефона</label>
                <input type="tel" id="workPhone" required>
            </div>
            <div class="form-group">
                <label for="workAge">Возраст</label>
                <input type="number" id="workAge" required>
            </div>
            <div class="form-group">
                <label for="workReason">Почему вы хотите у нас работать?</label>
                <textarea id="workReason" required></textarea>
            </div>
            <div class="form-group">
                <label for="workTime">Сколько свободного времени у вас есть?</label>
                <input type="text" id="workTime" required>
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn cancel" onclick="closeModal('workModal')">Отменить</button>
                <button type="submit" class="modal-btn confirm">Отправить</button>
            </div>
        </form>
    `);

    const preorderModal = createModal('preorderModal', `
        <h3 class="modal-title">Оформление предзаказа</h3>
        <form id="preorderForm">
            <div class="form-group">
                <label for="preorderName">Имя и фамилия</label>
                <input type="text" id="preorderName" required>
            </div>
            <div class="form-group">
                <label for="preorderAddress">Адрес доставки</label>
                <input type="text" id="preorderAddress" required>
            </div>
            <div class="form-group">
                <label for="preorderBook">Название книги</label>
                <input type="text" id="preorderBook" required>
            </div>
            <div class="form-group">
                <label for="preorderAuthor">Автор</label>
                <input type="text" id="preorderAuthor" required>
            </div>
            <div class="form-group">
                <label for="preorderQuantity">Количество</label>
                <input type="number" id="preorderQuantity" min="1" value="1" required>
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn cancel" onclick="closeModal('preorderModal')">Отменить</button>
                <button type="submit" class="modal-btn confirm">Оформить предзаказ</button>
            </div>
        </form>
    `);

    // Обработчики для модальных окон
    document.querySelectorAll('.footer-col a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.textContent.includes('Поддержка')) {
                e.preventDefault();
                openModal('supportModal');
            } else if (this.textContent.includes('Хотите у нас работать?')) {
                e.preventDefault();
                openModal('workModal');
            } else if (this.textContent.includes('Предзаказ')) {
                e.preventDefault();
                openModal('preorderModal');
            }
        });
    });

    // Обработчики форм
    document.getElementById('supportForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Ваш запрос в поддержку отправлен');
        closeModal('supportModal');
    });

    document.getElementById('workForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Ваша заявка на работу отправлена');
        closeModal('workModal');
    });

    document.getElementById('preorderForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Ваш предзаказ оформлен');
        closeModal('preorderModal');
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем иконки корзины в карточки книг
    document.querySelectorAll('.book-card, .genre-book, .choice-book').forEach(card => {
        const cartIcon = document.createElement('div');
        cartIcon.className = 'cart-icon';
        cartIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        cartIcon.style.color = '#333';
        cartIcon.dataset.id = Math.random().toString(36).substr(2, 9); // Генерируем уникальный ID
        
        // Для демонстрации - случайные данные о наличии и цене
        const price = Math.floor(Math.random() * 1000) + 100;
        const stock = Math.floor(Math.random() * 10) + 1;
        
        cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const title = card.querySelector('.book-title')?.textContent || 
                         card.querySelector('.genre-label')?.textContent;
            const author = card.querySelector('.book-author')?.textContent || 'Неизвестный автор';
            const image = card.querySelector('img').src;
            
            addToCart(
                cartIcon.dataset.id,
                title,
                author,
                image,
                `${price} ₽`,
                stock
            );
        });
        
        card.appendChild(cartIcon);
    });

    // Рандомные книги
    document.querySelector('.random-btn')?.addEventListener('click', () => {
        const bookCards = document.querySelectorAll('.book-card, .genre-book, .choice-book');
        if (bookCards.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * bookCards.length);
        const randomBook = bookCards[randomIndex];
        
        // Получаем данные книги
        const cartIcon = randomBook.querySelector('.cart-icon');
        const title = randomBook.querySelector('.book-title')?.textContent || 
                     randomBook.querySelector('.genre-label')?.textContent;
        const author = randomBook.querySelector('.book-author')?.textContent || 'Неизвестный автор';
        const image = randomBook.querySelector('img').src;
        const price = Math.floor(Math.random() * 1000) + 100;
        const stock = Math.floor(Math.random() * 10) + 1;
        
        addToCart(
            cartIcon.dataset.id,
            title,
            author,
            image,
            `${price} ₽`,
            stock
        );
    });
    
    // Обработчики для кнопок "Купить"
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.book-card, .genre-book, .choice-book');
            const cartIcon = card.querySelector('.cart-icon');
            
            const title = card.querySelector('.book-title')?.textContent || 
                         card.querySelector('.genre-label')?.textContent;
            const author = card.querySelector('.book-author')?.textContent || 'Неизвестный автор';
            const image = card.querySelector('img').src;
            const price = Math.floor(Math.random() * 1000) + 100;
            const stock = Math.floor(Math.random() * 10) + 1;
            
            addToCart(
                cartIcon.dataset.id,
                title,
                author,
                image,
                `${price} ₽`,
                stock
            );
        });
    });

    // Обработчики для сертификатов
    document.querySelectorAll('.certificate-card .btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.certificate-card');
            const price = card.querySelector('.price').textContent;
            const name = card.querySelector('.name').textContent;
            const image = card.querySelector('img').src;
            
            const certificateId = Math.random().toString(36).substr(2, 9);
            
            addToCart(
                certificateId,
                name,
                'Подарочный сертификат',
                image,
                price,
                1
            );
        });
    });
});

// Функции для работы с модальными окнами
function createModal(id, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = id;
    modal.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Добавляем ID для элементов путеводителя
    const notifyLink = document.querySelector('.user-nav a[href="#"]:first-child');
    if (notifyLink) notifyLink.id = 'notificationsLink';
    
    const wishlistLink = document.querySelector('.user-nav a[href="wishlist.html"]');
    if (wishlistLink) wishlistLink.id = 'wishlistLink';
    
    const registerLink = document.querySelector('.user-nav a[id="registerLink"]');
    if (!registerLink) {
        const registerLinks = document.querySelectorAll('.user-nav a');
        registerLinks.forEach(link => {
            if (link.textContent.includes('Регистрация')) {
                link.id = 'registerLink';
            }
        });
    }
    
    const loginLink = document.querySelector('.user-nav a[id="loginLink"]');
    if (!loginLink) {
        const loginLinks = document.querySelectorAll('.user-nav a');
        loginLinks.forEach(link => {
            if (link.textContent.includes('Вход')) {
                link.id = 'loginLink';
            }
        });
    }
    
    const randomBtn = document.getElementById('randomBookBtn');
    if (!randomBtn) {
        const randomBtns = document.querySelectorAll('.random-btn');
        if (randomBtns.length > 0) randomBtns[0].id = 'randomBookBtn';
    }
});


// Глобальные функции для вызова из HTML
window.openModal = openModal;
window.closeModal = closeModal;