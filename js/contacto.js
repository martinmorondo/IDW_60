document.addEventListener('DOMContentLoaded', () => {

    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const formMessages = document.getElementById('form-messages');

    const showMessage = (message, type) => {
        formMessages.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    };

    // Función para validar email
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return re.test(String(email).toLowerCase());
    };

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        //  Validación
        if (nombre === '' || email === '' || mensaje === '') {
            showMessage('Por favor, completa todos los campos.', 'danger');
            return; 
        }

        if (!isValidEmail(email)) {
            showMessage('Por favor, ingresa un email válido.', 'warning');
            return; 
        }

        if (mensaje.length < 10) {
            showMessage('Tu mensaje es muy corto. Por favor, danos más detalles.', 'warning');
            return;
        }

        // 5. Simulación de envío 
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Enviando...';

        setTimeout(() => {
            showMessage('¡Gracias por tu consulta! Te responderemos a la brevedad.', 'success');
            
            contactForm.reset(); 
            
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Enviar Consulta';

        }, 1500);
    });
});