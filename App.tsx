import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Provider as PaperProvider, MD3LightTheme as PaperDefaultTheme } from 'react-native-paper';
import { initDatabase } from './src/db/database';
import RegisterScreen from './src/screens/RegisterScreen';
import SearchScreen from './src/screens/SearchScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Navigation用のテーマをPaperの色に合わせる（ライトモード固定）
const CustomNavigationLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: PaperDefaultTheme.colors.background,
    card: PaperDefaultTheme.colors.elevation.level2,
    text: PaperDefaultTheme.colors.onSurface,
    border: PaperDefaultTheme.colors.outline,
    primary: PaperDefaultTheme.colors.primary,
  },
};

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <PaperProvider theme={PaperDefaultTheme}>
      <NavigationContainer theme={CustomNavigationLightTheme}>
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
