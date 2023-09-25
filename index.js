//global variables
const createEventButton = document.querySelector('#eventCreateBtn');
const modalBox = document.querySelector('.modal');
const modalContent = document.querySelector('div.modal-content');
const eventForm = document.querySelector('#eventCreateForm');
const fetchUrl = 'http://localhost:3000/events';
const eventsContainer = document.querySelector("#eventsContainer")
const eventDetails = document.querySelector("#detailsModal")


// Kat code
  // display event details
const displayDetails = (eventObj) => {
  eventDetails.innerHTML = "";
  const image = document.createElement("img")
  image.src = eventObj.image
  image.alt = eventObj.name
  const h3 = document.createElement("h3")
  h3.textContent = eventObj.name
  const pDateLoc = document.createElement("p")
  pDateLoc.textContent = `${eventObj.date}, ${eventObj.location}`
  const pDescrip = document.createElement("p")
  pDescrip.textContent = eventObj.description

  eventDetails.append(image, h3, pDateLoc, pDescrip)
  eventDetails.parentNode.classList.add('unhide')
}

  // render card for event
const renderEvent = (eventObj) => {
  const eventCard = document.createElement("div")
  eventCard.setAttribute("class", "card")
  const image = document.createElement("img")
  image.src = eventObj.image
  image.alt = eventObj.name
  const h3 = document.createElement("h3")
  h3.textContent = eventObj.name
  eventCard.append(image, h3)

  eventCard.addEventListener("click", e => displayDetails(eventObj))

  eventsContainer.append(eventCard)
}

// Joseph code
//add toggle visibility functionality to modal box
createEventButton.addEventListener('click', () => {
  modalBox.classList.add('unhide');
})

//close modal if user clicks outside the box
document.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('unhide');
  }
})

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitNewEvent();
  alert("Thanks for submitting your event!");
  modalBox.classList.add('hidden');
  eventForm.reset();
})

//helper functions
function getAllData() {
  fetch(fetchUrl)
    .then(resp => {
      if (resp.ok) return resp.json()
      throw new Error('Failed to fetch event data.')
    })
    .then(objArray => objArray.forEach(event => renderEvent(event)))
    .catch(err => alert(err.message))
}

function submitNewEvent() {
  const eventObj = {
    image: eventForm.image.value,
    name: eventForm.name.value,
    date: eventForm.date.value,
    location: eventForm.location.value,
    description: eventForm.desc.value
  }
  fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(eventObj)
  })
  .then(resp => {
    if (resp.ok) return resp.json()
    throw new Error('Failed to submit event data.')
  })
  .then(event => renderEvent(event))
  .catch(err => alert(err.message))
}

//function call
getAllData()