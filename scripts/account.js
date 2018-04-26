
(function() {
  'use strict';

  // authe gate
  request('/auth/token')
  .then(function(response){
    document.querySelector('#navbarDropdown').innerHTML = response.data.name
  })
  .catch(function(error){
    console.log(error)
    window.location = '/index.html'
  })

})();
