import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, PaperProvider, Surface, Text } from 'react-native-paper';

const TECLAS = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

const OPERADORES = ['+', '-', '*', '/'];

const SIMBOLOS = { '/': '÷', '*': '×', '-': '−' };

function calcular(a, b, operador) {
  switch (operador) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? null : a / b; 
    default:
      return b;
  }
}

function formatar(valor) {
  if (valor === null) return 'Erro';
  return String(parseFloat(valor.toFixed(10)));
}

export default function App() {

  const [display, setDisplay] = useState('0');
  const [primeiroValor, setPrimeiroValor] = useState(null);
  const [operador, setOperador] = useState(null);
  const [aguardandoSegundo, setAguardandoSegundo] = useState(false);

  function limpar() {
    setDisplay('0');
    setPrimeiroValor(null);
    setOperador(null);
    setAguardandoSegundo(false);
  }

  function digitar(numero) {
    if (aguardandoSegundo || display === '0' || display === 'Erro') {
      setDisplay(numero);
      setAguardandoSegundo(false);
    } else {
      setDisplay(display + numero);
    }
  }

  function digitarPonto() {
    if (aguardandoSegundo || display === 'Erro') {
      setDisplay('0.');
      setAguardandoSegundo(false);
      return;
    }
    if (display.includes('.')) return; 
    setDisplay(display + '.');
  }

  function escolherOperador(op) {
    if (display === 'Erro') return;

    const valorAtual = parseFloat(display);

    if (operador && !aguardandoSegundo) {
      const resultado = calcular(primeiroValor, valorAtual, operador);
      if (resultado === null) {
        limpar();
        setDisplay('Erro');
        return;
      }
      setDisplay(formatar(resultado));
      setPrimeiroValor(resultado);
    } else {
      setPrimeiroValor(valorAtual);
    }

    setOperador(op);
    setAguardandoSegundo(true);
  }

  function igual() {
    if (operador === null || primeiroValor === null || display === 'Erro') return;

    const resultado = calcular(primeiroValor, parseFloat(display), operador);
    setDisplay(formatar(resultado));
    setPrimeiroValor(null);
    setOperador(null);
    setAguardandoSegundo(true);
  }

  function aoPressionar(tecla) {
    if (tecla === '.') digitarPonto();
    else if (tecla === '=') igual();
    else if (OPERADORES.includes(tecla)) escolherOperador(tecla);
    else digitar(tecla);
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />

        {/* Display */}
        <Surface style={styles.display} elevation={2}>
          <Text
            variant="displayMedium"
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.textoDisplay}
          >
            {display}
          </Text>
        </Surface>

        {}
        <View style={styles.linha}>
          <Button
            mode="contained"
            buttonColor="#d32f2f"
            style={styles.botao}
            contentStyle={styles.conteudoBotao}
            labelStyle={styles.rotuloBotao}
            onPress={limpar}
          >
            C
          </Button>
        </View>

        {}
        {TECLAS.map((linha, i) => (
          <View key={i} style={styles.linha}>
            {linha.map((tecla) => {
              const ehOperador = OPERADORES.includes(tecla) || tecla === '=';
              return (
                <Button
                  key={tecla}
                  mode={ehOperador ? 'contained' : 'contained-tonal'}
                  style={styles.botao}
                  contentStyle={styles.conteudoBotao}
                  labelStyle={styles.rotuloBotao}
                  onPress={() => aoPressionar(tecla)}
                >
                  {SIMBOLOS[tecla] || tecla}
                </Button>
              );
            })}
          </View>
        ))}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  display: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    minHeight: 120,
    justifyContent: 'center',
  },
  textoDisplay: {
    textAlign: 'right',
  },
  linha: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  botao: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  conteudoBotao: {
    height: 70,
  },
  rotuloBotao: {
    fontSize: 24,
  },
});