const createEventButton = document.querySelector('#createEventBtn');
const modalBox = document.querySelector('#eventCreateModal');
const eventForm = document.querySelector('#createEventForm');

modalBox.classList.add('hidden');

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