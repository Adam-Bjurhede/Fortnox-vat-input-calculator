function addCalculatorFunctionality(vatField: HTMLInputElement) {
    vatField.style.borderBlockColor = 'orange'
	vatField.addEventListener('keydown', ({ key }: KeyboardEvent) => {
		if (key === 'Enter') {
			const value = vatField.value.trim();
			if (!value) return;

			const result = calculateExpression(value);
			if (result !== null) {
				vatField.value = result.toString();
				vatField.setAttribute('data-model-value', result.toString());
			}
		}
	});

	console.log("Calculator attached to VAT field!");
}

function calculateExpression(expression: string): number | null {
    try {
        // Input validation
        if (typeof expression !== 'string') {
            console.error("Invalid input type");
            return null;
        }

        // Normalize input: replace commas with dots and remove spaces
        expression = expression.replace(/,/g, '.').replace(/\s+/g, '');

        // Validate expression format
        if (!/^[\d.+\-*/]+$/.test(expression)) {
            console.error("Invalid characters in expression");
            return null;
        }

        // Split numbers and operators with proper regex
        const parts = expression.match(/(\d+(\.\d+)?|[-+*/])/g);

        if (!parts || parts.length < 1) {
            console.error("Invalid expression format");
            return null;
        }

        // Validate that expression starts and ends with numbers
        if (isOperator(parts[0]) || isOperator(parts[parts.length - 1])) {
            console.error("Expression cannot start or end with operator");
            return null;
        }

        const numbers: number[] = [];
        const operators: string[] = [];

        parts.forEach(part => {
            if (!isNaN(parseFloat(part))) {
                numbers.push(parseFloat(part));
            } else if (isOperator(part)) {
                operators.push(part);
            }
        });

        // Validate operators and numbers count
        if (numbers.length !== operators.length + 1) {
            console.error("Invalid expression structure");
            return null;
        }

        // Step 1: Process * and /
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '*' || operators[i] === '/') {
                const a = numbers[i];
                const b = numbers[i + 1];
                
                if (operators[i] === '/' && b === 0) {
                    console.error("Division by zero");
                    return null;
                }

                numbers.splice(i, 2, operators[i] === '*' ? a * b : a / b);
                operators.splice(i, 1);
                i--; // Adjust index after modification
            }
        }

        // Step 2: Process + and -
        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '+') result += numbers[i + 1];
            if (operators[i] === '-') result -= numbers[i + 1];
        }

        return isFinite(result) ? result : null;
    } catch (error) {
        console.error("Calculation error:", error);
        return null;
    }
}

function isOperator(char: string): boolean {
    return ['+', '-', '*', '/'].includes(char);
}

function observeIframe() {
	const observer = new MutationObserver(() => {
		console.log('Observing for Iframe')
		const iframe = document.getElementById('iframeApp') as HTMLIFrameElement;
		if (iframe) {
			observer.disconnect()
			iframe.addEventListener('load', () => initIframe(iframe));
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

function observeVatField(iframeDoc: Document) {
	const observer = new MutationObserver(() => {
		console.log('Observing for VAT input')

		const vatField = iframeDoc.getElementById('form-supplierinvoice-vat') as HTMLInputElement;

		if (vatField) {
			observer.disconnect()
			addCalculatorFunctionality(vatField);
		}
	});

	observer.observe(iframeDoc.body, { childList: true, subtree: true })
}

function initIframe(iframe: HTMLIFrameElement) {
	const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
	if (iframeDoc) {
		observeVatField(iframeDoc);
	}
}

observeIframe();