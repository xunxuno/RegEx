import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegexTesterScreen } from '../../regexTester/presentation/screens/RegexTesterScreen';
import { RegexHistoryScreen } from '../../regexTester/presentation/screens/RegexHistoryScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

type RootStackParamList = {
  RegexTester: { pattern?: string };
  RegexHistory: undefined;
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RegexTester">
        <Stack.Screen
          name="RegexTester"
          component={RegexTesterScreen}
          options={{ title: 'Probador de Regex' }}
        />
        <Stack.Screen
          name="RegexHistory"
          component={RegexHistoryScreen}
          options={{ title: 'Historial' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
