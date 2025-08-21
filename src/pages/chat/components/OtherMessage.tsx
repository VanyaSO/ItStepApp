import { ChatMessage } from '../types/ChatMessage.ts';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {displayData} from "../../../shared/services/helper.ts";

export const OtherMessage = ({
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
      <Text>{message.author}</Text>
      <Text>{message.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#becfff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 10,
    marginLeft: 10,
    marginRight: 100,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
});
