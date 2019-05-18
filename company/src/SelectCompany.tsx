import * as React from "react";
import * as _ from "lodash";
import {AutoComplete} from "antd";

export interface Company {
    short: string;
    full: string;
}

interface SelectCompanyProps {
    initialShort?: string;
    onChange: (company: Company)  => void;
    companies: Company[];
}

interface SelectCompanyState {
    filteredCompanyNames: string[];
    value?: string;
}

export class SelectCompany extends React.Component<SelectCompanyProps, SelectCompanyState> {

    readonly state: SelectCompanyState = {filteredCompanyNames: []};

    handleSearch(value: string) {
        const filteredCompanyNames = _.uniq(this.props.companies.map(company => company.full).filter(full => full.toLowerCase().indexOf(value.toLowerCase()) > -1));
        this.setState({filteredCompanyNames, value})
    }

    handleSelect(value: string) {
        const selectedCompany = this.props.companies.find(s => (s.full == value));
        this.props.onChange(selectedCompany);
        this.setState({value: value})
    }

    initCompany() {
        if(this.props.initialShort && this.props.companies) {
            console.log(new Date())
            const company = this.props.companies.find(s => (s.short == this.props.initialShort));
            if(company) {
                this.setState({value: company.full});
                this.props.onChange(company);
            }
        }
    }

    componentDidMount() {
        this.initCompany();
    }

    componentDidUpdate(prevProps: Readonly<SelectCompanyProps>) {
        if(prevProps.initialShort != this.props.initialShort || (this.props.companies && (prevProps.companies.length != this.props.companies.length))) {
            this.initCompany();
        }
    }

    render() {
        return <div className="input-field">
            <AutoComplete
                dataSource={this.state.filteredCompanyNames}
                onSearch={(value) => this.handleSearch(value)}
                onSelect={(value: string) => this.handleSelect(value)}
                value={this.state.value}
                placeholder="Enter company"/>
        </div>
    }
}
