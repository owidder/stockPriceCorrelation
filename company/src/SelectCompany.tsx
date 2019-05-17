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
    basedir: string;
}

interface SelectCompanyState {
    companies: Company[];
    data: string[];
    value?: string;
}

export class SelectCompany extends React.Component<SelectCompanyProps, SelectCompanyState> {

    readonly state: SelectCompanyState = {data: [], companies: []};

    handleSearch(value: string) {
        const data = _.uniq(this.state.companies.map(company => company.full).filter(full => full.toLowerCase().indexOf(value.toLowerCase()) > -1));
        this.setState({data, value})
    }

    handleSelect(full: string) {
        const selectedCompany = this.state.companies.find(s => (s.full == full));
        this.props.onChange(selectedCompany);
        this.setState({value: full})
    }

    async getCompanies(): Promise<Company[]> {
        return await fetch(`${this.props.basedir}/../../service/companies`).then(resp => resp.json());
    }

    async componentDidMount() {
        const companies = await this.getCompanies();
        this.setState({companies});
        if(this.props.initialShort) {
            const company = this.state.companies.find(s => (s.short == this.props.initialShort));
            if(company) {
                this.setState({value: company.full});
                this.props.onChange(company);
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
