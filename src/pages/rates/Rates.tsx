import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import rateItem from './components/rateItem.tsx';
import { NbuRate } from './types/NbuRate.ts';
import { RatesModel } from './models/RatesModel.ts';

export default function Rates() {
  const [rates, setRates] = useState<Array<NbuRate>>([]);
  const [showRates, setShowRates] = useState<Array<NbuRate>>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    if (RatesModel.instance.rates.length === 0) {
      console.log('Loading data');
      fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        .then(res => res.json())
        .then(j => {
          console.log('Loaded data');
          RatesModel.instance.rates = j;
          setRates(j);
        });
    } else {
      console.log('Used cache data');
      setRates(RatesModel.instance.rates);
      setShowRates(RatesModel.instance.showRates);
      setSearchValue(RatesModel.instance.searchValue);
    }
  }, []);

  useEffect(() => {
    if (searchValue.length > 0) {
      setShowRates(
        rates.filter(
          rate =>
            rate.cc.includes(searchValue.toUpperCase()) ||
            rate.txt.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setShowRates(rates);
    }

    RatesModel.instance.searchValue = searchValue;
  }, [searchValue, rates]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={searchValue}
          onChangeText={setSearchValue}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image
            source={require('../../shared/assets/images/search.png')}
            style={styles.searchButtonImg}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={showRates}
        renderItem={rateItem}
        keyExtractor={rate => rate.cc}
        style={styles.ratesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  ratesList: {
    flex: 1,
  },
  searchBar: {
    width: '100%',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderColor: '#888',
    borderWidth: 1,
    color: '#f2f2f2',
  },
  searchButton: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#505050',
  },
  searchButtonImg: {
    width: 44,
    height: 44,
    tintColor: '#f2f2f2',
    margin: 3,
  },
});
