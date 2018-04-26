
(function() {
  'use strict';

  // authe gate
  request('/auth/token')
  .then(function(response){
    document.querySelector('#profileFirstName').value = response.data.name
    document.querySelector('#profileLastName').value = response.data.lname
    document.querySelector('#profileUsername').value = response.data.user
    document.querySelector('#profileEmail').value = response.data.email
  })
  .catch(function(error){
    console.log(error)
    window.location = '/index.html'
  })


let confirmIdentity = document.querySelector('#confirmIdentity')
confirmIdentity.addEventListener('click', function(event){
  event.preventDefault()
  let password = document.querySelector('#profilePassword').value
  let username = document.querySelector('#profileUsername').value
  if(password && username) {
        request('/auth/token', 'post', { username , password })
        .then(function(response){
          document.querySelector('#registerError').style.display = "none"

          let submitButton = document.querySelector('#submitChanges')
          let cancelButton = document.querySelector('#cancelChanges')
          let confirmButton = document.querySelector('#confirmIdentity')
          let firstName = document.querySelector('#profileFirstName')
          let lastName = document.querySelector('#profileLastName')
          let formUsername = document.querySelector('#profileUsername')
          let email = document.querySelector('#profileEmail')


          firstName.classList = "form"
          lastName.classList = "form"
          formUsername.classList = "form"
          email.classList = "form"
          // newPass.classList = "form"
          document.querySelector('#profilePassword').style.display = "none"
          document.querySelector('#inputPass').style.display = "none"
          confirmButton.style.display = "none"
          submitButton.style.display = "inline"
          cancelButton.style.display = "inline"

          cancelButton.addEventListener('submit', function(event){
            event.preventDefault()
            submitButton.style.display = "hide"
            cancelButton.style.display = "hide"
            confirmButton.style.display = "inline"
            document.querySelector('#profilePassword').style.display = "inline"
            document.querySelector('#inputPass').style.display = "inline"
            firstName.classList = "form"
            lastName.classList = "form"
            formUsername.classList = "form"
            email.classList = "form"
            // newPass.classList = "form"

          })
          submitButton.addEventListener('submit', function(event){
            event.preventDefault()
//add ways to update from the submit button

//this happens after the submit functionsubmitButton.style.display = "hide"
              window.onload()
          })
        })
        .catch(function(error){
          document.querySelector('#registerError').style.color = "red"
          document.querySelector('#registerError').style.display = "block"
            console.log(error)
        })
  }
})
})();
