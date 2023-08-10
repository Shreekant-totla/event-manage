const eventListTable = document.getElementById("eventListTable");
const createEventForm = document.getElementById("createEventForm");
const logoutButton = document.getElementById("logoutButton");

const token = localStorage.getItem("token");
if(!token){
    window.location.href = "index.html";
}

const events = [];

async function fetchEvents() {
    try {
        const response = await fetch ("https://event-management-mock.onrender.com/events",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response.ok){
            const eventData = await response.json();
            return eventData;
        }else{
            console.log("Failed to fetch event details");
            return [];
        }
    } catch (error) {
        console.log("error occurred:", error);
        return [];
    }
}

function renderEventList(){
    eventListTable.innerHTML=" ";
    events.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML=`
        <td>${event.name}</td>
        <td>${event.date}</td>
        <td>${event.location}</td>
        <td>${event.category}</td>
        <td>${event.price}</td>
        <td><button class="editButton" data-id="${event.id}">Edit</button></td>
        <td><button class="deleteButton" data-id="${event.id}">Delete</button></td>
        `;
        eventListTable.appendChild(row);
    });
}

async function deleteEvent(eventId) {
    try {
        const response = await fetch (`https://event-management-mock.onrender.com/events/${eventId}`,{
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response.ok){
            events.splice(events.findIndex (event => event.id === eventId),1);
            renderEventList();
        }else{
            console.log("Failed to delete event");
        }
    } catch (error) {
        console.log("error occurred",error)
    }
}

async function editEvent(eventId,eventData) {
    try {
        const response = await fetch (`https://event-management-mock.onrender.com/events/${eventId}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });

        if(response.ok){
           const updatedEvent = await response.json();
           const eventIndex = events.findIndex(event => event.id.toString() === eventId);
           events[eventIndex] = updatedEvent;
           renderEventList();
           fetchAndRenderEvent();
        }else{
            console.log("Failed to edit event");
        }
    } catch (error) {
        console.log("error occurred",error)
    }
}

createEventForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const poster = createEventForm.poster.value;
    const eventName = createEventForm.eventName.value;
    const eventDescription = createEventForm.eventDescription.value;
    const eventDate = createEventForm.eventDate.value;
    const eventLocation = createEventForm.eventLocation.value;
    const eventCategory = createEventForm.eventCategory.value;
    const eventPrice = parseFloat(createEventForm.eventPrice.value);

    const newEvent = {
        poster,
        name: eventName,
        description: eventDescription,
        date: eventDate,
        location: eventLocation,
        category: eventCategory,
        price: eventPrice
    };

    try {
        const response = await fetch("https://event-management-mock.onrender.com/events",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newEvent)
        });

        if(response.ok){
            const createdEvent = await response.json();
            events.push(createdEvent);
            console.log("success")
            renderEventList();
            createEventForm.reset();
        }else{
            console.log("Failed to create event")
        }
    } catch (error) {
        console.log("error occurred", error);
    }
})

eventListTable.addEventListener("click", function(e){
    const target = e.target;
    if(target.classList.contains('editButton')){
        const eventId = target.getAttribute("data-id");
        const eventToEdit = events.find(event => event.id.toString() === eventId)
        openEditForm(eventToEdit);
    }else if (target.classList.contains("deleteButton")) {
        const eventId = target.getAttribute("data-id");
        deleteEvent(eventId)
    }
})

logoutButton.addEventListener("click", function() {
    localStorage.removeItem("token");
    window.location.href = "index.html"
})

async function fetchAndRenderEvent() {
    events.length = 0;
    const eventData = await fetchEvents();
    events.push(...eventData);
    renderEventList();
}

function openEditForm(eventToEdit) {
    const editForm = document.getElementById("createEventForm");
    const poster = document.getElementById("poster");
    const eventName = document.getElementById("eventName");
    const eventDescription = document.getElementById("eventDescription");
    const eventDate = document.getElementById("eventDate");
    const eventLocation = document.getElementById("eventLocation");
    const eventCategory = document.getElementById("eventCategory");
    const eventPrice = document.getElementById("eventPrice");
    const submitButton = document.getElementById("submitButton");

    if (!eventToEdit) {
        createEventForm.reset();
        submitButton.textContent = "Create Event";
        return;
    }

    
    poster.value = eventToEdit.poster || "";
    eventName.value = eventToEdit.name || "";
    eventDescription.value = eventToEdit.description || "";
    eventDate.value = eventToEdit.date || "";
    eventLocation.value = eventToEdit.location || "";
    eventCategory.value = eventToEdit.category || "";
    eventPrice.value = eventToEdit.price || "";

    
    submitButton.textContent ="Save Changes";

 
    submitButton.addEventListener("click", async function(event) {
        event.preventDefault();

        const updatedEvent = {
            poster: poster.value,
            name: eventName.value,
            description: eventDescription.value,
            date: eventDate.value,
            location: eventLocation.value,
            category: eventCategory.value,
            price: parseFloat(eventPrice.value)
        };

        await editEvent(eventToEdit.id, updatedEvent);
        
        createEventForm.reset();
        submitButton.textContent = "Create Event";
    });
    fetchAndRenderEvent()
}

fetchAndRenderEvent()