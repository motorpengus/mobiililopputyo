import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Yhteenveto',
          tabBarIcon: ({ color, size }) => <Ionicons name="pie-chart" size={size} color={color?.toString() ?? '#2563eb'} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Lisää kulu',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color?.toString() ?? '#2563eb'} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Historia',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color?.toString() ?? '#2563eb'} />,
        }}
      />
    </Tabs>
  );
}