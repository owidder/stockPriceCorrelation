// @ts-ignore
import * as React from "react";
import * as ReactDOM from "react-dom";

import {CompanyCorrelation} from "./CompanyCorrelation";

class CompanyCorrelationElement extends HTMLElement {

    public onChangeCompany: (string) => void;

    connectedCallback() {
        ReactDOM.render(<CompanyCorrelation
            symbolX={this.getAttribute("symbolX")}
            symbolY={this.getAttribute("symbolY")}/>, this);
    }
}

customElements.define("company-correlation", CompanyCorrelationElement);
