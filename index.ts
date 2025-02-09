const operators = ['-', '+', '*', '/'];

function addCalculatorFunctionality(vatField: HTMLInputElement) {
	vatField.addEventListener('keydown', ({key}: KeyboardEvent) => {
		if (key === 'Enter') {
			const value = vatField.value.trim()

			if (!value ) return;

			const operator = operators.find(op => value.includes(op));

			if (operator) {
				const [first, second] = value.split(operator).map(num => parseFloat(num.replace(',','.').trim()))

				if (!isNaN(first) && !isNaN(second)) {
					let result;
					switch (operator) {
						case '+': result = first + second; break;
						case '-': result = first - second; break;
						case '*': result = first * second; break;
						case '/': result = second !== 0 ? first / second : 'Error'; break
					}

					result = result?.toString()

					if(!result) return
					vatField.value = result;
					vatField.setAttribute('data-model-value', result);
				}
			}
		}
	});
	console.log("Calculator attached to VAT field!");
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