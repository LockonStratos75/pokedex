const pokemonArray = []; // Array to store each fetched Pokemon object

function clear1(divToClear) {
    const pokemonInfoContainer = document.getElementById(divToClear);
    while (pokemonInfoContainer.firstChild) {
        pokemonInfoContainer.removeChild(pokemonInfoContainer.firstChild);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const pokemonNameInput = document.getElementById('pokemonName').value;
    fetchPoke(pokemonNameInput);
}

async function fetchPoke(name) {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        const res = await fetch(url);
        const data = await res.json();

        const pokemon = {
            name: data.name,
            entry: data.id,
            weight: data.weight / 10,
            stats: data.stats,
            frontSprite: data.sprites['front_default'],
            backSprite: data.sprites['back_default'],
            type: new Set(data.types.map(type => type.type.name)),
        };

        console.log(pokemon);
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

    pokemonInfoContainer.appendChild(pokemonDiv);

    pokemonDiv.addEventListener('click', function () {
        clickDiv(pokemon);
    });
}

function clickDiv(pokemon) {
    const pokeName = pokemon.name;
    window.location.href = `details.html?pokemon=${pokeName}`;
}

// function showAll() {
//     clear1('pokemonInfo');
//     for (let i = 1; i <= 1008; i++) {
//         fetchPoke(i);
//     }
// }

async function showAll() {
    clear1('pokemonInfo');
    const promises = [];

    for (let i = 1; i <= 1008; i++) {
        promises.push(fetchPoke(i));
    }

    try {
        await Promise.all(promises);
        // All Pokemon data fetched successfully
        console.log("All Pokemon data loaded successfully!");
    } catch (error) {
        console.error("Error loading Pokemon data:", error);
        displayErrorMessage();
    }
}


// // Call showAll() to fetch and display all Pokemon
// showAll();
