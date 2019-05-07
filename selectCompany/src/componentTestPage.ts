const queryString = require("query-string");

const params = queryString.parse(window.location.hash);

const onChangeCompany = (short: string) => {
    document.getElementById("text").innerHTML = `Selected company: <b>${short}</b>`;
    window.location.hash = queryString.stringify({short});
}

const selectCompanyElement: any = document.createElement("select-company");
selectCompanyElement.onChangeCompany = onChangeCompany;
params.short && selectCompanyElement.setAttribute("initialShort", params.short);

const containerElement = document.getElementById("container");
containerElement.appendChild(selectCompanyElement);
