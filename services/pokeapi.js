import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * @param {string} url 
 * @returns {Promise<{next: string | null, results: object[]}>}
 */
export const getPokemons = async (url = `${BASE_URL}/pokemon?limit=20`) => {
  try {
    const response = await axios.get(url);
    const { results, next } = response.data;

    const detailedResults = await Promise.all(
      results.map(async (pokemon) => {
        try {
          const detailsResponse = await axios.get(pokemon.url);
          return detailsResponse.data;
        } catch (error) {
          console.error(`Failed to fetch details for ${pokemon.name}:`, error);
          return { name: pokemon.name, id: null, sprites: { front_default: null } };
        }
      })
    );
    
    return { next, results: detailedResults };
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    if (error.response) {
      throw new Error(`Failed to load Pokémon list. Server responded with status ${error.response.status}`);
    }
    throw new Error("Failed to load Pokémon list. Check your network connection.");
  }
};

/**
 * @param {string | number} nameOrId 
 * @returns {Promise<object>}
 */
export const getPokemonDetails = async (nameOrId) => {
  if (!nameOrId) {
    throw new Error("Pokémon name or ID is required.");
  }
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${String(nameOrId).toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for Pokémon ${nameOrId}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error(`Pokémon "${nameOrId}" not found.`);
    }
    throw new Error(`Failed to find Pokémon "${nameOrId}".`);
  }
};