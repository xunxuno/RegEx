import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RegexTesterScreen } from '../../regexTester/presentation/screens/RegexTesterScreen';
import { RegexHistoryScreen } from '../../regexTester/presentation/screens/RegexHistoryScreen';
import { InfoScreen } from '../../regexTester/presentation/screens/InfoScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';


// Tipo que define los parámetros de las rutas de navegación.
export type RootStackParamList = {
  RegexTester: { pattern?: string; testText?: string };
  RegexHistory: undefined;
  Info: undefined;
};
// Crea una instancia del navegador tipo Drawer
const Drawer = createDrawerNavigator();
// Componente principal de navegación que configura la estructura de navegación de la aplicació
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="RegexTester">
        <Drawer.Screen name="RegexTester" component={RegexTesterScreen} options={{ title: 'Tester de Regex' }} />
        <Drawer.Screen name="RegexHistory" component={RegexHistoryScreen} options={{ title: 'Historial' }} />
        <Drawer.Screen name="Info" component={InfoScreen} options={{ title: '¿Qué es una expresión regular?' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
