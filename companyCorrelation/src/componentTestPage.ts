const companyCorrelationElement: any = document.createElement("company-correlation");
companyCorrelationElement.setAttribute("symbolX", "FB");
companyCorrelationElement.setAttribute("symbolY", "AAPL");

const containerElement = document.getElementById("container");
containerElement.appendChild(companyCorrelationElement);
