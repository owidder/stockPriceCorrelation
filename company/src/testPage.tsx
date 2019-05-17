import * as React from "react";
import * as ReactDOM from "react-dom";

import {SelectCompany, Company} from "./SelectCompany";

import "antd/dist/antd.css";

const handleSelect = (company: Company) => {
    document.getElementById("short").innerHTML = company.short;
}

const scriptPath = document.currentScript.getAttribute("src");
const parts = scriptPath.split("/");
const basedir = parts.slice(0, parts.length-1).join("/");

ReactDOM.render(<SelectCompany basedir={basedir} onChange={(company => handleSelect(company))}/>, document.getElementById("select"));
