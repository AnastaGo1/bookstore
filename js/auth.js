// Хранилище пользователей
let users = JSON.parse(localStorage.getItem('users')) || [];

// Текущий пользователь
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');

    // Переключение между формами
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Обработка входа
    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotification('Вход выполнен успешно!');
            
            // Перенаправляем на главную страницу через 1 секунду
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showNotification('Неверный email или пароль');
        }
    });

    // Обработка регистрации
    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Проверка паролей
        if (password !== confirmPassword) {
            showNotification('Пароли не совпадают');
            return;
        }
        
        // Проверка длины пароля
        if (password.length < 6) {
            showNotification('Пароль должен содержать не менее 6 символов');
            return;
        }
        
        // Проверка, есть ли уже пользователь с таким email
        if (users.some(u => u.email === email)) {
            showNotification('Пользователь с таким email уже существует');
            return;
        }
        
        // Создаем нового пользователя
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            isAdmin: false // По умолчанию пользователь не администратор
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showNotification('Регистрация прошла успешно!');
        
        // Автоматически входим после регистрации
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Перенаправляем на главную страницу через 1 секунду
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });

    // Если пользователь уже вошел, перенаправляем на главную
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
});

// Функция для показа уведомления
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

// Функция выхода
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}