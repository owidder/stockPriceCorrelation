// @ts-ignore
import * as React from "react";
import * as ReactDOM from "react-dom";

import {CompanyCorrelation} from "./CompanyCorrelation";

const scriptPath = document.currentScript.getAttribute("src");
const parts = scriptPath.split("/");
const basedir = parts.slice(0, parts.length-1).join("/");

class CompanyCorrelationElement extends HTMLElement {

    static get observedAttributes() {
        return ["short-x", "short-y"];
    }

    drawReactComponent() {
        ReactDOM.render(<CompanyCorrelation
            basedir={basedir}
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
