import * as d3 from "d3";
import * as _ from "lodash";
import tippy from "tippy.js";
import * as ss from "simple-statistics";

import {EndOfDayPrice} from "./types";

import "./drawStockPrice.less";

interface Dot {
    x: number;
    y: number;
    date: string;
    id: number;
}

type Scale = (number) => number;

export type DrawFunction = (symbolX: string, symbolY: string,
                            pricesX: EndOfDayPrice[], pricesY: EndOfDayPrice[]) => void;

export const initScatterPlot = (_svg: SVGSVGElement): DrawFunction => {
    const width = _svg.getBoundingClientRect().width;
    const height = _svg.getBoundingClientRect().height;

    const MARGIN_X = 50;
    const MARGIN_Y = 50;
    const leftX = MARGIN_X;
    const rightX = width - MARGIN_X;
    const upperY = MARGIN_Y;
    const lowerY = height - MARGIN_Y;

    const svg = d3.select(_svg);

    const correlationG = svg.append("g").attr("class", "correlationG");
    const meanG = svg.append("g").attr("class", "meanG");
    const linearRegressionG = svg.append("g").attr("class", "linearRegressionG");
    const linearRegressionMiddleG = svg.append("g").attr("class", "linearRegressionMiddleG");
    const axis = svg.append("g").attr("class", "axis");
    const plotG = svg.append("g").attr("class", "plotG");

    const translate = (x: number, y: number) => {
        return "translate(" + String(x) + "," + String(y) + ")"
    }

    const projection = (array: Array<any>, attrName: string) => {
        return array.map(element => {
            return element[attrName]
        })
    }

    const scale = (data: any, attrName: string, rangeMin: number, rangeMax: number): Scale => {
        const min = _.minBy(data, attrName)[attrName];
        const max = _.maxBy(data, attrName)[attrName];
        return d3.scaleLinear().domain([min, max]).range([rangeMin, rangeMax]);
    }

    const color = (meanX: number, meanY: number, x: number, y: number): string => {
        if((x > meanX && y > meanY) || (x < meanX && y < meanY)) {
            return "green";
        }
        return "red";
    }

    const drawMeanLine = (name: string, startX1: number, startX2: number, startY1: number, startY2:  number,
                          endX1: number, endX2: number, endY1: number, endY2: number) => {
        meanG.selectAll("line.mean" + name).data([1]).enter()
            .append("line")
            .attr("class", "mean" + name)
            .attr("x1", startX1)
            .attr("x2", startX2)
            .attr("y1", startY1)
            .attr("y2", startY2)
            .attr("stroke", "grey")
            .attr("stroke-dasharray", 4)

        meanG.selectAll("line.mean" + name)
            .transition()
            .duration(2000)
            .attr("x1", endX1)
            .attr("x2", endX2)
            .attr("y1", endY1)
            .attr("y2", endY2)
    }

    const randomOutside = (max: number) => {
        return _.random(0, max) + Math.sign(_.random(-1000, 1000, true)) * max;
    }

    function drawLinearRegressionLine(plotData: Dot[], xScale: Scale, yScale: Scale) {
        const points = plotData.map(d => {return [d.x, d.y]});

        const linearRegressionObject = ss.linearRegression(points);

        const leftX = _.minBy(plotData, "x").x;
        const rightX = _.maxBy(plotData, "x").x;

        const leftY = linearRegressionObject.b + leftX * linearRegressionObject.m;
        const rightY = leftY + (rightX - leftX) * linearRegressionObject.m;
        const midY = _.mean([rightY, leftY]);
        const midX = _.mean([rightX, leftX]);

        const linearRegressionLinePath = d3.line()([[xScale(leftX), yScale(leftY)], [xScale(rightX), yScale(rightY)]]);
        const startLinePath = d3.line()([[xScale(leftX), yScale(midY)], [xScale(rightX), yScale(midY)]]);

        const pathSelection = linearRegressionG.selectAll("path.regression").data([1])

        pathSelection.enter()
            .append("path")
            .attr("class", "regression")
            .attr("stroke", "black")
            .attr("d", startLinePath)
            .merge(pathSelection)
            .transition()
            .duration(1000)
            .attr("d", linearRegressionLinePath)

        const middleOfPathSelection = linearRegressionMiddleG.selectAll("circle.regressionMiddle").data([1]);

        middleOfPathSelection.enter()
            .append("circle")
            .attr("r", 5)
            .attr("class", "regressionMiddle")
            .style("opacity", 0)
            .merge(middleOfPathSelection)
            .attr("cx", xScale(midX))
            .attr("cy", yScale(midY))
    }

    function showCorrelation(plotData) {
        const correlation = ss.sampleCorrelation(projection(plotData, "x"), projection(plotData, "y")).toFixed(1);

        const selection = correlationG.selectAll("text.correlation").data([1]);

        selection.enter()
            .append("text")
            .attr("class", "correlation")
            .style("font-size", Math.min(width, height) * .6)
            .attr("transform", translate(width/2, height/2))
            .merge(selection)
            .text(correlation)
            .attr("fill", Number(correlation) < 0 ? "red" : "green")
    }

    function draw(plotData: Dot[], symbolX: string, symbolY: string) {
        const xScale = scale(plotData, "x", leftX, rightX);
        const yScale = scale(plotData, "y", lowerY, upperY);

        const meanX = _.meanBy(plotData, "x");
        const meanY = _.meanBy(plotData, "y");

        drawMeanLine("x", leftX-width, rightX-width, yScale(meanY), yScale(meanY), leftX, rightX, yScale(meanY), yScale(meanY));
        drawMeanLine("y", xScale(meanX), xScale(meanX), upperY-height, lowerY-height, xScale(meanX), xScale(meanX), upperY, lowerY);

        drawLinearRegressionLine(plotData, xScale, yScale);
        showCorrelation(plotData);

        axis.transition().duration(1000).selectAll(".xaxis").call(d3.axisBottom(xScale));
        axis.transition().duration(1000).selectAll(".yaxis").call(d3.axisLeft(yScale));
        axis.select(".xlabel").text(symbolX);
        axis.select(".ylabel").text(symbolY);

        const data = plotG.selectAll("circle.dot").data(plotData);

        data.enter()
            .append("circle")
            .attr("class", function(d) {
                return  "dot _" + d.date;
            })
            .attr("r", 3)
            .attr("cx", function() {return randomOutside(width)})
            .attr("cy", function() {return randomOutside(height)})
            .attr("data-tippy-content", "init")

        plotG.selectAll("circle.dot")
            .on("mouseover", function(d) {
                const instance = this._tippy;
                instance && instance.setContent(d.date + ":<br>" + symbolX + ": " + Number(d.x).toFixed(1) + "<br>" + symbolY + ": " + Number(d.y).toFixed(1));
            })
            .transition()
            .duration(function() {return _.random(3000, 4000)})
            .attr("cx", function (d) {
                return xScale(d.x);
            })
            .attr("cy", function (d) {
                return yScale(d.y);
            })
            .attr("fill", function (d) {
                return color(meanX, meanY, d.x, d.y)
            })

        tippy("circle.dot", {
            followCursor: true,
            arrow: true
        });

        data.exit().remove();
    }

    function priceForDate(endOfDayPrices: EndOfDayPrice[], date: string) {
        return endOfDayPrices.find(eod => eod.date == date).price;
    }

    axis.append("g")
        .attr("class", "yaxis")
        .attr("transform", translate(MARGIN_X - 10, 0))
        .append("g")
        .attr("transform", translate(20, MARGIN_Y) + " rotate(-90)")
        .append("text")
        .attr("class", "label ylabel")

    axis.append("g")
        .attr("class", "xaxis")
        .attr("transform", translate(0, height - MARGIN_Y + 10))
        .append("g")
        .attr("transform", translate(width - MARGIN_X, -10))
        .append("text")
        .attr("class", "label xlabel")

    const drawScatterPlot: DrawFunction = (symbolX: string, symbolY: string, pricesX: EndOfDayPrice[], pricesY: EndOfDayPrice[]) => {
        const datesX = projection(pricesX, "date");
        const datesY = projection(pricesY, "date");
        const commonDates = _.intersection(datesX, datesY);

        const plotData: Dot[] = commonDates.map((date, i) => {
            const xValue = priceForDate(pricesX, date);
            const yValue = priceForDate(pricesY, date);
            return {
                date: date,
                x: Number(xValue),
                y: Number(yValue),
                id: i
            }
        })

        draw(plotData, symbolX, symbolY);
    }

    return drawScatterPlot;
}