import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { KanjiCameraScreen } from './src/screens/KanjiCameraScreen';
import { DictionaryScreen } from './src/screens/DictionaryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AppSettingsProvider } from './src/context/AppSettingsContext';

enableScreens();

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppSettingsProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Camera" component={KanjiCameraScreen} />
            <Stack.Screen
              name="Dictionary"
              component={DictionaryScreen}
              options={{
                headerShown: true,
                headerTitle: 'Dictionary',
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#FFD700',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                headerTitle: 'Settings',
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#FFD700',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      </AppSettingsProvider>
    </GestureHandlerRootView>
  );
}

export default App;
