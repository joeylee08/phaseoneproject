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
const displayDetails = (e, eventObj) => {
  eventDetails.innerHTML = "";
  const image = document.createElement("img")

  image.src = eventObj.image
  image.alt = eventObj.name
  const h3 = document.createElement("h3")
  h3.textContent = eventObj.name
  const pDateLoc = document.createElement("p")
  pDateLoc.textContent = `${parseDate(eventObj.date)}, ${eventObj.location}`
  const pDescrip = document.createElement("p")
  pDescrip.textContent = eventObj.description
  const detailFooter = document.createElement("div")
  detailFooter.setAttribute("class", "detail-footer")

  // attending drop down
  const label = document.createElement("label")
  label.setAttribute("name", "attending")
  const dropdown = document.createElement("select")
  dropdown.setAttribute("name", "attending")
  const select = document.createElement("option")
  select.setAttribute("value", "")
  select.textContent = "Select One"
  const interested = document.createElement("option")
  interested.setAttribute("value", "interested")
  interested.textContent = "Interested"
  const going = document.createElement("option")
  going.setAttribute("value", "going")
  going.textContent = "Going"
  const notgoing = document.createElement("option")
  notgoing.setAttribute("value", "notgoing")
  notgoing.textContent = "Not Interested"

  dropdown.append(select, interested, going, notgoing)

  if (localStorage.getItem(eventObj.id) !== 0) {
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
  attendSpan.textContent = `${eventObj.attendees} people attending`

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
  const eventCard = document.createElement("div")
  eventCard.setAttribute("class", "card")
  const image = document.createElement("img")
  image.src = eventObj.image
  image.alt = eventObj.name
  const h3 = document.createElement("h3")
  h3.textContent = eventObj.name
  eventCard.append(image, h3)

  localStorage.setItem(eventObj.id, "0")

  eventCard.addEventListener("click", (e) => displayDetails(e, eventObj))

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
    attendSpan.textContent = `${updatedEvent.attendees} people attending`
  })
  .catch(err => alert(err.message))
}

const validateFormData = (valuesArr) => {
  return valuesArr.every(el => el.trim() !== "")
}

const createNewEventObj = (e) => {
  if(validateFormData([e.target.image.value, e.target.name.value, e.target.date.value, e.target.location.value, e.target.desc.value])) {
    const eventObj = {
      image: eventForm.image.value,
      name: eventForm.name.value,
      date: eventForm.date.value,
      location: eventForm.location.value,
      description: eventForm.desc.value,
      attendees: 0
    }
    submitNewEvent(eventObj);
    alert("Thanks for submitting your event!");
    modalBox.classList.remove('unhide');
    eventForm.reset();
  } else {
    alert("Please complete event submission.")
  }
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
    .then(objArray => objArray.forEach(event => renderEvent(event)))
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


//function call
getAllData()