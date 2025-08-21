import { ChatMessage } from '../types/ChatMessage.ts';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { displayData } from '../../../shared/services/helper.ts';

export const MyMessage = ({
  message,
  onPress,
}: {
  message: ChatMessage;
  onPress: (message: ChatMessage) => void;
}) => {
  return (
    <TouchableOpacity
      key={message.id}
      style={styles.container}
      onPress={() => onPress(message)}
    >
      <Text>{displayData(message.moment)}</Text>
      <Text>Я</Text>
      <Text>{message.text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9bffc7',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 10,
    marginRight: 10,
    marginLeft: 100,
    padding: 10,
    elevation: 2,
    margin: 10,
  }
});
