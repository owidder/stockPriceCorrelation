// @ts-ignore
import * as React from "react";
import * as ReactDOM from "react-dom";

import {CompanyCorrelation} from "./CompanyCorrelation";

const scriptPath = document.currentScript.getAttribute("src");

class CompanyCorrelationElement extends HTMLElement {

    readonly basedir: string;

    static get observedAttributes() {
        return ["short-x", "short-y"];
    }

    constructor() {
        super();
        const parts = scriptPath.split("/");
        this.basedir = parts.slice(0, parts.length-1).join("/");
    }

    drawReactComponent() {
        ReactDOM.render(<CompanyCorrelation
            basedir={this.basedir}
            shortX={this.getAttribute("short-x")}
            shortY={this.getAttribute("short-y")}/>, this);
    }

    attributeChangedCallback() {
        this.drawReactComponent();
    }

    connectedCallback() {
        this.drawReactComponent();
    }
}

customElements.define("company-correlation", CompanyCorrelationElement);
