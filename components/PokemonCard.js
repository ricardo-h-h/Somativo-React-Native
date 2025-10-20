import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function PokemonCard({ item, onPress }) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(item.url);
        setPokemonData(response.data);
      } catch (error) {
        console.error(`Erro ao buscar dados para ${item.name}:`, error);
      }
    };
    fetchPokemonData();
  }, [item.url]);

  if (!pokemonData) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: pokemonData.sprites.front_default }}
        style={styles.image}
      />
      <Text style={styles.name}>
        {pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  image: {
    width: 90,
    height: 90,
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});