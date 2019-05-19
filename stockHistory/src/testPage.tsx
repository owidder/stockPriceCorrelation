import * as React from "react";
import * as ReactDOM from "react-dom";

import {CompanyCorrelation} from "./CompanyCorrelation";

const scriptPath = document.currentScript.getAttribute("src");
const parts = scriptPath.split("/");
const basedir = parts.slice(0, parts.length-1).join("/");

ReactDOM.render(<CompanyCorrelation basedir={basedir} symbolX="AAPL" symbolY="FB"/>, document.getElementById("correlation"));
