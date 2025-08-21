import {useContext, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../../shared/context/AppContext';
import { ChatModel } from './models/ChatModel.ts';
import { OtherMessage } from './components/OtherMessage.tsx';
import { ChatMessage } from './types/ChatMessage.ts';
import { MyMessage } from './components/MyMessage.tsx';

const chatUrl = 'https://chat.momentfor.fun/';

export default function Chat() {
  const { navigate, user, showModal } = useContext(AppContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (user == null) {
      showModal({
        title: 'Комунікатор',
        message: 'Доступ до чату можливий після входу',
        positiveButtonText: 'До меню входу',
        positiveButtonAction: () => navigate('auth'),
        negativeButtonText: 'Покинути чат',
        negativeButtonAction: () => navigate('-1'),
        closeButtonAction: () => navigate('-1'),
      });
    }
  }, [user]);

  useEffect(() => {
    if (ChatModel.instance.messages.length === 0) {
      console.log('Loading data');
      fetch(chatUrl)
        .then(r => r.json())
        .then(j => {
          console.log('Loaded data');
          ChatModel.instance.messages = j.data;
          setMessages(j.data);
        });
    } else {
      console.log('Used cache data');
      setMessages(ChatModel.instance.messages);
    }
  }, []);

  const messagePressed = (message: ChatMessage) => {
    setMessages([...messages]);
  };

  const onSendPressed = () => {
    if (messageText.trim().length === 0) {
      showModal({
        title: 'Комунікатор',
        message: 'Введіть повідомлення',
      });
      return;
    }

    let data = `author=${user?.nam}&msg=${messageText}`;
    console.log(data);
    fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    })
      .then(r => {
        if (r.status === 201) {
          updateMessage();
          setMessageText('');
        } else {
          r.json().then(console.error);
          showModal({
            title: 'Error',
            message: 'Error send message',
          });
        }
      })
      .then(console.log)
      .catch(console.error);
  };

  const updateMessage = () => {
    fetch(chatUrl)
      .then(r => r.json())
      .then(j => {
        let wasNew = false;
        for (let m of j.data) {
          if (typeof messages.find(e => e.id == m.id) === 'undefined') {
            messages.push(m);
            wasNew = true;
          }
        }

        if (wasNew) {
          setMessages([
            ...messages.sort((a, b) =>
              a.moment > b.moment ? 1 : a.moment < b.moment ? -1 : 0,
            ),
          ]);
        }
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.chat}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd();
          }}
        >
          {messages.map((m) =>
            user?.nam === m.author ? (
              <MyMessage key={m.id} message={m} onPress={messagePressed} />
            ) : (
              <OtherMessage key={m.id} message={m} onPress={messagePressed} />
            ),
          )}
        </ScrollView>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSendPressed}>
          <Text>&#10148;</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  chat: {
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#fa64f8',
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    borderColor: '#888',
    borderWidth: 1,
    margin: 3,
    color: 'white',
    flex: 1,
    paddingHorizontal: 5,
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 45,
    marginBottom: 10,
  },
});
