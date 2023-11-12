/*document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData();
    formData.append('email', document.getElementById('email').value);
    formData.append('subject', document.getElementById('subject').value);
    formData.append('message', document.getElementById('message').value);

    var fileField = document.querySelector('input[type="file"]');
    formData.append('file', fileField.files[0]);

    fetch('/sendEmail', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});*/