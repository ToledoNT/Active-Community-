import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { NewOcorrenciaScreen } from '../screens/NewOcorrenciaScreen';
import { OcorrenciasListScreen } from '../screens/OcorrenciasListScreen';
import { OcorrenciaDetailScreen } from '../screens/OcorrenciaDetailScreen';
import { AdminLoginScreen } from '../screens/AdminLoginScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { AuthProvider } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="NewOcorrencia" component={NewOcorrenciaScreen} />
          <Stack.Screen name="OcorrenciasList" component={OcorrenciasListScreen} />
          <Stack.Screen name="OcorrenciaDetail" component={OcorrenciaDetailScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};
