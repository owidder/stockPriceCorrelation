// @ts-ignore
import * as React from "react";
import * as ReactDOM from "react-dom";

import {CompanyCorrelation} from "./CompanyCorrelation";

const scriptPath = document.currentScript.getAttribute("src");

class CompanyCorrelationElement extends HTMLElement {

    readonly basedir: string;

    static get observedAttributes() {
        return ["symbol-x", "symbol-y"];
    }

    constructor() {
        super();
        const parts = scriptPath.split("/");
        this.basedir = parts.slice(0, parts.length-1).join("/");
    }

    drawReactComponent() {
        ReactDOM.render(<CompanyCorrelation
            basedir={this.basedir}
            symbolX={this.getAttribute("symbol-x")}
            symbolY={this.getAttribute("symbol-y")}/>, this);
    }

    attributeChangedCallback() {
        console.log("attributeChangedCallback");
        this.drawReactComponent();
    }

    connectedCallback() {
        this.drawReactComponent();
    }
}

customElements.define("company-correlation", CompanyCorrelationElement);
