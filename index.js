const operators = ['-', '+', '*', '/'];

function addCalculatorFunctionality(vatField) {
	if (!vatField) return;

	vatField.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			const value = e.target?.value.trim();

			if (!value) return;

			const operator = operators.find(op => value.includes(op));

			if (operator) {
				const [first, second] = value.split(operator).map(num => parseFloat(num.replace(',','.').trim()));

				if (!isNaN(first) && !isNaN(second)) {
					let result;
					switch (operator) {
						case '+': result = first + second; break;
						case '-': result = first - second; break;
						case '*': result = first * second; break;
						case '/': result = second !== 0 ? first / second : 'Error'; break;
					}

					vatField.value = result;
					vatField.setAttribute('data-model-value', result);
				}
			}
		}
	});
	console.log("Calculator attached to VAT field!");
}

function getIframe() {
	const iframe = document.getElementById('iframeApp');

	if (!iframe) {
		console.log("Waiting for iframe...");
		setTimeout(getIframe, 500); // Retry after 500ms
		return;
	}

	// Listen for the load event of the iframe
	iframe.addEventListener('load', function () {
		initIframe(iframe);
	});
}

function initIframe(iframe) {
	const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

	// Check if the iframe's document is loaded
	if (!iframeDoc) {
		console.log("Waiting for iframe document...");
		setTimeout(() => initIframe(iframe), 500); // Retry after 500ms
		return;
	}

	const input = iframeDoc.getElementById('form-supplierinvoice-vat');
	if (!input) {
		console.log("Waiting for vatInput...");
		setTimeout(() => initIframe(iframe), 500); // Retry after 500ms
		return;
	}

	addCalculatorFunctionality(input);
}

getIframe();
