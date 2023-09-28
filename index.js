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
const searchEvents = document.querySelector("#search")
const adminKey = '091123';

// Kat code
// helper functions
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
  const pDateAndTime = document.createElement("p")
  const pLocation = document.createElement("p")
  const pDescrip = document.createElement("p")

  h3 = document.createElement("h3")
  detailFooter = document.createElement("div")

  image.src = eventObj.image
  image.alt = eventObj.name

  pDateAndTime.textContent = `${parseDate(eventObj.date)} - ${eventObj.start} to ${eventObj.end}`
  
  pLocation.textContent = eventObj.location
  pDescrip.textContent = eventObj.description

  h3.textContent = eventObj.name
  detailFooter.setAttribute("class", "detail-footer")

  eventDetails.append(image, h3, pLocation, pDateAndTime, pDescrip, detailFooter)
  eventDetails.parentNode.classList.add('unhide')
}

// display attend dropdown
function displayDetailsLabel(e, eventObj) {
  const label = document.createElement("label") 
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
  attendSpan.textContent = personVsPeople(eventObj)
  
  dropdown.addEventListener("change", e => {
    toggleAttending(e, eventObj)
    if (e.target.value === "going") updateAttending(eventObj)
  })
  
  dropdown.append(select, interested, going, notgoing)
  label.append(dropdown)
  detailFooter.append(label, attendSpan)
}

// check local storage for attend status
function checkLocalStorage(e, eventObj) {
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

    let currentId = eventObj.id;

    h3.append(iconSpan)
  }
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
  eventCard.setAttribute("card-id", eventObj.id)
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
  if (validateFormData([e.target.image.value, e.target.name.value, e.target.date.value, e.target.start.value, e.target.end.value, e.target.location.value, e.target.desc.value])) {
    const eventObj = {
      image: eventForm.image.value,
      name: eventForm.name.value,
      date: eventForm.date.value,
      start: eventForm.start.value,
      end: eventForm.end.value,
      location: eventForm.location.value,
      description: eventForm.desc.value,
      hostCode: genHostCode(),
      attendees: 0
    }
    debugger
    submitNewEvent(eventObj);
    alert(`Thanks for submitting your event! Your host code is ${eventObj.hostCode}. You need this code if you want to edit your event. Thanks!`);
    modalBox.classList.remove('unhide');
    eventForm.reset();
  } else {
    alert("Please complete event submission.")
  }
}

// sort incoming events by date before display
const sortByDate = (a, b) => {
  return a.date.split("-").join("") - b.date.split("-").join("")
}

const stickyHeader = (e) => {
  const sticky = document.querySelector("#buttonDiv")
  const space = document.querySelector("#headingDiv").offsetHeight
  if (window.scrollY > space) {
    sticky.classList.add("sticky");
  } else {
    sticky.classList.remove("sticky");
  }
}

const searchByKeyword = (e) => {
  e.preventDefault()
  const keyword = e.target.search.value
  getAllData(keyword)
  eventsContainer.innerHTML = ""
}

// event listener for scroll
window.addEventListener("scroll", e => stickyHeader(e))

// event listener for search
searchEvents.addEventListener("submit", e => searchByKeyword(e))



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
// function getAllData() {
//   fetch(fetchUrl)
//     .then(resp => {
//       if (resp.ok) return resp.json()
//       throw new Error('Failed to fetch event data.')
//     })
//     .then(objArray => {
//       objArray.sort((a, b) => sortByDate(a, b))
//       objArray.forEach(event => renderEvent(event))
//     })
//     .catch(err => alert(err.message))
// }

const sortAndIterate = (objArray) => {
  objArray.sort((a, b) => sortByDate(a, b))
  objArray.forEach(event => renderEvent(event))
}

const filterSearch = (keyword, objArray) => {
  if (!keyword) return objArray // If no keyword, return the original array

  const filtered = objArray.filter(obj => {
    return obj.name && obj.name.toLowerCase().includes(keyword) ||
      obj.location && obj.location.toLowerCase().includes(keyword) ||
      obj.description && obj.description.toLowerCase().includes(keyword)
  })
  sortAndIterate(filtered)
}

