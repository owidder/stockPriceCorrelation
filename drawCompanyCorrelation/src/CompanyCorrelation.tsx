import * as React from "react";
import {RefObject} from "react";

import {EndOfDayPrice} from "./types";
import {initScatterPlot, DrawFunction} from "./stockPricesScatterPlot";

interface CorrelationProps {
    symbolX: string;
    symbolY: string;
}

interface CorrelationState {
    width: number;
    height: number;
    pricesX: EndOfDayPrice[];
    pricesY: EndOfDayPrice[];
}

const loadData = async (symbol: string): Promise<EndOfDayPrice[]> => {
    const response = await fetch(`./service/${symbol}`);
    return await response.json();
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

    async componentDidUpdate(prevProps: CorrelationProps, prevState: CorrelationState) {
        if(this.state.pricesX.length == 0 || (this.props.symbolX !== prevProps.symbolX)) {
            const pricesX  = await loadData(this.props.symbolX);
            this.setState({pricesX});
        }
        if(this.state.pricesY.length == 0 || (this.props.symbolY !== prevProps.symbolY)) {
            const pricesY  = await loadData(this.props.symbolY);
            this.setState({pricesY});
        }
        if(this.state.width !== prevState.width || this.state.height !== prevState.height) {
            this.drawScatterPlot || (this.drawScatterPlot = initScatterPlot(this.svgRef.current));
        }

        this.drawScatterPlot && this.drawScatterPlot(this.props.symbolX, this.props.symbolY, this.state.pricesX, this.state.pricesY);
    }

    render() {
        return <div style={{width: "100%", height: "100%"}} ref={this.containerRef}>
            <svg ref={this.svgRef} width={this.state.width} height={this.state.height}/>
        </div>
    }
}
