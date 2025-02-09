// index.ts
function addCalculatorFunctionality(vatField) {
  vatField.addEventListener("keydown", ({ key }) => {
    if (key === "Enter") {
      const value = vatField.value.trim();
      if (!value)
        return;
      const result = calculateExpression(value);
      if (result !== null) {
        vatField.value = result.toString();
        vatField.setAttribute("data-model-value", result.toString());
      }
    }
  });
  console.log("Calculator attached to VAT field!");
}
function calculateExpression(expression) {
  try {
    expression = expression.replace(/,/g, ".").replace(/\s+/g, "");
    const parts = expression.match(/(\d+(\.\d+)?|[-+*/])/g);
    if (!parts)
      return null;
    const numbers = [];
    const operators = [];
    parts.forEach((part) => {
      if (!isNaN(parseFloat(part))) {
        numbers.push(parseFloat(part));
      } else {
        operators.push(part);
      }
    });
    for (let i = 0;i < operators.length; i++) {
      if (operators[i] === "*" || operators[i] === "/") {
        const a = numbers[i];
        const b = numbers[i + 1];
        if (operators[i] === "/" && b === 0)
          return "Error";
        numbers.splice(i, 2, operators[i] === "*" ? a * b : a / b);
        operators.splice(i, 1);
        i--;
      }
    }
    let result = numbers[0];
    for (let i = 0;i < operators.length; i++) {
      if (operators[i] === "+")
        result += numbers[i + 1];
      if (operators[i] === "-")
        result -= numbers[i + 1];
    }
    return result;
  } catch (error) {
    console.error("Calculation error:", error);
    return null;
  }
}
function observeIframe() {
  const observer = new MutationObserver(() => {
    console.log("Observing for Iframe");
    const iframe = document.getElementById("iframeApp");
    if (iframe) {
      observer.disconnect();
      iframe.addEventListener("load", () => initIframe(iframe));
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
function observeVatField(iframeDoc) {
  const observer = new MutationObserver(() => {
    console.log("Observing for VAT input");
    const vatField = iframeDoc.getElementById("form-supplierinvoice-vat");
    if (vatField) {
      observer.disconnect();
      addCalculatorFunctionality(vatField);
    }
  });
  observer.observe(iframeDoc.body, { childList: true, subtree: true });
}
function initIframe(iframe) {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (iframeDoc) {
    observeVatField(iframeDoc);
  }
}
observeIframe();
