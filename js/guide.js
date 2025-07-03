function openGuideModal() {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'guideModal';
    
    // Создаем контент модального окна
    modal.innerHTML = `
        <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
            <h2 class="modal-title">Путеводитель по странице</h2>
            
            <div class="guide-section">
                <h3>Ваши уведомления</h3>
                <div class="guide-divider"></div>
                <div class="guide-notification-example">
                    <a href="#" class="notification-example">
                        <img src="img/icons/notify.svg" alt="Уведомления"> Уведомление
                    </a>
                </div>
                <p>Здесь вы получите уведомления о своих предзаказах и ближайших доставках.</p>
            </div>
            
            <div class="guide-section">
                <h3>Ваши отложенные товары</h3>
                <div class="guide-divider"></div>
                <div style="text-align: center; margin: 15px 0;">
                    <button class="guide-heart-btn"><i class="far fa-heart"></i></button>
                </div>
                <p>На карточках книг есть иконки сердечек.</p>
                <p>Нажмите на него и товар окажется в списке отложенных. Это просто!</p>
            </div>
            
            <div class="guide-section">
                <h3>Вход в личный кабинет</h3>
                <div class="guide-divider"></div>
                <div class="guide-auth-example">
                    <span>Регистрация</span> <span>Вход</span>
                </div>
                <p>Можете войти в свой аккаунт или пройти регистрацию, если у вас всё ещё нет учётной записи.</p>
            </div>
            
            <div class="guide-section">
                <h3>Покупка случайной книги</h3>
                <div class="guide-divider"></div>
                <p>При нажатии на кнопку "Мне повезет!" в вашу корзину добавится случайная книга. Испытайте удачу!</p>
            </div>
            
            <div class="guide-actions">
                <button class="modal-btn confirm" onclick="closeGuideModal()">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Блокируем прокрутку страницы за модальным окном
    document.body.style.overflow = 'hidden';
}

function closeGuideModal() {
    const modal = document.getElementById('guideModal');
    if (modal) {
        modal.remove();
        // Восстанавливаем прокрутку страницы
        document.body.style.overflow = '';
    }
}

// Добавляем стили для путеводителя
const style = document.createElement('style');
style.textContent = `
    .guide-section {
        margin-bottom: 30px;
    }
    
    .guide-divider {
        height: 1px;
        background-color: #d4a373;
        margin: 10px 0;
    }
    
    .guide-notification-example {
        margin: 15px 0;
    }
    
    .notification-example {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        text-decoration: none;
        color: #333;
        font-size: 14px;
    }
    
    .notification-example img {
        width: 16px;
        height: 16px;
    }
    
    .guide-heart-btn {
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: default;
        color: #000000;
        font-size: 16px;
    }
    
    .guide-auth-example {
        margin: 15px 0;
        display: flex;
        gap: 15px;
    }
    
    .guide-auth-example span {
        padding: 5px 10px;
        color: #333;
    }
    
    .guide-actions {
        text-align: center;
        margin-top: 30px;
    }
    
    #guideModal .modal-content {
        max-width: 600px;
    }
`;
document.head.appendChild(style);

// Делаем функции доступными глобально
window.openGuideModal = openGuideModal;
window.closeGuideModal = closeGuideModal;