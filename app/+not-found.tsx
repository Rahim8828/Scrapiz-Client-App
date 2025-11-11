import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { fs, spacing } from '../utils/responsive';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(20),
  },
  text: {
    fontSize: fs(20),
    fontWeight: '600',
  },
  link: {
    marginTop: spacing(15),
    paddingVertical: spacing(15),
  },
});

