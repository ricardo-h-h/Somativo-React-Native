import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, TextInput, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getPokemons } from '../services/pokeapi';
import PokemonCard from '../components/PokemonCard';

export default function PokedexScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const loadPokemons = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPokemons(url);
      setPokemons(prev => (url ? [...prev, ...data.results] : data.results));
      setNextUrl(data.next);
    } catch (err) {
      setError("Falha ao carregar Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemons();
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('Details', { pokemonName: searchText.trim() });
    }
  };

  const renderFooter = () => {
    if (loading) return <ActivityIndicator style={{ marginVertical: 20 }} size="large" />;
    if (nextUrl) {
      return (
        <View style={styles.buttonContainer}>
          <Button title="Carregar Mais" onPress={() => loadPokemons(nextUrl)} color="#ffcb05" />
        </View>
      );
    }
    return null;
  };

  if (loading && !pokemons.length) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome ou número"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <Button title="Buscar" onPress={handleSearch} color="#3b4cca" />
      </View>
      
      <TouchableOpacity 
        style={styles.favoritesButton} 
        onPress={() => navigation.navigate('Favorites')}>
        <Text style={styles.favoritesButtonText}>Ver Favoritos</Text>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        numColumns={2}
        renderItem={({ item }) => (
          <PokemonCard 
            item={item} 
            onPress={() => navigation.navigate('Details', { pokemonName: item.name })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginRight: 10 },
  errorText: { textAlign: 'center', color: 'red', margin: 10 },
  buttonContainer: { margin: 20 },
  favoritesButton: { backgroundColor: '#3b4cca', padding: 10, marginHorizontal: 10, marginBottom: 10, borderRadius: 5 },
  favoritesButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
});