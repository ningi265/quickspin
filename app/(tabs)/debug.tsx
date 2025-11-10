import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/theme';

export default function DebugScreen() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<string>('');

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
      setStorageStatus('Token loaded successfully');
    } catch (error) {
      setStorageStatus(`Error: ${error}`);
    }
  };

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setStorageStatus('Token cleared');
    } catch (error) {
      setStorageStatus(`Error clearing token: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Info</Text>
        <Text style={styles.info}>Name: {user?.name || 'No user'}</Text>
        <Text style={styles.info}>Email: {user?.email || 'No email'}</Text>
        <Text style={styles.info}>ID: {user?.id || 'No ID'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Token Info</Text>
        <Text style={styles.info}>Token Present: {token ? 'YES' : 'NO'}</Text>
        <Text style={styles.info}>Token Length: {token?.length || 0}</Text>
        <Text style={styles.info}>Token Preview: {token ? `${token.substring(0, 50)}...` : 'None'}</Text>
        <Text style={styles.info}>Storage Status: {storageStatus}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={loadToken}>
        <Text style={styles.buttonText}>Reload Token</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearToken}>
        <Text style={styles.buttonText}>Clear Token</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});