// Global variables
const createEventButton = document.querySelector('#createEventBtn');
const modalBox = document.querySelector('#eventCreateModal');
const eventForm = document.querySelector('#createEventForm');
const eventsContainer = document.querySelector("#eventsContainer")

modalBox.classList.add('hidden');



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
createEventButton.addEventListener('click', () => {
  modalBox.classList.remove('hidden');
})

document.addEventListener('mousedown', (e) => {
  if (e.target === createEventButton) return;
  if (e.target === eventForm) return;
  if (e.target.classList.contains('formInputField')) return;
  if (e.target !== modalBox) {
    modalBox.classList.add('hidden');
  }
})