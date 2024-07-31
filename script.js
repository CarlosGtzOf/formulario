/*const form = document.getElementById('weddingForm');
const SCRIPT_URL = '';

form.addEventListener('submit', e => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors'  // Añadido para manejar posibles problemas de CORS
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(data => {
        console.log('Response data:', data);
        try {
            const result = JSON.parse(data);
            if (result.status === "success") {
                alert('¡Gracias por tu respuesta!');
                form.reset();
            } else {
                throw new Error(result.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error parsing response:', error);
            alert('Hubo un error al procesar la respuesta. Por favor, intenta de nuevo.');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Hubo un error al enviar tu respuesta. Por favor, intenta de nuevo.');
    });
});*/

const form = document.getElementById('weddingForm');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKO3TEuyD2eTCHsf5_WSqM9GJt9yQ67R6mMLGYprVsOiJIyJY1WVKfX8nV2KoXFah-Rw/exec';

// Añade esta función para el contador de caracteres
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

// Llama a esta función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupCharacterCount);

form.addEventListener('submit', e => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    console.log('Datos del formulario:', data);
    console.log('adultOnly value:', data.adultOnly);

    // Asegúrate de que el mensaje no exceda los 46 caracteres
    if (data.message && data.message.length > 46) {
        data.message = data.message.substring(0, 46);
    }

    const dataToSend = JSON.stringify(data);
    console.log('Datos a enviar (JSON):', dataToSend);

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Añade esta línea
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(responseData => {
        console.log('Respuesta del servidor:', responseData);
        // ... resto del código ...
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar tu respuesta. Por favor, intenta de nuevo.');
    });
});