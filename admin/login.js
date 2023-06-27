function login() {
    // Retrieve the input values
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
  
    // Check if the credentials match the expected values
    if ((email == 'surendra' || email == 'shekhar') && (password == 'surendra@123' || password == 'shekhar')) {
      // Redirect the user to the home page or perform any other desired action
      window.location.href = '/admin/html/index.html';
    } else {
      // Credentials are incorrect, display an error message
      var errorMessage = document.getElementById('error-message');
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Incorrect username or password';
    }
  }
  