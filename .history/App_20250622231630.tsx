import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RegexTesterScreen } from './src/features/regexTester/presentation/screens/RegexTesterScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <RegexTesterScreen />
    </SafeAreaProvider>
  );
}
