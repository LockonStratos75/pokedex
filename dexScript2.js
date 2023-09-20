// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the value of the 'pokemon' parameter
const pokeName = urlParams.get('pokemon');

// Use the pokeName variable as needed
console.log(pokeName); // Print the value to the console
console.log(window.location.href);

// Check if the name is present
if (pokeName) {
    const pokemonName = pokeName.toLowerCase();

    // Fetch Pokémon details from PokeAPI
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((response) => response.json())
        .then((data) => {
            // Access the desired details from the fetched data
            const pokemonDetails = {
                name: data.name,
                id: data.id,
                height: data.height,
                weight: data.weight,
                types: data.types.map((type) => type.type.name),
                abilities: data.abilities.map((ability) => ability.ability.name),
                stats: data.stats.map((stat) => ({
                    name: stat.stat.name,
                    value: stat.base_stat,
                })),
            };

            // Fetch Pokémon species details from PokeAPI
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
                .then((response) => response.json())
                .then((speciesData) => {
                    // Access the desired details from the fetched species data
                    const speciesFlavorTextEntries = speciesData.flavor_text_entries.filter(
                        (entry) => entry.language.name === 'en'
                    );

                    // Find the longest flavor text entry
                    let longestFlavorEntry = '';
                    speciesFlavorTextEntries.forEach((entry) => {
                        const flavorText = entry.flavor_text.replace(/\r?\n|\r/g, ' ').trim();
                        if (flavorText.length > longestFlavorEntry.length) {
                            longestFlavorEntry = flavorText;
                        }
                    });
                    // Create the meta tag element
                    var meta = document.createElement('meta');

// Set the attributes for the meta tag
                    meta.setAttribute('name', 'viewport');
                    meta.setAttribute('content', 'width=device-width, initial-scale=1.0');

// Append the meta tag to the head element
                    document.head.appendChild(meta);

                    // Get the longest flavor text entry
                    const description = longestFlavorEntry;

                    // Display Pokémon details in the HTML
                    const pokedexContainer = document.getElementById('pokedex-container');
                    pokedexContainer.classList.add('pokedex-container');

                    // Create a heading for the Pokémon name
                    const nameHeading = document.createElement('h2');
                    nameHeading.textContent = pokemonDetails.name;
                    pokedexContainer.appendChild(nameHeading);

                    const sprite = document.createElement('img');
                    sprite.classList.add('sprite-detail');
                    sprite.src = "https://img.pokemondb.net/artwork/large/" + pokemonDetails.name + ".jpg"; //hd
                    pokedexContainer.appendChild(sprite);

                    const idItem = document.createElement("p");
                    idItem.textContent = `#${pokemonDetails.id}`;
                    pokedexContainer.appendChild(idItem);


                    const typesContainer = document.createElement('div');
                    typesContainer.classList.add('pokemon-types');

                    pokemonDetails.types.forEach((type) => {
                        const typeSpan = document.createElement('span');
                        typeSpan.classList.add('type', type);
                        typeSpan.textContent = type;
                        typesContainer.appendChild(typeSpan);
                    });

                    pokedexContainer.appendChild(typesContainer);

                    const descriptionParagraph = document.createElement('p');
                    descriptionParagraph.textContent = formatDescription(description);
                    descriptionParagraph.classList.add('description');
                    descriptionParagraph.style.maxWidth = '300px';
                    pokedexContainer.appendChild(descriptionParagraph);

                    const heightWeightItem = document.createElement("p");
                    const spaces = "\u00A0".repeat(10); // Add 5 non-breaking spaces

                    heightWeightItem.innerHTML = `<strong>Height:</strong> ${pokemonDetails.height*10}cm${spaces}<strong>Weight:</strong> ${pokemonDetails.weight / 10}kg`;
                    pokedexContainer.appendChild(heightWeightItem);


                    // Create an unordered list for the Pokémon details
                    const detailsList = document.createElement('ul');

                    // Add stats to the details list
                    const statsHeading = document.createElement('h3');
                    statsHeading.textContent = 'STATS';
                    detailsList.appendChild(statsHeading);

                    const statsGrid = document.createElement('div');
                    statsGrid.classList.add('stats-grid');
                    pokemonDetails.stats.forEach((stat) => {
                        const statItem = document.createElement('div');
                        statItem.classList.add('stats-item');

                        const statLabel = document.createElement('span');
                        statLabel.classList.add('stats-label');
                        statLabel.textContent = stat.name;
                        statItem.appendChild(statLabel);

                        const statBar = document.createElement('div');
                        statBar.classList.add('stats-bar');

                        const statBarFill = document.createElement('div');
                        statBarFill.classList.add('stats-bar-fill', stat.name.toLowerCase());
                        statBarFill.style.width = `${stat.value / 2}%`;
                        statBarFill.style.width = `${stat.value / 2}%`;
                        statBar.appendChild(statBarFill);

                        statItem.appendChild(statBar);

                        const statValue = document.createElement('span');
                        statValue.classList.add('stats-value');
                        statValue.textContent = stat.value;
                        statItem.appendChild(statValue);

                        statsGrid.appendChild(statItem);
                    });
                    detailsList.appendChild(statsGrid);

                    // Add the details list to the pokedex container
                    pokedexContainer.appendChild(detailsList);

                    // Create a back button
                    const backButton = document.createElement('button');
                    backButton.textContent = 'Back';
                    backButton.classList.add('back');
                    backButton.addEventListener('click', () => {
                        window.history.back();
                    });
                    pokedexContainer.appendChild(backButton);
                })
                .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
}

// Function to create and format list items for Pokémon details
function createListItem(label, value) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
    listItem.classList.add('details-list');
    return listItem;
}

// Function to format the description text
function formatDescription(description) {
    // Remove line breaks and excess whitespace
    const trimmedDescription = description.replace(/\r?\n|\r/g, ' ').trim();
    // Capitalize the first letter
    return trimmedDescription.charAt(0).toUpperCase() + trimmedDescription.slice(1);
}