import * as React from "react";
import * as ReactDOM from "react-dom";

import {CompanyCorrelation} from "./CompanyCorrelation";

ReactDOM.render(<CompanyCorrelation symbolX="AAPL" symbolY="FB"/>, document.getElementById("correlation"));
