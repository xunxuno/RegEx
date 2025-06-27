import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RegexTesterScreen } from './src/features/regexTester/presentation/screens/RegexTesterScreen';
import { useEffect } from 'react';
import { useRegexStore } from './src/features/regexTester/store/useRegexStore';

export default function App() {
  const initDatabase = useRegexStore((state) => state.initDatabase);

  useEffect(() => {
    initDatabase();
  }, []);
  return (
    <SafeAreaProvider>
      <RegexTesterScreen />
    </SafeAreaProvider>
  );
}
