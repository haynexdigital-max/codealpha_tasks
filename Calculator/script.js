
const display = document.getElementById("display");
const preview = document.getElementById("preview");
const buttons = document.querySelectorAll(".buttons button");

const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");

let expression = "";

// Display the current expression
function showExpression() {
    display.value = expression
        .replace(/\*/g, "×")
        .replace(/\//g, "÷")
        .replace(/-/g, "−");

    updatePreview();
}

// Calculate expression
function calculate() {
    if (!expression) {
        throw new Error("Empty expression");
    }

    if (/[+\-*/.]$/.test(expression)) {
        throw new Error("Incomplete expression");
    }

    if (!/^[0-9+\-*/. ]+$/.test(expression)) {
        throw new Error("Invalid expression");
    }

    const result = Function(
        '"use strict"; return (' + expression + ')'
    )();

    if (!Number.isFinite(result)) {
        throw new Error("Invalid calculation");
    }

    return Number(result.toPrecision(12));
}

// Live result preview
function updatePreview() {
    try {
        const result = calculate();
        preview.textContent = "Result: " + result;
    } catch {
        preview.textContent = "Result: ...";
    }
}

// Add numbers and operators
function addValue(value) {
    const operators = ["+", "-", "*", "/"];

    if (operators.includes(value)) {

        if (!expression && value !== "-") return;

        if (operators.includes(expression.slice(-1))) {
            expression = expression.slice(0, -1);
        }

        expression += value;
    }

    else if (value === ".") {

        const currentNumber =
            expression.split(/[+\-*/]/).pop();

        if (currentNumber.includes(".")) return;

        expression += currentNumber ? "." : "0.";
    }

    else {
        expression += value;
    }

    showExpression();
}

// Add calculation to history
function addToHistory(oldExpression, result) {
    if (!historyList) return;

    const emptyMessage = historyList.querySelector("li");

    if (
        emptyMessage &&
        emptyMessage.textContent === "No calculations yet"
    ) {
        historyList.innerHTML = "";
    }

    const item = document.createElement("li");

    const formattedExpression = oldExpression
        .replace(/\*/g, "×")
        .replace(/\//g, "÷")
        .replace(/-/g, "−");

    item.textContent = formattedExpression + " = " + result;

    historyList.prepend(item);

    // Keep only the latest 10 calculations
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastElementChild);
    }
}

// Clear calculation history
function clearHistory() {
    if (!historyList) return;

    historyList.innerHTML = "";

    const item = document.createElement("li");
    item.textContent = "No calculations yet";

    historyList.appendChild(item);
}

// Clear history button
if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", clearHistory);
}

// Calculator button functionality
buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent.trim();

        // Clear calculator
        if (value === "C") {
            expression = "";
            display.value = "";
            preview.textContent = "Result: 0";
        }

        // Delete last character
        else if (value === "DEL") {
            expression = expression.slice(0, -1);
            showExpression();
        }

        // Calculate result
        else if (value === "=") {

            try {
                const oldExpression = expression;
                const result = calculate();

                addToHistory(oldExpression, result);

                expression = String(result);

                showExpression();

            } catch {
                expression = "";
                display.value = "Error";
                preview.textContent = "Invalid calculation";
            }
        }

        // Handle numbers and operators
        else {
            const symbols = {
                "×": "*",
                "÷": "/",
                "−": "-"
            };

            addValue(symbols[value] || value);
        }

    });

});

// Keyboard support
document.addEventListener("keydown", event => {

    const key = event.key;

    // Numbers and decimal point
    if (/^[0-9.]$/.test(key)) {
        addValue(key);
    }

    // Mathematical operators
    else if (["+", "-", "*", "/"].includes(key)) {
        addValue(key);
    }

    // Calculate
    else if (key === "Enter" || key === "=") {
        event.preventDefault();

        document.querySelector(".equal").click();
    }

    // Delete
    else if (key === "Backspace") {
        expression = expression.slice(0, -1);
        showExpression();
    }

    // Clear calculator
    else if (key === "Escape") {
        expression = "";
        display.value = "";
        preview.textContent = "Result: 0";
    }

});

// Initial display
showExpression();
