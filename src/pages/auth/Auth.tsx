import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FirmButton from "../../features/buttons/ui/FirmButton";
import { ButtonTypes } from "../../features/buttons/model/ButtonTypes";
// import base64 from "react-native-base64";  // npm i react-native-base64; npm i @types/react-native-base64
import { AppContext } from "../../shared/context/AppContext";
import { Buffer } from 'buffer';

export default function Auth() {
    const {request, user, setUser} = useContext(AppContext);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState(null as string|null);

    useEffect(() => {
      setUserName(user == null ? null 
        : JSON.parse( Buffer.from(user.split('.')[1], 'base64').toString('utf8') ).nam)
    }, [user]);

    const onEnterPress = () => {
        console.log(login, password);
        request("/Cosmos/SignIn", {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${login}:${password}`, 'utf-8').toString('base64')
          }
        }).then(setUser);
    };

    const onRequestPress = () => {
      request("/Cosmos/SignIn");
    };

    const onExitPress = () => {
        setUser(null);
    };

    const isFormValid = () => login.length > 1 && password.length > 2;

    const anonView = () => <View>
        <Text>Вхід до кабінету</Text>

        <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Логін:</Text>
            <TextInput style={styles.textInput} 
                value={login}
                onChangeText={setLogin} />
        </View>        

        <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Пароль:</Text>
            <TextInput style={styles.textInput} 
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword} />
        </View>
        <FirmButton title="Вхід" 
            type={isFormValid() ? ButtonTypes.primary : ButtonTypes.secondary} 
            action={isFormValid() ? onEnterPress : () => {}} />
    </View>;

    const userView = () => <View>
      <Text>Кабінет користувача {userName}</Text>
      <FirmButton title="Запит" 
            type={ButtonTypes.primary} 
            action={onRequestPress} />
      <FirmButton title="Вихід" 
            type={ButtonTypes.secondary} 
            action={onExitPress} />
    </View>;

    return user == null ? anonView() : userView();
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#888",
    borderWidth: 1,
    margin: 10,
  },
  textInputContainer: {
    backgroundColor: "#555",
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  textInputTitle: {
    color: "#eee",
    marginLeft: 10,
    marginTop: 10,
  }
});
// Практика: вилучити з токена, що одержується від бекенду,
// відомості про користувача (ім'я) та включити його до 
// представлення (Кабінет користувача NAME)
// Також вивести термін (дату/час) завершення авторизованої сесії

/*
Реалізувати функцію "Запам'ятати мене"
- додати чекбокс з відповідним надписом
- за його поміченням забезпечити збереження одержаного токену
   у файл
- при старті застосунку перевіряти наявність файлу та відновлювати
   з нього дані
*/