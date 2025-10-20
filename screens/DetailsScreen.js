import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getPokemonDetails } from '../services/pokeapi';
import { useFavorites } from '../contexts/FavoritesContext';

export default function DetailsScreen({ route }) {
  const { pokemonName } = route.params; 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getPokemonDetails(pokemonName);
        setDetails(data);
        setError(null);
      } catch (err) {
        setError("Pokémon não encontrado ou falha na rede.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [pokemonName]); 

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }
  
  const isFav = details ? isFavorite(details.id) : false;

  const handleFavoritePress = () => {
    if (!details) return;
    if (isFav) {
      removeFavorite(details.id);
    } else {
      const simplifiedPokemon = {
        id: details.id,
        name: details.name,
        sprites: { front_default: details.sprites.front_default }
      };
      addFavorite(simplifiedPokemon);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: details.sprites.front_default }} 
        style={styles.image} 
      />
      <Text style={styles.name}>{details.name.charAt(0).toUpperCase() + details.name.slice(1)}</Text>
      <Text style={styles.detailText}>Nº: {details.id}</Text>
      <Text style={styles.detailText}>Tipos: {details.types.map(t => t.type.name).join(', ')}</Text>
      <Text style={styles.detailText}>Habilidades: {details.abilities.map(a => a.ability.name).join(', ')}</Text>
      
      <TouchableOpacity onPress={handleFavoritePress} style={[styles.button, isFav ? styles.unfavoriteButton : styles.favoriteButton]}>
        <Text style={styles.buttonText}>{isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'red',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  favoriteButton: {
    backgroundColor: '#3b4cca',
  },
  unfavoriteButton: {
    backgroundColor: '#ffcb05',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});