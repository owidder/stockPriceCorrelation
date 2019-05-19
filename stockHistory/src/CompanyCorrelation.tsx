import * as React from "react";
import {RefObject} from "react";

import {EndOfDayPrice} from "./types";
import {initScatterPlot, DrawFunction} from "./stockPricesScatterPlot";

interface CorrelationProps {
    shortX: string;
    shortY: string;
    basedir: string;
}

interface CorrelationState {
    width: number;
    height: number;
    pricesX: EndOfDayPrice[];
    pricesY: EndOfDayPrice[];
}

export class CompanyCorrelation extends React.Component<CorrelationProps, CorrelationState> {

    readonly state: CorrelationState = {width: 0, height: 0, pricesX: [], pricesY: []}

    private svgRef: RefObject<SVGSVGElement> = React.createRef();
    private containerRef: RefObject<HTMLDivElement> = React.createRef();

    private drawScatterPlot: DrawFunction;

    async componentDidMount() {
        window.requestAnimationFrame(() => {
            const containerRect = this.containerRef.current.getBoundingClientRect();
            this.setState({width: containerRect.width, height: containerRect.height});
        })
    }

    async loadData(symbol: string): Promise<EndOfDayPrice[]> {
        const response = await fetch(`${this.props.basedir}/../../service/${symbol}`);
        return await response.json();
    }

    async componentDidUpdate(prevProps: CorrelationProps, prevState: CorrelationState) {
        if((this.props.shortX && this.state.pricesX.length == 0) || (this.props.shortX != prevProps.shortX)) {
            const pricesX  = await this.loadData(this.props.shortX);
            this.setState({pricesX});
        }
        if((this.props.shortY && this.state.pricesY.length == 0) || (this.props.shortY !== prevProps.shortY)) {
            const pricesY  = await this.loadData(this.props.shortY);
            this.setState({pricesY});
        }
        if(this.state.width !== prevState.width || this.state.height !== prevState.height) {
            this.drawScatterPlot || (this.drawScatterPlot = initScatterPlot(this.svgRef.current));
        }

        this.drawScatterPlot && this.drawScatterPlot(this.props.shortX, this.props.shortY, this.state.pricesX, this.state.pricesY);
    }

    render() {
        return <div style={{width: "100%", height: "100%"}} ref={this.containerRef}>
            <svg ref={this.svgRef} width={this.state.width} height={this.state.height}/>
        </div>
    }
}
