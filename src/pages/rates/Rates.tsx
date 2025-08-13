import { FlatList, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import rateItem from './components/rateItem.tsx';
import { NbuRate } from './types/NbuRate.ts';

export default function Rates() {
  const [rates, setRates] = useState<Array<NbuRate>>([]);

  useEffect(() => {
    if (RatesModel.instance.rates.length === 0) {
      console.log('Loading data');
      fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        .then(res => res.json())
        .then(j => {
          RatesModel.instance.rates = j;
          setRates(j);
          console.log('Loaded data');
        });
    } else {
      setRates(RatesModel.instance.rates);
      console.log('Used cache data');
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={rates}
        renderItem={rateItem}
        keyExtractor={rate => rate.cc}
      />
    </View>
  );
}

class RatesModel {
  static #instance: RatesModel | null = null;
  static get instance(): RatesModel {
    if (RatesModel.#instance == null) {
      RatesModel.#instance = new RatesModel();
    }

    return RatesModel.#instance;
  }

  rates: Array<NbuRate> = [];
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
