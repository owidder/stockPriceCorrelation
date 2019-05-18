// @ts-ignore
import * as React from "react";
import * as ReactDOM from "react-dom";

import {SelectCompany, Company} from "./SelectCompany";

const scriptPath = document.currentScript.getAttribute("src");

class SelectCompanyElement extends HTMLElement {

    static get observedAttributes() {
        return ["initial-short"];
    }

    public onChangeCompany: (Company) => void;

    readonly basedir: string;

    constructor() {
        super();
        const parts = scriptPath.split("/");
        this.basedir = parts.slice(0, parts.length-1).join("/");
    }

    drawReactComponent() {
        ReactDOM.render(<SelectCompany initialShort={this.getAttribute("initial-short")}
                                       basedir={this.basedir}
                                       onChange={(company: Company) => {
                                           this.onChangeCompany && this.onChangeCompany(company)
                                       }}/>, this);
    }

    connectedCallback() {
        this.drawReactComponent();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if(newValue && oldValue != newValue) {
            this.drawReactComponent();
        }
    }
}

customElements.define("select-company", SelectCompanyElement);

