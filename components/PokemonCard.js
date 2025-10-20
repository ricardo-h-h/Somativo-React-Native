import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { capitalize } from '../utils/helpers';

export default function PokemonCard({ item, onPress }) {
  if (!item || !item.sprites) {
    return (
      <View style={[styles.card, styles.cardLoading]}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: item.sprites.front_default }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>
        {capitalize(item.name)}
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardLoading: {
    justifyContent: 'center',
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