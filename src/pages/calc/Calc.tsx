import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import CalcButton from './components/CalcButton';
import { useRef, useState } from 'react';
import MemoryButton from './components/MemoryButton';

const maxResultDigits = 19;

const calculate = (a: number, b: number, op: string): number => {
  switch (op) {
    case 'add':
      return a + b;
    case 'sub':
      return a - b;
    case 'mul':
      return a * b;
    case 'div':
      return b !== 0 ? a / b : NaN;
    default:
      return b;
  }
};

const operationSymbol = (op: string): string => {
  switch (op) {
    case 'add':
      return '+';
    case 'sub':
      return '−';
    case 'mul':
      return '×';
    case 'div':
      return '÷';
    default:
      return '';
  }
};


export default function Calc() {
  const [result, setResult] = useState('0');
  const [expression, setExpression] = useState('');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [secondOperand, setSecondOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isSecondOperand, setIsSecondOperand] = useState(false);
  const lastOpAndOperandRef = useRef<{ op: string; val: number } | null>(null);

  const { width, height } = useWindowDimensions();

  const onOperationPress = (title: string, data?: string) => {
    switch (data) {
      case 'backspace':
        if (result.length > 1) {
          setResult(result.substring(0, result.length - 1));
        } else {
          setResult('0');
        }
        break;

      case 'clear':
        setResult('0');
        setExpression('');
        setFirstOperand(null);
        setSecondOperand(null);
        setIsSecondOperand(false);
        setOperation(null);
        lastOpAndOperandRef.current = null;
        break;
      case 'clearEntry':
        setResult('0');
        setIsSecondOperand(true);
        break;
      case 'inverse':
        setResult((1 / Number(result)).toString());
        break;

      case 'add':
      case 'sub':
      case 'mul':
      case 'div':
        const b = Number(result);
        if (firstOperand !== null && operation && !isSecondOperand) {
          const res = calculate(firstOperand, b, operation);

          setResult(res.toString());
          setFirstOperand(res);
          setExpression(res + ' ' + title);
        } else {
          setFirstOperand(b);
          setSecondOperand(null);
          lastOpAndOperandRef.current = null;
          setExpression(result + ' ' + title);
        }
        setOperation(data);
        setIsSecondOperand(true);
        break;
      case 'percent':
        const currentValue = Number(result);
        if (firstOperand !== null && operation) {
          let percentValue;
          if (operation === 'add' || operation === 'sub') {
            percentValue = (firstOperand * currentValue) / 100;
          } else {
            percentValue = currentValue / 100;
          }
          setResult(percentValue.toString());
          setSecondOperand(percentValue);
          setIsSecondOperand(true);
          setExpression(
            firstOperand +
              ' ' +
              operationSymbol(operation) +
              ' ' +
              currentValue +
              '%',
          );
        } else {
          setResult('0');
          setExpression('0');
          setIsSecondOperand(true);
        }
        break;

      case 'square': {
        const val = Number(result);
        const sq = val * val;
        setResult(sq.toString());
        setExpression('sqr(' + val + ')');
        setIsSecondOperand(false);
        if (operation && isSecondOperand) setSecondOperand(sq);
        else setFirstOperand(sq);
        break;
      }
      case 'sqrt': {
        const val = Number(result);
        if (val >= 0) {
          const sqrtResult = Math.sqrt(val);
          setResult(sqrtResult.toString());
          setExpression('√(' + val + ')');
          setIsSecondOperand(false);
          if (operation && isSecondOperand) {
            setSecondOperand(sqrtResult);
          } else {
            setFirstOperand(sqrtResult);
          }
        } else {
          setResult('Invalid input');
          setExpression('');
          setIsSecondOperand(true);
        }
        break;
      }
      case 'equal':
        if (firstOperand && operation && secondOperand !== null) {
          const a = firstOperand;
          const b = secondOperand;
          const res = calculate(a, b, operation);

          setResult(res.toString());
          setExpression(
            firstOperand +
              ' ' +
              operationSymbol(operation) +
              ' ' +
              secondOperand +
              ' =',
          );
          setFirstOperand(null);
          setSecondOperand(null);
          setOperation(null);
          setIsSecondOperand(true);
          lastOpAndOperandRef.current = { op: operation, val: b };
        } else if (lastOpAndOperandRef.current) {
          const a = Number(result);
          const b = lastOpAndOperandRef.current.val;
          const op = lastOpAndOperandRef.current.op;
          const res = calculate(a, b, op);

          setResult(res.toString());
          setExpression(a + ' ' + operationSymbol(op) + ' ' + b + ' =');
          setFirstOperand(null);
          setSecondOperand(null);
          setOperation(null);
          setIsSecondOperand(true);
        }
        break;
    }
  };

  const onDigitPress = (title: string) => {
    const digitCount = result.replace(/[^0-9]/g, '').length;
    if (digitCount >= maxResultDigits) {
      return;
    }
    if (result === '0' || isSecondOperand) {
      setResult(title);
      setIsSecondOperand(false);
      if (operation) {
        setSecondOperand(Number(title));
      }
    } else {
      const newResult = result + title;
      setResult(newResult);
      if (operation) {
        setSecondOperand(Number(newResult));
      }
    }

    if (expression.endsWith('=')) {
      setExpression(title);
    } else if (isSecondOperand && operation) {
      setExpression(prev => prev + ' ' + title);
    } else {
      setExpression(prev => prev + title);
    }
  };

  const onDotPress = () => {
    if (!result.includes('.')) {
      setResult(result + '.');
    }
  };

  const onPmPress = () => {
    if (result.startsWith('-')) {
      setResult(result.substring(1));
    } else {
      setResult('-' + result);
    }
  };

  const portraitView = () => {
    return (
      <View style={styles.calcContainer}>
        <Text style={styles.title}>Калькулятор</Text>
        <Text style={styles.expression}>{expression}</Text>
        <Text
          style={[
            styles.result,
            {
              fontSize:
                result.length < 20
                  ? styles.result.fontSize
                  : (styles.result.fontSize * 19) / result.length,
            },
          ]}
        >
          {result}
        </Text>

        <View style={styles.memoryButtonRow}>
          <MemoryButton title="MC" action={onOperationPress} />
          <MemoryButton title="MR" action={onOperationPress} />
          <MemoryButton title="M+" action={onOperationPress} />
          <MemoryButton title={'M\u2212'} action={onOperationPress} />
          <MemoryButton title="MS" action={onOperationPress} />
          <MemoryButton title={'M\u02C7'} action={onOperationPress} />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title="%" action={onOperationPress} data="percent" />
          <CalcButton
            title="CE"
            textStyle={{ fontSize: 16 }}
            action={onOperationPress}
            data="clearEntry"
          />
          <CalcButton
            title="C"
            textStyle={{ fontSize: 16 }}
            action={onOperationPress}
            data="clear"
          />
          <CalcButton
            title={'\u232B'}
            action={onOperationPress}
            data="backspace"
          />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton
            title={'\u215F\u{1D465}'}
            action={onOperationPress}
            data="inverse"
          />
          <CalcButton
            title={'\u{1D465}\u00B2'}
            action={onOperationPress}
            data="square"
          />
          <CalcButton
            title={'\u00B2\u221A\u{1D465}'}
            action={onOperationPress}
            data="sqrt"
          />
          <CalcButton
            title={'\u00f7'}
            textStyle={{ fontSize: 25 }}
            action={onOperationPress}
            data="div"
          />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title="7" type="digit" action={onDigitPress} />
          <CalcButton title="8" type="digit" action={onDigitPress} />
          <CalcButton title="9" type="digit" action={onDigitPress} />
          <CalcButton title={'\u2715'} action={onOperationPress} data="mul" />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title="4" type="digit" action={onDigitPress} />
          <CalcButton title="5" type="digit" action={onDigitPress} />
          <CalcButton title="6" type="digit" action={onDigitPress} />
          <CalcButton title={'\uFF0D'} action={onOperationPress} data="sub" />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title="1" type="digit" action={onDigitPress} />
          <CalcButton title="2" type="digit" action={onDigitPress} />
          <CalcButton title="3" type="digit" action={onDigitPress} />
          <CalcButton title={'\uFF0B'} action={onOperationPress} data="add" />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton
            title={'\u207A\u2044\u208B'}
            type="digit"
            action={onPmPress}
          />
          <CalcButton title="0" type="digit" action={onDigitPress} />
          <CalcButton title={'\uFF0E'} type="digit" action={onDotPress} />
          <CalcButton
            title={'\uFF1D'}
            type="equal"
            action={onOperationPress}
            data="equal"
          />
        </View>
      </View>
    );
  };

  const landscapeView = () => {
    return (
      <View style={styles.calcContainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <View style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
            <Text style={[styles.title, { margin: 0 }]}>Калькулятор</Text>
            <Text style={styles.expression}>{expression}</Text>
          </View>

          <Text style={[styles.result, { flex: 3 }]}>{result}</Text>
        </View>

        <View style={styles.memoryButtonRow}>
          <MemoryButton title="MC" action={onOperationPress} />
          <MemoryButton title="MR" action={onOperationPress} />
          <MemoryButton title="M+" action={onOperationPress} />
          <MemoryButton title={'M\u2212'} action={onOperationPress} />
          <MemoryButton title="MS" action={onOperationPress} />
          <MemoryButton title={'M\u02C7'} action={onOperationPress} />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton title="%" action={onOperationPress} data="percent" />
          <CalcButton title="7" type="digit" action={onDigitPress} />
          <CalcButton title="8" type="digit" action={onDigitPress} />
          <CalcButton title="9" type="digit" action={onDigitPress} />
          <CalcButton
            title={'\u00f7'}
            textStyle={{ fontSize: 26 }}
            action={onOperationPress}
            data="div"
          />
          <CalcButton
            title={'\u232B'}
            action={onOperationPress}
            data="backspace"
          />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton
            title={'\u215F\u{1D465}'}
            action={onOperationPress}
            data="inverse"
          />
          <CalcButton title="4" type="digit" action={onDigitPress} />
          <CalcButton title="5" type="digit" action={onDigitPress} />
          <CalcButton title="6" type="digit" action={onDigitPress} />
          <CalcButton title={'\u2715'} action={onOperationPress} data="mul" />
          <CalcButton
            title="C"
            textStyle={{ fontSize: 16 }}
            action={onOperationPress}
            data="clear"
          />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton
            title={'\u{1D465}\u00B2'}
            action={onOperationPress}
            data="square"
          />
          <CalcButton title="1" type="digit" action={onDigitPress} />
          <CalcButton title="2" type="digit" action={onDigitPress} />
          <CalcButton title="3" type="digit" action={onDigitPress} />
          <CalcButton title={'\uFF0D'} action={onOperationPress} data="sub" />
          <CalcButton
            title="CE"
            textStyle={{ fontSize: 16 }}
            action={onOperationPress}
            data="clearEntry"
          />
        </View>

        <View style={styles.calcButtonRow}>
          <CalcButton
            title={'\u00B2\u221A\u{1D465}'}
            action={onOperationPress}
            data="sqrt"
          />
          <CalcButton
            title={'\u207A\u2044\u208B'}
            type="digit"
            action={onPmPress}
          />
          <CalcButton title="0" type="digit" action={onDigitPress} />
          <CalcButton title={'\uFF0E'} type="digit" action={onDotPress} />
          <CalcButton title={'\uFF0B'} action={onOperationPress} data="add" />
          <CalcButton
            title={'\uFF1D'}
            type="equal"
            action={onOperationPress}
            data="equal"
          />
        </View>
      </View>
    );
  };
  return width < height ? portraitView() : landscapeView();
}

const styles = StyleSheet.create({
  calcContainer: {
    backgroundColor: '#202020',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    color: '#ffffff',
    margin: 10,
  },
  expression: {
    color: '#A6A6A6',
    textAlign: 'right',
    margin: 10,
  },
  result: {
    color: '#ffffff',
    margin: 10,
    textAlign: 'right',
    fontSize: 30,
    fontWeight: 700,
  },
  calcButtonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 3,
  },
  memoryButtonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 3,
    flex: 1,
    maxHeight: 40,
    minHeight: 40,
  },
});
