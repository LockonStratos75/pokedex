const pokemonArray = []; // Array to store each fetched Pokemon object

function clear1(divToClear) {
    const pokemonInfoContainer = document.getElementById(divToClear);
    while (pokemonInfoContainer.firstChild) {
        pokemonInfoContainer.removeChild(pokemonInfoContainer.firstChild);
    }

}

function handleFormSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('pokemonName').value;
    const pokemonNameInput = input.toLowerCase();
    fetchPoke(pokemonNameInput);
}

async function fetchPoke(name) {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        const res = await fetch(url);
        const data = await res.json();

        // Fetch Pokemon details by name to get the region information
        const detailsRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        const detailsData = await detailsRes.json();


        const pokemon = {
            name: data.name,
            entry: data.id,
            weight: data.weight / 10,
            stats: data.stats,
            frontSprite: data.sprites['front_default'],
            backSprite: data.sprites['back_default'],
            type: new Set(data.types.map(type => type.type.name)),
            region: detailsData.generation.name, // Extracting region information
        };

        // console.log(pokemon);
        pokemonArray.push(pokemon); // Add the Pokemon object to the array
        displayPokemonInfo(pokemon);
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage();
    }
}

function displayPokemonInfo(pokemon) {
    const pokemonInfoContainer = document.getElementById('pokemonInfo');

    const pokemonDiv = document.createElement('div');
    pokemonDiv.id = 'pokeDiv';
    pokemonDiv.classList.add('pokeDiv', 'fade-in');

    const sprite = document.createElement("img");
    sprite.classList.add('sprite');
    sprite.src = `https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`; // HD
    pokemonDiv.appendChild(sprite);

    const entryElement = document.createElement('p');
    entryElement.textContent = `#${pokemon.entry}`;
    pokemonDiv.appendChild(entryElement);

    const nameElement = document.createElement('h2');
    nameElement.textContent = pokemon.name;
    pokemonDiv.appendChild(nameElement);

    const typeContainer = document.createElement('div');
    typeContainer.classList.add('type-container');
    for (const type of pokemon.type) {
        const typeIcon = document.createElement('img');
        typeIcon.src = `assets/${type}.svg`;
        typeIcon.alt = type;
        typeContainer.appendChild(typeIcon);
    }
    pokemonDiv.appendChild(typeContainer);

    const weightElement = document.createElement('p');
    weightElement.textContent = `${pokemon.weight} kg`;
    pokemonDiv.appendChild(weightElement);

    const regionElement = document.createElement('p');
    regionElement.textContent = `Region: ${pokemon.region}`;
    pokemonDiv.appendChild(regionElement);

    pokemonInfoContainer.appendChild(pokemonDiv);

    pokemonDiv.addEventListener('click', function () {
        clickDiv(pokemon);
    });
}

function clickDiv(pokemon) {
    const pokeName = pokemon.name;
    window.location.href = `details.html?pokemon=${pokeName}`;
}

function createFilterButtons() {
    // Get all buttons with the class 'hidden-buttons'
    const hiddenButtons = document.querySelectorAll('.hidden-buttons');
    const otherElements = document.querySelectorAll('.btn, input');

    // Remove the 'hidden-buttons' class from each button
    hiddenButtons.forEach(button => button.classList.remove('hidden-buttons'));
    otherElements.forEach(button => button.classList.add('hidden-buttons'));
}



async function showAll() {
    createFilterButtons();
    clear1('pokemonInfo');
    const pokemonData = [];

    for (let i = 1; i <= 1008; i++) {
        const data = await fetchPoke(i);
        pokemonData.push(data);
    }

    // Now, pokemonData contains the data for all Pokémon in the correct order.
    console.log("All Pokemon data loaded successfully!");


    // You can display the data or perform other operations here.
    // For example, if you want to display the data:
    displayPokemonInfo(pokemonData);
}

function toggleMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    hamburgerMenu.classList.toggle('active');
}


function filterByRegion(generation) {
    clear1('pokemonInfo');
    const filteredPokemon = pokemonArray.filter(pokemon => pokemon.region.toLowerCase() === generation.toLowerCase());
    filteredPokemon.forEach(displayPokemonInfo);
}







