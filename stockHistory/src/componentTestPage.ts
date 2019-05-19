const companyCorrelationElement: any = document.createElement("company-correlation");
companyCorrelationElement.setAttribute("symbol-x", "FB");
companyCorrelationElement.setAttribute("symbol-y", "AAPL");

const containerElement = document.getElementById("container");
containerElement.appendChild(companyCorrelationElement);
