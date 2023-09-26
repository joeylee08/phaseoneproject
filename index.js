//global variables
const createEventButton = document.querySelector('#eventCreateBtn');
const modalBox = document.querySelector('.modal');
const modalContent = document.querySelector('div.modal-content');
const eventForm = document.querySelector('#eventCreateForm');
const editModal = document.querySelector('#eventEditModal');
const editForm = document.querySelector('#eventEditForm');
const fetchUrl = 'http://localhost:3000/events';
const eventsContainer = document.querySelector("#eventsContainer")
const eventDetails = document.querySelector("#detailsModal")

// Kat code
const personVsPeople = (eventObj) => {
  if(eventObj.attendees === 1) {
    return `${eventObj.attendees} person attending`
  } else {
    return `${eventObj.attendees} people attending`
  }
}

// display event details
const displayDetails = (e, eventObj) => {
  eventDetails.innerHTML = "";

  let detailFooter;
  let h3;
  let interested;
  let going;
  let notgoing;

  displayDetailsCard(e, eventObj)
  displayDetailsLabel(e, eventObj)
  checkLocalStorage(e, eventObj)
  
  eventDetails.parentNode.classList.add('unhide')
}

function displayDetailsCard(e, eventObj) {
  const image = document.createElement("img")
  const pDateLoc = document.createElement("p")
  const pDescrip = document.createElement("p")

  h3 = document.createElement("h3")
  detailFooter = document.createElement("div")

  image.src = eventObj.image
  image.alt = eventObj.name
  pDateLoc.textContent = `${parseDate(eventObj.date)}, ${eventObj.location}`
  pDescrip.textContent = eventObj.description
  h3.textContent = eventObj.name
  detailFooter.setAttribute("class", "detail-footer")

  eventDetails.append(image, h3, pDateLoc, pDescrip, detailFooter)
  eventDetails.parentNode.classList.add('unhide')
}

function displayDetailsLabel(e, eventObj) {
  const label = document.createElement("label") //display dropdown
  const dropdown = document.createElement("select")
  const select = document.createElement("option")
  const attendSpan = document.createElement("span") 

  interested = document.createElement("option")
  going = document.createElement("option")
  notgoing = document.createElement("option")
  
  label.setAttribute("name", "attending")
  dropdown.setAttribute("name", "attending")
  select.setAttribute("value", "")
  select.textContent = "Select One"
  interested.setAttribute("value", "interested")
  interested.textContent = "Interested"
  going.setAttribute("value", "going")
  going.textContent = "Going"
  notgoing.setAttribute("value", "notgoing")
  notgoing.textContent = "Not Interested"
  attendSpan.textContent = `${eventObj.attendees} people attending`

  dropdown.addEventListener("change", e => {
    toggleAttending(e, eventObj)
    if (e.target.value === "going") updateAttending(eventObj)
  })
  
  dropdown.append(select, interested, going, notgoing)
  label.append(dropdown)
  detailFooter.append(label, attendSpan)
}

function checkLocalStorage(e, eventObj) {
  if (localStorage.getItem(eventObj.id) !== 0) { //check local storage
    const iconSpan = document.createElement('span');

    if (localStorage.getItem(eventObj.id) === '1') {
      interested.selected = 'true'
      iconSpan.textContent = ' ★'
      iconSpan.classList.add('interested')
    }
    if (localStorage.getItem(eventObj.id) === '2') {
      going.selected = 'true'
      iconSpan.textContent = ' ✔'
      iconSpan.classList.add('going')
    }
    if (localStorage.getItem(eventObj.id) === '3') {
      notgoing.selected = 'true'
      iconSpan.textContent = ' ✘'
      iconSpan.classList.add('notgoing')
    }

    h3.append(iconSpan)
  }
  
  const attendSpan = document.createElement("span")
  attendSpan.textContent = personVsPeople(eventObj)

  dropdown.addEventListener("change", e => {
    toggleAttending(e, eventObj)
    if(e.target.value === "going") {
      updateAttending(eventObj)
    }
  })

  label.append(dropdown)
  detailFooter.append(label, attendSpan)
  eventDetails.append(image, h3, pDateLoc, pDescrip, detailFooter)
  eventDetails.parentNode.classList.add('unhide')
}

// render card for event
const renderEvent = (eventObj) => {
  const eventCard = document.createElement("div");
  const image = document.createElement("img");
  const h3 = document.createElement("h3");
  const tooltip = document.createElement("span");
  
  image.src = eventObj.image
  image.alt = eventObj.name
  h3.textContent = eventObj.name
  tooltip.textContent = "Right click to edit event."
  tooltip.classList.add("tooltiptext")

  eventCard.setAttribute("class", "card")
  eventCard.classList.add('tooltip')
  eventCard.append(image, h3, tooltip)

  localStorage.setItem(eventObj.id, "0")

  eventCard.addEventListener("click", (e) => displayDetails(e, eventObj))
  eventCard.addEventListener("contextmenu", (e) => validateEditor(e, eventObj))
  
  eventsContainer.append(eventCard)
}

