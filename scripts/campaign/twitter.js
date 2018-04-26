const getTweets = document.querySelector('#getTweets')
const twitterProfileBox = document.querySelector("#twitterProfileBox")
const gettingTweetBox = document.querySelector('#gettingTweetBox')
const createCampaignBut = document.querySelector('#createCampaignBut')
const invalidTweetErr = document.querySelector('#invalidTwitterParam')
const hashtags = document.querySelector('#hashtagSearch')
const usernames = document.querySelector('#twitterUser')
const campaignTitle = document.querySelector('#campaignTitle')
const campaignDescription = document.querySelector('#campaignDescription')
const hashtagPlace = document.querySelector('#hashtags')
const users = document.querySelector('#users')
const campForm = document.querySelector('#createCampForm')
const selectedTweet = document.querySelector('#selectedTweet')
const sideBar = document.querySelector('#sidebar')
const remove = document.querySelector('#remove')
const contentArea = document.querySelector('#contentArea')
const placeholder = document.querySelector('#placeholder')
const share = document.querySelector('#share')
const campaignView = document.querySelector('#campaignView')
const sharedBy = document.querySelector('#sharedBy')
var userID;



function SideBar() {
  request('/auth/token')
    .then(function(response) {
      userID = response.data.id
      return Promise.resolve(userID)
    })
    .then(data => {
      request(`/users/${userID}/campaigns`, `get`)
        .then(response => {
          sideBar.innerHTML = ''
          for (let i = 0; i < response.data.data.length; i++) {
            let btn = document.createElement("Button")
            btn.classList = 'list-group-item'
            btn.innerHTML = `${response.data.data[i].title}`
            btn.setAttribute('data-id', response.data.data[i].id)
            btn.value = response.data.data[i].is_owner
            if (response.data.data[i].is_owner === true) btn.classList = `btn btn-outline-secondary`
            else if (response.data.data[i].is_owner === false) btn.classList = `btn btn-outline-danger`
            sideBar.append(btn)
            btn.addEventListener('click', campaignSelection)
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      return err
    })
}
SideBar()

function campaignSelection(event) {
  var btnID = parseInt(event.srcElement.getAttribute('data-id'))
  request(`/users/${userID}/campaigns/${btnID}`, `get`)
    .then(response => {
      placeholder.style.display = "none"
      contentArea.style.display = "block"
      campaignTitle.innerHTML = response.data.data.campaign.title
      campaignDescription.innerHTML = response.data.data.campaign.description
      hashtagPlace.innerHTML = ''
      users.innerHTML = ''
      users.classList = 'card-columns'
      hashtagPlace.classList = 'card-columns'
      if (response.data.data.usernames.length === 0) {
        document.querySelector('#usersBlock').style.display = "none"
      }
      if (response.data.data.hashtags.length === 0) {
        document.querySelector('#hashtagsBlock').style.display = "none"
      }
      for (let i = 0; i < response.data.data.usernames.length; i++) {
        document.querySelector('#usersBlock').style.display = "inline"
        let card = document.createElement('div')
        card.classList = `card`
        // card.style = 'width:20rem'
        let cardChart = document.createElement('div')
        let cardBody = document.createElement('div')
        cardBody.classList = "card-body"
        let cardText = document.createElement('p')
        cardText.innerHTML = response.data.data.usernames[i].username
        card.append(cardChart)
        cardBody.append(cardText)
        card.append(cardBody)
        users.append(card)
        const chart = new PersonalitySunburstChart({
          'element': cardChart,
          'version': 'v3'
        });
        chart.show(response.data.data.usernames[i].usernameAnalysis);
        cardBody.addEventListener('click', modalPopUp(response.data.data.usernames[i].usernameAnalysis, response.data.data.usernames[i].username))
      }
      for (let i = 0; i < response.data.data.hashtags.length; i++) {
        document.querySelector('#hashtagsBlock').style.display = "block"
        let card = document.createElement('div')
        card.classList = `card`
        // card.style = 'width:30px'
        let cardChart = document.createElement('div')
        card.append(cardChart)
        let cardBody = document.createElement('div')
        cardBody.classList = "card-body"
        let cardText = document.createElement('p')
        cardText.innerHTML = response.data.data.hashtags[i].hashtag
        cardBody.append(cardText)
        card.append(cardBody)
        hashtagPlace.append(card)
        const chart = new PersonalitySunburstChart({
          'element': cardChart,
          'version': 'v3'
        });
        chart.show(response.data.data.hashtags[i].hashtagAnalysis);
        cardBody.addEventListener('click', modalPopUp(response.data.data.hashtags[i].hashtagAnalysis, response.data.data.hashtags[i].hashtag, response.data.data.campaign.campaigns_id))
      }

    })
    .catch(err => {
      console.log(err)
    })

  //configures share Button
  share.addEventListener('click', event => {
    let reqUserid;
    $('#shareCampaign').modal('show')
    document.querySelector('#request').addEventListener('click', function(event) {
      event.preventDefault()
      reqUsername = document.querySelector('#requestUser').value
      request(`/users/${userID}/requestUser/${reqUsername}`, `get`)
        .then(response => {
          reqUserid = response.data.data.id
          return request(`/users/${reqUserid}/campaigns/${btnID}`, `post`)

        })
        .then(response => {
          $('#shareCampaign').modal('hide')
          SideBar()
        })
        .catch(err => {
          console.log(err)
        })
    })
  })

  //configures remove BTN
  remove.addEventListener('click', event => {
    request(`/users/${userID}/campaigns/${btnID}`, `delete`)
      .then(response => {
        console.log(response)
        SideBar()
      })
      .catch(err => {
        console.log(err)
      })
  })
}


function modalPopUp(data, title) {
  return function(event) {
    $('#campaignView').modal('show')
    document.querySelector('.campaign-modal-title').innerHTML = title
    const chart = new PersonalitySunburstChart({
      'element': document.querySelector('.sunburst-modal-body'),
      'version': 'v3'
    });
    chart.show(data);
  }
}

getTweets.addEventListener('click', function(event) {
  event.preventDefault()
  let usernamesArray = usernames.value.split(',')
  let hashtagArray = hashtags.value.split(',')
  if (!usernamesArray.length && !hashtagArray.length) {
    invalidTweetErr.style.color = "red"
    invalidTweetErr.style.display = "block"
  } else if (usernamesArray.length >= 1 || hashtagArray.length >= 1) {
    gettingTweetBox.style.display = "none"
    createCampaignBut.style.display = "inline"
    twitterProfileBox.style.display = "inline"
    selectedTweet.innerHTML = `Usernames: ${usernamesArray} <br> Hashtags:${hashtagArray}`
  }
  createCampaignBut.addEventListener('click', function(event) {
    event.preventDefault()
    let title = document.querySelector('#inputCampaignTitle').value
    let description = document.querySelector('#inputCampaignDesc').value
    let hashtags = hashtagArray
    let usernames = usernamesArray

    request(`/users/${userID}/campaigns`, 'post', {
        title,
        description,
        hashtags,
        usernames
      })
      .then(response => {
        createCampForm.reset();
        gettingTweetBox.style.display = "inline"
        createCampaignBut.style.display = "none"
        twitterProfileBox.style.display = "none"
        $('#squarespaceModal').modal('hide');
        SideBar()
      })
      .catch(error => {
        return alert("Sorry Couldn't process")
      })
  })
})
