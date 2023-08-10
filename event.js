    const categoryFilter = document.getElementById("categoryFilter");
    const priceSort = document.getElementById("priceSort");
    const eventCards = document.getElementById("eventCards");

    async function fetchEvents() {
        try {
            const response = await fetch("https://event-management-mock.onrender.com/events");
            if (response.ok) {
                const eventData = await response.json();
                return eventData;
            } else {
                console.error("Failed to fetch events");
                return [];
            }
        } catch (error) {
            console.error("An error occurred:", error);
            return [];
        }
    }

    function renderEventCards(events) {
        eventCards.innerHTML = "";

        events.forEach(event => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${event.poster}" alt="${event.name}" class="card-image">
                <div class="card-details">
                    <h3>${event.name}</h3>
                    <p>Date: ${event.date}</p>
                    <p>Location: ${event.location}</p>
                    <p>Category: ${event.category}</p>
                    <p>Price: $${event.price}</p>
                </div>
            `;

            eventCards.appendChild(card);
        });
    }

    async function displayEvents() {
        const events = await fetchEvents();

        const selectedCategory = categoryFilter.value;
        const filteredEvents = selectedCategory === "All"
            ? events
            : events.filter(event => event.category === selectedCategory);

        
        const selectedSort = priceSort.value;
        if (selectedSort === "Ascending") {
            filteredEvents.sort((a, b) => a.price - b.price);
        } else if (selectedSort === "Descending") {
            filteredEvents.sort((a, b) => b.price - a.price);
        }

        renderEventCards(filteredEvents);
    }

    categoryFilter.addEventListener("change", displayEvents);
    priceSort.addEventListener("change", displayEvents);

 
    displayEvents();
