document.addEventListener('DOMContentLoaded', () => {
    // Все книги для поиска
    const allBooks = [
        {
            id: '1',
            title: 'Зеленая миля',
            author: 'Стивен Кинг',
            genre: 'Фантастика',
            category: 'Проза',
            price: 650,
            image: 'img/popular/GreenM.svg'
        },
        {
            id: '2',
            title: 'Гарри Поттер',
            author: 'Джоан Роулинг',
            genre: 'Фэнтези',
            category: 'Детское',
            price: 750,
            image: 'img/popular/GarryP.svg'
        },
        {
            id: '3',
            title: 'Игра престолов',
            author: 'Джордж Мартин',
            genre: 'Фантастика',
            category: 'Проза',
            price: 800,
            image: 'img/genre/GameP.svg'
        },
        {
            id: '4',
            title: 'Дюна',
            author: 'Фрэнк Герберт',
            genre: 'Фантастика',
            category: 'Проза',
            price: 700,
            image: 'img/genre/Dune.svg'
        },
        {
            id: '5',
            title: 'Метро 2033',
            author: 'Дмитрий Глуховский',
            genre: 'Фантастика',
            category: 'Проза',
            price: 600,
            image: 'img/genre/Metro2033.svg'
        },
        {
            id: '6',
            title: 'Ведьмак',
            author: 'Анджей Сапковский',
            genre: 'Фэнтези',
            category: 'Проза',
            price: 720,
            image: 'img/genre/Vedmak.svg'
        },
        {
            id: '7',
            title: '451 градус по Фаренгейту',
            author: 'Рэй Брэдбери',
            genre: 'Антиутопия',
            category: 'Классика',
            price: 550,
            image: 'img/genre/451С.svg'
        },
        {
            id: '8',
            title: 'Портрет Дориана Грея',
            author: 'Оскар Уайльд',
            genre: 'Классика',
            category: 'Классика',
            price: 500,
            image: 'img/redakt/Dorian.svg'
        }
    ];

    // Элементы DOM
    const filterOptions = document.querySelectorAll('.filter-option');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const searchResults = document.getElementById('searchResults');

    // Выбранные фильтры
    let selectedGenres = [];
    let selectedCategories = [];
    let minPrice = 0;
    let maxPrice = Infinity;

    // Обработчики событий
    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('selected');
            
            // Определяем, к какой группе относится опция
            const parent = option.parentNode.parentNode;
            if (parent.querySelector('h4').textContent === 'Жанры') {
                updateSelectedGenres();
            } else if (parent.querySelector('h4').textContent === 'Категории') {
                updateSelectedCategories();
            }
        });
    });

    applyFiltersBtn.addEventListener('click', () => {
        minPrice = minPriceInput.value ? parseInt(minPriceInput.value) : 0;
        maxPrice = maxPriceInput.value ? parseInt(maxPriceInput.value) : Infinity;
        
        filterBooks();
    });

    // Функции
    function updateSelectedGenres() {
        selectedGenres = [];
        document.querySelectorAll('.filter-group:nth-child(1) .filter-option.selected').forEach(option => {
            selectedGenres.push(option.textContent);
        });
    }

    function updateSelectedCategories() {
        selectedCategories = [];
        document.querySelectorAll('.filter-group:nth-child(2) .filter-option.selected').forEach(option => {
            selectedCategories.push(option.textContent);
        });
    }

    function filterBooks() {
        const filteredBooks = allBooks.filter(book => {
            // Фильтрация по жанру
            if (selectedGenres.length > 0 && !selectedGenres.includes(book.genre)) {
                return false;
            }
            
            // Фильтрация по категории
            if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
                return false;
            }
            
            // Фильтрация по цене
            if (book.price < minPrice || book.price > maxPrice) {
                return false;
            }
            
            return true;
        });
        
        displayResults(filteredBooks);
    }

    function displayResults(books) {
        searchResults.innerHTML = '';
        
        if (books.length === 0) {
            searchResults.innerHTML = '<p>По вашему запросу ничего не найдено</p>';
            return;
        }
        
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <div class="book-image-container">
                    <img src="${book.image}" alt="${book.title}">
                    <button class="heart-btn"><i class="far fa-heart"></i></button>
                </div>
                <div class="book-info">
                    <div class="book-author">${book.author}</div>
                    <div class="book-title">${book.title}</div>
                    <div class="book-price">${book.price} ₽</div>
                    <div class="book-actions">
                        <button class="btn-buy">Купить</button>
                    </div>
                </div>
            `;
            searchResults.appendChild(bookCard);
        });
    }

    // Инициализация - показываем все книги при загрузке
    displayResults(allBooks);
});