// Хранилище книг
let books = JSON.parse(localStorage.getItem('adminBooks')) || [
    {
        id: '1',
        title: 'Зеленая миля',
        author: 'Стивен Кинг',
        genre: 'Фантастика',
        price: 650,
        description: 'Однажды в камеру привозят мужчину, который приговорен к смерти за убийство двух маленьких девочек.',
        image: 'img/popular/GreenM.svg'
    },
    {
        id: '2',
        title: 'Гарри Поттер',
        author: 'Джоан Роулинг',
        genre: 'Фэнтези',
        price: 750,
        description: 'Долгих двенадцать лет кровожадный убийца Сириус Блэк провел в заточении мрачной тюрьмы магического мира - Азкабане.',
        image: 'img/popular/GarryP.svg'
    }
];

// Хранилище отзывов
let reviews = JSON.parse(localStorage.getItem('adminReviews')) || [
    {
        id: '1',
        book: 'Дивергент',
        author: 'Жукова Дарья',
        text: 'Очень люблю книги Рея Брэдбери. Безумно талантливый писатель.',
        date: '09.04.25'
    },
    {
        id: '2',
        book: 'Повелитель мух',
        author: 'Гусакова Алла',
        text: 'Эта книга о нас, о настоящих жителях планеты Земля.',
        date: '17.05.25'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, является ли пользователь администратором
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // Загружаем книги и отзывы
    renderBooks();
    renderReviews();

    // Обработчики для книг
    document.getElementById('addBookBtn').addEventListener('click', () => {
        openBookModal();
    });

    document.getElementById('cancelBookBtn').addEventListener('click', () => {
        closeModal('bookModal');
    });

    document.getElementById('bookForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveBook();
    });

    // Обработчики для подтверждения
    document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
        closeModal('confirmModal');
    });

    document.getElementById('confirmBtn').addEventListener('click', () => {
        const action = document.getElementById('confirmBtn').dataset.action;
        const id = document.getElementById('confirmBtn').dataset.id;
        
        if (action === 'deleteBook') {
            deleteBook(id);
        } else if (action === 'deleteReview') {
            deleteReview(id);
        }
        
        closeModal('confirmModal');
    });
});

// Функции для работы с книгами
function renderBooks() {
    const tbody = document.querySelector('#booksTable tbody');
    tbody.innerHTML = '';
    
    books.forEach(book => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.price} ₽</td>
            <td>
                <div class="admin-actions">
                    <button class="admin-btn edit" onclick="editBook('${book.id}')">Редактировать</button>
                    <button class="admin-btn delete" onclick="confirmDelete('deleteBook', '${book.id}', 'Вы уверены, что хотите удалить книгу "${book.title}"?')">Удалить</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    localStorage.setItem('adminBooks', JSON.stringify(books));
}

function openBookModal(book = null) {
    const modal = document.getElementById('bookModal');
    const title = document.getElementById('bookModalTitle');
    const form = document.getElementById('bookForm');
    
    if (book) {
        title.textContent = 'Редактировать книгу';
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookGenre').value = book.genre;
        document.getElementById('bookPrice').value = book.price;
        document.getElementById('bookDescription').value = book.description;
        document.getElementById('bookImage').value = book.image;
    } else {
        title.textContent = 'Добавить новую книгу';
        form.reset();
    }
    
    modal.classList.add('active');
}

function saveBook() {
    const id = document.getElementById('bookId').value;
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const genre = document.getElementById('bookGenre').value;
    const price = parseInt(document.getElementById('bookPrice').value);
    const description = document.getElementById('bookDescription').value;
    const image = document.getElementById('bookImage').value;
    
    if (id) {
        // Редактирование существующей книги
        const index = books.findIndex(b => b.id === id);
        if (index !== -1) {
            books[index] = { id, title, author, genre, price, description, image };
        }
    } else {
        // Добавление новой книги
        const newId = Date.now().toString();
        books.push({ id: newId, title, author, genre, price, description, image });
    }
    
    renderBooks();
    closeModal('bookModal');
    showNotification('Книга сохранена успешно!');
}

function editBook(id) {
    const book = books.find(b => b.id === id);
    if (book) {
        openBookModal(book);
    }
}

function deleteBook(id) {
    books = books.filter(b => b.id !== id);
    renderBooks();
    showNotification('Книга удалена успешно!');
}

// Функции для работы с отзывами
function renderReviews() {
    const tbody = document.querySelector('#reviewsTable tbody');
    tbody.innerHTML = '';
    
    reviews.forEach(review => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${review.id}</td>
            <td>${review.book}</td>
            <td>${review.author}</td>
            <td>${review.text.length > 50 ? review.text.substring(0, 50) + '...' : review.text}</td>
            <td>${review.date}</td>
            <td>
                <div class="admin-actions">
                    <button class="admin-btn edit" onclick="editReview('${review.id}')">Редактировать</button>
                    <button class="admin-btn delete" onclick="confirmDelete('deleteReview', '${review.id}', 'Вы уверены, что хотите удалить отзыв от ${review.author}?')">Удалить</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    localStorage.setItem('adminReviews', JSON.stringify(reviews));
}

function editReview(id) {
    const review = reviews.find(r => r.id === id);
    if (review) {
        const newText = prompt('Редактировать отзыв:', review.text);
        if (newText !== null) {
            review.text = newText;
            renderReviews();
            showNotification('Отзыв обновлен успешно!');
        }
    }
}

function deleteReview(id) {
    reviews = reviews.filter(r => r.id !== id);
    renderReviews();
    showNotification('Отзыв удален успешно!');
}

// Общие функции
function confirmDelete(action, id, message) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmBtn').dataset.action = action;
    document.getElementById('confirmBtn').dataset.id = id;
    modal.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

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

// Глобальные функции для вызова из HTML
window.editBook = editBook;
window.confirmDelete = confirmDelete;
window.editReview = editReview;

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}