// Fetch Data Function
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Pagination variables
let currentPage = 1;
const itemsPerPage = 6;

// Event Listeners
document.getElementById('peopleBtn').addEventListener('click', async () => {
    currentPage = 1; // Reset current page
    const people = await fetchData('https://swapi.dev/api/people/');
    displayList(people.results, 'people');
});

document.getElementById('filmsBtn').addEventListener('click', async () => {
    currentPage = 1; // Reset current page
    const films = await fetchData('https://swapi.dev/api/films/');
    displayList(films.results, 'films');
});

document.getElementById('planetsBtn').addEventListener('click', async () => {
    currentPage = 1; // Reset current page
    const planets = await fetchData('https://swapi.dev/api/planets/');
    displayList(planets.results, 'planets');
});

// Display List Function
function displayList(data, category) {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'row-cols-lg-3', 'g-3');

    for (let i = startIndex; i < endIndex; i++) {
        const item = data[i];
        const listItem = document.createElement('div');
        listItem.classList.add('col');
        listItem.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${item.name || item.title}</h5>
                </div>
            </div>
        `;
        listItem.addEventListener('click', async () => {
            const detailedInfo = await fetchData(item.url);
            displayDetails(detailedInfo, category);
        });
        gridContainer.appendChild(listItem);
    }

    dataContainer.appendChild(gridContainer);

    // Add pagination buttons
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination-container', 'mt-3');

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous Page';
    prevButton.classList.add('btn', 'btn-primary', 'me-2');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayList(data, category);
        }
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Page';
    nextButton.classList.add('btn', 'btn-primary');
    nextButton.disabled = endIndex >= data.length;
    nextButton.addEventListener('click', () => {
        if (endIndex < data.length) {
            currentPage++;
            displayList(data, category);
        }
    });
    paginationContainer.appendChild(nextButton);

    dataContainer.appendChild(paginationContainer);
}

// Display Details Function
function displayDetails(details, category) {
    const dataContainer = document.getElementById('dataContainer');

    if (category === 'people') {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerHTML = `
            <h5 class="card-title">${details.name}</h5>
            <p class="card-text">Age: ${details.birth_year}</p>
            <p class="card-text">Height: ${details.height} cm</p>
            <p class="card-text">Skin Color: ${details.skin_color}</p>
        `;
        card.appendChild(cardBody);
        dataContainer.appendChild(card);
    } else if (category === 'films') {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerHTML = `
            <h5 class="card-title">${details.title}</h5>
            <p class="card-text">Director: ${details.director}</p>
            <p class="card-text">Release Date: ${details.release_date}</p>
            <p class="card-text">Description: ${details.opening_crawl.substring(0, 100)}...</p>
        `;
        card.appendChild(cardBody);
        dataContainer.appendChild(card);
    } else if (category === 'planets') {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerHTML = `
            <h5 class="card-title">${details.name}</h5>
            <p class="card-text">Climate: ${details.climate}</p>
            <p class="card-text">Terrain: ${details.terrain}</p>
            <p class="card-text">Population: ${details.population}</p>
        `;
        card.appendChild(cardBody);
        dataContainer.appendChild(card);
    }
}
