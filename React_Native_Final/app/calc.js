import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Calculator = () => {
  const [display, setDisplay] = useState("");
  const [equation, setEquation] = useState("");
  const [showingResult, setShowingResult] = useState(false);
  const [isNewNumber, setIsNewNumber] = useState(true);

  const calculateLiveResult = (expr) => {
    try {
      // If expression ends with an operator or is empty, don't show anything
      if (!expr || /[+\-×÷]\s*$/.test(expr)) {
        return "";
      }

      // If expression is incomplete percentage, don't show anything
      if (expr.endsWith("%")) {
        const parts = expr.split(" ");
        if (parts.length < 2) return "";
      }

      const result = evaluateExpression(expr);
      const formattedResult = parseFloat(result.toFixed(10));

      // Don't show NaN or invalid results
      if (isNaN(formattedResult)) return "";

      return formattedResult.toString();
    } catch (error) {
      return "";
    }
  };

  const handleNumber = (num) => {
    if (showingResult) {
      setDisplay("");
      setEquation(num);
      setShowingResult(false);
    } else if (isNewNumber) {
      const newEquation = equation + num;
      setEquation(newEquation);
      setDisplay(calculateLiveResult(newEquation));
      setIsNewNumber(false);
    } else {
      const newEquation = equation + num;
      setEquation(newEquation);
      setDisplay(calculateLiveResult(newEquation));
    }
  };

  const handleOperator = (operator) => {
    if (showingResult) {
      const newEquation = display + " " + operator + " ";
      setEquation(newEquation);
      setDisplay(""); 
    } else {
      const newEquation = equation + " " + operator + " ";
      setEquation(newEquation);
      setDisplay(""); 
    }
    setIsNewNumber(true);
    setShowingResult(false);
  };

  const handlePercentage = () => {
    if (showingResult) {
      const newEquation = display + "%";
      setEquation(newEquation);
      setDisplay(calculateLiveResult(newEquation));
    } else {
      const newEquation = equation + "%";
      setEquation(newEquation);
      setDisplay(calculateLiveResult(newEquation));
    }
    setIsNewNumber(true);
  };

  const evaluateExpression = (expr) => {
    // Split the expression into tokens
    const tokens = expr.trim().split(" ");

    // First pass: handle percentages attached to numbers
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].endsWith("%")) {
        const value = parseFloat(tokens[i].slice(0, -1));
        if (!isNaN(value)) {
          tokens[i] = String(value / 100);
        }
      }
    }

    // Second pass: handle multiplication and division
    let i = 1;
    while (i < tokens.length - 1) {
      if (tokens[i] === "×" || tokens[i] === "÷") {
        const num1 = parseFloat(tokens[i - 1]);
        const num2 = parseFloat(tokens[i + 1]);
        let result;

        if (tokens[i] === "×") {
          result = num1 * num2;
        } else {
          if (num2 === 0) throw new Error("Division by zero");
          result = num1 / num2;
        }

        tokens.splice(i - 1, 3, result.toString());
        i--;
      }
      i++;
    }

    // Final pass: addition and subtraction
    let result = parseFloat(tokens[0]);
    for (i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const num = parseFloat(tokens[i + 1]);

      if (operator === "+") {
        result += num;
      } else if (operator === "-") {
        result -= num;
      }
    }

    return result;
  };

  const calculate = () => {
    try {
      if (!equation) return;

      const result = evaluateExpression(equation);
      const formattedResult = parseFloat(result.toFixed(10));

      // Don't show NaN results
      if (isNaN(formattedResult)) {
        setDisplay("Error");
      } else {
        setDisplay(formattedResult.toString());
      }
      setShowingResult(true);
      setIsNewNumber(true);
    } catch (error) {
      setDisplay("Error");
      setEquation("");
      setShowingResult(true);
      setIsNewNumber(true);
    }
  };

  const clear = () => {
    setDisplay("");
    setEquation("");
    setShowingResult(false);
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (!showingResult) {
      const newEquation = equation
        .replace(/\s*[\+\-×÷]\s*$/, "") 
        .slice(0, -1);

      setEquation(newEquation);

      if (newEquation) {
        setDisplay(calculateLiveResult(newEquation));
      } else {
        setDisplay("");
      }
    }
  };


  const CalcButton = ({
    label,
    onClick,
    isOperator = false,
    isEqual = false,
  }) => (
    <TouchableOpacity
      style={[
        styles.button,
        isEqual
          ? styles.equalButton
          : isOperator
          ? styles.operatorButton
          : styles.numberButton,
      ]}
      onPress={onClick}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.calculatorContainer}>
        <View style={styles.displayWrapper}>
          <View style={styles.displayContainer}>
            <Text
              style={[styles.equationText, !showingResult ? styles.boldText : styles.smallText]}
              numberOfLines={1}
            >
              {equation}
            </Text>
            <Text
              style={[styles.displayText, showingResult ? styles.boldLargeText : styles.regularText]}
              numberOfLines={1}
            >
              {display}
            </Text>
          </View>
        </View>
        <View style={styles.buttonGrid}>
          {/* Calculator buttons */}
          <View style={styles.row}>
            <CalcButton label="AC" onClick={clear} isOperator />
            <CalcButton label="%" onClick={handlePercentage} isOperator />
            <CalcButton label="⌫" onClick={handleBackspace} isOperator />
            <CalcButton label="÷" onClick={() => handleOperator("÷")} isOperator />
          </View>
          <View style={styles.row}>
            <CalcButton label="7" onClick={() => handleNumber("7")} />
            <CalcButton label="8" onClick={() => handleNumber("8")} />
            <CalcButton label="9" onClick={() => handleNumber("9")} />
            <CalcButton label="×" onClick={() => handleOperator("×")} isOperator />
          </View>
          <View style={styles.row}>
            <CalcButton label="4" onClick={() => handleNumber("4")} />
            <CalcButton label="5" onClick={() => handleNumber("5")} />
            <CalcButton label="6" onClick={() => handleNumber("6")} />
            <CalcButton label="-" onClick={() => handleOperator("-")} isOperator />
          </View>
          <View style={styles.row}>
            <CalcButton label="1" onClick={() => handleNumber("1")} />
            <CalcButton label="2" onClick={() => handleNumber("2")} />
            <CalcButton label="3" onClick={() => handleNumber("3")} />
            <CalcButton label="+" onClick={() => handleOperator("+")} isOperator />
          </View>
          <View style={styles.row}>
            <CalcButton label="00" onClick={() => handleNumber("00")} />
            <CalcButton label="0" onClick={() => handleNumber("0")} />
            <CalcButton label="." onClick={() => handleNumber(".")} />
            <CalcButton label="=" onClick={calculate} isEqual />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  calculatorContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
  },
  settingsIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  displayWrapper: {
    height: 200,
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  displayContainer: {
    paddingHorizontal: 16,
  },
  equationText: {
    color: "#666",
    fontSize: 48,
    textAlign: "right",
    fontWeight: "300",
    marginBottom: 8,
    height: 60,
  },
  displayText: {
    color: "#666",
    fontSize: 24,
    textAlign: "right",
    fontWeight: "300",
    height: 30,
  },
  boldText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 48,
  },
  smallText: {
    fontSize: 24,
    height: 30,
  },
  boldLargeText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 48,
    height: 60,
  },
  regularText: {
    fontSize: 24,
    height: 30,
  },
  buttonGrid: {
    alignItems: "center",
    gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#fff",
  },
  numberButton: {
    backgroundColor: "#333",
  },
  operatorButton: {
    backgroundColor: "#666",
  },
  equalButton: {
    backgroundColor: "#0066ff",
  },
});

export default Calculator;