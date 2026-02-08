/**
 * Simple Calculator Script - Premium Version
 * Handles display updates, clearing, and calculation logic with validation.
 */

const resultDisplay = document.getElementById('result');

/**
 * Appends a number or operator to the display with basic validation.
 * @param {string} value - The value to append.
 */
function appendValue(value) {
    // Clear error or result animation state before new input
    resetDisplayState();

    const currentExpression = resultDisplay.value;
    const lastChar = currentExpression.slice(-1);
    const operators = ['+', '-', '*', '/', '×', '÷'];

    // Validation: Prevent starting with operators like × or ÷
    if (currentExpression === '' && ['*', '/', '×', '÷'].includes(value)) {
        triggerError();
        return;
    }

    // Validation: Prevent multiple operators in a row
    if (operators.includes(lastChar) && operators.includes(value)) {
        // Replace previous operator with the new one
        resultDisplay.value = currentExpression.slice(0, -1) + value;
        return;
    }

    resultDisplay.value += value;

    // Auto-scroll to the right
    resultDisplay.scrollLeft = resultDisplay.scrollWidth;
}

/**
 * Resets the display and removes enhancement classes.
 */
function clearDisplay() {
    resetDisplayState();
    resultDisplay.value = '';
}

/**
 * Helper to remove animation and error classes.
 */
function resetDisplayState() {
    resultDisplay.classList.remove('error-state', 'result-fade-in');
    if (resultDisplay.value === 'Error') {
        resultDisplay.value = '';
    }
}

/**
 * Triggers a visual error feedback.
 */
function triggerError() {
    resultDisplay.classList.add('error-state');
    setTimeout(() => {
        resultDisplay.classList.remove('error-state');
    }, 400); // Match CSS animation duration
}

/**
 * Evaluates the mathematical expression.
 */
function calculateResult() {
    const expression = resultDisplay.value;

    if (!expression) return;

    try {
        // Replace visual characters if any
        const formattedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

        // Division by zero check
        if (formattedExpression.includes('/0')) {
            throw new Error('DivByZero');
        }

        const result = new Function(`return ${formattedExpression}`)();

        if (Number.isFinite(result)) {
            // Round to 8 decimal places
            const roundedResult = Math.round(result * 100000000) / 100000000;
            resultDisplay.value = roundedResult;

            // Add premium reveal animation
            resultDisplay.classList.add('result-fade-in');
        } else {
            throw new Error('Invalid');
        }
    } catch (error) {
        resultDisplay.value = 'Error';
        triggerError();
    }
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) {
        appendValue(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendValue(key);
    } else if (key === '.') {
        appendValue('.');
    } else if (key === 'Enter') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        resultDisplay.value = resultDisplay.value.slice(0, -1);
    } else if (key === 'Delete') {
        clearDisplay();
    }
});
