//global variables
const createEventButton = document.querySelector('#eventCreateBtn');
const modalBox = document.querySelector('#eventCreateModal');
const eventForm = document.querySelector('#eventCreateForm');
const fetchUrl = 'http://localhost:3000/events';
const eventsContainer = document.querySelector("#eventsContainer")


// Kat code
const renderEvent = (eventObj) => {
  const eventCard = document.createElement("div")
  eventCard.setAttribute("class", "card")
  const image = document.createElement("img")
  image.src = eventObj.image
  image.alt = eventObj.name
  const h3 = document.createElement("h3")
  h3.textContent = eventObj.name
  eventCard.append(image, h3)
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
  if (e.target !== modalBox) {
    modalBox.classList.add('hidden');
  }
})

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert("Thanks for submitting your event!")
  modalBox.classList.add('hidden')
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