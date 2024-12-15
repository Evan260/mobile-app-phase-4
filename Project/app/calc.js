import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Calculator = () => {
  const [display, setDisplay] = useState("");
  const [equation, setEquation] = useState("");
  const [showingResult, setShowingResult] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const formatNumberWithCommas = (number) => {
    // Handle decimal numbers
    const parts = number.toString().split(".");
    const wholePart = parts[0];
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";

    // Add commas to the whole number part
    return wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimalPart;
  };

  const handleEquationChange = (text) => {
    setEquation(text);
    setDisplay(calculateLiveResult(text));
    setShowingResult(false);
  };

  const handleSelectionChange = (event) => {
    setCursorPosition(event.nativeEvent.selection.start);
  };

  const BlinkingCursor = ({ position, text }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();
      return () => animation.stop();
    }, []);

    // Format numbers in the equation while preserving operators and functions
    const formatEquation = (eq) => {
      return eq.replace(/\d+(\.\d+)?/g, (match) =>
        formatNumberWithCommas(match)
      );
    };

    const formattedText = formatEquation(text);

    // Calculate cursor position adjustment due to added commas
    const originalBeforeCursor = text.slice(0, position);
    const formattedBeforeCursor = formatEquation(originalBeforeCursor);
    const positionAdjustment =
      formattedBeforeCursor.length - originalBeforeCursor.length;
    const adjustedPosition = position + positionAdjustment;

    return (
      <Text style={[styles.equationText, styles.boldText]}>
        {formattedText.slice(0, adjustedPosition)}
        <Animated.Text style={[styles.cursor, { opacity }]}>|</Animated.Text>
        {formattedText.slice(adjustedPosition) || " "}
      </Text>
    );
  };

  const calculateLiveResult = (expr) => {
    try {
      if (!expr) return "";

      // Handle percentage calculations first
      expr = expr.replace(/(\d+\.?\d*)%/g, (_, num) => {
        return (parseFloat(num) / 100).toString();
      });

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

      return formatNumberWithCommas(formattedResult).toString();
    } catch (error) {
      return "";
    }
  };

  const handleNumber = (num) => {
    if (showingResult) {
      setDisplay("");
      setEquation(num);
      setCursorPosition(num.length);
      setShowingResult(false);
    } else {
      const newEquation =
        equation.slice(0, cursorPosition) +
        num +
        equation.slice(cursorPosition);
      setEquation(newEquation);
      setCursorPosition(cursorPosition + num.length);
      setDisplay(calculateLiveResult(newEquation));
    }
  };

  const handleOperator = (operator) => {
    if (showingResult) {
      const newEquation = display + operator;
      setEquation(newEquation);
      setCursorPosition(newEquation.length);
      setDisplay(calculateLiveResult(newEquation));
    } else {
      const newEquation =
        equation.slice(0, cursorPosition) +
        operator +
        equation.slice(cursorPosition);
      setEquation(newEquation);
      setCursorPosition(cursorPosition + operator.length);
      setDisplay(calculateLiveResult(newEquation));
    }
    setShowingResult(false);
  };

  const handlePercentage = () => {
    let newEquation;
    let newPosition;

    if (showingResult) {
      newEquation = display + "%";
      newPosition = newEquation.length;
    } else {
      newEquation =
        equation.slice(0, cursorPosition) +
        "%" +
        equation.slice(cursorPosition);
      newPosition = cursorPosition + 1;
    }

    setEquation(newEquation);
    setCursorPosition(newPosition);
    setDisplay(calculateLiveResult(newEquation));
    setShowingResult(false);
  };

  const factorial = (n) => {
    // Handle edge cases
    if (n < 0) return "Error";
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // JavaScript's limit for factorial calculations

    // Calculate factorial
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
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
      expr = expr.replace(/(\d+)!/g, (match, num) => {
        const factorialResult = factorial(parseInt(num));
        if (factorialResult === "Error") throw new Error("Invalid factorial");
        return factorialResult.toString();
      });

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
    } catch (error) {
      setDisplay("Error");
      setEquation("");
      setShowingResult(true);
    }
  };

  const handleScientificFunction = (func) => {
    let newEquation;
    let newPosition;

    switch (func) {
      case "sqrt":
        if (showingResult || !equation) {
          newEquation = "√";
          newPosition = 1;
        } else {
          newEquation =
            equation.slice(0, cursorPosition) +
            "√" +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + 1;
        }
        break;

      case "sin":
      case "cos":
      case "tan":
      case "log":
      case "ln":
        if (showingResult) {
          newEquation = func + "(" + display + ")";
          newPosition = newEquation.length;
        } else {
          const funcStr = func + "(";
          newEquation =
            equation.slice(0, cursorPosition) +
            funcStr +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + funcStr.length;
        }
        break;

      case "inv":
        if (showingResult) {
          newEquation = "1/(" + display + ")";
          newPosition = newEquation.length;
        } else {
          const invStr = "1/(";
          newEquation =
            equation.slice(0, cursorPosition) +
            invStr +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + invStr.length;
        }
        break;

      case "factorial":
        if (showingResult) {
          newEquation = display + "!";
          newPosition = newEquation.length;
        } else {
          newEquation =
            equation.slice(0, cursorPosition) +
            "!" +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + 1;
        }
        break;

      case "pi":
        if (showingResult || !equation) {
          newEquation = "π";
          newPosition = 1;
        } else {
          newEquation =
            equation.slice(0, cursorPosition) +
            "π" +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + 1;
        }
        break;

      case "e":
        if (showingResult || !equation) {
          newEquation = "e";
          newPosition = 1;
        } else {
          newEquation =
            equation.slice(0, cursorPosition) +
            "e" +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + 1;
        }
        break;
    }

    setEquation(newEquation);
    setCursorPosition(newPosition);
    setShowingResult(false);
    setDisplay(calculateLiveResult(newEquation));
  };

  const clear = () => {
    setDisplay("");
    setEquation("");
    setCursorPosition(0);
    setShowingResult(false);
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
            <View style={styles.inputWrapper}>
              onTouchStart=
              {() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              <TextInput
                style={[
                  styles.equationText,
                  !showingResult ? styles.boldText : styles.smallText,
                  styles.hiddenInput,
                ]}
                value={equation}
                onChangeText={handleEquationChange}
                onSelectionChange={handleSelectionChange}
                selection={{ start: cursorPosition, end: cursorPosition }}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="visible-password"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {!showingResult && (
                <View style={styles.cursorContainer} pointerEvents="none">
                  <BlinkingCursor
                    position={cursorPosition}
                    text={equation || " "}
                  />
                </View>
              )}
            </View>
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
  // Main container styles
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

  // Header styles
  header: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
  },

  // Display styles
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
    height: 60,
    padding: 0,
    minWidth: 20,
  },
  displayText: {
    color: "#666",
    fontSize: 24,
    textAlign: "right",
    fontWeight: "300",
    height: 30,
  },

  // Blinking cursor
  inputWrapper: {
    height: 60,
    position: "relative",
  },
  cursorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 1,
  },
  cursor: {
    color: "#0066ff",
    fontWeight: "100",
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    zIndex: 2,
  },

  // Text variations
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

  // Button grid and layout
  buttonGrid: {
    gap: 12,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },

  // Button base styles
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#fff",
    textAlign: "center",
  },

  // Button variations
  numberButton: {
    backgroundColor: "#333",
  },
  operatorButton: {
    backgroundColor: "#666",
  },
  equalButton: {
    backgroundColor: "#0066ff",
  },
  scientificButton: {
    backgroundColor: "#222",
  },
  backspaceButton: {
    backgroundColor: "#666",
  },
  scientificModeButton: {
    backgroundColor: "#222",
  },

  // Text variations for different button types
  scientificButtonText: {
    fontSize: 16,
    fontWeight: "400",
  },
  specialCharacterText: {
    fontSize: 22,
    fontWeight: "400",
  },
  operatorSymbolText: {
    fontSize: 24,
    fontWeight: "500",
  },

  // State-specific styles
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: "#999",
  },
  displayError: {
    color: "#ff4444",
  },
  selectedModeText: {
    color: "#0066ff",
  },

  // Mode toggle styles
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
});

export default Calculator;
