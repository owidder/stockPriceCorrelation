// @ts-ignore
import * as React from "react";
import * as ReactDOM from "react-dom";

import {SelectCompany} from "./SelectCompany";

const scriptPath = document.currentScript.getAttribute("src");

class SelectCompanyElement extends HTMLElement {

    public onChangeCompany: (string) => void;

    connectedCallback() {
        const parts = scriptPath.split("/");
        const basedir = parts.slice(0, parts.length-1).join("/");
        console.log(basedir);
        ReactDOM.render(<SelectCompany initialShort={this.getAttribute("initialShort")}
                                       basedir={basedir}
                                       onChange={(short: string) => {
                                           this.onChangeCompany && this.onChangeCompany(short)
                                       }}/>, this);
    }
}

customElements.define("select-company", SelectCompanyElement);

