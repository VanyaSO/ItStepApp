import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ButtonTypes } from '../model/ButtonTypes';

export default function FirmButton({
  type,
  action,
  children,
  styleButton,
}: {
  type?: string;
  action: Function;
  children?: React.ReactNode;
  styleButton?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={_ => action()}
      style={[
        styleButton ?? styles.button,
        type === ButtonTypes.primary
          ? styles.buttonPrimary
          : type === ButtonTypes.secondary
          ? styles.buttonSecondary
          : undefined,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    width: '95%',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonPrimary: {
    backgroundColor: '#625fb7ff',
  },
  buttonSecondary: {
    backgroundColor: '#515060ff',
  },
});

