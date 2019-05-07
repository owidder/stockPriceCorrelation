import * as React from "react";
import * as ReactDOM from "react-dom";

import {SelectCompany} from "./SelectCompany";

import "antd/dist/antd.css";

const handleSelect = (short: string) => {
    document.getElementById("short").innerHTML = short;
}

ReactDOM.render(<SelectCompany onChange={(short => handleSelect(short))}/>, document.getElementById("select"));
