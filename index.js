//global variables
const createEventButton = document.querySelector('#eventCreateBtn');
const modalBox = document.querySelector('.modal');
const eventForm = document.querySelector('#eventCreateForm');
const fetchUrl = 'http://localhost:3000/events';
const eventsContainer = document.querySelector("#eventsContainer")
const eventDetails = document.querySelector("#detailsModal")


// Kat code
const displayDetails = (eventObj) => {
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
  eventDetails.parentNode.classList.remove('hidden')
}

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
  modalBox.classList.remove('hidden');
})

//close modal if user clicks outside the box
document.addEventListener('mousedown', (e) => {
  if (e.target === createEventButton) return;
  if (e.target === eventForm) return;
  if (e.target.classList.contains('formInputField')) return;
  if (e.target.classList.contains('formTextarea')) return;
  if (e.target.classList.contains('label')) return;
  if (e.target.id === 'submitNewEvent') return;
  if (e.target !== eventForm || e.target !== eventDetails) {
    modalBox.classList.add('hidden');
  }
})

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert("Thanks for submitting your event!")
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



//function call
getAllData()