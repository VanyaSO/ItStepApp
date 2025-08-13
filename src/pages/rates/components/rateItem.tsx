import { StyleSheet, Text, View } from 'react-native';
import { NbuRate } from '../types/NbuRate.ts';

export default function rateItem({
  item,
  index,
}: {
  item: NbuRate;
  index: number;
}) {
  return (
    <View
      style={[styles.rateItem, index % 2 === 0 ? styles.bgEven : styles.bgOdd]}
    >
      <Text style={styles.rateCC}>{item.cc}</Text>
      <Text style={styles.rateTxt}>{item.txt}</Text>
      <Text style={styles.rateRate}>{item.rate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  bgEven: {
    backgroundColor: '#4A4A4A',
  },
  bgOdd: {
    backgroundColor: '#454545',
  },
  rateItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  rateCC: {
    color: '#FCF7F0',
    flex: 1,
  },
  rateTxt: {
    color: '#FCF7F0',
    flex: 4,
  },
  rateRate: {
    color: '#FCF7F0',
    flex: 2,
  },
});
