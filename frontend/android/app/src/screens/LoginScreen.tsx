import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type Props = { navigation: LoginScreenNavigationProp };

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '503278773866-euht7s2ou0u5s4ocnm5vmg0nj0rsghjn.apps.googleusercontent.com', // Replace with your Firebase Web Client ID
  forceCodeForRefreshToken: true, // Ensure a new token is always requested
  hostedDomain: '', // Optional: Specify a hosted domain if needed
});

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleGoogleSignIn = async () => {
    try {
      // Sign out to ensure account selection
      await GoogleSignin.signOut();

      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Start Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      console.log("Google Sign-In Response:", userInfo);

      // Get the ID token
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error("Google Sign-In failed: No idToken received.");
      }

      // Authenticate with Firebase
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      // Navigate to Home Screen on success
      navigation.navigate('Home');
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Play Services not available or outdated.");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stay engaged</Text>
      <Text style={styles.subtitle}>The best way to get the most out of our app is to participate actively.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>or</Text>
      
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createAccountText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  orText: {
    marginVertical: 10,
  },
  googleButton: {
    width: 200,
    height: 50,
  },
  createAccountText: {
    marginTop: 10,
    color: 'blue',
  },
});

export default LoginScreen;