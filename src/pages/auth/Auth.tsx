import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import FirmButton from '../../features/buttons/ui/FirmButton';
import { ButtonTypes } from '../../features/buttons/model/ButtonTypes';
import { AppContext } from '../../shared/context/AppContext';
import { Buffer } from 'buffer';
import RNFS from "react-native-fs";
import CheckBox from "@react-native-community/checkbox";

const tokenPath = '/auth.token'

export default function Auth() {
  const { request, user, setUser, showModal } = useContext(AppContext);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState(null as string | null);
  const [isRemember, setRemember] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const path = RNFS.DocumentDirectoryPath + tokenPath;
      const jwt = await RNFS.readFile(path, 'utf8').catch(() => null);

      if (jwt) {
        setUser(
            JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8')),
        );
      }
    };

    loadToken();
  }, []);


  useEffect(() => {
    setUserName(user === null ? null : user.nam);
  }, [user]);

  const onEnterPress = () => {
    if (login.length === 0) {
      console.log('Modal login');
      showModal({
        title: 'Авторизація',
        message: 'Введіть логін',
      });
      return;
    }
    if (password.length === 0) {
      showModal({
        title: 'Авторизація',
        message: 'Введіть пароль',
      });
      return;
    }
    request('/Cosmos/SignIn', {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${login}:${password}`, 'utf-8').toString('base64'),
      },
    }).then(jwt => {
      if (isRemember) {
        saveToken(jwt);
      }
      setUser(
        JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8')),
      );
    });
  };

  const onRequestPress = () => {
    request('/Cosmos/SignIn');
  };

  const onExitPress = () => {
    setUser(null);

    const path = RNFS.DocumentDirectoryPath + tokenPath;
    RNFS.unlink(path)
        .catch(err => {
          console.error('Error delete file', err);
        });
  };

  const isFormValid = () => login.length > 1 && password.length > 2;

  const saveToken = (token: string) => {
    const path = RNFS.DocumentDirectoryPath + tokenPath;
    return RNFS.writeFile(path, token.toString(), 'utf8');
  }


  const anonView = () => (
    <View>
      <Text>Вхід до кабінету</Text>

      <View style={styles.textInputContainer}>
        <Text style={styles.textInputTitle}>Логін:</Text>
        <TextInput
          style={styles.textInput}
          value={login}
          onChangeText={setLogin}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={styles.textInputTitle}>Пароль:</Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox
            value={isRemember}
            onValueChange={setRemember}
            style={styles.checkbox}
        />
        <Text style={styles.checkboxLabel}>Запам'ятати мене</Text>
      </View>
      <FirmButton
          type={isFormValid() ? ButtonTypes.primary : ButtonTypes.secondary}
          action={onEnterPress}
      >
        <Text>Вхід</Text>
      </FirmButton>
    </View>
  );

  const userView = () => (
    <View>
      <Text>Кабінет користувача {userName}</Text>
      <FirmButton
          type={ButtonTypes.primary}
          action={onRequestPress}
      >
        <Text>Запит</Text>
      </FirmButton>
      <FirmButton
          type={ButtonTypes.secondary}
          action={onExitPress}
      >
        <Text>Вихід</Text>
      </FirmButton>
    </View>
  );

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
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxLabel: {
    margin: 8,
    color: "#eee",
  },
});
