// @ts-ignore
import * as React from "react";
import * as ReactDOM from "react-dom";

import {SelectCompany} from "./SelectCompany";

const scriptPath = document.currentScript.getAttribute("src");

class SelectCompanyElement extends HTMLElement {

    static get observedAttributes() {
        return ["initial-short"];
    }

    public onChangeCompany: (string) => void;

    readonly basedir: string;

    constructor() {
        super();
        const parts = scriptPath.split("/");
        this.basedir = parts.slice(0, parts.length-1).join("/");
    }

    drawReactComponent() {
        ReactDOM.render(<SelectCompany initialShort={this.getAttribute("initial-short")}
                                       basedir={this.basedir}
                                       onChange={(short: string) => {
                                           this.onChangeCompany && this.onChangeCompany(short)
                                       }}/>, this);
    }

    connectedCallback() {
        this.drawReactComponent();
    }

    attributeChangedCallback() {
        console.log("attributeChangedCallback");
        this.drawReactComponent();
    }
}

customElements.define("select-company", SelectCompanyElement);

