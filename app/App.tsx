/**
 * npx react-native run-android
 */

import {  StyleSheet, Text, useColorScheme, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function Main() {
  const insets = useSafeAreaInsets();
  //console.log(insets);
  return <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    <Calc />
  </SafeAreaView>;
}

function App() {
  return (<SafeAreaProvider>
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Calc />
    </SafeAreaView>
  </SafeAreaProvider>);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#444",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
