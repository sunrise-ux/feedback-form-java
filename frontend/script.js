const form = document.getElementById('feedbackForm');
const submitBtn = document.getElementById('submitBtn');
const messageBox = document.getElementById('messageBox');

// Функция валидации на клиенте
function validateForm(name, email, message) {
    const errors = {};

    // Валидация имени
    if (!name || name.trim().length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа';
    } else if (name.length > 50) {
        errors.name = 'Имя не должно превышать 50 символов';
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = 'Введите корректный email адрес';
    }

    // Валидация сообщения
    if (!message || message.trim().length < 5) {
        errors.message = 'Сообщение должно содержать минимум 5 символов';
    } else if (message.length > 500) {
        errors.message = 'Сообщение не должно превышать 500 символов';
    }

    return errors;
}

// Функция отображения ошибок
function displayErrors(errors) {
    document.getElementById('nameError').textContent = errors.name || '';
    document.getElementById('emailError').textContent = errors.email || '';
    document.getElementById('messageError').textContent = errors.message || '';
}

// Функция очистки ошибок
function clearErrors() {
    displayErrors({});
}

// Функция показа сообщения
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
    messageBox.classList.remove('hidden');

    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000);
}

// Отправка формы
async function submitForm(event) {
    event.preventDefault();

    // Получаем значения
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Клиентская валидация
    const errors = validateForm(name, email, message);

    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }

    // Очищаем старые ошибки и сообщения
    clearErrors();
    messageBox.classList.add('hidden');

    // Блокируем кнопку отправки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
        // Отправка данных на сервер
        const response = await fetch('http://localhost:8080/api/feedback/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                message: message.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Обработка ошибок 400 и 500
            if (response.status === 400) {
                if (data.errors) {
                    // Отображаем ошибки валидации с сервера
                    displayErrors(data.errors);
                    showMessage(data.message || 'Ошибка валидации', 'error');
                } else {
                    showMessage('Ошибка валидации данных', 'error');
                }
            } else if (response.status === 500) {
                showMessage('Ошибка сервера. Пожалуйста, попробуйте позже.', 'error');
            } else {
                showMessage(data.message || 'Произошла ошибка', 'error');
            }
            return;
        }

        // Успешная отправка
        showMessage(data.message, 'success');

        // Очищаем форму
        form.reset();

        // Дополнительная информация в консоль
        console.log('Ответ сервера:', data);

    } catch (error) {
        console.error('Ошибка сети:', error);
        showMessage('Ошибка соединения с сервером. Проверьте, запущен ли сервер.', 'error');
    } finally {
        // Разблокируем кнопку
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
}

// Навешиваем обработчик отправки
form.addEventListener('submit', submitForm);

// Валидация в реальном времени (опционально)
document.getElementById('name').addEventListener('input', () => {
    const name = document.getElementById('name').value;
    const errors = validateForm(name, '', '');
    document.getElementById('nameError').textContent = errors.name || '';
});

document.getElementById('email').addEventListener('input', () => {
    const email = document.getElementById('email').value;
    const errors = validateForm('valid', email, 'valid');
    document.getElementById('emailError').textContent = errors.email || '';
});

document.getElementById('message').addEventListener('input', () => {
    const message = document.getElementById('message').value;
    const errors = validateForm('valid', 'valid@mail.com', message);
    document.getElementById('messageError').textContent = errors.message || '';
});