import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KanjiCameraScreen } from './src/screens/KanjiCameraScreen';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KanjiCameraScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
