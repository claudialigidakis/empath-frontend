(function() {
  'use strict';

  request('/auth/token')
  .then(function(response){
    // user is authenticated
  })
  .catch(function(error){
    // user is not authenticated
  })

  // signup form
  document.querySelector('#signupModal').addEventListener('submit', function(event){
    event.preventDefault()
    const fname = document.querySelector('#firstName').value
    const lname = document.querySelector('#lastName').value
    const email = document.querySelector('#email').value
    const newUser = document.querySelector('#newUsername').value
    const newPass = document.querySelector('#newPassword').value
    const confirmPass = document.querySelector('#confirmPassword').value

    if(newPass !== confirmPass) {
      document.querySelector('#signupError').style.display = "block"
      document.querySelector('#wrongpasswords').style.display = "block"
      document.querySelector('#wrongpasswords').style.color = "red"
      return
    }

    if(fname && lname && email && newUser && newPass) {
      request('/users', 'post', { username : newUser, password : newPass, fname , lname, email })
      .then(function(response){
        return request('/auth/token', 'post', { username : newUser, password : newPass })
      })
      .then(function(response){
        console.log("response")
        document.querySelector('#registerError').classList.add('hide-auth-error')
        localStorage.setItem('token', response.data.token)
        window.location = '/myDashboard.html'
      })
      .catch(function(error){
        document.querySelector('#registerError').classList.remove('hide-auth-error')
      })
    }

})



  // login form
  document.querySelector('#logInModal').addEventListener('submit', function(event){
    event.preventDefault()
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    if(username && password) {
          request('/auth/token', 'post', { username , password })
          .then(function(response){
            document.querySelector('#error').classList.add('hide-auth-error')
            localStorage.setItem('token', response.data.token)
            window.location = '/myDashboard.html'
          })
          .catch(function(error){
            document.querySelector('#error').classList.remove('hide-auth-error')
          })
    }
  })
})
();