// PATCH for attendee count
function updateAttending(eventObj) {
  fetch(`${fetchUrl}/${eventObj.id}`,{
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      attendees: ++eventObj.attendees
    })
  })
  .then(resp => {
    if (resp.ok) return resp.json()
    throw new Error('Failed to update event data.')
  })
  .then(updatedEvent => {
    const attendSpan = document.querySelector(".detail-footer").lastChild
    attendSpan.textContent = personVsPeople(updatedEvent)
  })
  .catch(err => alert(err.message))
}

const validateFormData = (valuesArr) => {
  return valuesArr.every(el => el.trim() !== "")
}

const createNewEventObj = (e) => {
  if (validateFormData([e.target.image.value, e.target.name.value, e.target.date.value, e.target.location.value, e.target.desc.value])) {
    const eventObj = {
      image: eventForm.image.value,
      name: eventForm.name.value,
      date: eventForm.date.value,
      location: eventForm.location.value,
      description: eventForm.desc.value,
      hostCode: genHostCode(),
      attendees: 0
    }
    submitNewEvent(eventObj);
    alert(`Thanks for submitting your event! Your host code is ${eventObj.hostCode}. You need this code if you want to edit your event. Thanks!`);
    modalBox.classList.remove('unhide');
    eventForm.reset();
  } else {
    alert("Please complete event submission.")
  }
}

// sort incoming events by date before display
const sortByDate = () => {

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
  createNewEventObj(e)
})

//helper functions
function getAllData() {
  fetch(fetchUrl)
    .then(resp => {
      if (resp.ok) return resp.json()
      throw new Error('Failed to fetch event data.')
    })
    .then(objArray => {

      objArray.sort((a, b) => {
        return a.date.split("-").join("") - b.date.split("-").join("")
      })
      objArray.forEach(event => renderEvent(event))
    })
    .catch(err => alert(err.message))
}

function submitNewEvent(eventObj) {
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

function toggleAttending(e, eventObj) {
  if (eventDetails.querySelector('h3 span')) {
    eventDetails.querySelector('h3 span').remove()
  }

  const iconSpan = document.createElement('span');

  if (e.target.value === "interested") {
    iconSpan.textContent = ' ★'
    iconSpan.classList.add('interested')
    localStorage.setItem(eventObj.id, "1")
  } else if (e.target.value === "going") {
    iconSpan.textContent = ' ✔'
    iconSpan.classList.add('going')
    localStorage.setItem(eventObj.id, "2")
  } else if (e.target.value === "notgoing") {
    iconSpan.textContent = ' ✘'
    iconSpan.classList.add('notgoing')
    localStorage.setItem(eventObj.id, "3")
  }

  eventDetails.children[1].append(iconSpan)
}

function parseDate(dateString) {
  const split = dateString.split("-");
  const month = split[1];
  const day = split[2];
  const year = split[0];

  function getMonthStr(monthNum) {
    switch(monthNum) {
      case "01":
        return "January";
        break;
      case "02":
        return "February";
        break;
      case "03":
        return "March";
        break;
      case "04":
        return "April";
        break;
      case "05":
        return "May";
        break;
      case "06":
        return "June";
        break;
      case "07":
        return "July";
        break;
      case "08":
        return "August";
        break;
      case "09":
        return "September";
        break;
      case "10":
        return "October";
        break;
      case "11":
        return "November";
        break;
      case "12":
        return "December";
        break;
    }
  }
  return `${getMonthStr(month)} ${day}, ${year}`;
}

function genHostCode() {
  function getNum() {
    return Math.floor(Math.random() * 10);
  }
  function getLetter() {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let rIndex = Math.floor(Math.random() * 26);
    return alphabet[rIndex];
  }
  let hostCode = ""
  for (let i = 0; i < 3; i++) {
    hostCode += getNum()
  }
  for (let i = 0; i < 3; i++) {
    hostCode += getLetter()
  }
  return hostCode;
}

function validateEditor(e, eventObj) {
  e.preventDefault()
  const validate = prompt("What is your host code?", "abc123");
  if (validate !== eventObj.hostCode) return;
  editEvent(e, eventObj)
}

function editEvent(e, eventObj) {
  editModal.parentNode.classList.add('unhide')

  editForm.name.value = eventObj.name;
  editForm.date.value = eventObj.date;
  editForm.location.value = eventObj.location;
  editForm.desc.value = eventObj.description;
  editForm.image.value = eventObj.image;
  editForm.attendees = eventObj.attendees;

  editForm.addEventListener("submit", () => patchEvent(eventObj))
}

function patchEvent(eventObj) {
  const id = eventObj.id;

  const patched = {
    image: editForm.image.value,
    name: editForm.name.value,
    date: editForm.date.value,
    location: editForm.location.value,
    description: editForm.desc.value,
  }

  fetch(`${fetchUrl}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(patched)
  })
  .then(resp => {
    if (resp.ok) return resp.json()
    throw new Error('Failed to modify event data.')
  })
  .catch(err => alert(err.message))
}

//function call
getAllData()