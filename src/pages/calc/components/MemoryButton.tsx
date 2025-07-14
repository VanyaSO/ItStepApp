import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type MemoryButtonData = {
  title: string;
  action: (title: string) => any;
  isLight?: boolean;
};

export default function MemoryButton({ title, action, isLight = false }: MemoryButtonData) {
  return (
    <TouchableOpacity onPress={() => action(title)} style={styles.button}>
      <Text style={[isLight ? styles.buttonTextLight : styles.buttonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#a1a1a1',
    fontSize: 14
  },
  buttonTextLight: {
    color: '#FFFFFF',
    fontSize: 14
  }
});
