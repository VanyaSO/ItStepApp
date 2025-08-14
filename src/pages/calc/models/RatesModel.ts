export class CalcModel {
  static #instance: CalcModel | null = null;
  static get instance(): CalcModel {
    if (CalcModel.#instance == null) {
      CalcModel.#instance = new CalcModel();
    }

    return CalcModel.#instance;
  }

  result: string = '0';
  expression: string = '';
  firstOperand: string | null = null;
  secondOperand: string | null = null;
  operation: string | null = null;
  isSecondOperand: boolean = false;
}
