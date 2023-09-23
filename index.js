//global variables
const createEventButton = document.querySelector('#createEventBtn');
const modalBox = document.querySelector('#eventCreateModal');
const eventForm = document.querySelector('#createEventForm');
const fetchUrl = 'http://localhost:3000/events';

//hide modal box on pageload and attach listener to display it
modalBox.classList.add('hidden');
createEventButton.addEventListener('click', () => {
  modalBox.classList.remove('hidden');
})

//close modal if user clicks outside the box
document.addEventListener('mousedown', (e) => {
  if (e.target === createEventButton) return;
  if (e.target === eventForm) return;
  if (e.target.classList.contains('formInputField')) return;
  if (e.target !== modalBox) {
    modalBox.classList.add('hidden');
  }
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

//FOR KAT TO CODE!!! DO NOT TOUCH UNLESS YOU ARE KAT!
function renderEvent(eventObj) {}