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
    const messageElement = document.getElementById('response-message');
    messageElement.textContent = 'Enviando tu respuesta...';
    messageElement.className = 'info';

    const script = document.createElement('script');
    const callback = 'callback_' + Math.random().toString(36).substr(2, 5);

    window[callback] = function(response) {
        console.log('Respuesta del servidor:', response);
        // No hacemos nada con la respuesta del servidor
        document.body.removeChild(script);
        delete window[callback];
    };

    script.onerror = function() {
        console.error('Error al cargar el script');
        document.body.removeChild(script);
        delete window[callback];
    };

    const queryString = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    script.src = `${SCRIPT_URL}?callback=${callback}&${queryString}`;
    document.body.appendChild(script);

    // Reiniciar el formulario y mostrar mensaje de éxito después de 3 segundos
    setTimeout(() => {
        form.reset();
        document.getElementById('char-count').textContent = '0 / 46';
        messageElement.textContent = '¡Gracias por tu respuesta!';
        messageElement.className = 'success';

        // Ocultar el mensaje después de 5 segundos adicionales
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = '';
        }, 5000);
    }, 3000);
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
