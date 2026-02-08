/**
 * Simple Calculator Script
 * Handles display updates, clearing, and calculation logic.
 */

const resultDisplay = document.getElementById('result');

/**
 * Appends a number or operator to the display.
 * @param {string} value - The value to append.
 */
function appendValue(value) {
    // If there's an error message, clear it before starting new input
    if (resultDisplay.value === 'Error') {
        resultDisplay.value = '';
    }

    // Prevent multiple decmial points in a single value is complex with eval, 
    // but for simplicity, we append directly. Eval handles most cases.
    resultDisplay.value += value;

    // Auto-scroll to the right so user sees current input
    resultDisplay.scrollLeft = resultDisplay.scrollWidth;
}

/**
 * Resets the display to an empty string.
 */
function clearDisplay() {
    resultDisplay.value = '';
}

/**
 * Evaluates the mathematical expression in the display.
 * Handles basic arithmetic and division by zero.
 */
function calculateResult() {
    const expression = resultDisplay.value;

    if (!expression) return;

    try {
        // Use Function constructor instead of eval for a slightly safer alternative
        // It takes the string and treats it as a return value of a function.
        // We replace 'x' and '÷' if they were used (though buttons use * and /)
        const formattedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

        // Division by zero check
        if (formattedExpression.includes('/0')) {
            throw new Error('DivByZero');
        }

        const result = new Function(`return ${formattedExpression}`)();

        // Format result to avoid long decimals (e.g., 0.1 + 0.2)
        if (Number.isFinite(result)) {
            // Round to 8 decimal places if it's a decimal
            const roundedResult = Math.round(result * 100000000) / 100000000;
            resultDisplay.value = roundedResult;
        } else {
            resultDisplay.value = 'Error';
        }
    } catch (error) {
        resultDisplay.value = 'Error';
    }
}

// Allow keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Numbers 0-9
    if (/[0-9]/.test(key)) {
        appendValue(key);
    }
    // Operators
    else if (['+', '-', '*', '/'].includes(key)) {
        appendValue(key);
    }
    // Decimal point
    else if (key === '.') {
        appendValue('.');
    }
    // Enter key for result
    else if (key === 'Enter') {
        event.preventDefault(); // Prevent accidental form submission
        calculateResult();
    }
    // Escape or Backspace for clear/delete
    else if (key === 'Escape') {
        clearDisplay();
    }
    else if (key === 'Backspace') {
        resultDisplay.value = resultDisplay.value.slice(0, -1);
    }
});