function getAllData(keyword) {
  fetch(fetchUrl)
    .then(resp => {
      if (resp.ok) return resp.json()
      throw new Error('Failed to fetch event data.')
    })
    .then(objArray => {
      if(keyword) {
        filterSearch(keyword, objArray)
      } else {
        sortAndIterate(objArray)
      }
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

  let currentId = eventObj.id;
  let target = document.querySelector(`div#eventsContainer [card-id="${currentId}"] h3`);
  if (target.querySelector('span') !== null) target.querySelector('span').remove();

  //THIS!!! THIS! DYAAAAAAH! Apparently target.append(element) will REMOVE
  //the original element and append it elsewhere. Had to create a clone of the iconSpan
  //and append THAT. Blaaaah....
  let iconSpan2 = iconSpan.cloneNode(true);
  target.insertAdjacentElement('beforeend', iconSpan2)

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
  if (validate === eventObj.hostCode || validate === adminKey) {
    editEvent(e, eventObj)
  }
}

function editEvent(e, eventObj) {
  editModal.parentNode.classList.add('unhide')

  editForm.name.value = eventObj.name;
  editForm.date.value = eventObj.date;
  editForm.start.value = eventObj.start;
  editForm.end.value = eventObj.end;
  editForm.location.value = eventObj.location;
  editForm.desc.value = eventObj.description;
  editForm.image.value = eventObj.image;

  editForm.addEventListener("submit", (e) => patchEvent(e, eventObj))
}

function patchEvent(e, eventObj) {
  e.preventDefault()
  const id = eventObj.id;
  
  if (validateFormData([editForm.image.value, editForm.name.value, editForm.date.value, editForm.location.value, editForm.desc.value])) {
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
  .then(patchedObj => {
      displayDetails(e, patchedObj)
      editModal.parentNode.classList.remove('unhide')
      editForm.reset();
      //ADDED THIS LINE!!!
      eventObj = Object.assign(eventObj, patched)
    })
    .catch(err => alert(err.message))
  } else {
    alert("Please finish editing event.")
  }
}

const quotes = [['The real voyage of discovery consists not in seeking new landscapes but in having new eyes.', '-Marcel Proust'], ['It is only with the heart that one can see rightly.', '-Antoine de Saint-Exupery'], ['There is some good in this world, and it’s worth fighting for.', '-J.R.R. Tolkien'], ['Beware; for I am fearless, and therefore powerful.', '-Mary Shelley'], ['The only way out of the labyrinth of suffering is to forgive.', '-John Green'], ['We accept the love we think we deserve.', '-Stephen Chobosky'], ['There are years that ask questions and years that answer.', '-Zora Neale Hurston'], ['It is nothing to die; it is dreadful not to live.', '-Victor Hugo'], ['Why, sometimes, I’ve believed as many as six impossible things before breakfast.', '-Lewis Carroll'], ['It is our choices, Harry, that show what we truly are, far more than our abilities.', '-J.K. Rowling'], ['There are some things you learn best in calm, and some in storm.', '-Willa Cather'], ['The world breaks everyone, and afterward, many are strong at the broken places.', '-Ernest Hemingway'], ['It doesn’t matter who you are or what you look like, so long as somebody loves you.', '-Roald Dahl'], ['And, when you want something, all the universe conspires in helping you to achieve it.', '-Paolo Cohelo'], ['There is always something left to love.', '-Gabriel Garcia Marquez'], ['Love is the longing for the half of ourselves we have lost.', '-Milan Kundera'], ['For you, a thousand times over.', '-Khaled Hosseini'], ['All human wisdom is summed up in these two words – \‘Wait and hope.', '-Alexandre Dumas'], ['What does the brain matter compared with the heart?', '-Virginia Woolf'], ['‘But man is not made for defeat,’ he said. ‘A man can be destroyed but not defeated.\'', '-Ernest Hemingway'], ['If we are honest, we can evolve.', '-Wendy Parr'], ['The only thing necessary for the triumph of evil is for good men to do nothing.', '-Edmund Burke'], ['The future doesn\'t belong to the fainthearted; it belongs to the brave.', '-Ronald Reagan'], ['The harder you work, the luckier you get.', '-Neil Donat'], ['Do or do not. There is no try.', '-Master Yoda']];
const quote = document.querySelector('h3#quote');
const author = document.querySelector('p#author');

function genRandomQuote() {
  const rIndex = Math.floor(Math.random() * 25);
  quote.textContent = quotes[rIndex][0];
  author.textContent = quotes[rIndex][1]
}

genRandomQuote();

//function call
getAllData();