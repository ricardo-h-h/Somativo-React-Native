import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import { capitalize } from '../utils/helpers';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>You have no favorite Pokémon yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Details', { pokemonName: item.name })}
        >
          <Image
            source={{ uri: item.sprites.front_default }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.name}>
            {capitalize(item.name)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 18,
    color: 'gray',
  },
  list: {
    padding: 5,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: 90,
    height: 90,
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});