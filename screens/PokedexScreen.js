import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, TextInput, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/pokeapi';
import PokemonCard from '../components/PokemonCard';

export default function PokedexScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const loadPokemons = async (url, loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getPokemons(url);
      setPokemons(prev => (loadMore ? [...prev, ...data.results] : data.results));
      setNextUrl(data.next);
    } catch (err) {
      setError(err.message);
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPokemons();
  }, []);

  const handleSearch = async () => {
    const query = searchText.trim();
    if (!query) return;

    setIsSearching(true);
    try {
      await getPokemonDetails(query);
      navigation.navigate('Details', { pokemonName: query });
    } catch (err) {
      Alert.alert("Search Error", err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const renderFooter = () => {
    if (loadingMore) return <ActivityIndicator style={{ marginVertical: 20 }} size="large" />;
    if (nextUrl && !searchText) {
      return (
        <View style={styles.buttonContainer}>
          <Button title="Load More" onPress={() => loadPokemons(nextUrl, true)} color="#ffcb05" />
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
          placeholder="Search by name or number"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Button title={isSearching ? "..." : "Search"} onPress={handleSearch} color="#3b4cca" disabled={isSearching} />
      </View>
      
      <TouchableOpacity 
        style={styles.favoritesButton} 
        onPress={() => navigation.navigate('Favorites')}>
        <Text style={styles.favoritesButtonText}>View Favorites</Text>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={pokemons}
        keyExtractor={(item, index) => `${item.id}-${item.name}-${index}`}
        numColumns={2}
        renderItem={({ item }) => (
          <PokemonCard 
            item={item} 
            onPress={() => navigation.navigate('Details', { pokemonName: item.name })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        ListFooterComponent={renderFooter}
        onEndReached={() => nextUrl && !loadingMore && loadPokemons(nextUrl, true)}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', padding: 10, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginRight: 10, height: 40 },
  errorText: { textAlign: 'center', color: 'red', margin: 10 },
  buttonContainer: { margin: 20 },
  favoritesButton: { backgroundColor: '#3b4cca', padding: 10, marginHorizontal: 10, marginVertical: 5, borderRadius: 5 },
  favoritesButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
});