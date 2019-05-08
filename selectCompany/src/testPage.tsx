import * as React from "react";
import * as ReactDOM from "react-dom";

import {SelectCompany} from "./SelectCompany";

import "antd/dist/antd.css";

const handleSelect = (short: string) => {
    document.getElementById("short").innerHTML = short;
}

const scriptPath = document.currentScript.getAttribute("src");
const parts = scriptPath.split("/");
const basedir = parts.slice(0, parts.length-1).join("/");

ReactDOM.render(<SelectCompany basedir={basedir} onChange={(short => handleSelect(short))}/>, document.getElementById("select"));
