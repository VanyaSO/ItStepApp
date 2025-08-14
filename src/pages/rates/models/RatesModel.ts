import { NbuRate } from '../types/NbuRate.ts';
import { DateType } from 'react-native-ui-datepicker';

export class RatesModel {
  static #instance: RatesModel | null = null;
  rates: Array<NbuRate> = [];
  showRates: Array<NbuRate> = [];
  searchValue: string = '';
  selectedDate: DateType;

  static get instance(): RatesModel {
    if (RatesModel.#instance == null) {
      RatesModel.#instance = new RatesModel();
    }

    return RatesModel.#instance;
  }
}
