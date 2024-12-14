import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Calculator = () => {
  const [display, setDisplay] = useState("");
  const [equation, setEquation] = useState("");
  const [showingResult, setShowingResult] = useState(false);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [isScientific, setIsScientific] = useState(false);

  const calculateLiveResult = (expr) => {
    try {
      if (!expr) return "";

      // Remove trailing operator for calculation
      let tempExpr = expr;
      const endsWithOperator = /[+\-×÷]$/.test(tempExpr);

      if (endsWithOperator) {
        tempExpr = tempExpr.slice(0, -1);
      }

      // Complete unclosed parentheses
      const openParens = (tempExpr.match(/\(/g) || []).length;
      const closeParens = (tempExpr.match(/\)/g) || []).length;

      if (openParens > closeParens) {
        tempExpr = tempExpr + ")".repeat(openParens - closeParens);
      }

      // Don't evaluate if it's just an operator
      if (!/[0-9πe]/.test(tempExpr)) return "";

      // Evaluate the expression
      const result = evaluateExpression(tempExpr);
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
      const newEquation = display + operator;
      setEquation(newEquation);
      setDisplay("");
    } else {
      const newEquation = equation + operator;
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
    try {
      // Replace constants first
      expr = expr.replace(/π/g, Math.PI.toString());
      expr = expr.replace(/e/g, Math.E.toString());

      // Handle scientific functions with parentheses
      while (/(?:sin|cos|tan|log|ln)\([^()]*\)/.test(expr)) {
        expr = expr.replace(/sin\(([^()]*)\)/g, (_, num) =>
          Math.sin(
            (parseFloat(evaluateExpression(num)) * Math.PI) / 180
          ).toString()
        );
        expr = expr.replace(/cos\(([^()]*)\)/g, (_, num) =>
          Math.cos(
            (parseFloat(evaluateExpression(num)) * Math.PI) / 180
          ).toString()
        );
        expr = expr.replace(/tan\(([^()]*)\)/g, (_, num) =>
          Math.tan(
            (parseFloat(evaluateExpression(num)) * Math.PI) / 180
          ).toString()
        );
        expr = expr.replace(/log\(([^()]*)\)/g, (_, num) =>
          Math.log10(parseFloat(evaluateExpression(num))).toString()
        );
        expr = expr.replace(/ln\(([^()]*)\)/g, (_, num) =>
          Math.log(parseFloat(evaluateExpression(num))).toString()
        );
      }

      // Handle square root (without parentheses)
      expr = expr.replace(/√(\d*\.?\d*)/g, (_, num) =>
        Math.sqrt(parseFloat(num)).toString()
      );

      // Handle inverse
      expr = expr.replace(/1\/\(([^()]*)\)/g, (_, num) =>
        (1 / parseFloat(evaluateExpression(num))).toString()
      );

      // Handle factorial
      expr = expr.replace(/(\d+)!/g, (_, num) => factorial(parseInt(num)));

      // Handle nested parentheses
      while (expr.includes("(")) {
        expr = expr.replace(/\(([^()]*)\)/g, (_, inner) =>
          evaluateExpression(inner)
        );
      }

      // Split by operators while keeping the operators in the array
      let tokens = expr.split(/([+\-×÷^])/);

      // Remove any empty strings from the array
      tokens = tokens.filter((token) => token !== "");

      // Handle multiplication and division first
      let i = 1;
      while (i < tokens.length) {
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

      // Handle addition and subtraction
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
    } catch (error) {
      throw new Error("Invalid expression");
    }
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

  const handleScientificFunction = (func) => {
    switch (func) {
      case "sqrt":
        if (showingResult || !equation) {
          setEquation("√");
        } else {
          setEquation(equation + "√");
        }
        break;

      case "sin":
      case "cos":
      case "tan":
      case "log":
      case "ln":
        if (showingResult) {
          setEquation(func + "(" + display + ")");
        } else {
          setEquation(equation + func + "(");
        }
        break;

      case "inv":
        if (showingResult) {
          setEquation("1/(" + display + ")");
        } else {
          setEquation(equation + "1/(");
        }
        break;

      case "factorial":
        if (showingResult) {
          setEquation(display + "!");
        } else {
          setEquation(equation + "!");
        }
        break;

      case "pi":
        if (showingResult || !equation) {
          setEquation("π");
        } else {
          setEquation(equation + "π");
        }
        break;

      case "e":
        if (showingResult || !equation) {
          setEquation("e");
        } else {
          setEquation(equation + "e");
        }
        break;
    }

    setShowingResult(false);
    setDisplay("");
    setIsNewNumber(false);
  };

  const clear = () => {
    setDisplay("");
    setEquation("");
    setShowingResult(false);
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (!showingResult) {
      let newEquation = equation;

      // Check for function names to delete
      const functions = ["sin(", "cos(", "tan(", "log(", "ln("];
      for (const func of functions) {
        if (equation.endsWith(func)) {
          newEquation = equation.slice(0, -func.length);
          setEquation(newEquation);
          setDisplay(calculateLiveResult(newEquation));
          return;
        }
      }

      // Normal backspace behavior
      newEquation = equation.slice(0, -1);
      setEquation(newEquation);
      setDisplay(calculateLiveResult(newEquation));
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
        {/* Header with mode toggle */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsScientific(!isScientific)}>
            <Icon
              name={isScientific ? "calculator-variant" : "calculator"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Display */}
        <View style={styles.displayWrapper}>
          <View style={styles.displayContainer}>
            <Text
              style={[
                styles.equationText,
                !showingResult ? styles.boldText : styles.smallText,
              ]}
              numberOfLines={1}
            >
              {equation}
            </Text>
            <Text
              style={[
                styles.displayText,
                showingResult ? styles.boldLargeText : styles.regularText,
              ]}
              numberOfLines={1}
            >
              {display}
            </Text>
          </View>
        </View>

        {/* Button Grid */}
        <View style={styles.buttonGrid}>
          {isScientific ? (
            <>
              <View style={styles.row}>
                <CalcButton
                  label="sin"
                  onClick={() => handleScientificFunction("sin")}
                />
                <CalcButton
                  label="cos"
                  onClick={() => handleScientificFunction("cos")}
                />
                <CalcButton
                  label="tan"
                  onClick={() => handleScientificFunction("tan")}
                />
                <CalcButton
                  label="rad"
                  onClick={() => handleScientificFunction("rad")}
                />
                <CalcButton
                  label="deg"
                  onClick={() => handleScientificFunction("deg")}
                />
              </View>
              <View style={styles.row}>
                <CalcButton
                  label="log"
                  onClick={() => handleScientificFunction("log")}
                />
                <CalcButton
                  label="ln"
                  onClick={() => handleScientificFunction("ln")}
                />
                <CalcButton label="(" onClick={() => handleNumber("(")} />
                <CalcButton label=")" onClick={() => handleNumber(")")} />
                <CalcButton
                  label="inv"
                  onClick={() => handleScientificFunction("inv")}
                />
              </View>
              <View style={styles.row}>
                <CalcButton
                  label="!"
                  onClick={() => handleScientificFunction("factorial")}
                />
                <CalcButton label="AC" onClick={clear} isOperator />
                <CalcButton label="%" onClick={handlePercentage} isOperator />
                <CalcButton label="⌫" onClick={handleBackspace} isOperator />
                <CalcButton
                  label="÷"
                  onClick={() => handleOperator("÷")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton label="^" onClick={() => handleOperator("^")} />
                <CalcButton label="7" onClick={() => handleNumber("7")} />
                <CalcButton label="8" onClick={() => handleNumber("8")} />
                <CalcButton label="9" onClick={() => handleNumber("9")} />
                <CalcButton
                  label="×"
                  onClick={() => handleOperator("×")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton
                  label="√"
                  onClick={() => handleScientificFunction("sqrt")}
                />
                <CalcButton label="4" onClick={() => handleNumber("4")} />
                <CalcButton label="5" onClick={() => handleNumber("5")} />
                <CalcButton label="6" onClick={() => handleNumber("6")} />
                <CalcButton
                  label="-"
                  onClick={() => handleOperator("-")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton
                  label="π"
                  onClick={() => handleScientificFunction("pi")}
                />
                <CalcButton label="1" onClick={() => handleNumber("1")} />
                <CalcButton label="2" onClick={() => handleNumber("2")} />
                <CalcButton label="3" onClick={() => handleNumber("3")} />
                <CalcButton
                  label="+"
                  onClick={() => handleOperator("+")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton
                  label="e"
                  onClick={() => handleScientificFunction("e")}
                />
                <CalcButton label="00" onClick={() => handleNumber("00")} />
                <CalcButton label="0" onClick={() => handleNumber("0")} />
                <CalcButton label="." onClick={() => handleNumber(".")} />
                <CalcButton label="=" onClick={calculate} isEqual />
              </View>
            </>
          ) : (
            <>
              <View style={styles.row}>
                <CalcButton label="AC" onClick={clear} isOperator />
                <CalcButton label="%" onClick={handlePercentage} isOperator />
                <CalcButton label="⌫" onClick={handleBackspace} isOperator />
                <CalcButton
                  label="÷"
                  onClick={() => handleOperator("÷")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton label="7" onClick={() => handleNumber("7")} />
                <CalcButton label="8" onClick={() => handleNumber("8")} />
                <CalcButton label="9" onClick={() => handleNumber("9")} />
                <CalcButton
                  label="×"
                  onClick={() => handleOperator("×")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton label="4" onClick={() => handleNumber("4")} />
                <CalcButton label="5" onClick={() => handleNumber("5")} />
                <CalcButton label="6" onClick={() => handleNumber("6")} />
                <CalcButton
                  label="-"
                  onClick={() => handleOperator("-")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton label="1" onClick={() => handleNumber("1")} />
                <CalcButton label="2" onClick={() => handleNumber("2")} />
                <CalcButton label="3" onClick={() => handleNumber("3")} />
                <CalcButton
                  label="+"
                  onClick={() => handleOperator("+")}
                  isOperator
                />
              </View>
              <View style={styles.row}>
                <CalcButton label="00" onClick={() => handleNumber("00")} />
                <CalcButton label="0" onClick={() => handleNumber("0")} />
                <CalcButton label="." onClick={() => handleNumber(".")} />
                <CalcButton label="=" onClick={calculate} isEqual />
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  calculatorContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 320,
    justifyContent: "center",
    paddingTop: 20,
  },
  header: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
  },
  displayWrapper: {
    marginBottom: 32,
    justifyContent: "flex-end",
    minHeight: 120,
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
    gap: 8,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    margin: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#fff",
    textAlign: "center",
  },
  scientificButtonText: {
    fontSize: 18,
    fontWeight: "400",
  },
  numberButton: {
    backgroundColor: "#333",
  },
  scientificButton: {
    backgroundColor: "#222",
  },
  operatorButton: {
    backgroundColor: "#666",
  },
  equalButton: {
    backgroundColor: "#0066ff",
  },
  modeToggle: {
    padding: 8,
    backgroundColor: "transparent",
  },
  modeToggleText: {
    color: "#fff",
    fontSize: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  // Additional style for active/pressed state
  buttonPressed: {
    opacity: 0.8,
  },
  // Style for disabled buttons
  buttonDisabled: {
    opacity: 0.5,
  },
  // Style for button text when disabled
  buttonTextDisabled: {
    color: "#999",
  },
  // Style for error state in display
  displayError: {
    color: "#ff4444",
  },
  // Style for parentheses and special characters
  specialCharacterText: {
    fontSize: 22,
    fontWeight: "400",
  },
  // Style for operator symbols
  operatorSymbolText: {
    fontSize: 24,
    fontWeight: "500",
  },
  // Specific style for backspace button
  backspaceButton: {
    backgroundColor: "#666",
  },
  // Style for buttons in scientific mode
  scientificModeButton: {
    backgroundColor: "#222",
  },
  // Style for currently selected angle mode (rad/deg)
  selectedModeText: {
    color: "#0066ff",
  },
});

export default Calculator;
