import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { initDatabase } from './src/db/database';
import RegisterScreen from './src/screens/RegisterScreen';
import SearchScreen from './src/screens/SearchScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === '登録') {
                iconName = focused ? 'add-circle' : 'add-circle-outline';
              } else if (route.name === '履歴') {
                iconName = focused ? 'list' : 'list-outline';
              } else {
                iconName = 'help';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="登録" component={RegisterScreen} />
          <Tab.Screen name="履歴" component={SearchScreen} />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
