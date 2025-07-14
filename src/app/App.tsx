/**
 * npx react-native run-android
 */

import {  BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import { AppContext } from '../shared/context/AppContext';

function App() {
  /* Навігація у мобільних застосунках
  ідея - ведення власної історії переходу між "сторінками"
   */

  const [page, setPage] = useState("game");
  const [history, setHistory] = useState([] as Array<string>);

  const navigate = (href:string) => {  // додавання до історії поточної сторінки
    if(href === page) {                 // та перехід на нову сторінку
      return;
    }
    history.push(page);
    setHistory(history);
    setPage(href);
  };

  const popRoute = () => {            // рух назад по історії (кнопка "<-")
    if(history.length > 0) {
      const page = history.pop() ?? "calc";
      setHistory(history);
      setPage(page);
    }
    else {
      BackHandler.exitApp();
    }
  };

  useEffect(() => {
    // перехоплюємо оброблення апаратної кнопки "назад"
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      popRoute();
      return true;   // означає, що подальша обробка не потрібна
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (<SafeAreaProvider>
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* передаємо navigate через контекст на всі дочірні елементи*/}
      <AppContext.Provider value={{navigate}}>
        <View style={styles.content}>
          { page === "calc" ? <Calc />
              : <Game />
          }
        </View>

        <View style={styles.bottomNav}>
          <Pressable onPress={() => navigate("calc")} style={styles.bottomNavItem}>
            <Text>Calc</Text>
          </Pressable>
          <Pressable onPress={() => navigate("game")} style={styles.bottomNavItem}>
            <Text>Game</Text>
          </Pressable>
        </View>
      </AppContext.Provider>
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
    width: "100%"
  },
  content: {
    flex: 1,
    width: "100%"
  },
  bottomNav: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 50,
    width: "100%"
  },
  bottomNavItem: {
    borderColor: "gray",
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
  }
});

export default App;
