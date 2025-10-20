import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { FavoritesProvider } from './contexts/FavoritesContext';

import PokedexScreen from './screens/PokedexScreen';
import DetailsScreen from './screens/DetailsScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Pokedex"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#dc143c',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Pokedex" 
            component={PokedexScreen} 
            options={{ title: 'Pokédex' }} 
          />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
            options={{ title: 'Detalhes do Pokémon' }} 
          />
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ title: 'Meus Favoritos' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}