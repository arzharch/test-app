import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.navigate('Login');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;