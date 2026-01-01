import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Provider as PaperProvider, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { initDatabase } from './src/db/database';
import RegisterScreen from './src/screens/RegisterScreen';
import SearchScreen from './src/screens/SearchScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Navigation用のテーマをPaperの色に合わせる
const CustomNavigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: PaperDarkTheme.colors.background,
    card: PaperDarkTheme.colors.elevation.level2,
    text: PaperDarkTheme.colors.onSurface,
    border: PaperDarkTheme.colors.outline,
    primary: PaperDarkTheme.colors.primary,
  },
};

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <PaperProvider theme={PaperDarkTheme}>
      <NavigationContainer theme={CustomNavigationDarkTheme}>
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
