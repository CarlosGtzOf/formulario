const form = document.getElementById('weddingForm');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxa4ssRgKUaUnRdQzrPEaBIPlJD-MJDbcT7rL-tDrPXaigKwzn7F800XxhigxKWQBSiJw/exec'; // Elimina el espacio al final de la URL

// Función para configurar el contador de caracteres
function setupCharacterCount() {
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    messageTextarea.addEventListener('input', function() {
        const remainingChars = 46 - this.value.length;
        charCount.textContent = `${this.value.length} / 46`;
        
        if (remainingChars <= 10) {
            charCount.style.color = 'red';
        } else {
            charCount.style.color = '#666';
        }
    });
}

// Función para enviar los datos del formulario
function sendFormData(data) {
    const overlay = document.getElementById('overlay');
    const popupMessage = document.getElementById('popup-message');
    
    // Mostrar el popup
    overlay.style.display = 'flex';
    popupMessage.textContent = 'Enviando tu respuesta...';

    const script = document.createElement('script');
    const callback = 'callback_' + Math.random().toString(36).substr(2, 5);

    window[callback] = function(response) {
        console.log('Respuesta del servidor:', response);
        document.body.removeChild(script);
        delete window[callback];

        if (response && response.status === "success") {
            form.reset();
            document.getElementById('char-count').textContent = '0 / 46';
            popupMessage.textContent = '¡Gracias por tu respuesta!';

            // Ocultar el popup después de 3 segundos
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 3000);
        } else {
            popupMessage.textContent = 'Hubo un error al procesar la respuesta. Por favor, intenta de nuevo.';
            
            // Ocultar el popup después de 3 segundos en caso de error
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 3000);
        }
    };

    script.onerror = function() {
        console.error('Error al cargar el script');
        document.body.removeChild(script);
        delete window[callback];
        popupMessage.textContent = 'Hubo un error al enviar la respuesta. Por favor, intenta de nuevo.';
        
        // Ocultar el popup después de 3 segundos en caso de error
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 3000);
    };

    const queryString = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    script.src = `${SCRIPT_URL}?callback=${callback}&${queryString}`;
    document.body.appendChild(script);
}

// Event listener para el envío del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    console.log('Datos a enviar:', data);
    console.log('adultOnly value:', data.adultOnly);

    sendFormData(data);
});

// Llamar a setupCharacterCount cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupCharacterCount);
