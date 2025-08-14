import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { useEffect, useState } from 'react';
import rateItem from './components/rateItem.tsx';
import { NbuRate } from './types/NbuRate.ts';
import { RatesModel } from './models/RatesModel.ts';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function Rates() {
  const [rates, setRates] = useState<Array<NbuRate>>([]);
  const [showRates, setShowRates] = useState<Array<NbuRate>>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateType>();

  const defaultStyles = useDefaultStyles();

  useEffect(() => {
    if (RatesModel.instance.rates.length === 0) {
      console.log('Loading data');
      fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        .then(res => res.json())
        .then(j => {
          console.log('Loaded data');
          RatesModel.instance.rates = j;
          RatesModel.instance.selectedDate = dayjs()
          setRates(j);
        });
    } else {
      console.log('Used cache data');
      setRates(RatesModel.instance.rates);
      setShowRates(RatesModel.instance.showRates);
      setSearchValue(RatesModel.instance.searchValue);
      setSelectedDate(RatesModel.instance.selectedDate);
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

  useEffect(() => {
    fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dayjs(selectedDate).format('YYYYMMDD')}&json`)
        .then(res => res.json())
        .then(data => {
          RatesModel.instance.rates = data;
          setRates(data);
        })
    RatesModel.instance.selectedDate = selectedDate;
  }, [selectedDate]);

  const changeDate = () => {
    setCalendarVisible(true);
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={changeDate}>
          <Text>{dayjs(selectedDate).format('DD.MM.YYYY')}</Text>
        </TouchableOpacity>
      </View>
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
      <View style={{display: isCalendarVisible ? "contents":"none"}}>
        <DateTimePicker
            mode="single"
            date={selectedDate}
            onChange={({ date }) => {
              setSelectedDate(date);
              setCalendarVisible(false);
            }}
            styles={defaultStyles}
            maxDate={dayjs()}
        />
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
