import * as React from "react";
import * as _ from "lodash";
import {AutoComplete} from "antd";

interface SelectSymbolProps {
    initialShort?: string;
    onChange: (symbol: string)  => void;
    basedir: string;
}

export interface Symbol {
    short: string;
    full: string;
}

interface SelectSymbolState {
    symbols: Symbol[];
    data: string[];
    value?: string;
}

export class SelectCompany extends React.Component<SelectSymbolProps, SelectSymbolState> {

    readonly state: SelectSymbolState = {data: [], symbols: []};

    handleSearch(value: string) {
        const data = _.uniq(this.state.symbols.map(symbol => symbol.full).filter(full => full.toLowerCase().indexOf(value.toLowerCase()) > -1));
        this.setState({data, value})
    }

    handleSelect(full: string) {
        const short = this.state.symbols.find(s => (s.full == full)).short;
        this.props.onChange(short);
        this.setState({value: full})
    }

    async getSymbols(): Promise<Symbol[]> {
        const symbols = await fetch(`${this.props.basedir}/../../service/companies`).then(resp => resp.json());
        return symbols;
    }

    async componentDidMount() {
        const symbols = await this.getSymbols();
        this.setState({symbols});
        if(this.props.initialShort) {
            const symbolObj = this.state.symbols.find(s => (s.short == this.props.initialShort));
            if(symbolObj) {
                this.setState({value: symbolObj.full});
                this.props.onChange(this.props.initialShort);
            }
        }
    }

    render() {
        return <div className="input-field">
            <AutoComplete
                dataSource={this.state.data}
                onSearch={(text) => this.handleSearch(text)}
                onSelect={this.handleSelect.bind(this)}
                value={this.state.value}
                placeholder="Enter company"/>
        </div>
    }
}
