import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * @param {string} url
 * @returns {Promise<object>}
 */
export const getPokemons = async (url = `${BASE_URL}/pokemon?limit=20`) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar lista de Pokémon:", error);
    throw new Error("Não foi possível carregar a lista de Pokémon.");
  }
};

/**
 * @param {string | number} nameOrId 
 * @returns {Promise<object>}
 */
export const getPokemonDetails = async (nameOrId) => {
  if (!nameOrId) {
    throw new Error("Nome ou ID do Pokémon é necessário.");
  }
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${String(nameOrId).toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do Pokémon ${nameOrId}:`, error);
    throw new Error("Pokémon não encontrado.");
  }
};