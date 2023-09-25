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
  pDateLoc.textContent = `${parseDate(eventObj.date)}, ${eventObj.location}`
  const pDescrip = document.createElement("p")
  pDescrip.textContent = eventObj.description

  // attending drop down
  const label = document.createElement("label")
  // dropdown.setAttribute("for", "attending")
  const dropdown = document.createElement("select")
  dropdown.setAttribute("name", "attending")
  const select = document.createElement("option")
  select.setAttribute("value", "")
  select.textContent = "Select one"
  const interested = document.createElement("option")
  interested.setAttribute("value", "interested")
  interested.textContent = "Interested"
  const going = document.createElement("option")
  going.setAttribute("value", "going")
  going.textContent = "Going"
  const notgoing = document.createElement("option")
  notgoing.setAttribute("value", "notgoing")
  notgoing.textContent = "Not interested"
  dropdown.append(select, interested, going, notgoing)

  dropdown.addEventListener("change", e => toggleAttending(e))

  eventDetails.append(image, h3, pDateLoc, pDescrip, label, dropdown)
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

function toggleAttending(e) {
  e.target.parentElement.querySelector('span').remove()

  const iconSpan = document.createElement('span');

  if (e.target.value === "interested") {
    icon.textContent = '★'
    icon.classList.add('interested')
  } else if (e.target.value === "going") {
    icon.textContent = '✔'
    icon.classList.add('going')
  } else if (e.target.value === "not going") {
    icon.textcontent = '✘'
    icon.classList.add('notGoing')
  } else {
    return;
  }

  e.target.parentElement.children[1].append(iconSpan)
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

//function call
getAllData()