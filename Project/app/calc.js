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
  const [isRadianMode, setIsRadianMode] = useState(false); // Default to degrees
  const [isInverseMode, setIsInverseMode] = useState(false);

  const degToRad = (degrees) => (degrees * Math.PI) / 180;

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
      let formatted = eq.replace(/\d+(\.\d+)?/g, (match) =>
        formatNumberWithCommas(match)
      );
      // Add superscript formatting for inverse trig functions
      formatted = formatEquationDisplay(formatted);
      return formatted;
    };

    const formattedText = formatEquation(text);

    // Adjust cursor position for the formatted text
    let adjustedPosition = position;
    const beforeCursor = text.slice(0, position);
    const formattedBeforeCursor = formatEquation(beforeCursor);
    adjustedPosition = formattedBeforeCursor.length;

    return (
      <Text style={[styles.equationText, styles.boldText]}>
        {formattedText.slice(0, adjustedPosition)}
        <Animated.Text style={[styles.cursor, { opacity }]}>|</Animated.Text>
        {formattedText.slice(adjustedPosition) || " "}
      </Text>
    );
  };

  const calculateLiveResult = (expr, mode = isRadianMode) => {
    try {
      if (!expr) return "";

      // Handle percentage calculations first
      expr = expr.replace(/(\d+\.?\d*)%/g, (_, num) => {
        return (parseFloat(num) / 100).toString();
      });

      // Remove trailing operator for calculation
      let tempExpr = expr;
      const endsWithOperator = /[+\-×÷^]$/.test(tempExpr);

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

      // Pass the mode to evaluateExpression
      const result = evaluateExpression(tempExpr, mode);
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

  const evaluateExpression = (expr, mode = isRadianMode) => {
    try {
      if (!expr) return "";

      // Handle implicit multiplication
      expr = expr.replace(/(\d+|\))(?=\()/g, "$1×"); // 2(5) -> 2×(5)
      expr = expr.replace(/\)(\d+)/g, ")×$1"); // (2)5 -> (2)×5
      expr = expr.replace(/(\d)\(/g, "$1×("); // 2(3) -> 2×(3)

      // Handle percentage calculations
      expr = expr.replace(/(\d+\.?\d*)%/g, (_, num) => {
        return (parseFloat(num) / 100).toString();
      });

      // Remove trailing operator for calculation
      let tempExpr = expr;
      const endsWithOperator = /[+\-×÷^]$/.test(tempExpr);
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

      // Handle implicit multiplication after trigonometric functions and parentheses
      tempExpr = tempExpr.replace(/(\))(\d+|[πe√]|sin|cos|tan)/g, "$1×$2");
      tempExpr = tempExpr.replace(
        /(sin|cos|tan)\(([^()]*)\)(\d+|[πe√])/g,
        "$1($2)×$3"
      );

      // Handle factorial before other operations
      while (tempExpr.includes("!")) {
        tempExpr = tempExpr.replace(
          /(\d+\.?\d*|\([^()]*\))!(\d+|\()?/g,
          (match, number, after) => {
            // Remove parentheses if present and evaluate the expression inside
            if (number.startsWith("(") && number.endsWith(")")) {
              number = evaluateExpression(number.slice(1, -1), mode);
            }

            const n = parseInt(number);
            if (n !== parseFloat(number)) {
              throw new Error("Factorial requires whole numbers");
            }
            if (n < 0) throw new Error("Invalid input");
            if (n === 0 || n === 1) return after ? `1×${after}` : "1";
            if (n > 170) return after ? `Infinity×${after}` : "Infinity";

            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;

            // Add multiplication sign if there's a number or parenthesis after
            return after ? `${result}×${after}` : result.toString();
          }
        );
      }

      // Handle inverse trig functions first
      while (/(?:sin|cos|tan)-1\([^()]*\)/.test(tempExpr)) {
        tempExpr = tempExpr.replace(/sin-1\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          if (value < -1 || value > 1) throw new Error("Domain error");
          let result = Math.asin(value);
          if (!mode) {
            result = (result * 180) / Math.PI;
          }
          return result.toString();
        });

        tempExpr = tempExpr.replace(/cos-1\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          if (value < -1 || value > 1) throw new Error("Domain error");
          let result = Math.acos(value);
          if (!mode) {
            result = (result * 180) / Math.PI;
          }
          return result.toString();
        });

        tempExpr = tempExpr.replace(/tan-1\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          let result = Math.atan(value);
          if (!mode) {
            result = (result * 180) / Math.PI;
          }
          return result.toString();
        });
      }

      // Handle regular trig functions
      while (/(?:sin|cos|tan)\([^()]*\)/.test(tempExpr)) {
        tempExpr = tempExpr.replace(/sin\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          const angleInRad = mode ? value : degToRad(value);
          const result = Math.sin(angleInRad);
          return Math.abs(result) < 1e-10 ? "0" : result.toString();
        });

        tempExpr = tempExpr.replace(/cos\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          const angleInRad = mode ? value : degToRad(value);
          const result = Math.cos(angleInRad);
          return Math.abs(result) < 1e-10 ? "0" : result.toString();
        });

        tempExpr = tempExpr.replace(/tan\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          const angleInRad = mode ? value : degToRad(value);
          if (Math.abs(Math.cos(angleInRad)) < 1e-10) {
            throw new Error("Undefined");
          }
          const result = Math.tan(angleInRad);
          return Math.abs(result) < 1e-10 ? "0" : result.toString();
        });
      }

      // Handle inverse logarithms (10^x and e^x) before regular logarithms
      while (/(?:10|e)\^(-?\d*\.?\d+|\([^()]*\))/.test(tempExpr)) {
        tempExpr = tempExpr.replace(
          /10\^(-?\d*\.?\d+|\([^()]*\))/g,
          (_, num) => {
            const value = parseFloat(evaluateExpression(num, mode));
            return Math.pow(10, value).toString();
          }
        );
        tempExpr = tempExpr.replace(
          /e\^(-?\d*\.?\d+|\([^()]*\))/g,
          (_, num) => {
            const value = parseFloat(evaluateExpression(num, mode));
            return Math.exp(value).toString();
          }
        );
      }

      // Handle logarithms
      while (/(?:log|ln)\([^()]*\)/.test(tempExpr)) {
        tempExpr = tempExpr.replace(/log\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          if (value <= 0) throw new Error("Invalid input");
          return Math.log10(value).toString();
        });

        tempExpr = tempExpr.replace(/ln\(([^()]*)\)/g, (_, num) => {
          const value = parseFloat(evaluateExpression(num, mode));
          if (value <= 0) throw new Error("Invalid input");
          return Math.log(value).toString();
        });
      }

      // Handle square root with implicit multiplication
      tempExpr = tempExpr.replace(
        /(\d*\.?\d*)?√(-?\d*\.?\d+)/g,
        (match, coeff, number) => {
          const value = parseFloat(number);
          if (value < 0) throw new Error("Invalid input");
          const sqrtResult = Math.sqrt(value);
          return coeff ? `${coeff}*${sqrtResult}` : sqrtResult.toString();
        }
      );

      // Handle percentage calculations after exponents
      expr = expr.replace(/(\d+\.?\d*)%(?!\^)/g, (_, num) => {
        return `(${num}/100)`;
      });

      // Handle exponents with implicit multiplication
      while (tempExpr.includes("^")) {
        tempExpr = tempExpr.replace(
          /(-?\d*\.?\d+)\^(-?\d*\.?\d+)(?=\d)/g,
          (_, base, exp) => {
            const result = Math.pow(parseFloat(base), parseFloat(exp));
            return `${result}×`; // Add multiplication operator after exponent
          }
        );

        tempExpr = tempExpr.replace(
          /(-?\d*\.?\d+)\^(-?\d*\.?\d+)/g,
          (_, base, exp) => {
            return Math.pow(parseFloat(base), parseFloat(exp));
          }
        );
      }

      // Handle remaining percentages after all operations
      tempExpr = tempExpr.replace(/(\d+\.?\d*)%/g, (_, num) => {
        return `(${num}/100)`;
      });

      // Add implicit multiplication for remaining cases
      tempExpr = tempExpr.replace(/π(\d+)/g, "π×$1"); // π2 -> π×2
      tempExpr = tempExpr.replace(/e(\d+)/g, "e×$1"); // e2 -> e×2
      tempExpr = tempExpr.replace(/π\(/g, "π×("); // π(2) -> π×(2)
      tempExpr = tempExpr.replace(/e\(/g, "e×("); // e(2) -> e×(2)
      tempExpr = tempExpr.replace(/(\d+)π/g, "$1×π"); // 2π -> 2×π
      tempExpr = tempExpr.replace(/(\d+)e/g, "$1×e"); // 2e -> 2×e

      // Replace constants
      tempExpr = tempExpr.replace(/π/g, Math.PI.toString());
      tempExpr = tempExpr.replace(/e/g, Math.E.toString());

      // Evaluate remaining arithmetic
      const result = eval(tempExpr.replace(/×/g, "*").replace(/÷/g, "/"));

      // Format the result
      const formattedResult = parseFloat(result.toFixed(10));
      return isNaN(formattedResult) ? "" : formattedResult;
    } catch (error) {
      throw new Error(error.message || "Invalid expression");
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

  const TrigButton = ({ func, onClick }) => (
    <TouchableOpacity
      style={[styles.button, styles.numberButton]}
      onPress={onClick}
    >
      <View style={styles.trigButtonContent}>
        <Text style={styles.buttonText}>{func}</Text>
        {isInverseMode && (
          <Text style={styles.superscriptText}>{"\u207B\u00B9"}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const SqrtButton = ({ onClick }) => (
    <TouchableOpacity
      style={[styles.button, styles.numberButton]}
      onPress={onClick}
    >
      <View style={styles.trigButtonContent}>
        {isInverseMode ? (
          <View style={styles.superContainer}>
            <Text style={styles.buttonText}>x</Text>
            <Text style={styles.superscriptText}>2</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>√</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const LogButton = ({ onClick }) => (
    <TouchableOpacity
      style={[styles.button, styles.numberButton]}
      onPress={onClick}
    >
      <View style={styles.trigButtonContent}>
        {isInverseMode ? (
          <View style={styles.superContainer}>
            <Text style={styles.buttonText}>10</Text>
            <Text style={styles.superscriptText}>x</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>log</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const LnButton = ({ onClick }) => (
    <TouchableOpacity
      style={[styles.button, styles.numberButton]}
      onPress={onClick}
    >
      <View style={styles.trigButtonContent}>
        {isInverseMode ? (
          <View style={styles.superContainer}>
            <Text style={styles.buttonText}>e</Text>
            <Text style={styles.superscriptText}>x</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>ln</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const formatEquationDisplay = (text) => {
    // Handle inverse trig functions
    let formatted = text.replace(/(sin|cos|tan)-1\(/g, (match, func) => {
      return `${func}\u207B\u00B9(`; // Using unicode superscript characters
    });
    // Handle squared numbers using superscript 2
    formatted = formatted.replace(/\^2/g, "\u00B2");
    return formatted;
  };

  const handleScientificFunction = (func) => {
    let newEquation;
    let newPosition;

    switch (func) {
      case "sqrt":
        if (isInverseMode) {
          // Handle x²
          if (showingResult) {
            // If showing result, add square to the result
            newEquation = display + "^2";
            newPosition = newEquation.length;
          } else {
            // Check if there's a valid number or expression to square
            const beforeCursor = equation.slice(0, cursorPosition);
            const hasValidBase = /[\d)πe]$/.test(beforeCursor);

            if (!hasValidBase) {
              return; // Don't add square if there's no valid base
            }

            newEquation =
              equation.slice(0, cursorPosition) +
              "^2" +
              equation.slice(cursorPosition);
            newPosition = cursorPosition + 2;
          }
        } else {
          // Original √ functionality
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
        }
        break;

      case "sin":
      case "cos":
      case "tan":
        if (showingResult) {
          newEquation =
            func + (isInverseMode ? "-1" : "") + "(" + display + ")";
          newPosition = newEquation.length;
        } else {
          const funcStr = func + (isInverseMode ? "-1" : "") + "(";
          newEquation =
            equation.slice(0, cursorPosition) +
            funcStr +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + funcStr.length;
        }
        break;

      case "log":
        if (showingResult) {
          if (isInverseMode) {
            // 10^x
            newEquation = "10^(" + display + ")";
          } else {
            newEquation = "log(" + display + ")";
          }
          newPosition = newEquation.length;
        } else {
          const funcStr = isInverseMode ? "10^(" : "log(";
          newEquation =
            equation.slice(0, cursorPosition) +
            funcStr +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + funcStr.length;
        }
        break;

      case "ln":
        if (showingResult) {
          if (isInverseMode) {
            // e^x
            newEquation = "e^(" + display + ")";
          } else {
            newEquation = "ln(" + display + ")";
          }
          newPosition = newEquation.length;
        } else {
          const funcStr = isInverseMode ? "e^(" : "ln(";
          newEquation =
            equation.slice(0, cursorPosition) +
            funcStr +
            equation.slice(cursorPosition);
          newPosition = cursorPosition + funcStr.length;
        }
        break;

      case "inv":
        // Toggle inverse mode
        setIsInverseMode(!isInverseMode);
        return;

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

  const handleAngleModeChange = (newMode) => {
    setIsRadianMode(newMode);
    if (equation) {
      // Pass the new mode directly to calculateLiveResult
      const newResult = calculateLiveResult(equation, newMode);
      setDisplay(newResult);
    }
  };

  const handleBackspace = () => {
    if (showingResult || cursorPosition === 0) return;

    const functions = [
      "sin-1(",
      "cos-1(",
      "tan-1(",
      "sin(",
      "cos(",
      "tan(",
      "log(",
      "ln(",
      "10^(",
      "e^(",
      "^2",
    ];
    const beforeCursor = equation.slice(0, cursorPosition);
    let newEquation;

    // Check if cursor is after any function
    for (const func of functions) {
      if (beforeCursor.endsWith(func)) {
        newEquation =
          equation.slice(0, cursorPosition - func.length) +
          equation.slice(cursorPosition);
        setEquation(newEquation);
        setCursorPosition(cursorPosition - func.length);
        setDisplay(calculateLiveResult(newEquation));
        return;
      }
    }

    // Normal backspace - remove single character
    newEquation =
      equation.slice(0, cursorPosition - 1) + equation.slice(cursorPosition);
    setEquation(newEquation);
    setCursorPosition(cursorPosition - 1);
    setDisplay(calculateLiveResult(newEquation));
  };

  const CalcButton = ({
    label,
    onClick,
    isOperator = false,
    isEqual = false,
    isActive = false,
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
      <Text
        style={[
          styles.buttonText,
          isActive && styles.activeButtonText, // Apply active style when button is active
        ]}
      >
        {label}
      </Text>
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
                <TrigButton
                  func="sin"
                  onClick={() => handleScientificFunction("sin")}
                />
                <TrigButton
                  func="cos"
                  onClick={() => handleScientificFunction("cos")}
                />
                <TrigButton
                  func="tan"
                  onClick={() => handleScientificFunction("tan")}
                />
                <CalcButton
                  label="rad"
                  onClick={() => handleAngleModeChange(true)}
                  isActive={isRadianMode}
                />
                <CalcButton
                  label="deg"
                  onClick={() => handleAngleModeChange(false)}
                  isActive={!isRadianMode}
                />
              </View>
              <View style={styles.row}>
                <LogButton onClick={() => handleScientificFunction("log")} />
                <LnButton onClick={() => handleScientificFunction("ln")} />
                <CalcButton label="(" onClick={() => handleNumber("(")} />
                <CalcButton label=")" onClick={() => handleNumber(")")} />
                <CalcButton
                  label="inv"
                  onClick={() => handleScientificFunction("inv")}
                  isActive={isInverseMode}
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
                <SqrtButton onClick={() => handleScientificFunction("sqrt")} />
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
  trigButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  superContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  superscriptText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 0,
    marginLeft: 1,
  },
  equationText: {
    lineHeight: 60,
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
  activeButtonText: {
    color: "#0066ff", // Blue color for active state
    fontWeight: "600",
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
