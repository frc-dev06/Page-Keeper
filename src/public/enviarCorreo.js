document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtén los datos del formulario
    let email = document.querySelector('#email').value;
    let subject = document.querySelector('#subject').value;
    let message = document.querySelector('#message').value;
    let file = document.querySelector('#file').files[0];

    // Valida los datos del formulario aquí
    // ...

    // Crea un objeto FormData para enviar los datos del formulario
    let formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('file', file);

    // Envía los datos del formulario a tu servidor
    // Envía los datos del formulario a tu servidor
fetch('/correo/send-email', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: email,
        subject: subject,
        message: message
    }),
})
.then((response) => response.json())
.then((data) => console.log(data))
.catch((error) => console.error('Error:', error));
});