const companyCorrelationElement: any = document.createElement("company-correlation");
companyCorrelationElement.setAttribute("short-x", "FB");
companyCorrelationElement.setAttribute("short-y", "AAPL");

const containerElement = document.getElementById("container");
containerElement.appendChild(companyCorrelationElement);
