import { jsxs, jsx, Fragment as Fragment$1 } from 'react/jsx-runtime';
import { Component, PureComponent, Fragment, createRef, Children, cloneElement, useState, useMemo, useCallback, useEffect, useRef, isValidElement } from 'react';
import { CloneElement, useId } from 'rdk';
import ellipsize from 'ellipsize';
import { max, bisector, range, median, histogram, extent as extent$1, min, maxIndex, sum } from 'd3-array';
import calculateSize from 'calculate-size';
import { scaleLinear, scaleTime, scaleBand, scaleOrdinal, scalePoint, scaleQuantile } from 'd3-scale';
import bind from 'memoize-bind';
import { applyToPoint, inverse, applyToPoints, smoothMatrix, transform, translate as translate$1, scale, identity, fromDefinition, fromObject } from 'transformation-matrix';
import classNames from 'classnames';
import useDimensions from 'react-cool-dimensions';
import bigInt from 'big-integer';
import humanFormat from 'human-format';
import { stack, stackOffsetExpand, stackOffsetDiverging, arc, curveMonotoneX, curveStep, curveLinear, area, line, pie, radialArea, curveCardinalClosed, curveLinearClosed, radialLine } from 'd3-shape';
import chroma from 'chroma-js';
import { Tooltip } from 'realayers';
import memoize from 'memoize-one';
import isEqual from 'react-fast-compare';
import { useMotionValue, useSpring, motion, animate } from 'framer-motion';
import { interpolate as interpolate$1 } from 'd3-interpolate';
import { geoMercator, geoPath } from 'd3-geo';
import { sankey, sankeyJustify, sankeyCenter, sankeyLeft, sankeyRight, sankeyLinkHorizontal } from 'd3-sankey';
import { layout } from '@upsetjs/venn.js';
import invert from 'invert-color';
import { pack, hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';

class LinearAxisTickLabel extends Component {
    getAlign() {
        const { align, half } = this.props;
        if ((align === 'inside' || align === 'outside') && half === 'center') {
            return 'center';
        }
        if (align === 'inside') {
            return half === 'start' ? 'end' : 'start';
        }
        if (align === 'outside') {
            return half === 'start' ? 'start' : 'end';
        }
        return align;
    }
    getTickLineSpacing() {
        const { line } = this.props;
        if (!line) {
            return [0, 0];
        }
        const size = line.props.size;
        const position = line.props.position;
        if (position === 'start') {
            return [size * -1, 0];
        }
        else if (position === 'end') {
            return [0, size];
        }
        else {
            return [size * -0.5, size * 0.5];
        }
    }
    getOffset() {
        const { padding, position, rotation, orientation } = this.props;
        const adjustedPadding = typeof padding === 'number'
            ? {
                fromAxis: padding,
                alongAxis: padding
            }
            : padding;
        const spacing = this.getTickLineSpacing();
        const offset1 = position === 'start'
            ? spacing[0] - adjustedPadding.fromAxis
            : position === 'end'
                ? spacing[1] + adjustedPadding.fromAxis
                : 0;
        const align = this.getAlign();
        let offset2 = rotation === true ? -5 : 0;
        offset2 +=
            align === 'center'
                ? 0
                : align === 'start'
                    ? -adjustedPadding.alongAxis
                    : adjustedPadding.alongAxis;
        const horz = orientation === 'horizontal';
        return {
            [horz ? 'x' : 'y']: offset2,
            [horz ? 'y' : 'x']: offset1
        };
    }
    getTextPosition() {
        const { angle, orientation, position } = this.props;
        let transform = '';
        let textAnchor = '';
        let alignmentBaseline = 'middle';
        if (angle !== 0) {
            transform = `rotate(${angle})`;
            textAnchor = 'end';
        }
        else {
            const align = this.getAlign();
            if (orientation === 'horizontal') {
                textAnchor =
                    align === 'center' ? 'middle' : align === 'start' ? 'end' : 'start';
                if (position === 'start') {
                    alignmentBaseline = 'baseline';
                }
                else if (position === 'end') {
                    alignmentBaseline = 'hanging';
                }
            }
            else {
                alignmentBaseline =
                    align === 'center'
                        ? 'middle'
                        : align === 'start'
                            ? 'baseline'
                            : 'hanging';
                if (position === 'start') {
                    textAnchor = 'end';
                }
                else if (position === 'end') {
                    textAnchor = 'start';
                }
                else {
                    textAnchor = 'middle';
                }
            }
        }
        return {
            transform,
            textAnchor: this.props.textAnchor || textAnchor,
            alignmentBaseline
        };
    }
    render() {
        const { fill, text, fullText, fontSize, fontFamily, className } = this.props;
        const { x, y } = this.getOffset();
        const textPosition = this.getTextPosition();
        return (jsxs("g", Object.assign({ transform: `translate(${x}, ${y})`, fontSize: fontSize, fontFamily: fontFamily }, { children: [jsx("title", { children: fullText }, void 0),
                jsx("text", Object.assign({}, textPosition, { fill: fill, className: className }, { children: text }), void 0)] }), void 0));
    }
}
LinearAxisTickLabel.defaultProps = {
    fill: '#8F979F',
    fontSize: 11,
    fontFamily: 'sans-serif',
    rotation: true,
    padding: 0,
    align: 'center'
};

class LinearAxisTickLine extends PureComponent {
    positionTick() {
        const { size, position, orientation } = this.props;
        const isVertical = orientation === 'vertical';
        const tickSize = size || 0;
        const start = position === 'start'
            ? tickSize * -1
            : position === 'center'
                ? tickSize * -0.5
                : 0;
        const end = start + tickSize;
        return {
            x1: isVertical ? end : 0,
            x2: isVertical ? start : 0,
            y1: isVertical ? 0 : start,
            y2: isVertical ? 0 : end
        };
    }
    render() {
        const { strokeColor, strokeWidth, className } = this.props;
        const path = this.positionTick();
        return (jsx("line", Object.assign({ className: className, strokeWidth: strokeWidth, stroke: strokeColor }, path), void 0));
    }
}
LinearAxisTickLine.defaultProps = {
    strokeColor: '#8F979F',
    strokeWidth: 1,
    size: 5
};

// https://stackoverflow.com/questions/673905/best-way-to-determine-users-locale-within-browser
const getNavigatorLanguage = () => {
    if (typeof window === 'undefined') {
        return 'en';
    }
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    }
    if (navigator.userLanguage ||
        navigator.language ||
        navigator.browserLanguage) {
        return 'en';
    }
};
const locale = getNavigatorLanguage();
const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: true,
    formatMatcher: 'best fit'
};
/**
 * Format a value based on type.
 */
function formatValue(value) {
    if (value !== undefined) {
        if (value instanceof Date) {
            return value.toLocaleDateString(locale, options);
        }
        else if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return value;
    }
    return 'No value';
}

const ONE_DAY = 60 * 60 * 24;
const DURATION_TICK_STEPS = [
    0.001,
    0.005,
    0.01,
    0.05,
    0.1,
    0.5,
    1,
    5,
    10,
    15,
    60,
    60 * 15,
    60 * 30,
    60 * 60,
    60 * 60 * 2,
    60 * 60 * 4,
    60 * 60 * 6,
    60 * 60 * 8,
    60 * 60 * 12,
    ONE_DAY // 24 h
];
/**
 * Reduce the ticks to the max number of ticks.
 */
function reduceTicks(ticks, maxTicks) {
    if (ticks.length > maxTicks) {
        const reduced = [];
        const modulus = Math.floor(ticks.length / maxTicks);
        for (let i = 0; i < ticks.length; i++) {
            if (i % modulus === 0) {
                reduced.push(ticks[i]);
            }
        }
        ticks = reduced;
    }
    return ticks;
}
/**
 * Determine the max ticks for the available width.
 */
function getMaxTicks(size, dimension) {
    const tickWidth = Math.max(size, 0);
    return Math.floor(dimension / tickWidth);
}
/**
 * Formats the ticks in a duration format.
 */
function getDurationTicks(domain, maxTicks) {
    const domainWidth = domain[1] - domain[0];
    let tickStep = null;
    for (const s of DURATION_TICK_STEPS) {
        if (domainWidth / s < maxTicks) {
            tickStep = s;
            break;
        }
    }
    if (tickStep === null) {
        const numDayTicks = domainWidth / ONE_DAY;
        const dayStep = Math.ceil(numDayTicks / maxTicks);
        tickStep = ONE_DAY * dayStep;
    }
    const ticks = [domain[0]];
    while (ticks[ticks.length - 1] + tickStep <= domain[1]) {
        ticks.push(ticks[ticks.length - 1] + tickStep);
    }
    return ticks;
}
/**
 * Get the tick values from the scale.
 */
function getTicks(scale, tickValues, type, maxTicks = 100, interval) {
    let result;
    if (tickValues) {
        result = tickValues;
    }
    else {
        if (scale.ticks) {
            if (type === 'duration') {
                result = getDurationTicks(scale.domain(), maxTicks);
            }
            else if (interval) {
                result = scale.ticks(interval);
            }
            else {
                if (type === 'time') {
                    // If its time, we need to handle the time count
                    // manually because d3 does this odd rounding
                    result = scale.ticks();
                    result = reduceTicks(result, maxTicks);
                }
                else {
                    result = scale.ticks(maxTicks);
                }
            }
        }
        else {
            tickValues = scale.domain();
            result = reduceTicks(tickValues, maxTicks);
        }
    }
    return result;
}

const calculateDimensions = (text, fontFamily, fontSize) => {
    // SSR Rendering doesn't support canvas measurements
    // we have to make a guess in this case...
    if (typeof document === 'undefined') {
        return {
            width: text.length * 8,
            height: 25
        };
    }
    return calculateSize(text, {
        font: fontFamily,
        fontSize: `${fontSize}px`
    });
};

class LinearAxisTickSeries extends Component {
    /**
     * Gets the adjusted scale given offsets.
     */
    getAdjustedScale() {
        const { scale } = this.props;
        if (scale.bandwidth) {
            let offset = scale.bandwidth() / 2;
            if (scale.round()) {
                offset = Math.round(offset);
            }
            return (d) => +scale(d) + offset;
        }
        else {
            return (d) => +scale(d);
        }
    }
    /**
     * Gets the x/y position for a given tick.
     */
    getPosition(scaledTick) {
        const { orientation } = this.props;
        if (orientation === 'horizontal') {
            return { x: scaledTick, y: 0 };
        }
        else {
            return { x: 0, y: scaledTick };
        }
    }
    /**
     * Gets the dimension (height/width) this axis is calculating on.
     */
    getDimension() {
        const { height, width, orientation } = this.props;
        return orientation === 'vertical' ? height : width;
    }
    /**
     * Calculates the rotation angle that the ticks need to be shifted to.
     * This equation will measure the length of the text in a external canvas
     * object and determine what the longest label is and rotate until they fit.
     */
    getRotationAngle(ticks) {
        if (!this.props.label) {
            return 0;
        }
        const label = this.props.label.props;
        const dimension = this.getDimension();
        const maxTicksLength = max(ticks, (tick) => tick.width);
        let angle = 0;
        if (label.rotation) {
            if (label.rotation === true) {
                let baseWidth = maxTicksLength;
                const maxBaseWidth = Math.floor(dimension / ticks.length);
                while (baseWidth > maxBaseWidth && angle > -90) {
                    angle -= 30;
                    baseWidth = Math.cos(angle * (Math.PI / 180)) * maxTicksLength;
                }
            }
            else {
                angle = label.rotation;
            }
        }
        return angle;
    }
    /**
     * Gets the formatted label of the tick.
     */
    getLabelFormat() {
        const { label, scale } = this.props;
        if (label && label.props.format) {
            return label.props.format;
        }
        else if (scale.tickFormat) {
            return scale.tickFormat.apply(scale, [5]);
        }
        else {
            return (v) => formatValue(v);
        }
    }
    /**
     * Gets the ticks given the dimensions and scales and returns
     * the text and position.
     */
    getTicks() {
        const { scale, tickSize, tickValues, interval, axis, label } = this.props;
        const dimension = this.getDimension();
        const maxTicks = getMaxTicks(tickSize, dimension);
        const ticks = getTicks(scale, tickValues, axis.type, maxTicks, interval);
        const adjustedScale = this.getAdjustedScale();
        const format = this.getLabelFormat();
        const midpoint = dimension / 2;
        return ticks.map((tick) => {
            const fullText = format(tick);
            const scaledTick = adjustedScale(tick);
            const position = this.getPosition(scaledTick);
            const text = ellipsize(fullText, 18);
            const size = label
                ? calculateDimensions(text, label.props.fontFamily, label.props.fontSize.toString())
                : {};
            return Object.assign(Object.assign(Object.assign({}, position), size), { text,
                fullText, half: scaledTick === midpoint
                    ? 'center'
                    : scaledTick < midpoint
                        ? 'start'
                        : 'end' });
        });
    }
    render() {
        const { label, line, height, width, orientation } = this.props;
        const ticks = this.getTicks();
        const angle = this.getRotationAngle(ticks);
        return (jsx(Fragment, { children: ticks.map((tick, i) => (jsxs("g", Object.assign({ transform: `translate(${tick.x}, ${tick.y})` }, { children: [line && (jsx(CloneElement, { element: line, height: height, width: width, orientation: orientation }, void 0)),
                    label && (jsx(CloneElement, { element: label, text: tick.text, fullText: tick.fullText, half: tick.half, angle: angle, orientation: orientation, line: line }, void 0))] }), i))) }, void 0));
    }
}
LinearAxisTickSeries.defaultProps = {
    line: jsx(LinearAxisTickLine, {}, void 0),
    label: jsx(LinearAxisTickLabel, {}, void 0),
    tickSize: 30
};

const LinearAxisLine = ({ strokeColor, strokeWidth, strokeGradient, scale, orientation, className }) => {
    const id = useId();
    const [range0, range1] = scale.range();
    return (jsxs(Fragment, { children: [jsx("line", { className: className, x1: orientation === 'vertical' ? 0 : range0, 
                // Workaround for a Chrome/Firefox bug where it won't render gradients for straight lines
                x2: orientation === 'vertical' ? 0.00001 : range1, y1: orientation === 'vertical' ? range0 : 0, y2: orientation === 'vertical' ? range1 : 0.00001, strokeWidth: strokeWidth, stroke: strokeGradient ? `url(#axis-gradient-${id})` : strokeColor }, void 0),
            strokeGradient && (jsx(CloneElement, { element: strokeGradient, id: `axis-gradient-${id}` }, void 0))] }, void 0));
};
LinearAxisLine.defaultProps = {
    strokeColor: '#8F979F',
    strokeWidth: 1
};

class LinearAxis extends Component {
    constructor(props) {
        super(props);
        this.ref = createRef();
        this.state = {
            height: props.height,
            width: props.width
        };
    }
    componentDidMount() {
        this.updateDimensions();
    }
    componentDidUpdate(prevProps) {
        const { height, width, scale } = this.props;
        if (width !== prevProps.width ||
            height !== prevProps.height ||
            scale !== prevProps.scale) {
            this.updateDimensions();
        }
    }
    updateDimensions() {
        const { onDimensionsChange, orientation, position } = this.props;
        const shouldOffset = position !== 'center';
        let height;
        let width;
        if (shouldOffset) {
            const dims = this.ref.current.getBoundingClientRect();
            width = Math.floor(dims.width);
            height = Math.floor(dims.height);
        }
        if (orientation === 'vertical') {
            if (this.state.width !== width) {
                this.setState({ width });
                onDimensionsChange({ width });
            }
        }
        else {
            if (this.state.height !== height) {
                this.setState({ height });
                onDimensionsChange({ height });
            }
        }
    }
    getPosition() {
        const { position, width, height, orientation } = this.props;
        let translateY = 0;
        let translateX = 0;
        if (position === 'end' && orientation === 'horizontal') {
            translateY = height;
        }
        else if (position === 'center' && orientation === 'horizontal') {
            translateY = height / 2;
        }
        else if (position === 'end' && orientation === 'vertical') {
            translateX = width;
        }
        else if (position === 'center' && orientation === 'vertical') {
            translateX = width / 2;
        }
        return { translateX, translateY };
    }
    render() {
        const { scale, height, width, orientation, axisLine, tickSeries } = this.props;
        const { translateX, translateY } = this.getPosition();
        return (jsxs("g", Object.assign({ transform: `translate(${translateX}, ${translateY})`, ref: this.ref }, { children: [axisLine && (jsx(CloneElement, { element: axisLine, height: height, width: width, scale: scale, orientation: orientation }, void 0)),
                (tickSeries.props.line || tickSeries.props.label) && (jsx(CloneElement, { element: tickSeries, height: height, width: width, scale: scale, orientation: orientation, axis: this.props }, void 0))] }), void 0));
    }
}
LinearAxis.defaultProps = {
    axisLine: jsx(LinearAxisLine, {}, void 0),
    tickSeries: jsx(LinearAxisTickSeries, {}, void 0),
    scaled: false,
    roundDomains: false,
    onDimensionsChange: () => undefined
};

class LinearXAxisTickLabel extends Component {
    render() {
        return jsx(LinearAxisTickLabel, Object.assign({}, this.props), void 0);
    }
}
LinearXAxisTickLabel.defaultProps = Object.assign(Object.assign({}, LinearAxisTickLabel.defaultProps), { rotation: true, position: 'end', align: 'center' });
class LinearXAxisTickLine extends Component {
    render() {
        return jsx(LinearAxisTickLine, Object.assign({}, this.props), void 0);
    }
}
LinearXAxisTickLine.defaultProps = Object.assign(Object.assign({}, LinearAxisTickLine.defaultProps), { position: 'end' });
class LinearXAxisTickSeries extends Component {
    render() {
        return jsx(LinearAxisTickSeries, Object.assign({}, this.props), void 0);
    }
}
LinearXAxisTickSeries.defaultProps = Object.assign(Object.assign({}, LinearAxisTickSeries.defaultProps), { tickSize: 75, line: jsx(LinearXAxisTickLine, {}, void 0), label: jsx(LinearXAxisTickLabel, {}, void 0) });
class LinearXAxis extends Component {
    render() {
        return jsx(LinearAxis, Object.assign({}, this.props), void 0);
    }
}
LinearXAxis.defaultProps = Object.assign(Object.assign({}, LinearAxis.defaultProps), { position: 'end', roundDomains: false, scaled: false, type: 'value', orientation: 'horizontal', tickSeries: jsx(LinearXAxisTickSeries, {}, void 0) });

class LinearYAxisTickLabel extends Component {
    render() {
        return jsx(LinearAxisTickLabel, Object.assign({}, this.props), void 0);
    }
}
LinearYAxisTickLabel.defaultProps = Object.assign(Object.assign({}, LinearAxisTickLabel.defaultProps), { rotation: false, position: 'start', align: 'center' });
class LinearYAxisTickLine extends Component {
    render() {
        return jsx(LinearAxisTickLine, Object.assign({}, this.props), void 0);
    }
}
LinearYAxisTickLine.defaultProps = Object.assign(Object.assign({}, LinearAxisTickLine.defaultProps), { position: 'start' });
class LinearYAxisTickSeries extends Component {
    render() {
        return jsx(LinearAxisTickSeries, Object.assign({}, this.props), void 0);
    }
}
LinearYAxisTickSeries.defaultProps = Object.assign(Object.assign({}, LinearAxisTickSeries.defaultProps), { tickSize: 30, line: jsx(LinearYAxisTickLine, {}, void 0), label: jsx(LinearYAxisTickLabel, {}, void 0) });
class LinearYAxis extends Component {
    render() {
        return jsx(LinearAxis, Object.assign({}, this.props), void 0);
    }
}
LinearYAxis.defaultProps = Object.assign(Object.assign({}, LinearAxis.defaultProps), { orientation: 'vertical', scaled: false, roundDomains: false, type: 'value', position: 'start', tickSeries: jsx(LinearYAxisTickSeries, {}, void 0) });

/**
 * Returns whether the axis has a visual element or not.
 */
const isAxisVisible = (axis) => !!axis.tickSeries.props.label || !!axis.tickSeries.props.line;

class RadialAxisTickLine extends PureComponent {
    render() {
        const { stroke, size, position, innerRadius, outerRadius } = this.props;
        const x1 = position === 'outside' ? size : -(outerRadius - innerRadius);
        return (jsx("line", { x1: x1, x2: 0, stroke: stroke, style: { pointerEvents: 'none' } }, void 0));
    }
}
RadialAxisTickLine.defaultProps = {
    stroke: 'rgba(113, 128, 141, .5)',
    size: 10,
    position: 'inside'
};

const rad2deg = (angle) => (angle * 180) / Math.PI;
class RadialAxisTickLabel extends PureComponent {
    getPosition() {
        const { point, autoRotate, rotation, padding } = this.props;
        let textAnchor;
        let transform;
        if (autoRotate) {
            const l = point >= Math.PI;
            const r = point < 2 * Math.PI;
            // TODO: This centers the text, determine better way later
            if ((rotation >= 85 && rotation <= 95) ||
                (rotation <= -85 && rotation >= -95)) {
                textAnchor = 'middle';
            }
            else if (l && r) {
                textAnchor = 'end';
            }
            else {
                textAnchor = 'start';
            }
            transform = `rotate(${90 - rad2deg(point)}, ${padding}, 0)`;
        }
        else {
            const shouldRotate = rotation > 100 && rotation;
            const rotate = shouldRotate ? 180 : 0;
            const translate = shouldRotate ? -30 : 0;
            textAnchor = shouldRotate ? 'end' : 'start';
            transform = `rotate(${rotate}) translate(${translate})`;
        }
        return {
            transform,
            textAnchor
        };
    }
    render() {
        const { data, fill, fontFamily, fontSize, format, lineSize, index } = this.props;
        const text = format ? format(data, index) : formatValue(data);
        const { transform, textAnchor } = this.getPosition();
        return (jsxs("g", Object.assign({ transform: transform }, { children: [jsx("title", { children: text }, void 0),
                jsx("text", Object.assign({ dy: "0.35em", x: lineSize + 5, textAnchor: textAnchor, fill: fill, fontFamily: fontFamily, fontSize: fontSize }, { children: text }), void 0)] }), void 0));
    }
}
RadialAxisTickLabel.defaultProps = {
    fill: '#71808d',
    fontSize: 11,
    padding: 15,
    fontFamily: 'sans-serif',
    autoRotate: true
};

class RadialAxisTick extends Component {
    render() {
        const { line, label, scale, outerRadius, data, index, padding, innerRadius } = this.props;
        const point = scale(data);
        const rotation = (point * 180) / Math.PI - 90;
        const transform = `rotate(${rotation}) translate(${outerRadius + padding},0)`;
        const lineSize = line ? line.props.size : 0;
        return (jsxs("g", Object.assign({ transform: transform }, { children: [line && (jsx(CloneElement, { element: line, innerRadius: innerRadius, outerRadius: outerRadius }, void 0)),
                label && (jsx(CloneElement, { element: label, index: index, point: point, rotation: rotation, lineSize: lineSize, data: data }, void 0))] }), void 0));
    }
}
RadialAxisTick.defaultProps = {
    outerRadius: 0,
    padding: 0,
    line: jsx(RadialAxisTickLine, {}, void 0),
    label: jsx(RadialAxisTickLabel, {}, void 0)
};

class RadialAxisTickSeries extends Component {
    render() {
        const { scale, count, outerRadius, tick, tickValues, innerRadius, interval, type } = this.props;
        const ticks = getTicks(scale, tickValues, type, count, interval || count);
        return (jsx(Fragment, { children: ticks.map((data, i) => (jsx(CloneElement, { element: tick, index: i, scale: scale, data: data, innerRadius: innerRadius, outerRadius: outerRadius }, i))) }, void 0));
    }
}
RadialAxisTickSeries.defaultProps = {
    count: 12,
    type: 'time',
    tick: jsx(RadialAxisTick, {}, void 0)
};

class RadialAxisArc extends Component {
    render() {
        const { index, stroke, strokeDasharray, scale } = this.props;
        const r = scale(index);
        const strokeColor = typeof stroke === 'string' ? stroke : stroke(index);
        const strokeDash = typeof strokeDasharray === 'string'
            ? strokeDasharray
            : strokeDasharray(index);
        return (jsx("circle", { fill: "none", strokeDasharray: strokeDash, stroke: strokeColor, style: { pointerEvents: 'none' }, cx: "0", cy: "0", r: r }, void 0));
    }
}
RadialAxisArc.defaultProps = {
    stroke: '#71808d',
    strokeDasharray: '1,4'
};

class RadialAxisArcSeries extends Component {
    render() {
        const { count, innerRadius, outerRadius, arc } = this.props;
        const scale = scaleLinear()
            .domain([0, count])
            .range([innerRadius, outerRadius]);
        const arcs = scale.ticks(count);
        return (jsx(Fragment, { children: arcs.map((d) => (jsx(CloneElement, { element: arc, index: d, scale: scale }, d))) }, void 0));
    }
}
RadialAxisArcSeries.defaultProps = {
    count: 12,
    arc: jsx(RadialAxisArc, {}, void 0)
};

class RadialAxis extends Component {
    render() {
        const { arcs, ticks, xScale, height, width, innerRadius, type } = this.props;
        const outerRadius = Math.min(height, width) / 2;
        return (jsxs(Fragment, { children: [arcs && (jsx(CloneElement, { element: arcs, outerRadius: outerRadius, innerRadius: innerRadius }, void 0)),
                ticks && (jsx(CloneElement, { element: ticks, scale: xScale, type: type, innerRadius: innerRadius, outerRadius: outerRadius }, void 0))] }, void 0));
    }
}
RadialAxis.defaultProps = {
    innerRadius: 10,
    type: 'value',
    arcs: jsx(RadialAxisArcSeries, {}, void 0),
    ticks: jsx(RadialAxisTickSeries, {}, void 0)
};

/**
 * Add ability to calculate scale band position.
 * Reference: https://stackoverflow.com/questions/38633082/d3-getting-invert-value-of-band-scales
 */
const scaleBandInvert = (scale) => {
    const domain = scale.domain();
    const paddingOuter = scale(domain[0]);
    const eachBand = scale.step();
    const [, end] = scale.range();
    return (offset) => {
        let index = Math.floor((offset - paddingOuter) / eachBand);
        // Handle horizontal charts...
        if (end === 0) {
            index = index * -1;
        }
        return domain[Math.max(0, Math.min(index, domain.length - 1))];
    };
};
/**
 * Given a point position, get the closes data point in the dataset.
 */
const getClosestPoint = (pos, scale, data, attr = 'x') => {
    if (scale.invert) {
        const domain = scale.invert(pos);
        // Select the index
        const bisect = bisector((d) => d[attr]).right;
        const index = bisect(data, domain);
        // Determine min index
        const minIndex = Math.max(0, index - 1);
        const before = data[minIndex];
        // Determine max index
        const maxIndex = Math.min(data.length - 1, index);
        const after = data[maxIndex];
        // Determine which is closest to the point
        let beforeVal = before[attr];
        let afterVal = after[attr];
        beforeVal = domain - beforeVal;
        afterVal = afterVal - domain;
        return beforeVal < afterVal ? before : after;
    }
    else {
        // If we have a band scale, handle that special
        const domain = scale.domain();
        let prop;
        // Of course the Marimekko is a pain...
        if (scale.mariemkoInvert) {
            prop = scale.mariemkoInvert(pos);
        }
        else {
            prop = scaleBandInvert(scale)(pos);
        }
        const idx = domain.indexOf(prop);
        return data[idx];
    }
};
/**
 * Given an event, get the parent svg element;
 */
const getParentSVG = (event) => {
    // set node to targets owner svg
    let node = event.target.ownerSVGElement;
    // find the outermost svg
    if (node) {
        while (node.ownerSVGElement) {
            node = node.ownerSVGElement;
        }
    }
    return node;
};
/**
 * Given an event, get the relative X/Y position for a target.
 */
const getPositionForTarget = ({ target, clientX, clientY }) => {
    const { top, left } = target.getBoundingClientRect();
    return {
        x: clientX - left - target.clientLeft,
        y: clientY - top - target.clientTop
    };
};
/**
 * Gets the point from q given matrix.
 */
const getPointFromMatrix = (event, matrix) => {
    const parent = getParentSVG(event);
    if (!parent) {
        return null;
    }
    // Determines client coordinates relative to the editor component
    const { top, left } = parent.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    // Transforms the coordinate to world coordinate (in the SVG/DIV world)
    return applyToPoint(inverse(matrix), { x, y });
};
/**
 * Get the start/end matrix.
 */
const getLimitMatrix = (height, width, matrix) => applyToPoints(matrix, [
    { x: 0, y: 0 },
    { x: width, y: height }
]);
/**
 * Constrain the matrix.
 */
const constrainMatrix = (height, width, matrix) => {
    const [min, max] = getLimitMatrix(height, width, matrix);
    if (max.x < width || max.y < height) {
        return true;
    }
    if (min.x > 0 || min.y > 0) {
        return true;
    }
    return false;
};
/**
 * Determine if scale factor is less than allowed.
 */
const lessThanScaleFactorMin = (value, scaleFactor) => value.scaleFactorMin && value.d * scaleFactor <= value.scaleFactorMin;
/**
 * Determine if scale factor is larger than allowed.
 */
const moreThanScaleFactorMax = (value, scaleFactor) => value.scaleFactorMax && value.d * scaleFactor >= value.scaleFactorMax;
/**
 * Determine if both min and max scale fctors are going out of bounds.
 */
const isZoomLevelGoingOutOfBounds = (value, scaleFactor) => {
    const a = lessThanScaleFactorMin(value, scaleFactor) && scaleFactor < 1;
    const b = moreThanScaleFactorMax(value, scaleFactor) && scaleFactor > 1;
    return a || b;
};

/**
 * Toggle the text selection of the body.
 */
function toggleTextSelection(allowSelection) {
    const style = allowSelection ? '' : 'none';
    [
        '-webkit-touch-callout',
        '-webkit-user-select',
        '-khtml-user-select',
        '-moz-user-select',
        '-ms-user-select',
        'user-select'
    ].forEach((prop) => (document.body.style[prop] = style));
}

class Move extends Component {
    constructor() {
        super(...arguments);
        this.started = false;
        this.deltaX = 0;
        this.deltaY = 0;
        this.prevXPosition = 0;
        this.prevYPosition = 0;
        this.onMouseMove = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const { movementX, movementY } = event;
            this.deltaX = this.deltaX + movementX;
            this.deltaY = this.deltaY + movementY;
            if (this.checkThreshold()) {
                this.disableText(true);
                this.setCursor(true);
                this.deltaX = 0;
                this.deltaY = 0;
                this.started = true;
                this.props.onMoveStart({
                    nativeEvent: event,
                    type: 'mouse'
                });
            }
            else {
                this.rqf = requestAnimationFrame(() => {
                    this.props.onMove({
                        nativeEvent: event,
                        type: 'mouse',
                        x: movementX,
                        y: movementY
                    });
                });
            }
        };
        this.onMouseUp = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.disposeHandlers();
            if (this.started) {
                this.props.onMoveEnd({
                    nativeEvent: event,
                    type: 'mouse'
                });
            }
            else {
                this.props.onMoveCancel({
                    nativeEvent: event,
                    type: 'mouse'
                });
            }
        };
        this.onTouchMove = (event) => {
            event.preventDefault();
            event.stopPropagation();
            // Calculate delta from previous position and current
            const { clientX, clientY } = this.getTouchCoords(event);
            const deltaX = clientX - this.prevXPosition;
            const deltaY = clientY - this.prevYPosition;
            // Track the delta
            this.deltaX = this.deltaX + deltaX;
            this.deltaY = this.deltaY + deltaY;
            if (this.checkThreshold()) {
                this.disableText(true);
                this.setCursor(true);
                this.deltaX = 0;
                this.deltaY = 0;
                this.started = true;
                this.props.onMoveStart({
                    // TODO: Come back and clean this up...
                    nativeEvent: Object.assign(Object.assign({}, event), { clientX,
                        clientY }),
                    type: 'touch'
                });
            }
            else {
                this.rqf = requestAnimationFrame(() => {
                    this.props.onMove({
                        // TODO: Come back and clean this up...
                        nativeEvent: Object.assign(Object.assign({}, event), { clientX,
                            clientY }),
                        type: 'touch',
                        x: deltaX,
                        y: deltaY
                    });
                });
            }
            this.prevXPosition = clientX;
            this.prevYPosition = clientY;
        };
        this.onTouchEnd = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.disposeHandlers();
            if (this.started) {
                this.props.onMoveEnd({
                    nativeEvent: event,
                    type: 'touch'
                });
            }
            else {
                this.props.onMoveCancel({
                    nativeEvent: event,
                    type: 'touch'
                });
            }
        };
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.rqf);
        this.disposeHandlers();
    }
    disposeHandlers() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
        this.setCursor(false);
        this.disableText(true);
    }
    disableText(shouldDisable) {
        if (this.props.disableText) {
            toggleTextSelection(shouldDisable);
        }
    }
    setCursor(set) {
        let { cursor } = this.props;
        if (cursor) {
            if (!set) {
                cursor = 'inherit';
            }
            document.body.style['cursor'] = cursor;
        }
    }
    checkThreshold() {
        const { threshold } = this.props;
        return (!this.started &&
            (Math.abs(this.deltaX) > threshold || Math.abs(this.deltaY) > threshold));
    }
    getTouchCoords(event) {
        const { clientX, clientY } = event.touches[0];
        return {
            clientX,
            clientY
        };
    }
    onMouseDown(event) {
        const { preventRightClick, disabled } = this.props;
        const shouldCancel = event.nativeEvent.which === 3 && preventRightClick;
        if (shouldCancel || disabled) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.started = false;
        // Always bind event so we cancel movement even if no action was taken
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }
    onTouchStart(event) {
        const { disabled } = this.props;
        if (disabled || event.touches.length !== 1) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.started = false;
        this.prevXPosition = event.touches[0].clientX;
        this.prevYPosition = event.touches[0].clientY;
        // Always bind event so we cancel movement even if no action was taken
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onTouchEnd);
    }
    render() {
        return Children.map(this.props.children, (child) => cloneElement(child, Object.assign(Object.assign({}, child.props), { onMouseDown: (e) => {
                this.onMouseDown(e);
                if (child.props.onMouseDown) {
                    child.props.onMouseDown(e);
                }
            }, onTouchStart: (e) => {
                this.onTouchStart(e);
                if (child.props.onTouchStart) {
                    child.props.onTouchStart(e);
                }
            } })));
    }
}
Move.defaultProps = {
    preventRightClick: true,
    disableText: true,
    threshold: 0,
    onMoveStart: () => undefined,
    onMove: () => undefined,
    onMoveEnd: () => undefined,
    onMoveCancel: () => undefined
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$s = ".BrushHandle-module_handle__1HtKb {\n  fill: var(--color-handle-fill);\n  stroke: var(--color-handle-stroke);\n}\n\n.BrushHandle-module_dragging__k86sG {\n  fill: var(--color-handle-drag-fill);\n}\n\n.BrushHandle-module_dot__vx-R8 {\n  fill: var(--color-handle-dots);\n}\n\n.BrushHandle-module_line__1jJ7Y {\n  stroke: var(--color-handle-line);\n}\n";
var css$s = {"handle":"BrushHandle-module_handle__1HtKb","dragging":"BrushHandle-module_dragging__k86sG","dot":"BrushHandle-module_dot__vx-R8","line":"BrushHandle-module_line__1jJ7Y"};
styleInject(css_248z$s);

class BrushHandle extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isDragging: false
        };
    }
    onMoveStart() {
        this.setState({
            isDragging: true
        });
    }
    onMove(event) {
        this.props.onHandleDrag(event.x);
    }
    onMoveEnd() {
        this.setState({
            isDragging: false
        });
    }
    render() {
        const { height } = this.props;
        const { isDragging } = this.state;
        return (jsx(Move, Object.assign({ cursor: "ew-resize", onMoveStart: bind(this.onMoveStart, this), onMove: bind(this.onMove, this), onMoveEnd: bind(this.onMoveEnd, this) }, { children: jsxs("g", { children: [jsx("line", { className: css$s.line, y1: "0", y2: height, x1: "5", x2: "5" }, void 0),
                    jsx("rect", { className: classNames(css$s.handle, { [css$s.dragging]: isDragging }), height: height - 10, style: { cursor: 'ew-resize' }, width: 8, y: "5", y1: height - 5 }, void 0),
                    jsx("g", Object.assign({ transform: `translate(-1, ${height / 2 - 10})`, style: { pointerEvents: 'none' } }, { children: range(5).map((i) => (jsx("circle", { cy: i * 5, cx: "5", r: ".5", className: css$s.dot }, i))) }), void 0)] }, void 0) }), void 0));
    }
}

var css_248z$r = ".BrushSlice-module_slice__sa839 {\n  fill: var(--color-primary);\n}\n\n.BrushSlice-module_unsliced__1Ls_5 {\n  fill: var(--color-background);\n  opacity: 0.5;\n  pointer-events: none;\n}\n";
var css$r = {"slice":"BrushSlice-module_slice__sa839","unsliced":"BrushSlice-module_unsliced__1Ls_5"};
styleInject(css_248z$r);

class BrushSlice extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isDragging: false
        };
    }
    onMoveStart() {
        const { start, end, width } = this.props;
        const hasNoSlice = start === 0 && end === width;
        if (!hasNoSlice) {
            this.setState({
                isDragging: true
            });
        }
    }
    onMove({ x }) {
        const { onBrushChange, width } = this.props;
        let { start, end } = this.props;
        start = start + x;
        end = end + x;
        if (start >= 0 && end <= width) {
            onBrushChange({
                start,
                end
            });
        }
    }
    onMoveEnd() {
        this.setState({
            isDragging: false
        });
    }
    onHandleDrag(direction, deltaX) {
        const { onBrushChange } = this.props;
        let { start, end } = this.props;
        start = direction === 'start' ? start + deltaX : start;
        end = direction !== 'start' ? end + deltaX : end;
        onBrushChange({
            start,
            end
        });
    }
    render() {
        const { height, start, end, width } = this.props;
        const { isDragging } = this.state;
        const sliceWidth = Math.max(end - start, 0);
        const endSliceWidth = Math.max(width - end, 0);
        const hasNoSlice = start === 0 && end === width;
        return (jsxs(Fragment, { children: [jsx("rect", { className: css$r.unsliced, height: height, width: start }, void 0),
                jsx("rect", { transform: `translate(${end}, 0)`, className: css$r.unsliced, height: height, width: endSliceWidth }, void 0),
                jsxs("g", Object.assign({ transform: `translate(${start}, 0)` }, { children: [jsx(Move, Object.assign({ cursor: "grabbing", onMoveStart: bind(this.onMoveStart, this), onMove: bind(this.onMove, this), onMoveEnd: bind(this.onMoveEnd, this) }, { children: jsx("rect", { className: css$r.slice, height: height, width: sliceWidth, style: {
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    opacity: hasNoSlice ? 0 : 0.1,
                                    pointerEvents: !hasNoSlice ? 'initial' : 'none'
                                } }, void 0) }), void 0),
                        jsx("g", Object.assign({ transform: 'translate(-4, 0)' }, { children: jsx(BrushHandle, { height: height, onHandleDrag: bind(this.onHandleDrag, this, 'start') }, void 0) }), void 0),
                        jsx("g", Object.assign({ transform: `translate(${sliceWidth - 5}, 0)` }, { children: jsx(BrushHandle, { height: height, onHandleDrag: bind(this.onHandleDrag, this, 'end') }, void 0) }), void 0)] }), void 0)] }, void 0));
    }
}

class Brush extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSlicing: false,
            isPanning: false,
            start: props.start || 0,
            end: props.end || props.width
        };
    }
    componentDidUpdate(prevProps) {
        // If no brush is defined and width updates, update the offset of the end handle.
        if (prevProps.width !== this.props.width &&
            this.state.end === prevProps.width) {
            this.setState({ end: this.props.width });
        }
        // Don't update if we are doing the slicing
        if (!this.state.isSlicing && !this.state.isPanning) {
            const { start, end } = this.props;
            const startUpdated = start !== prevProps.start && start !== this.state.start;
            const endUpdated = end !== prevProps.end && end !== this.state.end;
            if (startUpdated || endUpdated) {
                this.setState(Object.assign({}, this.ensurePositionInBounds(start, end)));
            }
        }
    }
    getStartEnd(event, state = this.state) {
        const { x } = this.getPositionsForPanEvent(event);
        let start;
        let end;
        if (x < state.initial) {
            start = x;
            end = state.initial;
        }
        else {
            start = state.initial;
            end = x;
        }
        return this.ensurePositionInBounds(start, end, state);
    }
    getPositionsForPanEvent(event) {
        const eventObj = {
            target: this.ref,
            clientX: event.clientX,
            clientY: event.clientY
        };
        return getPositionForTarget(eventObj);
    }
    ensurePositionInBounds(newStart, newEnd, state = this.state) {
        const { width } = this.props;
        let start = newStart;
        let end = newEnd;
        if (start === undefined || start <= 0) {
            start = 0;
        }
        if (end === undefined) {
            end = width;
        }
        if (start > end) {
            start = state.start;
        }
        if (end < start) {
            end = state.end;
        }
        if (end >= width) {
            end = width;
        }
        return { start, end };
    }
    onMoveStart(event) {
        const positions = this.getPositionsForPanEvent(event.nativeEvent);
        this.setState({
            isSlicing: true,
            initial: positions.x
        });
    }
    onMove(event) {
        this.setState((prev) => {
            const { onBrushChange } = this.props;
            // Use setState callback so we can get the true previous value
            // rather than the bulk updated value react will trigger
            const { start, end } = this.getStartEnd(event.nativeEvent, prev);
            if (onBrushChange) {
                onBrushChange({
                    start,
                    end
                });
            }
            return {
                start,
                end
            };
        });
    }
    onMoveEnd() {
        this.setState({
            isSlicing: false
        });
    }
    onMoveCancel() {
        const val = {
            start: 0,
            end: this.props.width
        };
        this.setState(val);
        if (this.props.onBrushChange) {
            this.props.onBrushChange(val);
        }
    }
    onSliceChange(event) {
        const val = this.ensurePositionInBounds(event.start, event.end);
        this.setState(val);
        if (this.props.onBrushChange) {
            this.props.onBrushChange(val);
        }
    }
    render() {
        const { children, disabled, height, width } = this.props;
        const { isSlicing, start, end } = this.state;
        return (jsx(Move, Object.assign({ cursor: "crosshair", onMoveStart: bind(this.onMoveStart, this), onMove: bind(this.onMove, this), onMoveEnd: bind(this.onMoveEnd, this), onMoveCancel: bind(this.onMoveCancel, this) }, { children: jsxs("g", Object.assign({ style: {
                    pointerEvents: isSlicing ? 'none' : 'auto',
                    cursor: disabled ? '' : 'crosshair'
                } }, { children: [children, !disabled && (jsxs(Fragment, { children: [jsx("rect", { ref: (ref) => (this.ref = ref), height: height, width: width, opacity: 0 }, void 0),
                            start !== undefined && end !== undefined && (jsx(BrushSlice, { start: start, end: end, height: height, width: width, onBrushChange: bind(this.onSliceChange, this) }, void 0))] }, void 0))] }), void 0) }), void 0));
    }
}
Brush.defaultProps = {
    disabled: false,
    height: 0,
    width: 0,
    onBrushChange: () => undefined
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

class ChartBrush extends Component {
    getBrushOffset() {
        let start;
        let end;
        const { disabled, domain, scale } = this.props;
        if (!disabled && domain) {
            start = scale(domain[0]);
            end = scale(domain[1]);
        }
        return { start, end };
    }
    onBrushChange(event) {
        const { onBrushChange, scale, width } = this.props;
        if (onBrushChange) {
            let domain;
            if (event.start !== undefined &&
                event.end !== undefined &&
                (event.start !== 0 || event.end !== width)) {
                const start = scale.invert(event.start);
                const end = scale.invert(event.end);
                domain = [start, end];
            }
            onBrushChange({
                domain
            });
        }
    }
    render() {
        const _a = this.props, { scale, height, width, children } = _a, rest = __rest(_a, ["scale", "height", "width", "children"]);
        return (jsx(Brush, Object.assign({}, rest, this.getBrushOffset(), { height: height, width: width, onBrushChange: bind(this.onBrushChange, this) }, { children: children }), void 0));
    }
}
ChartBrush.defaultProps = {};

/**
 * Given a margins object, returns the top/left/right/bottom positions.
 */
function parseMargins(margins) {
    let top = 0;
    let right = 0;
    let bottom = 0;
    let left = 0;
    if (Array.isArray(margins)) {
        if (margins.length === 2) {
            top = margins[0];
            bottom = margins[0];
            left = margins[1];
            right = margins[1];
        }
        else if (margins.length === 4) {
            top = margins[0];
            right = margins[1];
            bottom = margins[2];
            left = margins[3];
        }
    }
    else if (margins !== undefined) {
        top = margins;
        right = margins;
        bottom = margins;
        left = margins;
    }
    return {
        top,
        right,
        bottom,
        left
    };
}
/**
 * Calculates the margins for the chart.
 */
function calculateMarginOffsets(height, width, margins) {
    const { left, right, bottom, top } = margins;
    const newHeight = height - top - bottom;
    const newWidth = width - left - right;
    return {
        height: newHeight,
        width: newWidth
    };
}
/**
 * Calculates the dimensions for the chart.
 */
function getDimension({ xOffset, yOffset, height, width, margins }) {
    const parsedMargins = parseMargins(margins);
    const marginDims = calculateMarginOffsets(height, width, parsedMargins);
    const chartWidth = marginDims.width - xOffset;
    const chartHeight = marginDims.height - yOffset;
    return {
        xOffset,
        yOffset,
        height,
        width,
        chartWidth,
        chartHeight,
        xMargin: xOffset + parsedMargins.left,
        yMargin: parsedMargins.top
    };
}

const ChartContainer = (_a) => {
    var { className, children, center, centerX, centerY, style, margins, containerClassName, xAxisVisible, yAxisVisible, id } = _a, rest = __rest(_a, ["className", "children", "center", "centerX", "centerY", "style", "margins", "containerClassName", "xAxisVisible", "yAxisVisible", "id"]);
    const curId = useId(id);
    const [xAxisSized, setXAxisSized] = useState(false);
    const [yAxisSized, setYAxisSized] = useState(false);
    const [xOffset, setYOffset] = useState(0);
    const [yOffset, setXOffset] = useState(0);
    const { observe, width, height } = useDimensions();
    const chartSized = useMemo(() => {
        if (!height || !width) {
            return false;
        }
        // TODO: @amcdnl refactor this to account for 0-2 axises on x/y
        if (xAxisVisible && !xAxisSized) {
            return false;
        }
        if (yAxisVisible && !yAxisSized) {
            return false;
        }
        return true;
    }, [height, width, xAxisSized, xAxisVisible, yAxisVisible, yAxisSized]);
    const onUpdateAxes = useCallback((orientation, event) => {
        if (orientation === 'horizontal') {
            setXAxisSized(true);
        }
        else {
            setYAxisSized(true);
        }
        if (event.height) {
            setYOffset(event.height);
        }
        if (event.width) {
            setXOffset(event.width);
        }
    }, []);
    const childProps = useMemo(() => (Object.assign({ chartSized, id: curId, updateAxes: onUpdateAxes, yAxisSized,
        xAxisSized }, getDimension({
        margins,
        height,
        width,
        yOffset,
        xOffset
    }))), [
        chartSized,
        curId,
        onUpdateAxes,
        yAxisSized,
        xAxisSized,
        margins,
        height,
        width,
        yOffset,
        xOffset
    ]);
    const translateX = center || centerX ? width / 2 : childProps.xMargin;
    const translateY = center || centerY ? height / 2 : childProps.yMargin;
    const styleHeight = rest.height !== undefined && rest.height !== null ? rest.height : '100%';
    const styleWidth = rest.width !== undefined && rest.width !== null ? rest.width : '100%';
    return (jsx("div", Object.assign({ ref: observe, style: { height: styleHeight, width: styleWidth }, className: containerClassName }, { children: height > 0 && width > 0 && (jsx("svg", Object.assign({ width: width, height: height, className: className, style: style }, { children: jsx("g", Object.assign({ transform: `translate(${translateX}, ${translateY})` }, { children: children(childProps) }), void 0) }), void 0)) }), void 0));
};

const humanFormatScale = new humanFormat.Scale({
    k: 1000,
    M: 1000000,
    B: 1000000000
});
const humanFormatMillionScale = new humanFormat.Scale({
    M: 1,
    B: 1000,
    T: 1000000
});
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000;
const humanFormatBigInteger = (bigInteger) => {
    if (bigInteger.greater(ONE_BILLION)) {
        return humanFormat(bigInteger.divide(ONE_MILLION).toJSNumber(), {
            scale: humanFormatMillionScale
        });
    }
    return humanFormat(bigInteger.toJSNumber(), { scale: humanFormatScale });
};
const bigIntegerToLocaleString = (bigInteger) => {
    let i = 0;
    let formattedString = '';
    for (const c of bigInteger.toString().split('').reverse()) {
        if (i > 0 && i % 3 === 0) {
            formattedString = ',' + formattedString;
        }
        formattedString = c + formattedString;
        i++;
    }
    return formattedString;
};

function normalizeValue(value, maxBigInt) {
    if (bigInt.isInstance(value)) {
        if (maxBigInt.greater(1000000)) {
            const divideBy = maxBigInt.divide(1000000);
            return value.divide(divideBy).toJSNumber();
        }
        else {
            return value.toJSNumber();
        }
    }
    else {
        return value;
    }
}
function normalizeValueForFormatting(value) {
    if (bigInt.isInstance(value)) {
        return bigIntegerToLocaleString(value);
    }
    return value;
}
function getMaxBigIntegerForNested(series) {
    let maxBigInteger = bigInt.one;
    for (const group of series) {
        const maxBigIntegerForGroup = getMaxBigIntegerForShallow(group.data);
        if (maxBigIntegerForGroup.greater(maxBigInteger)) {
            maxBigInteger = maxBigIntegerForGroup;
        }
    }
    return maxBigInteger;
}
function getMaxBigIntegerForShallow(series) {
    let maxBigInteger = bigInt.one;
    for (const point of series) {
        if (bigInt.isInstance(point.data)) {
            const bigInteger = point.data;
            if (bigInteger.greater(maxBigInteger)) {
                maxBigInteger = bigInteger;
            }
        }
    }
    return maxBigInteger;
}

/**
 * Accepts a `ChartDataShape` and transforms it to a chart readable data shape.
 *
 * Example:
 *
 *   [{
 *    key: 'Threat Intel',
 *    data: [{ key:'2011', data: 25 }]
 *   }]
 *
 * will be transformed to:
 *
 *  [{
 *    key: 'Threat Intel',
 *    data: [
 *      key: 'Threat Intel',
 *      x: '2011',
 *      y: 25
 *    ]
 *  }]
 */
function buildNestedChartData(series, sort = false, direction = 'vertical') {
    let result = [];
    const maxBigInteger = getMaxBigIntegerForNested(series);
    const isVertical = direction === 'vertical';
    for (const point of series) {
        for (const nestedPoint of point.data) {
            const key = normalizeValueForFormatting(point.key);
            let idx = result.findIndex((r) => {
                const left = r.key;
                if (left instanceof Date && key instanceof Date) {
                    return left.getTime() === key.getTime();
                }
                return left === key;
            });
            if (idx === -1) {
                result.push({
                    key,
                    metadata: point.metadata,
                    data: []
                });
                idx = result.length - 1;
            }
            const x = normalizeValue(isVertical ? nestedPoint.key : nestedPoint.data, maxBigInteger);
            const y = normalizeValue(isVertical ? nestedPoint.data : nestedPoint.key, maxBigInteger);
            result[idx].data.push({
                key,
                value: normalizeValueForFormatting(nestedPoint.data),
                metadata: nestedPoint.metadata,
                id: point.id,
                x,
                x0: isVertical ? x : 0,
                x1: x,
                y,
                y0: isVertical ? 0 : y,
                y1: y
            });
        }
    }
    // Sort the series data based on the median value
    if (sort) {
        result = result.sort((a, b) => {
            const aMax = median(a.data, (d) => d.y);
            const bMax = median(b.data, (d) => d.y);
            return aMax < bMax ? 1 : -1;
        });
    }
    return result;
}
function addToChartType(a, b) {
    if (bigInt.isInstance(a) && bigInt.isInstance(b)) {
        return a.add(b);
    }
    else if (a instanceof Date && typeof b === 'number') {
        return new Date(a.valueOf() + b);
    }
    else if (typeof a === 'number' && typeof b === 'number') {
        return a + b;
    }
    else {
        throw new Error('Invalid types to addToChartTypes');
    }
}
/**
 * Accepts a shallow shape and normalizes it to a chart readable format.
 */
function buildShallowChartData(series, direction = 'vertical', binSize = undefined) {
    const result = [];
    const maxBigInteger = getMaxBigIntegerForShallow(series);
    const isVertical = direction === 'vertical';
    for (const point of series) {
        const isTuple = Array.isArray(point.data);
        let k1 = point.key;
        if (binSize) {
            k1 = addToChartType(point.key, binSize);
        }
        const props = {
            k0: normalizeValue(point.key, maxBigInteger),
            k1: normalizeValue(k1, maxBigInteger),
            v0: normalizeValue(isTuple ? point.data[0] : 0, maxBigInteger),
            v1: normalizeValue(isTuple ? point.data[1] : point.data, maxBigInteger)
        };
        const xProp = isVertical ? 'k' : 'v';
        const yProp = isVertical ? 'v' : 'k';
        result.push({
            key: normalizeValueForFormatting(props.k0),
            value: normalizeValueForFormatting(props.v1),
            metadata: point.metadata,
            id: point.id,
            x: props[`${xProp}1`],
            x0: props[`${xProp}0`],
            x1: props[`${xProp}1`],
            y: props[`${yProp}1`],
            y0: props[`${yProp}0`],
            y1: props[`${yProp}1`]
        });
    }
    return result;
}

/**
 * Build a histogram given data set.
 */
function buildBins(xScale, thresholds, data) {
    const layout = histogram()
        .value((d) => d.x)
        .domain(xScale.domain())
        .thresholds(xScale.ticks(thresholds));
    const bins = layout(data);
    return bins.map((bin) => ({
        x0: bin.x0,
        x1: bin.x1,
        y: bin.length,
        y0: 0,
        y1: bin.length
    }));
}

/**
 * Given a dataset and a list of accessors, returns a unique collection.
 */
function uniqueBy(data, ...accessors) {
    const result = [];
    const ittr = (arr, depth) => {
        for (const a of arr) {
            const acc = accessors[depth];
            if (acc === undefined) {
                throw new Error(`Accessor not found for depth: ${depth}`);
            }
            const val = acc(a);
            if (Array.isArray(val)) {
                ittr(val, depth + 1);
            }
            else if (!result.includes(val)) {
                result.push(val);
            }
        }
    };
    ittr(data, 0);
    return result;
}

/**
 * Given a dataset like:
 *
 *   [{
 *    key: 'Threat Intel',
 *    data: [{ key:'2011', data: 25 }]
 *   }]
 *
 * it will transform it to:
 *
 *  [
 *    { x: 'Theat Intel', '2011': 25 }
 *  ]
 */
function transformDataToStack$1(data) {
    const result = [];
    const maxBigInteger = getMaxBigIntegerForNested(data);
    for (const category of data) {
        for (const value of category.data) {
            let idx = result.findIndex((r) => {
                if (r.x instanceof Date && category.key instanceof Date) {
                    return r.x.getTime() === category.key.getTime();
                }
                return r.x === category.key;
            });
            if (idx === -1) {
                result.push({
                    metadata: category.metadata,
                    x: category.key,
                    formattedValues: {}
                });
                idx = result.length - 1;
            }
            result[idx].metadata = value.metadata;
            result[idx][value.key] = normalizeValue(value.data, maxBigInteger);
            result[idx].formattedValues[value.key] =
                normalizeValueForFormatting(value.data);
        }
    }
    return result;
}
/**
 * Translates the stack data to a chart standard dataset.
 */
function transformStackToData$1(stackData, direction = 'vertical') {
    const result = [];
    const isVertical = direction === 'vertical';
    // Transform the data from the d3 stack format to our internal format
    for (const category of stackData) {
        for (const point of category) {
            const key = point.data.x;
            let idx = result.findIndex((r) => {
                if (r.key instanceof Date && key instanceof Date) {
                    return r.key.getTime() === key.getTime();
                }
                return r.key === key;
            });
            if (idx === -1) {
                result.push({
                    key,
                    data: []
                });
                idx = result.length - 1;
            }
            const categoryKey = category.key;
            const y = point.data[categoryKey];
            const [y0, y1] = point;
            result[idx].data.push({
                metadata: point.data.metadata,
                key,
                x: isVertical ? categoryKey : y1,
                x0: isVertical ? categoryKey : y0,
                x1: isVertical ? categoryKey : y1,
                y: isVertical ? y : categoryKey,
                y0: isVertical ? y0 : categoryKey,
                y1: isVertical ? y1 : categoryKey,
                value: point.data.formattedValues[categoryKey]
            });
        }
    }
    return result;
}
/**
 * Builds a stack dataset from the standard data format.
 */
function buildBarStackData(data = [], offset = 'default', direction = 'vertical') {
    const keys = uniqueBy(data, (d) => d.data, (d) => d.key);
    const stackData = transformDataToStack$1(data);
    let stackFn = stack();
    if (offset === 'expand') {
        stackFn = stackFn.offset(stackOffsetExpand);
    }
    else if (offset === 'diverging') {
        stackFn = stackFn.offset(stackOffsetDiverging);
    }
    const result = stackFn.keys(keys)(stackData);
    return transformStackToData$1(result, direction);
}

/**
 * Builds a stack dataset from the standard data format.
 */
function buildMarimekkoData(data = []) {
    const result = buildBarStackData(data, 'expand');
    const sums = {};
    // Calculate the sum for each series and the total sum
    let totalSum = 0;
    for (const series of result) {
        const sum = series.data.reduce((acc, cur) => acc + cur.y, 0);
        sums[series.key] = sum;
        totalSum += sum;
    }
    // Calculate the x0/x1 for each series
    let prev = 0;
    for (const series of result) {
        const x0 = prev;
        const x1 = prev + sums[series.key] / totalSum;
        prev = x1;
        for (const point of series.data) {
            point.x0 = x0;
            point.x1 = x1;
        }
    }
    return result;
}

/**
 * Given a dataset like:
 *
 *   [{
 *    key: 'Threat Intel',
 *    data: [{ key:'2011', data: 25 }]
 *   }]
 *
 * it will transform it to:
 *
 *  [
 *    { x: '2011', 'Theat Intel': 25 }
 *  ]
 */
function transformDataToStack(data) {
    const result = [];
    const maxBigInteger = getMaxBigIntegerForNested(data);
    for (const category of data) {
        for (const value of category.data) {
            let idx = result.findIndex((r) => {
                if (r.x instanceof Date && value.key instanceof Date) {
                    return r.x.getTime() === value.key.getTime();
                }
                return r.x === value.key;
            });
            if (idx === -1) {
                result.push({
                    x: value.key,
                    formattedValues: {}
                });
                idx = result.length - 1;
            }
            result[idx][category.key] = normalizeValue(value.data, maxBigInteger);
            result[idx].formattedValues[category.key] = normalizeValueForFormatting(value.data);
        }
    }
    return result;
}
/**
 * Translates the stack data to a chart standard dataset.
 */
function transformStackToData(stackData) {
    const result = [];
    for (const category of stackData) {
        const series = [];
        for (const point of category) {
            const [y0, y1] = point;
            const x = point.data.x;
            series.push({
                key: category.key,
                x,
                x0: x,
                x1: x,
                y: y1 - y0,
                y0,
                y1,
                value: point.data.formattedValues[category.key]
            });
        }
        result.push({
            key: category.key,
            data: series
        });
    }
    return result;
}
/**
 * Builds a stack dataset from the standard data format.
 */
function buildStackData(data, normalized = false) {
    const keys = uniqueBy(data, (d) => d.key);
    const stackData = transformDataToStack(data);
    const stackFn = !normalized ? stack() : stack().offset(stackOffsetExpand);
    const result = stackFn.keys(keys)(stackData);
    return transformStackToData(result);
}

const buildWaterfall = (series, direction = 'vertical', binSize = undefined) => {
    const data = buildShallowChartData(series, direction, binSize);
    const isVertical = direction === 'vertical';
    const v = isVertical ? 'y' : 'x';
    let cumulative = 0;
    for (const point of data) {
        point[`${v}0`] = cumulative;
        cumulative += point[v];
        point[`${v}1`] = cumulative;
        point[v] = cumulative;
    }
    return data;
};

class Pan extends Component {
    constructor() {
        super(...arguments);
        this.prevXPosition = 0;
        this.prevYPosition = 0;
        this.started = false;
        this.deltaX = 0;
        this.deltaY = 0;
        this.childRef = createRef();
        this.onMouseDown = (event) => {
            // Stop at disabled
            if (this.props.disabled) {
                return;
            }
            // Ignore right click
            if (event.which === 3) {
                return;
            }
            // If global panning is turned off, it will only pan on the container
            if (!this.props.globalPanning &&
                event.target &&
                !event.target.classList.contains('pan-container')) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            toggleTextSelection(false);
            this.started = false;
            // Always bind event so we cancel movement even if no action was taken
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
        };
        this.onMouseMove = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.deltaX = this.deltaX + event.movementX;
            this.deltaY = this.deltaY + event.movementY;
            if (this.checkThreshold()) {
                if (this.props.cursor) {
                    document.body.style['cursor'] = this.props.cursor;
                }
                this.deltaX = 0;
                this.deltaY = 0;
                this.started = true;
                this.onPanStart(event, 'mouse');
            }
            else {
                this.pan(event.movementX, event.movementY, event, 'mouse');
            }
        };
        this.onMouseUp = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.disposeHandlers();
            toggleTextSelection(true);
            if (this.started) {
                this.onPanEnd(event, 'mouse');
            }
            else {
                this.props.onPanCancel({
                    nativeEvent: event,
                    source: 'mouse'
                });
            }
        };
        this.onTouchStart = (event) => {
            // Stop at disabled
            if (this.props.disabled) {
                return;
            }
            // Reqquire more than one touch
            if (event.touches.length !== 1) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            toggleTextSelection(false);
            this.started = false;
            this.prevXPosition = event.touches[0].clientX;
            this.prevYPosition = event.touches[0].clientY;
            // Always bind event so we cancel movement even if no action was taken
            window.addEventListener('touchmove', this.onTouchMove);
            window.addEventListener('touchend', this.onTouchEnd);
        };
        this.onTouchMove = (event) => {
            event.preventDefault();
            event.stopPropagation();
            // Calculate delta from previous position and current
            const x = event.touches[0].clientX;
            const y = event.touches[0].clientY;
            const deltaX = x - this.prevXPosition;
            const deltaY = y - this.prevYPosition;
            this.deltaX = this.deltaX + deltaX;
            this.deltaY = this.deltaY + deltaY;
            if (this.checkThreshold()) {
                this.deltaX = 0;
                this.deltaY = 0;
                this.started = true;
                this.onPanStart(event, 'touch');
            }
            else {
                const contrained = this.pan(deltaX, deltaY, event, 'touch');
                if (!contrained) {
                    this.prevXPosition = x;
                    this.prevYPosition = y;
                }
            }
        };
        this.onTouchEnd = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.disposeHandlers();
            toggleTextSelection(true);
            if (this.started) {
                this.onPanEnd(event, 'touch');
            }
            else {
                this.props.onPanCancel({
                    nativeEvent: event,
                    source: 'touch'
                });
            }
        };
    }
    componentDidMount() {
        if (this.childRef.current) {
            this.childRef.current.addEventListener('mousedown', this.onMouseDown, {
                passive: false
            });
            this.childRef.current.addEventListener('touchstart', this.onTouchStart, {
                passive: false
            });
        }
    }
    componentWillUnmount() {
        this.disposeHandlers();
        if (this.childRef.current) {
            this.childRef.current.removeEventListener('mousedown', this.onMouseDown);
            this.childRef.current.removeEventListener('touchstart', this.onTouchStart);
        }
    }
    disposeHandlers() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
        // Reset cursor on body back to original
        document.body.style['cursor'] = 'inherit';
        toggleTextSelection(true);
    }
    checkThreshold() {
        const { threshold } = this.props;
        return (!this.started &&
            (Math.abs(this.deltaX) > threshold || Math.abs(this.deltaY) > threshold));
    }
    onPanStart(nativeEvent, source) {
        this.props.onPanStart({
            nativeEvent,
            source
        });
    }
    onPanMove(x, y, source, nativeEvent) {
        this.props.onPanMove({
            source,
            nativeEvent,
            x,
            y
        });
    }
    onPanEnd(nativeEvent, source) {
        const { onPanEnd } = this.props;
        onPanEnd({
            nativeEvent,
            source
        });
    }
    pan(x, y, nativeEvent, source) {
        const { scale, constrain, width, height, matrix } = this.props;
        const newMatrix = smoothMatrix(transform(matrix, translate$1(x / scale, y / scale)), 100);
        const shouldConstrain = constrain && constrainMatrix(height, width, newMatrix);
        if (!shouldConstrain) {
            this.onPanMove(newMatrix.e, newMatrix.f, source, nativeEvent);
        }
        return shouldConstrain;
    }
    render() {
        return jsx("g", Object.assign({ ref: this.childRef }, { children: this.props.children }), void 0);
    }
}
Pan.defaultProps = {
    x: 0,
    y: 0,
    disabled: false,
    scale: 1,
    threshold: 10,
    globalPanning: true,
    onPanStart: () => undefined,
    onPanMove: () => undefined,
    onPanEnd: () => undefined,
    onPanCancel: () => undefined
};

/**
 * Gets the position between a given set of points.
 */
const getMidpoint = (pointA, pointB) => ({
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2
});
/**
 * Gets the distance between a given set of points.
 */
const getDistanceBetweenPoints = (pointA, pointB) => Math.sqrt(Math.pow(pointB.y - pointA.y, 2) + Math.pow(pointB.x - pointA.x, 2));
/**
 * Get touch points.
 */
function getTouchPoints(event, node) {
    const { left, top } = node.getBoundingClientRect();
    const [pointA, pointB] = [...event.touches].map((touch) => ({
        x: touch.clientX - Math.round(left),
        y: touch.clientY - Math.round(top)
    }));
    const distance = getDistanceBetweenPoints(pointA, pointB);
    const midpoint = getMidpoint(pointA, pointB);
    return {
        pointA,
        pointB,
        distance,
        midpoint
    };
}

class Zoom extends Component {
    constructor() {
        super(...arguments);
        this.childRef = createRef();
        this.onMouseWheel = (event) => {
            const { disableMouseWheel, requireZoomModifier, matrix, onZoomEnd } = this.props;
            if (disableMouseWheel) {
                return false;
            }
            const hasModifier = event.metaKey || event.ctrlKey;
            if (requireZoomModifier && !hasModifier) {
                return false;
            }
            event.preventDefault();
            event.stopPropagation();
            const point = getPointFromMatrix(event, matrix);
            if (point) {
                const { x, y } = point;
                const step = this.getStep(event.deltaY);
                this.scale(x, y, step, event);
                // Do small timeout to 'guess' when its done zooming
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => onZoomEnd(), 500);
            }
        };
        this.onTouchStart = (event) => {
            if (event.touches.length === 2) {
                event.preventDefault();
                event.stopPropagation();
                toggleTextSelection(false);
                this.firstTouch = getTouchPoints(event, this.childRef.current);
                this.lastDistance = this.firstTouch.distance;
                window.addEventListener('touchmove', this.onTouchMove);
                window.addEventListener('touchend', this.onTouchEnd);
            }
        };
        this.onTouchMove = (event) => {
            if (event.touches.length === 2) {
                event.preventDefault();
                event.stopPropagation();
                const { distance } = getTouchPoints(event, this.childRef.current);
                const distanceFactor = distance / this.lastDistance;
                const point = applyToPoint(inverse(this.props.matrix), {
                    x: this.firstTouch.midpoint.x,
                    y: this.firstTouch.midpoint.y
                });
                if (point.x && point.y) {
                    const outside = this.scale(point.x, point.y, distanceFactor, event);
                    if (!outside) {
                        this.lastDistance = distance;
                    }
                }
            }
        };
        this.onTouchEnd = (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.removeEventListener('touchmove', this.onTouchMove);
            window.removeEventListener('touchend', this.onTouchEnd);
            toggleTextSelection(true);
            this.props.onZoomEnd();
        };
    }
    componentDidMount() {
        const { disabled, disableMouseWheel } = this.props;
        const ref = this.childRef.current;
        if (!disabled && ref) {
            if (!disableMouseWheel) {
                ref.addEventListener('mousewheel', this.onMouseWheel, {
                    passive: false
                });
            }
            ref.addEventListener('touchstart', this.onTouchStart, { passive: false });
        }
    }
    componentWillUnmount() {
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
        cancelAnimationFrame(this.rqf);
        clearTimeout(this.timeout);
        const ref = this.childRef.current;
        if (ref) {
            ref.removeEventListener('mousewheel', this.onMouseWheel);
            ref.removeEventListener('touchstart', this.onTouchStart);
        }
        toggleTextSelection(true);
    }
    getStep(delta) {
        const { scaleFactor } = this.props;
        return -delta > 0 ? scaleFactor + 1 : 1 - scaleFactor;
    }
    scale(x, y, step, nativeEvent) {
        const { minZoom, maxZoom, onZoom, matrix } = this.props;
        const outside = isZoomLevelGoingOutOfBounds({
            d: matrix.a,
            scaleFactorMin: minZoom,
            scaleFactorMax: maxZoom
        }, step);
        if (!outside) {
            const newMatrix = smoothMatrix(transform(matrix, translate$1(x, y), scale(step, step), translate$1(-x, -y)), 100);
            this.rqf = requestAnimationFrame(() => {
                onZoom({
                    scale: newMatrix.a,
                    x: newMatrix.e,
                    y: newMatrix.f,
                    nativeEvent
                });
            });
        }
        return outside;
    }
    render() {
        const { style, children } = this.props;
        return (jsx("g", Object.assign({ ref: this.childRef, style: style }, { children: children }), void 0));
    }
}
Zoom.defaultProps = {
    x: 0,
    y: 0,
    scale: 1,
    scaleFactor: 0.1,
    minZoom: 1,
    maxZoom: 10
};

var css_248z$q = ".DiscreteLegend-module_container__MpmKP {\n  display: flex;\n  overflow: auto;\n}\n\n  .DiscreteLegend-module_container__MpmKP.DiscreteLegend-module_horizontal__3Mt5B {\n    align-items: center;\n    flex-direction: row;\n  }\n\n  .DiscreteLegend-module_container__MpmKP.DiscreteLegend-module_vertical__M1d-S {\n    flex-direction: column;\n  }\n";
var css$q = {"container":"DiscreteLegend-module_container__MpmKP","horizontal":"DiscreteLegend-module_horizontal__3Mt5B","vertical":"DiscreteLegend-module_vertical__M1d-S"};
styleInject(css_248z$q);

const DiscreteLegend = ({ entries, orientation, style, className }) => (jsx("div", Object.assign({ className: classNames(css$q.container, className, {
        [css$q.horizontal]: orientation === 'horizontal',
        [css$q.vertical]: orientation === 'vertical'
    }), style: style }, { children: entries.map((entry, index) => (jsx(CloneElement, { element: entry, orientation: orientation }, `dle-${index}`))) }), void 0));
DiscreteLegend.defaultProps = {
    orientation: 'vertical'
};

var css_248z$p = ".DiscreteLegendSymbol-module_symbol__1n4Gb {\n  width: 15px;\n  height: 3px;\n}\n";
var css$p = {"symbol":"DiscreteLegendSymbol-module_symbol__1n4Gb"};
styleInject(css_248z$p);

const DiscreteLegendSymbol = ({ className, color }) => (jsx("div", { className: classNames(css$p.symbol, className), style: { background: color } }, void 0));

var css_248z$o = ".DiscreteLegendEntry-module_entry__2kjdn {\n  display: flex;\n  color: var(--color-on-primary);\n  padding: 8px;\n  will-change: transparency;\n  transition: opacity 150ms ease-in;\n}\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_vertical__2LxhZ {\n    flex-direction: row;\n    align-items: center;\n  }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_vertical__2LxhZ:first-child {\n      padding-top: 0;\n    }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_vertical__2LxhZ:last-child {\n      padding-bottom: 0;\n    }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_vertical__2LxhZ .DiscreteLegendEntry-module_label__2e4-v {\n      margin-left: 8px;\n    }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_vertical__2LxhZ svg {\n      display: block;\n      margin: 0 auto;\n    }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_horizontal__37dGv {\n    align-items: center;\n    flex-direction: row;\n  }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_horizontal__37dGv:first-child {\n      padding-left: 0;\n    }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_horizontal__37dGv:last-child {\n      padding-right: 0;\n    }\n\n  .DiscreteLegendEntry-module_entry__2kjdn.DiscreteLegendEntry-module_horizontal__37dGv .DiscreteLegendEntry-module_label__2e4-v {\n      margin-left: 8px;\n    }\n\n  .DiscreteLegendEntry-module_entry__2kjdn .DiscreteLegendEntry-module_label__2e4-v {\n    font-size: 12px;\n  }\n\n  .DiscreteLegendEntry-module_entry__2kjdn svg {\n    width: 15px;\n    height: 15px;\n  }\n";
var css$o = {"entry":"DiscreteLegendEntry-module_entry__2kjdn","vertical":"DiscreteLegendEntry-module_vertical__2LxhZ","label":"DiscreteLegendEntry-module_label__2e4-v","horizontal":"DiscreteLegendEntry-module_horizontal__37dGv"};
styleInject(css_248z$o);

const DiscreteLegendEntry = ({ label, symbol, title, className, color, style, orientation, onMouseEnter, onMouseLeave, onClick }) => (jsxs("div", Object.assign({ title: title, className: classNames(css$o.entry, className, {
        [css$o.vertical]: orientation === 'vertical',
        [css$o.horizontal]: orientation === 'horizontal'
    }), onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, style: style }, { children: [jsx(CloneElement, { element: symbol, color: color }, void 0),
        jsx("span", Object.assign({ className: css$o.label }, { children: label }), void 0)] }), void 0));
DiscreteLegendEntry.defaultProps = {
    symbol: jsx(DiscreteLegendSymbol, {}, void 0),
    orientation: 'horizontal'
};

var css_248z$n = ".SequentialLegend-module_container__2EkZd {\n  display: flex;\n  height: 100%;\n}\n\n  .SequentialLegend-module_container__2EkZd.SequentialLegend-module_vertical__1DXNP {\n    flex-direction: column;\n    max-width: 55px;\n  }\n\n  .SequentialLegend-module_container__2EkZd.SequentialLegend-module_vertical__1DXNP .SequentialLegend-module_start__1Pb9A,\n    .SequentialLegend-module_container__2EkZd.SequentialLegend-module_vertical__1DXNP .SequentialLegend-module_end__3RWw0 {\n      text-align: center;\n      padding: 5px 0;\n      width: 100%;\n    }\n\n  .SequentialLegend-module_container__2EkZd.SequentialLegend-module_vertical__1DXNP .SequentialLegend-module_gradient__3aF0r {\n      width: 25px;\n      margin: 0 auto;\n    }\n\n  .SequentialLegend-module_container__2EkZd.SequentialLegend-module_horizontal__2Q9EA {\n    flex-direction: row-reverse;\n  }\n\n  .SequentialLegend-module_container__2EkZd.SequentialLegend-module_horizontal__2Q9EA .SequentialLegend-module_start__1Pb9A,\n    .SequentialLegend-module_container__2EkZd.SequentialLegend-module_horizontal__2Q9EA .SequentialLegend-module_end__3RWw0 {\n      max-width: 20%;\n    }\n\n  .SequentialLegend-module_container__2EkZd.SequentialLegend-module_horizontal__2Q9EA .SequentialLegend-module_start__1Pb9A {\n      text-align: right;\n      padding-left: 5px;\n    }\n\n  .SequentialLegend-module_container__2EkZd.SequentialLegend-module_horizontal__2Q9EA .SequentialLegend-module_end__3RWw0 {\n      text-align: left;\n      padding-right: 5px;\n    }\n\n  .SequentialLegend-module_container__2EkZd .SequentialLegend-module_gradient__3aF0r {\n    flex: 1;\n    width: 100%;\n    border-radius: 2px;\n  }\n\n  .SequentialLegend-module_container__2EkZd .SequentialLegend-module_start__1Pb9A,\n  .SequentialLegend-module_container__2EkZd .SequentialLegend-module_end__3RWw0 {\n    color: var(--color-on-primary);\n    font-size: 12px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n[dir=\"ltr\"] :export {\n  start-top: SequentialLegend-module_start__1Pb9A;\n  start-left: SequentialLegend-module_start__1Pb9A;\n}\n\n[dir=\"rtl\"] :export {\n  start-top: SequentialLegend-module_start__1Pb9A;\n  start-right: SequentialLegend-module_start__1Pb9A;\n}\n\n[dir=\"ltr\"] :export {\n  end-bottom: SequentialLegend-module_end__3RWw0;\n  end-right: SequentialLegend-module_end__3RWw0;\n}\n\n[dir=\"rtl\"] :export {\n  end-bottom: SequentialLegend-module_end__3RWw0;\n  end-left: SequentialLegend-module_end__3RWw0;\n}\n";
var css$n = {"container":"SequentialLegend-module_container__2EkZd","vertical":"SequentialLegend-module_vertical__1DXNP","gradient":"SequentialLegend-module_gradient__3aF0r","horizontal":"SequentialLegend-module_horizontal__2Q9EA"};
styleInject(css_248z$n);

class SequentialLegend extends PureComponent {
    render() {
        const { orientation, className, style, colorScheme, data } = this.props;
        // Generate the color gradient
        const color = chroma
            .scale(colorScheme)
            .colors(10)
            .reverse()
            .map((c, i) => `${c} ${i * 10}%`)
            .join(',');
        // Get the extent from the data passed
        const [end, start] = extent$1(uniqueBy(data, (d) => d.data, (d) => d.data));
        // Get direction
        const gradientDir = orientation === 'vertical' ? '' : 'to left,';
        return (jsxs("div", Object.assign({ style: style, className: classNames(css$n.container, className, {
                [css$n.vertical]: orientation === 'vertical',
                [css$n.horizontal]: orientation === 'horizontal'
            }) }, { children: [jsx("div", Object.assign({ className: css$n.start }, { children: formatValue(start) }), void 0),
                jsx("div", { className: css$n.gradient, style: {
                        background: `linear-gradient(${gradientDir}${color})`
                    } }, void 0),
                jsx("div", Object.assign({ className: css$n.end }, { children: formatValue(end) }), void 0)] }), void 0));
    }
}
SequentialLegend.defaultProps = {
    colorScheme: ['rgba(28, 107, 86, 0.5)', '#2da283'],
    orientation: 'vertical'
};

var css_248z$m = ".Gridline-module_gridLine__1K6sy {\n  shape-rendering: crispEdges;\n  pointer-events: none;\n}\n";
var css$m = {"gridLine":"Gridline-module_gridLine__1K6sy"};
styleInject(css_248z$m);

const Gridline = ({ strokeWidth, direction, className, strokeColor, data, height, width, scale, strokeDasharray }) => {
    const coords = useMemo(() => {
        const pos = scale(data);
        if (direction === 'x') {
            return {
                x1: pos,
                x2: pos,
                y1: 0,
                y2: height
            };
        }
        else {
            return {
                y1: pos,
                y2: pos,
                x1: 0,
                x2: width
            };
        }
    }, [direction, data, height, width, scale]);
    return (jsx("line", Object.assign({}, coords, { className: classNames(css$m.gridLine, className), strokeDasharray: strokeDasharray, strokeWidth: strokeWidth, stroke: strokeColor, fill: "none" }), void 0));
};
Gridline.defaultProps = {
    strokeWidth: 1,
    strokeDasharray: '2 5',
    direction: 'all',
    strokeColor: 'rgba(153, 153, 153, 0.5)'
};

const GridlineSeries = ({ line, stripe, yScale, xScale, yAxis, xAxis, height, width }) => {
    const shouldRenderY = (direction) => direction === 'all' || direction === 'y';
    const shouldRenderX = (direction) => direction === 'all' || direction === 'x';
    const getSkipIndex = useCallback((direction) => {
        if ((direction === 'x' &&
            yAxis.axisLine !== null &&
            yAxis.position === 'start') ||
            (direction === 'y' &&
                xAxis.axisLine !== null &&
                xAxis.position === 'end')) {
            return 0;
        }
        return null;
    }, [xAxis, yAxis]);
    const { yAxisGrid, xAxisGrid } = useMemo(() => {
        return {
            yAxisGrid: getTicks(yScale, yAxis.tickSeries.props.tickValues, yAxis.type, getMaxTicks(yAxis.tickSeries.props.tickSize, height), yAxis.tickSeries.props.interval),
            xAxisGrid: getTicks(xScale, xAxis.tickSeries.props.tickValues, xAxis.type, getMaxTicks(xAxis.tickSeries.props.tickSize, width), xAxis.tickSeries.props.interval)
        };
    }, [height, width, xAxis, yAxis, yScale, xScale]);
    const renderGroup = useCallback((element, grid, scale, direction, type) => {
        const skipIdx = getSkipIndex(direction);
        return grid.map((point, index) => (jsx(Fragment, { children: index !== skipIdx && (jsx(CloneElement, { element: element, index: index, scale: scale, data: point, height: height, width: width, direction: direction }, void 0)) }, `${type}-${direction}-${index}`)));
    }, [getSkipIndex, height, width]);
    const renderSeries = useCallback((yAxisGrid, xAxisGrid, element, type) => {
        return (jsxs(Fragment, { children: [shouldRenderY(element.props.direction) &&
                    renderGroup(element, yAxisGrid, yScale, 'y', type), shouldRenderX(element.props.direction) &&
                    renderGroup(element, xAxisGrid, xScale, 'x', type)] }, void 0));
    }, [renderGroup, xScale, yScale]);
    return (jsxs("g", Object.assign({ style: { pointerEvents: 'none' } }, { children: [line && renderSeries(yAxisGrid, xAxisGrid, line, 'line'), stripe && renderSeries(yAxisGrid, xAxisGrid, stripe, 'stripe')] }), void 0));
};
GridlineSeries.defaultProps = {
    line: jsx(Gridline, { direction: "all" }, void 0),
    stripe: null
};

var css_248z$l = ".GridStripe-module_gridStripe__1UttV {\n  pointer-events: none;\n}\n";
var css$l = {"gridStripe":"GridStripe-module_gridStripe__1UttV"};
styleInject(css_248z$l);

const GridStripe = ({ fill, className, position, data, height, width, scale, index }) => {
    const coords = useMemo(() => {
        const pos = scale(data);
        const stripeFill = index % 2 ? 'none' : fill;
        const dim = scale.bandwidth();
        if (position === 'vertical') {
            return {
                y: 0,
                x: pos,
                height: height,
                width: dim,
                fill: stripeFill
            };
        }
        else {
            return {
                y: pos,
                x: 0,
                height: dim,
                width,
                fill: stripeFill
            };
        }
    }, [scale, data, index, height, width, fill, position]);
    return jsx("rect", Object.assign({ className: classNames(css$l.gridStripe, className) }, coords), void 0);
};
GridStripe.defaultProps = {
    fill: '#393c3e'
};

var css_248z$k = ".MarkLine-module_markLine__2002U {\n  pointer-events: none;\n  stroke-dasharray: 4, 4;\n  stroke-linecap: round;\n}\n";
var css$k = {"markLine":"MarkLine-module_markLine__2002U"};
styleInject(css_248z$k);

const MarkLine = ({ pointX, height, strokeWidth = 1, strokeColor = '#eee' }) => (jsx("line", { stroke: strokeColor, strokeWidth: strokeWidth, y1: "0", vectorEffect: "non-scaling-stroke", y2: height, x1: pointX, x2: pointX, className: css$k.markLine }, void 0));

const GradientStop = ({ color, offset, stopOpacity = 1 }) => jsx("stop", { offset: offset, stopOpacity: stopOpacity, stopColor: color }, void 0);

const Gradient = ({ id, color, direction = 'vertical', stops = [
    jsx(GradientStop, { offset: "0%", stopOpacity: 0.3 }, "start"),
    jsx(GradientStop, { offset: "80%", stopOpacity: 1 }, "stop")
] }) => {
    const pos = direction === 'vertical'
        ? {
            x1: '10%',
            x2: '10%',
            y1: '100%',
            y2: '0%'
        }
        : {
            y1: '0%',
            y2: '0%',
            x1: '0%',
            x2: '100%'
        };
    return (jsx("linearGradient", Object.assign({ spreadMethod: "pad", id: id }, pos, { children: stops.map((stop, index) => (jsx(CloneElement, { element: stop, color: stop.props.color || color }, `gradient-${index}`))) }), void 0));
};

const RadialGradient = ({ id, color, radius = '30%', stops = [
    jsx(GradientStop, { offset: "0%", stopOpacity: 0.2 }, "start"),
    jsx(GradientStop, { offset: "80%", stopOpacity: 0.7 }, "stop")
] }) => (jsx("radialGradient", Object.assign({ id: id, cx: 0, cy: 0, r: radius, gradientUnits: "userSpaceOnUse" }, { children: stops.map((stop, index) => (jsx(CloneElement, { element: stop, color: color }, `gradient-${index}`))) }), void 0));

const Mask = ({ id, fill }) => (jsx("mask", Object.assign({ id: id }, { children: jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: fill }, void 0) }), void 0));

const Stripes = ({ id, fill }) => (jsx("pattern", Object.assign({ id: id, width: "4", height: "4", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, { children: jsx("rect", { className: "area-stripe", width: "1", height: "4", fill: fill }, void 0) }), void 0));

var css_248z$j = ".TooltipTemplate-module_label__1-9Eq {\n  font-size: 16px;\n  margin-bottom: 3px;\n  color: var(--color-on-tooltip);\n}\n\n.TooltipTemplate-module_value__3RhFW {\n  font-size: 13px;\n  color: var(--color-on-tooltip);\n  opacity: 0.7;\n}\n\n.TooltipTemplate-module_subValue__2jKhI {\n  display: block;\n  text-align: left;\n  padding: 3px 5px;\n}\n\n.TooltipTemplate-module_subValue__2jKhI .TooltipTemplate-module_subValueColor__2Mkos {\n    width: 5px;\n    height: 15px;\n    margin-right: 8px;\n    display: inline-block;\n  }\n\n.TooltipTemplate-module_subValue__2jKhI .TooltipTemplate-module_subValueName__MtlOy {\n    margin-right: 5px;\n  }\n";
var css$j = {"label":"TooltipTemplate-module_label__1-9Eq","value":"TooltipTemplate-module_value__3RhFW","subValue":"TooltipTemplate-module_subValue__2jKhI","subValueColor":"TooltipTemplate-module_subValueColor__2Mkos","subValueName":"TooltipTemplate-module_subValueName__MtlOy"};
styleInject(css_248z$j);

const TooltipTemplate = ({ value, color, className }) => {
    if (!value) {
        return null;
    }
    const renderValues = (data, index) => {
        const fill = color(data, index);
        return (jsxs("span", Object.assign({ className: css$j.subValue }, { children: [jsx("span", { className: css$j.subValueColor, style: { backgroundColor: fill } }, void 0),
                jsxs("span", Object.assign({ className: css$j.subValueName }, { children: [formatValue(data.key || data.x), ":"] }), void 0),
                jsx("span", { children: formatValue(data.value || data.y) }, void 0)] }), void 0));
    };
    const renderMultiple = (value) => {
        const excessCount = value.data.length - 15;
        const pagedValues = value.data.slice(0, 15);
        return (jsxs(Fragment, { children: [pagedValues.map((point, i) => (jsx(Fragment, { children: renderValues(point, i) }, i))),
                excessCount > 0 && jsxs("div", { children: ["...", excessCount, " more..."] }, void 0)] }, void 0));
    };
    const isMultiple = Array.isArray(value.data);
    return (jsxs("div", Object.assign({ className: className, role: "tooltip" }, { children: [jsx("div", Object.assign({ className: css$j.label }, { children: formatValue(value.x) }), void 0),
            jsxs("div", Object.assign({ className: css$j.value }, { children: [isMultiple && renderMultiple(value),
                    !isMultiple && (jsx(Fragment, { children: formatValue(value.value ||
                            value.y) }, void 0))] }), void 0)] }), void 0));
};

const ChartTooltip = (_a) => {
    var { content, value, data, color } = _a, rest = __rest(_a, ["content", "value", "data", "color"]);
    return (jsx(Tooltip, Object.assign({}, rest, { content: () => {
            if (!value && !data) {
                return null;
            }
            return typeof content === 'function'
                ? content(data || value, color)
                : cloneElement(content, Object.assign(Object.assign({}, content.props), { value,
                    color }));
        } }), void 0));
};
ChartTooltip.defaultProps = {
    content: jsx(TooltipTemplate, {}, void 0),
};

class TooltipArea extends Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.ref = createRef();
        this.transformData = memoize((series) => {
            const { inverse, isHorizontal } = this.props;
            const result = [];
            if (inverse) {
                for (const point of series) {
                    const seriesPoint = point;
                    if (Array.isArray(seriesPoint.data)) {
                        for (const nestedPoint of seriesPoint.data) {
                            const right = nestedPoint.x;
                            let idx = result.findIndex((r) => {
                                const left = r.x;
                                if (left instanceof Date && right instanceof Date) {
                                    return left.getTime() === right.getTime();
                                }
                                return left === right;
                            });
                            if (idx === -1) {
                                result.push({
                                    x: nestedPoint.x,
                                    data: []
                                });
                                idx = result.length - 1;
                            }
                            const data = result[idx].data;
                            if (Array.isArray(data)) {
                                data.push(nestedPoint);
                            }
                        }
                    }
                    else {
                        result.push(point);
                    }
                }
            }
            else {
                for (const point of series) {
                    const nestedPoint = point;
                    if (Array.isArray(nestedPoint.data)) {
                        result.push(Object.assign(Object.assign({}, nestedPoint), { x: nestedPoint.key, data: nestedPoint.data.map((d) => (Object.assign(Object.assign({}, d), { key: !isHorizontal ? d.x : d.y, value: !isHorizontal ? d.y : d.x }))) }));
                    }
                    else {
                        const shallowPoint = point;
                        result.push(Object.assign(Object.assign({}, shallowPoint), { 
                            // Histograms special logic...
                            x: shallowPoint.key === undefined ? shallowPoint.x0 : point.key, y: shallowPoint.value === undefined
                                ? shallowPoint.y
                                : shallowPoint.value }));
                    }
                }
            }
            return result;
        });
    }
    getXCoord(x, y) {
        const { isRadial, width, height } = this.props;
        // If the shape is radial, we need to convert the X coords to a radial format.
        if (isRadial) {
            const outerRadius = Math.min(width, height) / 2;
            let rad = Math.atan2(y - outerRadius, x - outerRadius) + Math.PI / 2;
            // TODO: Figure out what the 'correct' way to do this is...
            if (rad < 0) {
                rad += Math.PI * 2;
            }
            return rad;
        }
        return x;
    }
    onMouseMove(event) {
        const { xScale, yScale, onValueEnter, height, width, data, isRadial, isHorizontal, placement } = this.props;
        const { value } = this.state;
        const transformed = this.transformData(data);
        // Get our default placement
        let newPlacement = placement;
        if (!placement) {
            if (isHorizontal) {
                newPlacement = 'right';
            }
            else {
                newPlacement = 'top';
            }
        }
        // Get the path container element
        let target = this.ref.current;
        const { y, x } = getPositionForTarget({
            target: target,
            // Manually pass the x/y from the event
            clientX: event.clientX,
            clientY: event.clientY
        });
        // Need to flip scales/coords if we are a horz layout
        let keyScale;
        let valueScale;
        let coord;
        if (isHorizontal) {
            keyScale = yScale;
            valueScale = xScale;
            coord = y;
        }
        else {
            coord = this.getXCoord(x, y);
            keyScale = xScale;
            valueScale = yScale;
        }
        const newValue = getClosestPoint(coord, keyScale, transformed);
        if (!isEqual(newValue, value) && newValue) {
            const pointX = keyScale(newValue.x);
            let pointY = valueScale(newValue.y);
            let marginX = 0;
            let marginY = 0;
            if (isNaN(pointY)) {
                pointY = height / 2;
                marginX = 10;
                if (!placement) {
                    newPlacement = 'right';
                }
            }
            else {
                marginY = -10;
            }
            // If the points didn't change, don't trigger an update
            if (pointX === this.prevX && pointY === this.prevY) {
                return;
            }
            this.prevY = pointY;
            this.prevX = pointX;
            const target = event.target;
            const { top, left } = target.getBoundingClientRect();
            let offsetX = 0;
            let offsetY = 0;
            if (isRadial) {
                // If its radial, we need to convert the coords to radial format
                const outerRadius = Math.min(width, height) / 2;
                offsetX = pointY * Math.cos(pointX - Math.PI / 2) + outerRadius;
                offsetY = pointY * Math.sin(pointX - Math.PI / 2) + outerRadius;
            }
            else {
                offsetX = pointX;
                offsetY = pointY;
            }
            offsetX += left + marginX;
            offsetY += top + marginY;
            this.setState({
                placement: newPlacement,
                visible: true,
                value: newValue,
                offsetX,
                offsetY
            });
            onValueEnter({
                visible: true,
                value: newValue,
                pointY,
                pointX,
                offsetX,
                offsetY,
                nativeEvent: event
            });
        }
    }
    onMouseLeave() {
        this.prevX = undefined;
        this.prevY = undefined;
        this.setState({
            value: undefined,
            visible: false
        });
        this.props.onValueLeave();
    }
    getTooltipReference() {
        const { offsetX, offsetY } = this.state;
        return {
            width: 4,
            height: 4,
            top: offsetY,
            left: offsetX
        };
    }
    renderRadial() {
        let { height, width, innerRadius, outerRadius } = this.props;
        innerRadius = innerRadius || 0;
        outerRadius = outerRadius || Math.min(width, height) / 2;
        const d = arc()({
            innerRadius,
            outerRadius,
            startAngle: 180,
            endAngle: Math.PI / 2
        });
        return (jsx("path", { d: d, opacity: "0", cursor: "auto", ref: this.ref, onMouseMove: bind(this.onMouseMove, this) }, void 0));
    }
    renderLinear() {
        const { height, width } = this.props;
        return (jsx("rect", { height: height, ref: this.ref, width: width, opacity: 0, cursor: "auto", onMouseMove: bind(this.onMouseMove, this) }, void 0));
    }
    render() {
        const { isRadial, children, tooltip, disabled, color } = this.props;
        const { visible, placement, value } = this.state;
        return (jsxs(Fragment, { children: [disabled && children, !disabled && (jsxs("g", Object.assign({ onMouseLeave: bind(this.onMouseLeave, this) }, { children: [isRadial && this.renderRadial(), !isRadial && this.renderLinear(), jsx(CloneElement, { element: tooltip, visible: visible, placement: placement, modifiers: {
                                offset: {
                                    offset: '0, 15px'
                                }
                            }, reference: this.getTooltipReference(), color: color, value: value }, void 0), children] }), void 0))] }, void 0));
    }
}
TooltipArea.defaultProps = {
    isRadial: false,
    tooltip: jsx(ChartTooltip, {}, void 0),
    inverse: true,
    onValueEnter: () => undefined,
    onValueLeave: () => undefined
};

/**
 * Gets the min/max values handling nested arrays.
 */
function extent(data, attr) {
    const accessor = (val, fn) => {
        if (Array.isArray(val.data)) {
            return fn(val.data, (vv) => vv[attr]);
        }
        return val[attr];
    };
    const minVal = min(data, (d) => accessor(d, min));
    const maxVal = max(data, (d) => accessor(d, max));
    return [minVal, maxVal];
}
/**
 * Get the domain for the Y Axis.
 */
function getYDomain({ data, scaled = false, isDiverging = false }) {
    const [startY, endY] = extent(data, 'y');
    const [startY1, endY1] = extent(data, 'y1');
    // If dealing w/ negative numbers, we should
    // normalize the top and bottom values
    if (startY < 0 || isDiverging) {
        const posStart = -startY;
        const maxNum = Math.max(posStart, endY);
        return [-maxNum, maxNum];
    }
    // Scaled start scale at non-zero
    if (scaled) {
        return [startY1, endY1];
    }
    // Start at 0 based
    return [0, endY1];
}
/**
 * Get the domain for the X Axis.
 */
function getXDomain({ data, scaled = false, isDiverging = false }) {
    const startX0 = extent(data, 'x0')[0];
    const endX1 = extent(data, 'x1')[1];
    // Histograms use dates for start/end
    if (typeof startX0 === 'number' && typeof endX1 === 'number') {
        // If dealing w/ negative numbers, we should
        // normalize the top and bottom values
        if (startX0 < 0 || isDiverging) {
            const posStart = -startX0;
            const maxNum = Math.max(posStart, endX1);
            return [-maxNum, maxNum];
        }
        // If not scaled, return 0/max domains
        if (!scaled) {
            return [0, endX1];
        }
    }
    // Scaled start scale at non-zero
    return [startX0, endX1];
}

/**
 * Helper function for interpolation.
 */
function interpolate(type) {
    if (type === 'smooth') {
        return curveMonotoneX;
    }
    else if (type === 'step') {
        return curveStep;
    }
    else {
        return curveLinear;
    }
}

/**
 * Calculates whether the stroke should be shown.
 */
function calculateShowStroke(current, data) {
    const i = data.indexOf(current);
    let showLine = false;
    const prev = data[i - 1];
    if (i > 0 && prev.y) {
        showLine = true;
    }
    const cur = data[i];
    if (cur.y) {
        showLine = true;
    }
    const next = data[i + 1];
    if (i < data.length - 1 && next.y) {
        showLine = true;
    }
    return showLine;
}

/**
 * Get the angle from a radian.
 */
const getDegrees = (radians) => (radians / Math.PI) * 180 - 90;

const functionProps = (prop, val, data) => {
    if (typeof val === 'function') {
        return val(data);
    }
    else if (prop === 'className') {
        return classNames(val);
    }
    else if (val !== undefined || val !== null) {
        return val;
    }
    return {};
};
const constructFunctionProps = (props, data) => ({
    className: functionProps('className', props.className, data),
    style: functionProps('style', props.style, data)
});

function wrapText({ key, x = 0, y = 0, paddingY, paddingX, width, height, fontFamily, fontSize }) {
    const size = calculateDimensions(key, fontFamily, fontSize);
    const words = key.toString().split(/\s+/);
    if (words.length > 1 && size.width > width) {
        let rows = [];
        let sumWidth = 0;
        let sumHeight = 0;
        let curText = '';
        let lineNum = 0;
        for (const word of words) {
            const wordSize = calculateDimensions(word, fontFamily, fontSize);
            const wordWidth = wordSize.width;
            lineNum++;
            if (sumWidth + wordWidth < width) {
                sumWidth += wordWidth;
                sumHeight += wordSize.height;
                curText = `${curText} ${word}`;
            }
            else {
                rows.push(curText);
                sumWidth += wordSize.width;
                sumHeight += wordSize.height;
                curText = word;
            }
            if (words.length === lineNum) {
                rows.push(curText);
            }
        }
        if (height && (sumHeight + paddingY) >= height) {
            return null;
        }
        if (width && (sumWidth + paddingX) >= width) {
            return null;
        }
        return rows.map((r, i) => (jsx("tspan", Object.assign({ dominantBaseline: "alphabetic", style: { baselineShift: '0%' }, dy: i > 0 ? size.height : -size.height / 2, x: x }, { children: r }), i)));
    }
    if (height && (size.height + paddingY) >= height) {
        return null;
    }
    if (width && (size.width + paddingX) >= width) {
        return null;
    }
    // NOTE: 5px seems to magic number for making it center
    return (jsx("tspan", Object.assign({ dominantBaseline: "alphabetic", style: { baselineShift: '0%' }, dy: size.height / 2 - 5, x: x }, { children: key }), void 0));
}

class ZoomPan extends Component {
    constructor() {
        super(...arguments);
        this.zoomRef = createRef();
        this.panRef = createRef();
        this.state = {
            isZooming: false,
            isPanning: false,
            matrix: identity()
        };
    }
    static getDerivedStateFromProps(props, state) {
        // TODO: the types in the library don't seem to be correct...
        const matrix = transform(fromDefinition([
            { type: 'translate', tx: props.x, ty: props.y },
            { type: 'scale', sx: props.scale, sy: props.scale }
        ]));
        if (!isEqual(matrix, state.matrix)) {
            return {
                matrix
            };
        }
        return null;
    }
    onPanStart(event) {
        this.setState({
            isPanning: true
        });
        this.props.onPanStart(event);
    }
    onPanMove(event) {
        this.props.onZoomPan({
            scale: this.props.scale,
            x: event.x,
            y: event.y,
            type: 'pan',
            nativeEvent: event.nativeEvent
        });
        this.props.onPanMove(event);
    }
    onPanEnd(event) {
        this.setState({ isPanning: false });
        this.props.onPanEnd(event);
    }
    onZoom(event) {
        this.props.onZoomPan({
            x: event.x,
            y: event.y,
            scale: event.scale,
            nativeEvent: event.nativeEvent,
            type: 'zoom'
        });
        this.props.onZoom(event);
    }
    onZoomEnd() {
        this.setState({
            isZooming: false
        });
        this.props.onZoomEnd();
    }
    render() {
        const { height, width, children, disabled, pannable, maxZoom, minZoom, zoomable, scale, x, y, disableMouseWheel, constrain, zoomStep, onPanCancel, requireZoomModifier, globalPanning } = this.props;
        const { isZooming, isPanning } = this.state;
        const cursor = pannable ? 'move' : 'auto';
        const selection = isZooming || isPanning ? 'none' : 'auto';
        const matrix = fromObject(this.state.matrix);
        return (jsx(Pan, Object.assign({ x: x, y: y, scale: scale, matrix: matrix, constrain: constrain, height: height, width: width, disabled: !pannable || disabled, ref: this.panRef, globalPanning: globalPanning, onPanStart: bind(this.onPanStart, this), onPanMove: bind(this.onPanMove, this), onPanEnd: bind(this.onPanEnd, this), onPanCancel: onPanCancel }, { children: jsxs(Zoom, Object.assign({ ref: this.zoomRef, disabled: !zoomable || disabled, scaleFactor: zoomStep, disableMouseWheel: disableMouseWheel, maxZoom: maxZoom, minZoom: minZoom, scale: scale, x: x, y: y, style: { cursor }, requireZoomModifier: requireZoomModifier, matrix: matrix, onZoom: bind(this.onZoom, this), onZoomEnd: bind(this.onZoomEnd, this) }, { children: [!disabled && (jsx("rect", { height: height, width: width, opacity: 0, className: "pan-container" }, void 0)),
                    jsx("g", Object.assign({ style: {
                            pointerEvents: selection,
                            userSelect: selection
                        } }, { children: children }), void 0)] }), void 0) }), void 0));
    }
}
ZoomPan.defaultProps = {
    maxZoom: 10,
    minZoom: 0,
    zoomStep: 0.1,
    pannable: true,
    zoomable: true,
    constrain: true,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    scale: 1,
    globalPanning: true,
    onPanStart: () => undefined,
    onPanMove: () => undefined,
    onPanEnd: () => undefined,
    onPanCancel: () => undefined,
    onZoom: () => undefined,
    onZoomEnd: () => undefined
};

/**
 * Gets the X Scale function.
 */
function getXScale({ type, roundDomains, data, width, domain, padding, scaled, isMultiSeries = false, isDiverging = false }) {
    let scale;
    if (type === 'time' || type === 'duration' || type === 'value') {
        if (type === 'time') {
            scale = scaleTime().rangeRound([0, width]);
        }
        else {
            scale = scaleLinear().rangeRound([0, width]);
        }
        scale = scale.domain(domain || getXDomain({ data, scaled, isDiverging }));
    }
    else {
        if (!domain) {
            if (isMultiSeries) {
                domain = uniqueBy(data, (d) => d.key);
            }
            else {
                domain = uniqueBy(data, (d) => d.x);
            }
        }
        scale = scaleBand()
            .rangeRound([0, width])
            .padding(padding || 0)
            .domain(domain);
    }
    return roundDomains ? scale.nice() : scale;
}
/**
 * Gets the Y Scale function.
 */
function getYScale({ type, height, data, domain, roundDomains = false, scaled = false, padding = 0, isMultiSeries = false, isDiverging = false }) {
    let scale;
    if (type === 'time' || type === 'value' || type === 'duration') {
        scale = scaleLinear()
            .range([height, 0])
            .domain(domain || getYDomain({ data, scaled, isDiverging }));
    }
    else {
        if (!domain) {
            if (isMultiSeries) {
                domain = uniqueBy(data, (d) => d.key);
            }
            else {
                domain = uniqueBy(data, (d) => d.y);
            }
        }
        scale = scaleBand()
            .rangeRound([height, 0])
            .padding(padding)
            .domain(domain);
    }
    return roundDomains ? scale.nice() : scale;
}

/**
 * Get a linear scale for the mariemko chart.
 */
const getMarimekkoScale = (width, roundDomains) => {
    const scale = scaleLinear().rangeRound([0, width]);
    return roundDomains ? scale.nice() : scale;
};
/**
 * Builds a fake scale function to get a group scale for a marimekko value scale.
 */
const getMarimekkoGroupScale = ({ data, width, valueScale, padding }) => {
    const domain = uniqueBy(data, (d) => d.key);
    const barCount = data.length;
    const widthMinusPadding = width - padding * (barCount - 1);
    const xMultiplier = widthMinusPadding / width;
    // Given a data series, find the x0/x1 for it.
    const getXRange = (series) => {
        const [val] = series.data;
        const x0 = valueScale(val.x0);
        const x1 = valueScale(val.x1);
        return { x0, x1 };
    };
    const scale = (arg) => {
        let result = 0;
        const index = data.findIndex((d) => d.key === arg);
        const series = data[index];
        if (series && series.data && series.data.length) {
            const { x1, x0 } = getXRange(series);
            result = (x1 - x0) / 2 + x0;
            if (padding) {
                result = result * xMultiplier + index * padding;
            }
        }
        return result;
    };
    scale.range = () => [0, width];
    scale.domain = () => domain;
    // Special invert function for marimekko
    scale.mariemkoInvert = (offset) => {
        let found;
        for (let i = 0; i < domain.length; i++) {
            const attr = domain[i];
            const series = data[i];
            const { x1, x0 } = getXRange(series);
            if (offset >= x0 - padding / 2 && offset <= x1 - padding / 2) {
                found = attr;
                break;
            }
        }
        return found;
    };
    return scale;
};

/**
 * Get the group scale aka x0.
 */
function getGroupScale({ dimension, padding, data, direction = 'vertical' }) {
    const domain = uniqueBy(data, (d) => d.key);
    const spacing = domain.length / (dimension / padding + 1);
    const range = direction === 'vertical' ? [0, dimension] : [dimension, 0];
    return scaleBand()
        .rangeRound(range)
        .paddingInner(spacing)
        .paddingOuter(spacing / 2)
        .domain(domain);
}
/**
 * Get the inner scale aka x1.
 */
function getInnerScale({ groupScale, padding, data, prop = 'x' }) {
    const dimension = groupScale.bandwidth();
    const domain = uniqueBy(data, (d) => d.data, (d) => d[prop]);
    const spacing = domain.length / (dimension / padding + 1);
    return scaleBand()
        .rangeRound([0, dimension])
        .paddingInner(spacing)
        .domain(domain);
}

/**
 * Get the Y Scale for a given set of radiuses.
 * Reference: https://github.com/d3/d3-scale/issues/90
 */
const getRadialYScale = (innerRadius, outerRadius, domain) => {
    if (domain[0] === 0 && domain[1] === 0) {
        // If all values are 0, set the domain to [0, 1], so the zero values are
        // all at the bottom of the chart, not the middle.
        domain = [0, 1];
    }
    const y = scaleLinear()
        .range([innerRadius * innerRadius, outerRadius * outerRadius])
        .domain(domain);
    const yScale = Object.assign((d) => Math.sqrt(y(d)), y);
    return yScale;
};

class ChartZoomPan extends Component {
    onZoomPan(event) {
        const { width, data, axisType, roundDomains, onZoomPan } = this.props;
        const can = event.type === 'zoom' || (event.type === 'pan' && event.scale > 1);
        if (can) {
            const scale = getXScale({
                width: width,
                type: axisType,
                roundDomains,
                data
            });
            const newScale = scale.copy().domain(scale
                .range()
                .map((x) => (x - event.x) / event.scale)
                .map(scale.clamp(true).invert, event.x));
            onZoomPan({
                domain: newScale.domain(),
                isZoomed: event.scale !== 1
            });
        }
    }
    getOffset() {
        let zoomOffset = {
            scale: undefined,
            x: undefined
        };
        const { disabled, domain, width, data, axisType, roundDomains } = this.props;
        if (!disabled && domain) {
            const xScale = getXScale({
                width,
                type: axisType,
                roundDomains,
                data
            });
            let offset = xScale(domain[0]);
            const endOffset = xScale(domain[1]);
            const scale = width / (endOffset - offset);
            // Apply the new scale to the offset so its scaled correctly
            offset = offset * scale;
            zoomOffset = {
                scale: scale,
                x: -offset
            };
        }
        return zoomOffset;
    }
    render() {
        const _a = this.props, { data, height, children, width, onZoomPan } = _a, rest = __rest(_a, ["data", "height", "children", "width", "onZoomPan"]);
        const { scale, x } = this.getOffset();
        return (jsx(ZoomPan, Object.assign({}, rest, { scale: scale, x: x, height: height, width: width, pannable: scale > 1, onZoomPan: bind(this.onZoomPan, this) }, { children: children }), void 0));
    }
}
ChartZoomPan.defaultProps = {
    onZoomPan: () => undefined
};

const DEFAULT_TRANSITION = {
    type: 'spring',
    velocity: 5,
    damping: 20,
    // https://github.com/framer/motion/issues/1513#issuecomment-1121133717
    restDelta: 0.01,
    restSpeed: 0.01
};

const MotionPath = (_a) => {
    var { custom, transition } = _a, rest = __rest(_a, ["custom", "transition"]);
    const d = useMotionValue(custom.exit.d);
    const prevPath = useMotionValue(custom.exit.d);
    const spring = useSpring(prevPath, Object.assign(Object.assign({}, DEFAULT_TRANSITION), { from: 0, to: 1 }));
    useEffect(() => {
        const interpolator = interpolate$1(prevPath.get(), custom.enter.d);
        const unsub = spring.onChange((v) => d.set(interpolator(v)));
        prevPath.set(custom.enter.d);
        return unsub;
    });
    const _b = custom.enter, { d: enterD } = _b, enterRest = __rest(_b, ["d"]);
    const _c = custom.exit, exitRest = __rest(_c, ["d"]);
    return (jsx(motion.path, Object.assign({}, rest, { initial: exitRest, exit: exitRest, animate: enterRest, transition: transition, d: transition.type !== false ? d : enterD }), void 0));
};

/**
 * Color Schemes
 * Credits: https://gka.github.io/chroma.js/#chroma-brewer
 */
const schemes = Object.assign({ cybertron: chroma.scale(['#2d60e8', '#26efb5']).correctLightness().colors(8) }, chroma.brewer);

/**
 * Given a point, get the key attributes for it.
 */
const rangeHelper = (point, attribute) => point.map((r, i) => {
    if (r) {
        if (r[attribute] !== undefined) {
            return r[attribute];
        }
        else if (r.data && r.data[attribute] !== undefined) {
            return r.data[attribute];
        }
    }
    return i;
});
/**
 * Get a color given a range.
 */
const getColor = (props) => {
    let { point, colorScheme, attribute, index, data, active, isMultiSeries, domain, key, scale } = Object.assign({ attribute: 'key', isMultiSeries: false, scale: scaleOrdinal }, props);
    if (typeof colorScheme === 'string' && schemes[colorScheme]) {
        colorScheme = schemes[colorScheme];
    }
    if (Array.isArray(colorScheme)) {
        if (!domain) {
            if (isMultiSeries && Array.isArray(data)) {
                const maxIdx = maxIndex(data, (d) => d.data.length);
                const maxVal = data[maxIdx];
                data = maxVal.data;
            }
            domain = rangeHelper(data, attribute);
        }
        key = key !== undefined ? key : point[attribute];
        return scale(colorScheme).domain(domain)(key);
    }
    else if (typeof colorScheme === 'function') {
        return colorScheme(point, index, active);
    }
    else {
        return colorScheme;
    }
};

const COUNT_DEFAULTS = {
    from: 0,
    duration: 1,
    delay: 0,
    format: true,
    decimalPlaces: 0
};
const useCount = ({ from, to, duration, delay, decimalPlaces, format }) => {
    const nodeRef = useRef(null);
    from = from || COUNT_DEFAULTS.from;
    duration = duration || COUNT_DEFAULTS.duration;
    delay = delay || COUNT_DEFAULTS.delay;
    format = format || COUNT_DEFAULTS.format;
    decimalPlaces = decimalPlaces || COUNT_DEFAULTS.decimalPlaces;
    useEffect(() => {
        const node = nodeRef.current;
        const controls = animate(from, to, {
            duration,
            delay,
            onUpdate(value) {
                let formatted = value;
                if (decimalPlaces) {
                    formatted = Number(value.toFixed(decimalPlaces));
                }
                else {
                    formatted = Number(value.toFixed(0));
                }
                if (format) {
                    formatted = formatted.toLocaleString();
                }
                node.textContent = formatted;
            }
        });
        return () => controls.stop();
    }, [from, to, duration, delay, decimalPlaces, format]);
    return nodeRef;
};

const Count = (_a) => {
    var { className } = _a, rest = __rest(_a, ["className"]);
    const ref = useCount(rest);
    return jsx("span", { ref: ref, className: className }, void 0);
};
Count.defaultProps = {
    from: 0,
    duration: 1,
    delay: 0,
    localize: true,
    decimalPlaces: 0
};

var css_248z$i = ".ScatterPoint-module_inactive__3ahvT {\n  opacity: 0.2;\n}\n";
var css$i = {"inactive":"ScatterPoint-module_inactive__3ahvT"};
styleInject(css_248z$i);

const ScatterPoint = (_a) => {
    var { symbol, index, id, data, xScale, yScale, active, tooltip, cursor, size, color, animated, onClick, onMouseEnter, onMouseLeave } = _a, rest = __rest(_a, ["symbol", "index", "id", "data", "xScale", "yScale", "active", "tooltip", "cursor", "size", "color", "animated", "onClick", "onMouseEnter", "onMouseLeave"]);
    const rectRef = useRef(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const extras = useMemo(() => constructFunctionProps(rest, data), [rest, data]);
    const r = useMemo(() => (typeof size === 'function' ? size(data) : size), [size, data]);
    const renderedSymbol = useMemo(() => (symbol ? symbol(data) : null), [data, symbol]);
    const transitionProps = useMemo(() => animated
        ? Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay: index * 0.005 }) : {
        type: false,
        delay: 0
    }, [index, animated]);
    const enterProps = useMemo(() => {
        let cy = yScale(data.y1);
        if (yScale.bandwidth) {
            const width = yScale.bandwidth();
            cy = cy + width / 2;
        }
        return {
            x: xScale(data.x),
            y: cy
        };
    }, [data, yScale]);
    const exitProps = useMemo(() => {
        const [yStartDomain] = yScale.domain();
        return {
            y: yScale(yStartDomain),
            x: xScale(data.x)
        };
    }, [data, yScale]);
    const fill = useMemo(() => getColor({
        colorScheme: color,
        index,
        point: data
    }), [data, color, index]);
    return (jsxs(Fragment, { children: [jsx("g", Object.assign({ ref: rectRef, onMouseEnter: () => {
                    setTooltipVisible(true);
                    onMouseEnter(data);
                }, onMouseLeave: () => {
                    setTooltipVisible(false);
                    onMouseLeave(data);
                }, onClick: () => onClick(data), className: classNames({
                    [css$i.inactive]: !active
                }) }, { children: symbol ? (jsx(motion.g, Object.assign({}, extras, { initial: {
                        translateX: exitProps.x,
                        translateY: exitProps.y,
                        opacity: 0
                    }, animate: {
                        translateX: enterProps.x,
                        translateY: enterProps.y,
                        opacity: 1
                    }, exit: {
                        translateX: exitProps.x,
                        translateY: exitProps.y,
                        opacity: 0
                    }, transition: transitionProps }, { children: renderedSymbol }), `symbol-${id}-${data.id}`)) : (jsx(motion.circle, { className: extras.className, style: Object.assign(Object.assign({}, extras.style), { cursor }), initial: {
                        cx: exitProps.x,
                        cy: exitProps.y,
                        fill,
                        r,
                        opacity: 0
                    }, animate: {
                        cx: enterProps.x,
                        cy: enterProps.y,
                        opacity: 1,
                        fill,
                        r
                    }, exit: {
                        cx: exitProps.x,
                        cy: exitProps.y,
                        fill,
                        r,
                        opacity: 0
                    }, transition: transitionProps }, `symbol-${id}-${data.id}`)) }), void 0),
            tooltip && !tooltip.props.disabled && (jsx(CloneElement, { element: tooltip, visible: tooltipVisible, reference: rectRef, value: data }, void 0))] }, void 0));
};
ScatterPoint.defaultProps = {
    active: true,
    toolti: jsx(ChartTooltip, {}, void 0),
    cursor: 'pointer',
    size: 4,
    color: schemes.cybertron[0],
    animated: true,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
};

// For bubble charts, often symbols exceed the area
// and we want to add a little bit of padding to prevent clipping
const PADDING$1 = 25;
const HALF_PADDING$1 = PADDING$1 / 2;
const ScatterSeries = (_a) => {
    var { data, height, width, id, isZoomed, activeIds, point } = _a, rest = __rest(_a, ["data", "height", "width", "id", "isZoomed", "activeIds", "point"]);
    const renderPoint = useCallback((pointData, index) => {
        let pointId;
        if (pointData.id) {
            pointId = pointData.id;
        }
        const key = pointId || index;
        const active = !(activeIds && activeIds.length) || activeIds.includes(pointId);
        const visible = point.props.visible;
        if (visible && !visible(pointData, index)) {
            return jsx(Fragment, {}, key);
        }
        return (jsx(CloneElement, Object.assign({ element: point }, rest, { id: id, data: pointData, index: index, active: active }), key));
    }, [point, id, rest, activeIds]);
    return (jsxs(Fragment, { children: [jsx("defs", { children: jsx("clipPath", Object.assign({ id: `${id}-path` }, { children: jsx("rect", { width: isZoomed ? width : width + PADDING$1, height: height + PADDING$1, x: isZoomed ? 0 : -HALF_PADDING$1, y: -HALF_PADDING$1 }, void 0) }), void 0) }, void 0),
            jsx("g", Object.assign({ clipPath: `url(#${id}-path)` }, { children: data.map(renderPoint) }), void 0)] }, void 0));
};
ScatterSeries.defaultProps = {
    point: jsx(ScatterPoint, {}, void 0)
};

var css_248z$h = ".ScatterPlot-module_scatterPlot__1gWRV {\n  overflow: visible;\n}\n";
var css$h = {"scatterPlot":"ScatterPlot-module_scatterPlot__1gWRV"};
styleInject(css_248z$h);

const ScatterPlot = ({ id, width, height, margins, className, series, xAxis, yAxis, data, gridlines, containerClassName, brush, zoomPan, secondaryAxis }) => {
    const zoomControlled = useMemo(() => { var _a, _b; 
    // eslint-disable-next-line
    return !((_b = (_a = zoomPan === null || zoomPan === void 0 ? void 0 : zoomPan.props) === null || _a === void 0 ? void 0 : _a.domain) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('domain')); }, [zoomPan]);
    const timeout = useRef(null);
    const [preventAnimation, setPreventAnimation] = useState(false);
    const [zoomDomain, setZoomDomain] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const aggregatedData = useMemo(() => buildShallowChartData(data), [data]);
    const getScales = useCallback((chartHeight, chartWidth) => {
        const yScale = getYScale({
            roundDomains: yAxis.props.roundDomains,
            type: yAxis.props.type,
            height: chartHeight,
            data: aggregatedData,
            domain: yAxis.props.domain
        });
        const xScale = getXScale({
            width: chartWidth,
            type: xAxis.props.type,
            roundDomains: xAxis.props.roundDomains,
            data: aggregatedData,
            domain: zoomDomain || xAxis.props.domain
        });
        return {
            yScale,
            xScale
        };
    }, [yAxis, xAxis, aggregatedData, zoomDomain]);
    const onZoomPan = useCallback((event) => {
        if (zoomControlled) {
            setPreventAnimation(true);
            setZoomDomain(event.domain);
            setIsZoomed(event.isZoomed);
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setPreventAnimation(true), 500);
        }
    }, [zoomControlled]);
    const renderChart = useCallback(({ chartHeight, chartWidth, id, updateAxes, chartSized }) => {
        const { yScale, xScale } = getScales(chartHeight, chartWidth);
        const animated = preventAnimation === true ? false : series.props.animated;
        return (jsxs(Fragment, { children: [chartSized && gridlines && (jsx(CloneElement, { element: gridlines, height: chartHeight, width: chartWidth, yScale: yScale, xScale: xScale, yAxis: yAxis.props, xAxis: xAxis.props }, void 0)),
                jsx(CloneElement, { element: xAxis, height: chartHeight, width: chartWidth, scale: xScale, onDimensionsChange: (e) => updateAxes('horizontal', e) }, void 0),
                jsx(CloneElement, { element: yAxis, height: chartHeight, width: chartWidth, scale: yScale, onDimensionsChange: (e) => updateAxes('vertical', e) }, void 0),
                secondaryAxis &&
                    secondaryAxis.map((axis, i) => (jsx(CloneElement, { element: axis, height: chartHeight, width: chartWidth, onDimensionsChange: (e) => updateAxes('horizontal', e) }, i))),
                chartSized && (jsx(CloneElement, Object.assign({ element: brush, height: chartHeight, width: chartWidth, scale: xScale }, { children: jsx(CloneElement, Object.assign({ element: zoomPan, onZoomPan: onZoomPan, height: chartHeight, width: chartWidth, axisType: xAxis.props.type, roundDomains: xAxis.props.roundDomains, data: aggregatedData, domain: zoomDomain }, { children: jsx(CloneElement, { element: series, id: `area-series-${id}`, data: aggregatedData, height: chartHeight, width: chartWidth, yScale: yScale, xScale: xScale, isZoomed: isZoomed, animated: animated }, void 0) }), void 0) }), void 0))] }, void 0));
    }, [
        getScales,
        preventAnimation,
        series,
        gridlines,
        yAxis,
        xAxis,
        secondaryAxis,
        brush,
        zoomPan,
        onZoomPan,
        aggregatedData,
        zoomDomain,
        isZoomed
    ]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, containerClassName: containerClassName, margins: margins, xAxisVisible: isAxisVisible(xAxis.props), yAxisVisible: isAxisVisible(yAxis.props), className: classNames(css$h.scatterPlot, className) }, { children: renderChart }), void 0));
};
ScatterPlot.defaultProps = {
    data: [],
    xAxis: jsx(LinearXAxis, { type: "time" }, void 0),
    yAxis: jsx(LinearYAxis, { type: "value" }, void 0),
    series: jsx(ScatterSeries, {}, void 0),
    gridlines: jsx(GridlineSeries, {}, void 0),
    brush: null,
    zoomPan: null
};

var css_248z$g = ".PointSeries-module_point__3cXpV {\n  stroke: rgba(255, 255, 255, 0.5);\n  stroke-width: 1px;\n}\n";
var css$g = {"point":"PointSeries-module_point__3cXpV"};
styleInject(css_248z$g);

const PointSeries = ({ data, xScale, yScale, animated, point, color, height, width, id, activeValues, show }) => {
    const getIsVisible = useCallback((point, index) => {
        const isActive = activeValues && point && isEqual(activeValues.x, point.x);
        if (show === 'hover') {
            return isActive;
        }
        else if (show === 'first') {
            if (activeValues) {
                return isActive;
            }
            else {
                return index === 0;
            }
        }
        else if (show === 'last') {
            if (activeValues) {
                return isActive;
            }
            else {
                return index === data.length - 1;
            }
        }
        return show;
    }, [activeValues, data.length, show]);
    return (jsx(ScatterSeries, { height: height, width: width, id: id, animated: animated, data: data, xScale: xScale, yScale: yScale, point: jsx(CloneElement, { element: point, color: color, className: css$g.point, size: 4, tooltip: null, visible: getIsVisible }, void 0) }, void 0));
};
PointSeries.defaultProps = {
    show: 'hover',
    point: jsx(ScatterPoint, {}, void 0)
};

const Area = (_a) => {
    var { id, gradient, mask, data, color, index, total, xScale, yScale, animated, interpolation } = _a, rest = __rest(_a, ["id", "gradient", "mask", "data", "color", "index", "total", "xScale", "yScale", "animated", "interpolation"]);
    const stroke = color(data, index);
    const coords = useMemo(() => {
        return data.map((item) => ({
            x: xScale(item.x),
            x1: xScale(item.x) - xScale(item.x1),
            y: yScale(item.y),
            y0: yScale(item.y0),
            y1: yScale(item.y1)
        }));
    }, [data, xScale, yScale]);
    const getAreaPath = useCallback((d) => {
        // If the input data is a single value and this is the only
        // area in a series, fill the available space with an area:
        if (d.length === 1 && total === 1) {
            const [point] = d;
            // Assume the single data point's `x` value
            // is the middle of the graph:
            const midpoint = point.x;
            d = [Object.assign({}, point), Object.assign({}, point)];
            const [start, end] = d;
            start.x = 0;
            end.x = midpoint * 2;
        }
        const fn = area()
            .x((d) => d.x)
            .y0((d) => d.y0)
            .y1((d) => d.y1)
            .curve(interpolate(interpolation));
        return fn(d);
    }, [interpolation, total]);
    const enter = useMemo(() => {
        const areaPath = getAreaPath(coords);
        return {
            d: areaPath === null ? undefined : areaPath
        };
    }, [coords, getAreaPath]);
    const exit = useMemo(() => {
        const maxY = Math.max(...yScale.range());
        const coords = data.map((item) => ({
            x: xScale(item.x),
            x1: 0,
            y: 0,
            y1: maxY,
            y0: maxY
        }));
        const areaPath = getAreaPath(coords);
        return {
            d: areaPath === null ? undefined : areaPath
        };
    }, [data, getAreaPath, xScale, yScale]);
    const fill = useMemo(() => {
        if (mask) {
            return `url(#mask-pattern-${id})`;
        }
        else {
            if (gradient) {
                return `url(#gradient-${id})`;
            }
            return '';
        }
    }, [gradient, id, mask]);
    const transition = useMemo(() => {
        if (animated) {
            return Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay: index * 0.05 });
        }
        else {
            return {
                type: false,
                delay: 0
            };
        }
    }, [animated, index]);
    const renderArea = useCallback(() => {
        const maskPath = mask ? `url(#mask-${id})` : '';
        const extras = constructFunctionProps(rest, data);
        return (jsx(MotionPath, Object.assign({}, extras, { pointerEvents: "none", mask: maskPath, fill: fill, transition: transition, custom: {
                enter,
                exit
            } }), void 0));
    }, [data, enter, exit, fill, id, mask, rest, transition]);
    return (jsxs(Fragment, { children: [renderArea(), mask && (jsxs(Fragment, { children: [jsx(Mask, { id: `mask-${id}`, fill: `url(#gradient-${id})` }, void 0),
                    jsx(CloneElement, { element: mask, id: `mask-pattern-${id}`, fill: stroke }, void 0)] }, void 0)),
            gradient && (jsx(CloneElement, { element: gradient, id: `gradient-${id}`, color: stroke }, void 0))] }, void 0));
};
Area.defaultProps = {
    gradient: jsx(Gradient, {}, void 0),
    interpolation: 'linear'
};

const Line = (_a) => {
    var { width, data, color, index, strokeWidth, hasArea, animated, yScale, xScale, showZeroStroke, interpolation } = _a, rest = __rest(_a, ["width", "data", "color", "index", "strokeWidth", "hasArea", "animated", "yScale", "xScale", "showZeroStroke", "interpolation"]);
    const [pathLength, setPathLength] = useState(null);
    const ghostPathRef = useRef(null);
    useEffect(() => {
        if (ghostPathRef.current) {
            setPathLength(ghostPathRef.current.getTotalLength());
        }
    }, [data, xScale, yScale, width]);
    const getLinePath = useCallback((point) => {
        const fn = line()
            .x((d) => d.x)
            .y((d) => d.y1)
            .defined((d) => showZeroStroke || calculateShowStroke(d, point))
            .curve(interpolate(interpolation));
        return fn(point);
    }, [interpolation, showZeroStroke]);
    const transition = useMemo(() => {
        if (animated) {
            return Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay: hasArea ? 0 : index * 0.05 });
        }
        else {
            return {
                type: false,
                delay: 0
            };
        }
    }, [animated, hasArea, index]);
    const coords = useMemo(() => {
        return data.map((item) => ({
            x: xScale(item.x),
            x1: xScale(item.x) - xScale(item.x1),
            y: yScale(item.y),
            y0: yScale(item.y0),
            y1: yScale(item.y1)
        }));
    }, [data, xScale, yScale]);
    const enter = useMemo(() => {
        const linePath = getLinePath(coords);
        let strokeDasharray = '';
        if (!hasArea && pathLength !== null) {
            strokeDasharray = `${pathLength} ${pathLength}`;
        }
        return {
            d: linePath === null ? undefined : linePath,
            strokeDashoffset: 0,
            strokeDasharray: strokeDasharray
        };
    }, [coords, getLinePath, hasArea, pathLength]);
    const exit = useMemo(() => {
        let newCoords = coords;
        if (hasArea) {
            const maxY = Math.max(...yScale.range());
            newCoords = data.map((item) => ({
                x: xScale(item.x),
                x1: 0,
                y: maxY,
                y1: maxY,
                y0: maxY
            }));
        }
        const linePath = getLinePath(newCoords);
        let strokeDasharray = '';
        let strokeDashoffset = 0;
        if (!hasArea && pathLength !== null) {
            strokeDasharray = `${pathLength} ${pathLength}`;
            strokeDashoffset = pathLength;
        }
        return {
            d: linePath === null ? undefined : linePath,
            strokeDasharray,
            strokeDashoffset
        };
    }, [coords, data, getLinePath, hasArea, pathLength, xScale, yScale]);
    const stroke = color(data, index);
    const extras = constructFunctionProps(rest, data);
    const showLine = hasArea || pathLength !== null;
    // framer-motion freaks out when these are added for area
    if (hasArea) {
        delete enter.strokeDashoffset;
        delete exit.strokeDashoffset;
    }
    return (jsxs(Fragment, { children: [showLine && (jsx(MotionPath, Object.assign({}, extras, { pointerEvents: "none", stroke: stroke, strokeWidth: strokeWidth, fill: "none", transition: transition, custom: {
                    enter,
                    exit
                } }), void 0)),
            !hasArea && (jsx("path", { opacity: "0", d: enter.d, ref: ghostPathRef, pointerEvents: "none" }, void 0))] }, void 0));
};
Line.defaultProps = {
    showZeroStroke: true,
    strokeWidth: 3
};

// For area charts, often symbols exceed the area
// and we want to add a little bit of padding to prevent clipping
const PADDING = 25;
const HALF_PADDING = PADDING / 2;
const AreaSeries = ({ data, height, id, width, isZoomed, tooltip, xScale, yScale, type, markLine, symbols, animated, area, interpolation, line, colorScheme }) => {
    const [activeValues, setActiveValues] = useState(null);
    const [activePoint, setActivePoint] = useState(null);
    const onValueEnter = useCallback((event) => {
        setActivePoint(event.pointX);
        setActiveValues(event.value);
    }, []);
    const onValueLeave = useCallback(() => {
        setActivePoint(undefined);
        setActiveValues(undefined);
    }, []);
    const isMulti = type === 'grouped' || type === 'stacked' || type === 'stackedNormalized';
    const getPointColor = useCallback((point, index) => {
        var _a;
        const key = Array.isArray(point) ? (_a = point === null || point === void 0 ? void 0 : point[0]) === null || _a === void 0 ? void 0 : _a.key : point === null || point === void 0 ? void 0 : point.key;
        return getColor({
            data,
            colorScheme,
            active: activeValues,
            point,
            index,
            key
        });
    }, [activeValues, colorScheme, data]);
    const renderArea = useCallback((data, index = 0, total = 1) => {
        return (jsxs(Fragment, { children: [line && (jsx(CloneElement, { element: line, xScale: xScale, yScale: yScale, data: data, width: width, index: index, hasArea: area !== null, animated: animated, interpolation: interpolation, color: getPointColor }, void 0)),
                area && (jsx(CloneElement, { element: area, id: `${id}-area-${index}`, xScale: xScale, yScale: yScale, data: data, index: index, total: total, animated: animated, interpolation: interpolation, color: getPointColor }, void 0))] }, void 0));
    }, [
        animated,
        area,
        getPointColor,
        id,
        interpolation,
        line,
        width,
        xScale,
        yScale
    ]);
    const renderSymbols = useCallback((data, index = 0) => {
        const visible = symbols !== null;
        const activeSymbols = (symbols && symbols.props.activeValues) || activeValues;
        // Animations are only valid for Area
        const isAnimated = area !== undefined && animated && !activeSymbols;
        return (jsx(Fragment, { children: visible && (jsx(CloneElement, { element: symbols, id: id, height: height, width: width, activeValues: activeSymbols, xScale: xScale, yScale: yScale, index: index, data: data, animated: isAnimated, color: () => getPointColor(data, index) }, `point-series-${id}`)) }, void 0));
    }, [
        activeValues,
        animated,
        area,
        getPointColor,
        height,
        id,
        symbols,
        width,
        xScale,
        yScale
    ]);
    const renderMarkLine = useCallback(() => {
        return (jsx(Fragment, { children: activeValues && markLine && (jsx(CloneElement, { element: markLine, height: height, pointX: activePoint }, void 0)) }, void 0));
    }, [activePoint, activeValues, height, markLine]);
    const renderSingleSeries = useCallback((data) => {
        return (jsxs(Fragment, { children: [renderArea(data), renderMarkLine(), renderSymbols(data)] }, void 0));
    }, [renderArea, renderMarkLine, renderSymbols]);
    const renderMultiSeries = useCallback((data) => {
        return (jsxs(Fragment, { children: [data
                    .map((point, index) => (jsx(Fragment, { children: renderArea(point.data, index, data.length) }, `${point.key.toString()}`)))
                    .reverse(), renderMarkLine(), data
                    .map((point, index) => (jsx(Fragment, { children: renderSymbols(point.data, index) }, `${point.key.toString()}`)))
                    .reverse()] }, void 0));
    }, [renderArea, renderMarkLine, renderSymbols]);
    return (jsxs(Fragment, { children: [jsx("defs", { children: jsx("clipPath", Object.assign({ id: `${id}-path` }, { children: jsx("rect", { width: isZoomed ? width : width + PADDING, height: height + PADDING, x: isZoomed ? 0 : -HALF_PADDING, y: -HALF_PADDING }, void 0) }), void 0) }, void 0),
            jsx(CloneElement, Object.assign({ element: tooltip, xScale: xScale, yScale: yScale, data: data, height: height, width: width, color: getColor, onValueEnter: onValueEnter, onValueLeave: onValueLeave }, { children: jsxs("g", Object.assign({ clipPath: `url(#${id}-path)` }, { children: [isMulti && renderMultiSeries(data),
                        !isMulti &&
                            renderSingleSeries(data)] }), void 0) }), void 0)] }, void 0));
};
AreaSeries.defaultProps = {
    colorScheme: 'cybertron',
    animated: true,
    interpolation: 'linear',
    type: 'standard',
    line: jsx(Line, {}, void 0),
    area: jsx(Area, {}, void 0),
    markLine: jsx(MarkLine, {}, void 0),
    tooltip: jsx(TooltipArea, {}, void 0),
    symbols: jsx(PointSeries, {}, void 0)
};

const StackedNormalizedAreaSeries = (_a) => {
    var { type, symbols } = _a, rest = __rest(_a, ["type", "symbols"]);
    return (jsx(AreaSeries, Object.assign({}, rest, { type: "stackedNormalized", symbols: symbols && (jsx(CloneElement, Object.assign({ element: symbols }, symbols.props, { point: jsx(CloneElement, Object.assign({ element: symbols.props.point }, symbols.props.point.props, { tooltip: null }), void 0) }), void 0)) }), void 0));
};
StackedNormalizedAreaSeries.defaultProps = Object.assign(Object.assign({}, AreaSeries.defaultProps), { type: 'stackedNormalized', tooltip: (jsx(TooltipArea, { tooltip: jsx(ChartTooltip, { content: (series, color) => {
                if (!series) {
                    return null;
                }
                const value = Object.assign(Object.assign({}, series), { data: series.data.map((d) => (Object.assign(Object.assign({}, d), { value: `${formatValue(d.value)} ∙ ${formatValue(Math.floor((d.y1 - d.y0) * 100))}%` }))) });
                return jsx(TooltipTemplate, { color: color, value: value }, void 0);
            } }, void 0) }, void 0)) });

const StackedAreaSeries = (_a) => {
    var { type, symbols } = _a, rest = __rest(_a, ["type", "symbols"]);
    return (jsx(AreaSeries, Object.assign({}, rest, { type: "stacked", symbols: symbols && (jsx(CloneElement, Object.assign({ element: symbols }, symbols.props, { point: jsx(CloneElement, Object.assign({ element: symbols.props.point }, symbols.props.point.props, { tooltip: null }), void 0) }), void 0)) }), void 0));
};
StackedAreaSeries.defaultProps = Object.assign(Object.assign({}, AreaSeries.defaultProps), { type: 'stacked' });

var css_248z$f = ".AreaChart-module_areaChart__1BikF {\n  overflow: visible;\n}\n";
var css$f = {"areaChart":"AreaChart-module_areaChart__1BikF"};
styleInject(css_248z$f);

const AreaChart = ({ xAxis, yAxis, id, data, width, height, margins, className, containerClassName, series, gridlines, brush, zoomPan, secondaryAxis }) => {
    const zoom = zoomPan ? zoomPan.props : {};
    const [zoomDomain, setZoomDomain] = useState(zoom.domain);
    const [preventAnimation, setPreventAnimation] = useState(false);
    const [isZoomed, setIsZoomed] = useState(!!zoom.domain);
    // eslint-disable-next-line
    const [zoomControlled] = useState(!zoom.hasOwnProperty('domain'));
    const timeoutRef = useRef(null);
    const seriesType = series.props.type;
    const isMultiSeries = seriesType === 'stacked' ||
        seriesType === 'stackedNormalized' ||
        seriesType === 'grouped';
    const animated = preventAnimation === true ? false : series.props.animated;
    useEffect(() => {
        if (zoomPan) {
            const zoom = zoomPan.props;
            if (!zoomControlled && zoom.domain !== zoomDomain) {
                setZoomDomain(zoom.domain);
                setIsZoomed(!!zoom.domain);
            }
        }
    }, [zoomControlled, zoomDomain, zoomPan]);
    const aggregatedData = useMemo(() => {
        if (seriesType === 'stacked' || seriesType === 'stackedNormalized') {
            return buildStackData(data, seriesType === 'stackedNormalized');
        }
        else if (seriesType === 'grouped') {
            return buildNestedChartData(data, true);
        }
        else {
            return buildShallowChartData(data);
        }
    }, [data, seriesType]);
    const getScales = useCallback((chartWidth, chartHeight) => {
        const xScale = getXScale({
            width: chartWidth,
            type: xAxis.props.type,
            roundDomains: xAxis.props.roundDomains,
            data: aggregatedData,
            domain: zoomDomain || xAxis.props.domain,
            isMultiSeries
        });
        const yScale = getYScale({
            roundDomains: yAxis.props.roundDomains,
            type: yAxis.props.type,
            height: chartHeight,
            data: aggregatedData,
            domain: yAxis.props.domain,
            isMultiSeries
        });
        return { xScale, yScale };
    }, [
        aggregatedData,
        isMultiSeries,
        xAxis.props.domain,
        xAxis.props.roundDomains,
        xAxis.props.type,
        yAxis.props.domain,
        yAxis.props.roundDomains,
        yAxis.props.type,
        zoomDomain
    ]);
    const onZoomPan = useCallback((event) => {
        if (zoomControlled) {
            setZoomDomain(event.domain);
            setIsZoomed(event.isZoomed);
            setPreventAnimation(true);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setPreventAnimation(false));
        }
    }, [zoomControlled]);
    const renderChart = useCallback(({ chartHeight, chartWidth, id, updateAxes, chartSized }) => {
        const { xScale, yScale } = getScales(chartWidth, chartHeight);
        return (jsxs(Fragment, { children: [chartSized && gridlines && (jsx(CloneElement, { element: gridlines, height: chartHeight, width: chartWidth, yScale: yScale, xScale: xScale, yAxis: yAxis.props, xAxis: xAxis.props }, void 0)),
                jsx(CloneElement, { element: xAxis, height: chartHeight, width: chartWidth, scale: xScale, onDimensionsChange: (event) => updateAxes('horizontal', event) }, void 0),
                jsx(CloneElement, { element: yAxis, height: chartHeight, width: chartWidth, scale: yScale, onDimensionsChange: (event) => updateAxes('vertical', event) }, void 0),
                secondaryAxis &&
                    secondaryAxis.map((axis, i) => (jsx(CloneElement, { element: axis, height: chartHeight, width: chartWidth, onDimensionsChange: (event) => updateAxes('horizontal', event) }, i))),
                chartSized && (jsx(CloneElement, Object.assign({ element: brush, height: chartHeight, width: chartWidth, scale: xScale }, { children: jsx(CloneElement, Object.assign({ element: zoomPan, onZoomPan: onZoomPan, height: chartHeight, width: chartWidth, axisType: xAxis.props.type, roundDomains: xAxis.props.roundDomains, data: aggregatedData, domain: zoomDomain }, { children: jsx(CloneElement, { element: series, id: `area-series-${id}`, data: aggregatedData, height: chartHeight, width: chartWidth, yScale: yScale, xScale: xScale, isZoomed: isZoomed, animated: animated }, void 0) }), void 0) }), void 0))] }, void 0));
    }, [
        aggregatedData,
        animated,
        brush,
        getScales,
        gridlines,
        isZoomed,
        onZoomPan,
        secondaryAxis,
        series,
        xAxis,
        yAxis,
        zoomDomain,
        zoomPan
    ]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, containerClassName: containerClassName, xAxisVisible: isAxisVisible(xAxis.props), yAxisVisible: isAxisVisible(yAxis.props), className: classNames(css$f.areaChart, className, series.type) }, { children: renderChart }), void 0));
};
AreaChart.defaultProps = {
    data: [],
    xAxis: jsx(LinearXAxis, { type: "time" }, void 0),
    yAxis: jsx(LinearYAxis, { type: "value" }, void 0),
    series: jsx(AreaSeries, {}, void 0),
    gridlines: jsx(GridlineSeries, {}, void 0),
    brush: null,
    zoomPan: null
};

const StackedAreaChart = (props) => (jsx(AreaChart, Object.assign({}, props), void 0));
StackedAreaChart.defaultProps = {
    series: jsx(StackedAreaSeries, {}, void 0)
};

const StackedNormalizedAreaChart = (props) => jsx(AreaChart, Object.assign({}, props), void 0);
StackedNormalizedAreaChart.defaultProps = {
    series: jsx(StackedNormalizedAreaSeries, {}, void 0),
    yAxis: (jsx(LinearYAxis, { type: "value", tickSeries: jsx(LinearYAxisTickSeries, { label: jsx(LinearYAxisTickLabel, { rotation: false, format: (data) => `${data * 100}%` }, void 0) }, void 0) }, void 0))
};

const Bar = ({ activeBrightness, id, gradient, data, barIndex, color, yScale, barCount, xScale, groupIndex, minHeight, rangeLines, animated, active, type, tooltip, layout, mask, label, cursor, rx, ry, isCategorical, className, style, width, padding, guide, xScale1, onMouseEnter, onClick, onMouseMove, onMouseLeave }) => {
    const isVertical = useMemo(() => layout === 'vertical', [layout]);
    const rect = useRef(null);
    const [internalActive, setInternalActive] = useState(active);
    const calculateLinearScalePadding = useCallback((scale, offset, size) => {
        // This function calculates the padding on a linear scale used by the marimekko chart.
        const totalSize = scale.range()[1];
        const sizeMinusPadding = totalSize - padding * (barCount - 1);
        const multiplier = sizeMinusPadding / totalSize;
        offset = offset * multiplier + groupIndex * padding;
        size = size * multiplier;
        return { size, offset };
    }, [barCount, groupIndex, padding]);
    const getExit = useCallback(({ x, y, width, height }) => {
        let newX = isVertical ? x : Math.min(...xScale.range());
        let newY = isVertical ? Math.max(...yScale.range()) : y;
        const newHeight = isVertical ? 0 : height;
        const newWidth = isVertical ? width : 0;
        if (type === 'stackedDiverging') {
            if (isVertical) {
                newY = newY / 2;
            }
            else {
                newX = newX / 2;
            }
        }
        return {
            x: newX,
            y: newY,
            height: newHeight,
            width: newWidth
        };
    }, [isVertical, type, xScale, yScale]);
    const getKeyCoords = useCallback((v, v0, v1, scale, sizeOverride, isCategorical, padding) => {
        let offset;
        let size;
        if (isCategorical) {
            if (scale.bandwidth) {
                offset = scale(v);
                size = scale.bandwidth();
                if (sizeOverride) {
                    if (offset) {
                        offset = offset + size / 2 - sizeOverride / 2;
                    }
                    else {
                        // Stacked bar charts don't have offsets...
                        offset = size / 2 - sizeOverride / 2;
                    }
                    size = sizeOverride;
                }
            }
            else {
                if (sizeOverride) {
                    throw new Error('Not a valid option for this scale type');
                }
                offset = scale(v0);
                size = scale(v1 - v0);
                if (padding) {
                    const calc = calculateLinearScalePadding(scale, offset, size);
                    offset = calc.offset;
                    size = calc.size;
                }
            }
        }
        else {
            if (sizeOverride) {
                throw new Error('Not a valid option for this scale type');
            }
            const c0 = scale(v0);
            const c1 = scale(v1);
            const delta = c1 - c0;
            offset = c0;
            size = Math.max(delta - 1, 0);
        }
        return {
            offset: isNaN(offset) ? 0 : offset,
            size: isNaN(size) ? 0 : size
        };
    }, [calculateLinearScalePadding]);
    const getValueCoords = useCallback((v0, v1, scale) => {
        const c0 = scale(v0);
        const c1 = scale(v1);
        const size = Math.abs(c0 - c1);
        const minSize = Math.max(minHeight || 0, size);
        const offset = Math.min(c0, c1);
        return {
            offset: isNaN(offset) ? 0 : offset,
            size: isNaN(minSize) ? 0 : minSize
        };
    }, [minHeight]);
    const getCoords = useCallback((data) => {
        let newYScale = yScale;
        let newXScale = xScale;
        if (xScale1) {
            if (isVertical) {
                newXScale = xScale1;
            }
            else {
                newYScale = xScale1;
            }
        }
        if (isVertical) {
            const xCoords = getKeyCoords(data.x, data.x0, data.x1, newXScale, width, isCategorical, padding);
            const yCoords = getValueCoords(data.y0, data.y1, newYScale);
            return {
                x: xCoords.offset,
                width: xCoords.size,
                y: yCoords.offset,
                height: yCoords.size
            };
        }
        else {
            const yCoords = getKeyCoords(data.y, data.y0, data.y1, newYScale, width, isCategorical, padding);
            const xCoords = getValueCoords(data.x0, data.x1, newXScale);
            return {
                x: xCoords.offset,
                width: xCoords.size,
                y: yCoords.offset,
                height: yCoords.size
            };
        }
    }, [
        getKeyCoords,
        getValueCoords,
        isCategorical,
        isVertical,
        padding,
        width,
        xScale,
        xScale1,
        yScale
    ]);
    const onMouseEnterInternal = useCallback((event) => {
        // Only tooltip bars rely on this...
        if (tooltip) {
            setInternalActive(true);
        }
        onMouseEnter({
            value: data,
            nativeEvent: event
        });
    }, [data, onMouseEnter, tooltip]);
    const onMouseLeaveInternal = useCallback((event) => {
        // Only tooltip bars rely on this...
        if (tooltip) {
            setInternalActive(false);
        }
        onMouseLeave({
            value: data,
            nativeEvent: event
        });
    }, [data, onMouseLeave, tooltip]);
    const onMouseClick = useCallback((event) => {
        onClick({
            value: data,
            nativeEvent: event
        });
    }, [data, onClick]);
    const getFill = useCallback((color) => {
        if (mask) {
            return `url(#mask-pattern-${id})`;
        }
        else {
            if (gradient) {
                return `url(#gradient-${id})`;
            }
            return color;
        }
    }, [gradient, id, mask]);
    const tooltipData = useMemo(() => {
        const xAttr = isCategorical ? 'x' : 'x0';
        let x = data[xAttr];
        // Stacked diverging negative numbers
        // in horizontal layouts need to pull x0
        if (data.x0 < 0) {
            x = data.x0;
        }
        const matches = isVertical
            ? data.key && data.key !== x
            : data.key && data.key !== data.y;
        if (matches) {
            x = `${data.key} ∙ ${x}`;
        }
        return {
            y: data.y,
            x
        };
    }, [data, isCategorical, isVertical]);
    const getTransition = useCallback((index) => {
        if (animated) {
            let delay = 0;
            if (layout === 'vertical') {
                delay = (index / barCount) * 0.5;
            }
            else {
                delay = ((barCount - index) / barCount) * 0.5;
            }
            return Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay: delay });
        }
        else {
            return {
                type: false,
                delay: 0
            };
        }
    }, [animated, barCount, layout]);
    const renderBar = useCallback((currentColorShade, coords, index) => {
        const maskPath = mask ? `url(#mask-${id})` : '';
        const fill = getFill(currentColorShade);
        const initialExit = getExit(coords);
        const extras = constructFunctionProps({ className, style }, data);
        const transition = getTransition(index);
        // UGH: https://github.com/framer/motion/issues/384
        const initial = Object.assign(Object.assign({}, initialExit), { attrX: initialExit.x, attrY: initialExit.y, fill });
        delete initial.x;
        delete initial.y;
        const animate = Object.assign(Object.assign({}, coords), { attrX: coords.x, attrY: coords.y, fill });
        delete animate.x;
        delete animate.y;
        return (jsx("g", Object.assign({ ref: rect }, { children: jsx(motion.rect, { className: classNames(extras.className), style: Object.assign(Object.assign({}, extras.style), { cursor }), mask: maskPath, rx: rx, ry: ry, initial: initial, animate: animate, exit: initial, transition: transition, onMouseEnter: onMouseEnterInternal, onMouseLeave: onMouseLeaveInternal, onClick: onMouseClick, onMouseMove: onMouseMove }, void 0) }), void 0));
    }, [
        className,
        cursor,
        data,
        getExit,
        getFill,
        getTransition,
        id,
        mask,
        onMouseClick,
        onMouseEnterInternal,
        onMouseLeaveInternal,
        onMouseMove,
        rx,
        ry,
        style
    ]);
    const renderGuideBar = useCallback(() => {
        if (!guide) {
            return null;
        }
        // If we are stacked, only render the first bar
        if (type === 'stacked' && barIndex !== 0) {
            return null;
        }
        // No reason to show them since they are always 100% tall
        if (type === 'stackedNormalized' || type === 'marimekko') {
            console.error('Guide bars are not supported for these chart types');
            return null;
        }
        const valueScale = isVertical ? yScale : xScale;
        const [start, end] = valueScale.domain();
        const attr = isVertical ? 'y' : 'x';
        // For stacked diverging we need to flip the points for positive / negative bars
        const attrStart = type === 'stackedDiverging' ? '0' : '1';
        const endPoint = type === 'stackedDiverging' ? start : end;
        const startPoint = type === 'stackedDiverging' && data[attr] > 0 ? end : endPoint;
        const coords = getCoords(Object.assign(Object.assign({}, data), { [attr]: endPoint, [`${attr}${attrStart}`]: startPoint }));
        return (jsx(CloneElement, Object.assign({ element: guide }, coords, { active: active }), void 0));
    }, [
        active,
        barIndex,
        data,
        getCoords,
        guide,
        isVertical,
        type,
        xScale,
        yScale
    ]);
    const isActive = tooltip ? internalActive : active;
    const stroke = color(data, barIndex);
    const coords = getCoords(data);
    const currentColorShade = active
        ? chroma(stroke).brighten(activeBrightness).hex()
        : stroke;
    const rangeLineColor = (rangeLines && rangeLines.props.color) || stroke;
    const rangeLineColorShade = active
        ? chroma(rangeLineColor).brighten(activeBrightness)
        : rangeLineColor;
    const index = groupIndex !== undefined ? groupIndex : barIndex;
    const scale = isVertical ? yScale : xScale;
    const barLabel = isVertical ? tooltipData.y : tooltipData.x;
    const placement = layout === 'vertical' ? 'top' : 'right';
    return (jsxs(Fragment, { children: [renderGuideBar(), renderBar(currentColorShade, coords, index), rangeLines && (jsx(CloneElement, Object.assign({ element: rangeLines }, coords, { index: index, data: data, scale: scale, color: rangeLineColorShade, barCount: barCount, animated: animated, layout: layout, type: type }), void 0)),
            mask && (jsxs(Fragment, { children: [jsx(Mask, { id: `mask-${id}`, fill: `url(#gradient-${id})` }, void 0),
                    jsx(CloneElement, { element: mask, id: `mask-pattern-${id}`, fill: stroke }, void 0)] }, void 0)),
            gradient && (jsx(CloneElement, { element: gradient, id: `gradient-${id}`, direction: layout, color: currentColorShade }, void 0)),
            label && (jsx(CloneElement, Object.assign({ element: label }, coords, { text: formatValue(barLabel), index: index, data: data, scale: scale, fill: label.props.fill || currentColorShade, barCount: barCount, animated: animated, layout: layout, type: type }), void 0)),
            tooltip && (jsx(CloneElement, { element: tooltip, visible: !!isActive, reference: rect, color: color, value: tooltipData, placement: tooltip.props.placement || placement, data: data }, void 0))] }, void 0));
};
Bar.defaultProps = {
    activeBrightness: 0.5,
    rx: 0,
    ry: 0,
    cursor: 'auto',
    rangeLines: null,
    label: null,
    tooltip: null,
    layout: 'vertical',
    guide: null,
    gradient: jsx(Gradient, {}, void 0),
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined,
    onMouseMove: () => undefined
};

const BarSeries = ({ data, tooltip, xScale, yScale, height, width, colorScheme, xScale1, bar, padding, animated, isCategorical, layout, type, id }) => {
    const ref = useRef(null);
    const [activeValues, setActiveValues] = useState(null);
    const isVertical = useMemo(() => layout === 'vertical', [layout]);
    const isMultiSeries = useMemo(() => {
        return (type === 'grouped' ||
            type === 'stacked' ||
            type === 'marimekko' ||
            type === 'stackedNormalized' ||
            type === 'stackedDiverging');
    }, [type]);
    const getTransform = useCallback((data) => {
        let xPos = 0;
        let yPos = 0;
        if (type !== 'marimekko') {
            if (layout === 'vertical') {
                const val = xScale(data.key);
                xPos = val;
            }
            else {
                const val = yScale(data.key);
                yPos = val;
            }
        }
        return `translate(${xPos}, ${yPos})`;
    }, [layout, type, xScale, yScale]);
    const getBarColor = useCallback((point, index) => {
        let key = 'key';
        if (isMultiSeries) {
            if (layout === 'vertical') {
                key = 'x';
            }
            else {
                key = 'y';
            }
        }
        // histograms...
        if (point[key] === undefined) {
            key = 'x0';
        }
        return getColor({
            colorScheme,
            point,
            index,
            data,
            isMultiSeries,
            attribute: key
        });
    }, [colorScheme, data, isMultiSeries, layout]);
    const onMouseMove = useCallback((event) => {
        var _a;
        // Manuallly call mouse move so we don't have to kill bar pointer events
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.onMouseMove(event);
    }, []);
    const onValueEnter = useCallback((event) => {
        setActiveValues(event.value);
    }, []);
    const onValueLeave = useCallback(() => {
        setActiveValues(null);
    }, []);
    const renderBar = useCallback((data, barIndex, barCount, groupIndex) => {
        const active = activeValues && activeValues.x === data.key;
        let newYScale = yScale;
        let newXScale = xScale;
        if (xScale1) {
            if (isVertical) {
                newXScale = xScale1;
            }
            else {
                newYScale = xScale1;
            }
        }
        // Histograms dont have keys
        let key = barIndex.toString();
        if (data.key) {
            key = `${data.key.toString()}-${groupIndex}-${data.x}`;
        }
        let barElements = Array.isArray(bar) ? bar[barIndex] : bar;
        if (!bar) {
            barElements = jsx(Bar, {}, void 0);
        }
        return (jsx(Fragment, { children: jsx(CloneElement, { element: barElements, id: `${id}-bar-${groupIndex}-${barIndex}`, animated: animated, active: active, xScale: newXScale, xScale1: xScale1, yScale: newYScale, padding: padding, barCount: barCount, groupIndex: groupIndex, barIndex: barIndex, data: data, isCategorical: isCategorical, color: getBarColor, layout: layout, type: type, onMouseMove: onMouseMove }, void 0) }, key));
    }, [
        activeValues,
        animated,
        bar,
        getBarColor,
        id,
        isCategorical,
        isVertical,
        layout,
        onMouseMove,
        padding,
        type,
        xScale,
        xScale1,
        yScale
    ]);
    const renderBarGroup = useCallback((data, barCount, groupIndex) => {
        return (jsx(Fragment, { children: data.map((barData, barIndex) => renderBar(barData, barIndex, barCount, groupIndex)) }, void 0));
    }, [renderBar]);
    return (jsxs(CloneElement, Object.assign({ element: tooltip, childRef: ref, xScale: xScale, yScale: yScale, data: data, height: height, width: width, inverse: false, isHorizontal: layout === 'horizontal', color: getBarColor, onValueEnter: onValueEnter, onValueLeave: onValueLeave }, { children: [isMultiSeries &&
                data.map((groupData, index) => (jsx("g", Object.assign({ transform: getTransform(groupData) }, { children: renderBarGroup(groupData.data, data.length, index) }), `bar-group-${index}`))),
            !isMultiSeries &&
                renderBarGroup(data, data.length)] }), void 0));
};
BarSeries.defaultProps = {
    type: 'standard',
    padding: 0.1,
    groupPadding: 16,
    animated: true,
    tooltip: (jsx(TooltipArea, { tooltip: jsx(ChartTooltip, { followCursor: true, modifiers: {
                offset: '5px, 5px'
            } }, void 0) }, void 0)),
    colorScheme: 'cybertron',
    bar: jsx(Bar, {}, void 0),
    layout: 'vertical'
};

const RangeLines = ({ layout, color, x, y, scale, type, height, position, strokeWidth, width, animated, index, barCount, data }) => {
    const isVertical = useMemo(() => layout === 'vertical', [layout]);
    const rangeLineHeight = useMemo(() => Math.min(strokeWidth, isVertical ? height : width), [height, isVertical, strokeWidth, width]);
    const [newWidth, newHeight] = useMemo(() => [
        isVertical ? width : rangeLineHeight,
        isVertical ? rangeLineHeight : height
    ], [height, isVertical, rangeLineHeight, width]);
    const enterProps = useMemo(() => {
        let newY = y;
        let newX = x;
        // If its diverging and the value is negative, we
        // need to reverse the type...
        const isTop = position === 'top';
        const direction = isVertical
            ? data.y < 0 && isTop
                ? 'bottom'
                : position
            : data.x0 < 0 && isTop
                ? 'bottom'
                : position;
        if (isVertical) {
            if (direction === 'top') {
                newY = y;
            }
            else {
                newY = y + height - rangeLineHeight;
            }
        }
        else {
            if (direction === 'top') {
                newX = x + width - rangeLineHeight;
            }
            else {
                newX = x;
            }
        }
        return {
            x: newX,
            y: newY,
            opacity: 1
        };
    }, [
        data.x0,
        data.y,
        height,
        isVertical,
        position,
        rangeLineHeight,
        width,
        x,
        y
    ]);
    const exitProps = useMemo(() => {
        let newY = y;
        let newX = x;
        if (isVertical) {
            const maxY = Math.max(...scale.range());
            if (position === 'top') {
                newY = maxY;
            }
            else {
                newY = maxY + height - rangeLineHeight;
            }
        }
        else {
            const minX = Math.min(...scale.range());
            if (position === 'top') {
                newX = minX;
            }
            else {
                newX = minX + width - rangeLineHeight;
            }
        }
        if (type === 'stackedDiverging') {
            if (isVertical) {
                newY = newY / 2;
            }
            else {
                newX = newX / 2;
            }
        }
        return {
            y: newY,
            x: newX,
            opacity: 0
        };
    }, [height, isVertical, position, rangeLineHeight, scale, type, width, x, y]);
    const delay = useMemo(() => {
        let delay = 0;
        if (animated) {
            if (layout === 'vertical') {
                return (index / barCount) * 0.5;
            }
            else {
                return ((barCount - index) / barCount) * 0.5;
            }
        }
        return delay;
    }, [animated, barCount, index, layout]);
    // UGH: https://github.com/framer/motion/issues/384
    const initial = useMemo(() => {
        const r = Object.assign(Object.assign({}, exitProps), { attrX: exitProps.x, attrY: exitProps.y });
        delete r.x;
        delete r.y;
        return r;
    }, [exitProps]);
    const animate = useMemo(() => {
        const r = Object.assign(Object.assign({}, enterProps), { attrX: enterProps.x, attrY: enterProps.y });
        delete r.x;
        delete r.y;
        return r;
    }, [enterProps]);
    return (jsx(motion.rect, { pointerEvents: "none", fill: color, width: newWidth, height: newHeight, initial: initial, animate: animate, exit: initial, transition: Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay }) }, void 0));
};
RangeLines.defaultProps = {
    position: 'top',
    strokeWidth: 1,
    layout: 'vertical'
};

const StackedBarSeries = (props) => (jsx(BarSeries, Object.assign({ type: "stackedNormalized" }, props), void 0));
StackedBarSeries.defaultProps = Object.assign(Object.assign({}, BarSeries.defaultProps), { type: 'stacked', bar: (jsx(Bar, { gradient: jsx(Gradient, { stops: [
                jsx(GradientStop, { offset: "5%", stopOpacity: 0.1 }, "start"),
                jsx(GradientStop, { offset: "90%", stopOpacity: 0.7 }, "stop")
            ] }, void 0), rangeLines: jsx(RangeLines, { position: "top", strokeWidth: 3 }, void 0) }, void 0)) });

const StackedNormalizedBarSeries = (props) => jsx(BarSeries, Object.assign({ type: "stackedNormalized" }, props), void 0);
StackedNormalizedBarSeries.defaultProps = Object.assign(Object.assign({}, BarSeries.defaultProps), { type: 'stackedNormalized', tooltip: (jsx(TooltipArea, { tooltip: jsx(ChartTooltip, { followCursor: true, modifiers: {
                offset: '5px, 5px'
            }, content: (point, color) => {
                point.data = point.data.map((d) => {
                    // Handle horz case
                    const start = isNaN(d.y0) ? d.x0 : d.y0;
                    const end = isNaN(d.y1) ? d.x1 : d.y1;
                    return Object.assign(Object.assign({}, d), { value: `${formatValue(Math.floor((end - start) * 100))}%` });
                });
                return jsx(TooltipTemplate, { value: point, color: color }, void 0);
            } }, void 0) }, void 0)), bar: (jsx(Bar, { gradient: jsx(Gradient, { stops: [
                jsx(GradientStop, { offset: "5%", stopOpacity: 0.1 }, "start"),
                jsx(GradientStop, { offset: "90%", stopOpacity: 0.7 }, "stop")
            ] }, void 0), rangeLines: jsx(RangeLines, { position: "top", strokeWidth: 3 }, void 0) }, void 0)) });

const MarimekkoBarSeries = (props) => (jsx(BarSeries, Object.assign({ type: "marimekko" }, props), void 0));
MarimekkoBarSeries.defaultProps = Object.assign(Object.assign({}, BarSeries.defaultProps), { type: 'marimekko', padding: 10, tooltip: (jsx(TooltipArea, { tooltip: jsx(ChartTooltip, { followCursor: true, modifiers: {
                offset: '5px, 5px'
            }, content: (point, color) => {
                const data = Object.assign(Object.assign({}, point), { data: point.data.map((d) => (Object.assign(Object.assign({}, d), { value: `${formatValue(d.value)} ∙ ${formatValue(Math.floor((d.y1 - d.y0) * 100))}%` }))) });
                return jsx(TooltipTemplate, { value: data, color: color }, void 0);
            } }, void 0) }, void 0)), bar: (jsx(Bar, { padding: 10, gradient: jsx(Gradient, { stops: [
                jsx(GradientStop, { offset: "5%", stopOpacity: 0.1 }, "start"),
                jsx(GradientStop, { offset: "90%", stopOpacity: 0.7 }, "stop")
            ] }, void 0), rangeLines: jsx(RangeLines, { position: "top", strokeWidth: 3 }, void 0) }, void 0)) });

const BarLabel = ({ fontSize, fontFamily, fill, layout, className, text, x, y, height, position, width, data, padding, scale, type, animated, index, barCount }) => {
    const isVertical = useMemo(() => layout === 'vertical', [layout]);
    const textAnchor = isVertical ? 'middle' : 'start';
    const enterProps = useMemo(() => {
        let newY = y;
        let newX = x;
        // If its diverging and the value is negative, we
        // need to reverse the type...
        const isTop = position === 'top';
        const direction = isVertical
            ? data.y < 0 && isTop
                ? 'bottom'
                : position
            : data.x0 < 0 && isTop
                ? 'bottom'
                : position;
        if (isVertical) {
            if (direction === 'top') {
                newY = y - padding;
            }
            else if (direction === 'center') {
                newY = y + height / 2;
            }
            else if (direction === 'bottom') {
                newY = y + height - padding;
            }
            newX = newX + width / 2;
        }
        else {
            if (direction === 'top') {
                newX = x + width + padding;
            }
            else if (direction === 'center') {
                newX = x + width / 2;
            }
            else if (direction === 'bottom') {
                newX = x + padding;
            }
            newY = newY + height / 2;
        }
        return {
            translateX: newX,
            translateY: newY,
            opacity: 1
        };
    }, [data.x0, data.y, height, isVertical, padding, position, width, x, y]);
    const exitProps = useMemo(() => {
        let newY = y;
        let newX = x;
        if (isVertical) {
            const maxY = Math.max(...scale.range());
            if (position === 'top') {
                newY = maxY;
            }
            else {
                newY = maxY + height + padding;
            }
            newX = newX + width / 2;
        }
        else {
            const minX = Math.min(...scale.range());
            if (position === 'top') {
                newX = minX;
            }
            else {
                newX = minX + width + padding;
            }
            newY = newY + height / 2;
        }
        if (type === 'stackedDiverging') {
            if (isVertical) {
                newY = newY / 2;
            }
            else {
                newX = newX / 2;
            }
        }
        return {
            translateY: newY,
            translateX: newX,
            opacity: 0
        };
    }, [height, isVertical, padding, position, scale, type, width, x, y]);
    const delay = useMemo(() => {
        let delay = 0;
        if (animated) {
            if (layout === 'vertical') {
                return (index / barCount) * 0.5;
            }
            else {
                return ((barCount - index) / barCount) * 0.5;
            }
        }
        return delay;
    }, [animated, barCount, index, layout]);
    return (jsx(motion.g, Object.assign({ initial: exitProps, animate: enterProps, exit: exitProps, transition: Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay }), fontSize: fontSize, fontFamily: fontFamily }, { children: jsx("text", Object.assign({ fill: fill, className: className, textAnchor: textAnchor }, { children: text }), void 0) }), void 0));
};
BarLabel.defaultProps = {
    position: 'top',
    layout: 'vertical',
    fontSize: 13,
    padding: 5,
    fontFamily: 'sans-serif',
    fill: '#000'
};

const HistogramBarSeries = (_a) => {
    var rest = __rest(_a, ["type"]);
    return jsx(BarSeries, Object.assign({}, rest), void 0);
};
HistogramBarSeries.defaultProps = Object.assign(Object.assign({}, BarSeries.defaultProps), { colorScheme: schemes.cybertron[0], tooltip: (jsx(TooltipArea, { tooltip: jsx(ChartTooltip, { followCursor: true, modifiers: {
                offset: '5px, 5px'
            }, content: (point, color) => {
                const data = Object.assign(Object.assign({}, point), { x: `${formatValue(point.x0)} - ${formatValue(point.x1)}`, value: point.y });
                return jsx(TooltipTemplate, { value: data, color: color }, void 0);
            } }, void 0) }, void 0)) });

const GuideBar = (_a) => {
    var { active, opacity = 0.15 } = _a, rest = __rest(_a, ["active", "opacity"]);
    const { x, y } = rest, other = __rest(rest, ["x", "y"]);
    return (jsx(motion.rect, Object.assign({}, other, { pointerEvents: "none", initial: "hidden", animate: active ? 'visible' : 'hidden', variants: {
            hidden: { opacity: 0, attrX: x, attrY: y },
            visible: { opacity, attrX: x, attrY: y }
        } }), void 0));
};
GuideBar.defaultProps = {
    fill: '#eee',
    opacity: 0.15
};

var css_248z$e = ".BarChart-module_barChart__36biH {\n  overflow: visible;\n}\n\n  .BarChart-module_barChart__36biH.BarChart-module_stackedNormalized__3l5Vx .bar, .BarChart-module_barChart__36biH.BarChart-module_stacked__12DMR .bar, .BarChart-module_barChart__36biH.BarChart-module_marimekko__33Uhg .bar {\n      stroke: var(--color-background);\n      stroke-width: 0.2;\n    }\n";
var css$e = {"barChart":"BarChart-module_barChart__36biH","stackedNormalized":"BarChart-module_stackedNormalized__3l5Vx","stacked":"BarChart-module_stacked__12DMR","marimekko":"BarChart-module_marimekko__33Uhg"};
styleInject(css_248z$e);

const BarChart = ({ id, width, height, margins, className, data, xAxis, yAxis, series, brush, gridlines, secondaryAxis, containerClassName }) => {
    const isVertical = useMemo(() => series.props.layout === 'vertical', [series]);
    const keyAxis = useMemo(() => (isVertical ? xAxis : yAxis), [yAxis, xAxis, isVertical]);
    const isDiverging = useMemo(() => series.props.type === 'stackedDiverging', [series.props.type]);
    const getMarimekkoGroupScales = useCallback((aggregatedData, axis, width) => {
        const keyScale = getMarimekkoScale(width, axis.props.roundDomains);
        const groupScale = getMarimekkoGroupScale({
            width,
            padding: series.props.padding,
            data: aggregatedData,
            valueScale: keyScale
        });
        return {
            keyScale,
            groupScale
        };
    }, [series.props.padding]);
    const getMultiGroupScales = useCallback((aggregatedData, height, width) => {
        const { groupPadding, layout } = series.props;
        const groupScale = getGroupScale({
            dimension: isVertical ? width : height,
            direction: layout,
            padding: groupPadding,
            data: aggregatedData
        });
        const keyScale = getInnerScale({
            groupScale: groupScale,
            padding: series.props.padding,
            data: aggregatedData,
            prop: isVertical ? 'x' : 'y'
        });
        return {
            groupScale,
            keyScale
        };
    }, [isVertical, series.props]);
    const getKeyScale = useCallback((aggregatedData, axis, isMultiSeries, width) => {
        return getXScale({
            width,
            type: axis.props.type,
            roundDomains: axis.props.roundDomains,
            data: aggregatedData,
            padding: series.props.padding,
            domain: axis.props.domain,
            isMultiSeries,
            isDiverging
        });
    }, [isDiverging, series]);
    const getValueScale = useCallback((aggregatedData, axis, isMultiSeries, height) => {
        return getYScale({
            roundDomains: axis.props.roundDomains,
            padding: series.props.padding,
            type: axis.props.type,
            height,
            data: aggregatedData,
            domain: axis.props.domain,
            isMultiSeries,
            isDiverging
        });
    }, [isDiverging, series]);
    const getScalesAndData = useCallback((chartHeight, chartWidth) => {
        const { type, layout } = series.props;
        const isMarimekko = type === 'marimekko';
        const isGrouped = type === 'grouped';
        const isStacked = type === 'stacked' ||
            type === 'stackedNormalized' ||
            type === 'stackedDiverging';
        const isMultiSeries = isGrouped || isStacked;
        let aggregatedData;
        if (isStacked) {
            let distroType = 'default';
            if (type === 'stackedNormalized') {
                distroType = 'expand';
            }
            else if (type === 'stackedDiverging') {
                distroType = 'diverging';
            }
            aggregatedData = buildBarStackData(data, distroType, layout);
        }
        else if (type === 'waterfall') {
            aggregatedData = buildWaterfall(data, layout, series.props.binSize);
        }
        else if (isMarimekko) {
            aggregatedData = buildMarimekkoData(data);
        }
        else if (isGrouped) {
            aggregatedData = buildNestedChartData(data, false, layout);
        }
        else {
            aggregatedData = buildShallowChartData(data, layout, series.props.binSize);
        }
        let yScale;
        let xScale;
        let xScale1;
        if (isVertical) {
            if (isGrouped) {
                const { keyScale, groupScale } = getMultiGroupScales(aggregatedData, chartHeight, chartWidth);
                xScale = groupScale;
                xScale1 = keyScale;
            }
            else if (isMarimekko) {
                const { keyScale, groupScale } = getMarimekkoGroupScales(aggregatedData, xAxis, chartWidth);
                xScale = groupScale;
                xScale1 = keyScale;
            }
            else {
                xScale = getKeyScale(aggregatedData, xAxis, isMultiSeries, chartWidth);
            }
            yScale = getValueScale(aggregatedData, yAxis, isMultiSeries, chartHeight);
        }
        else {
            if (isGrouped) {
                const { keyScale, groupScale } = getMultiGroupScales(aggregatedData, chartHeight, chartWidth);
                yScale = groupScale;
                xScale1 = keyScale;
                xScale = getKeyScale(aggregatedData, xAxis, isMultiSeries, chartWidth);
            }
            else if (isMarimekko) {
                throw new Error('Marimekko is currently not supported for horizontal layouts');
            }
            else {
                xScale = getKeyScale(aggregatedData, xAxis, isMultiSeries, chartWidth);
                yScale = getValueScale(aggregatedData, yAxis, isMultiSeries, chartHeight);
            }
        }
        return { xScale, xScale1, yScale, aggregatedData };
    }, [
        getKeyScale,
        data,
        getMarimekkoGroupScales,
        getMultiGroupScales,
        getValueScale,
        isVertical,
        series.props,
        xAxis,
        yAxis
    ]);
    const renderChart = useCallback((containerProps) => {
        const { chartHeight, chartWidth, id, updateAxes, chartSized } = containerProps;
        const { xScale, xScale1, yScale, aggregatedData } = getScalesAndData(chartHeight, chartWidth);
        const isCategorical = keyAxis.props.type === 'category';
        return (jsxs(Fragment, { children: [chartSized && gridlines && (jsx(CloneElement, { element: gridlines, height: chartHeight, width: chartWidth, yScale: yScale, xScale: xScale, yAxis: yAxis.props, xAxis: xAxis.props }, void 0)),
                jsx(CloneElement, { element: xAxis, height: chartHeight, width: chartWidth, scale: xScale, onDimensionsChange: (event) => updateAxes(isVertical ? 'horizontal' : 'vertical', event) }, void 0),
                jsx(CloneElement, { element: yAxis, height: chartHeight, width: chartWidth, scale: yScale, onDimensionsChange: (event) => updateAxes(isVertical ? 'vertical' : 'horizontal', event) }, void 0),
                secondaryAxis &&
                    secondaryAxis.map((axis, i) => (jsx(CloneElement, { element: axis, height: chartHeight, width: chartWidth, onDimensionsChange: (event) => updateAxes('horizontal', event) }, i))),
                chartSized && (jsx(CloneElement, Object.assign({ element: brush, height: chartHeight, width: chartWidth, scale: xScale }, { children: jsx(CloneElement, { element: series, id: `bar-series-${id}`, data: aggregatedData, height: chartHeight, width: chartWidth, isCategorical: isCategorical, xScale: xScale, xScale1: xScale1, yScale: yScale }, void 0) }), void 0))] }, void 0));
    }, [
        brush,
        getScalesAndData,
        gridlines,
        isVertical,
        keyAxis,
        secondaryAxis,
        series,
        xAxis,
        yAxis
    ]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, containerClassName: containerClassName, xAxisVisible: isAxisVisible(xAxis.props), yAxisVisible: isAxisVisible(yAxis.props), className: classNames(css$e.barChart, className, css$e[series.props.type]) }, { children: renderChart }), void 0));
};
BarChart.defaultProps = {
    data: [],
    xAxis: (jsx(LinearXAxis, { type: "category", tickSeries: jsx(LinearXAxisTickSeries, { tickSize: 20 }, void 0) }, void 0)),
    yAxis: jsx(LinearYAxis, { type: "value" }, void 0),
    series: jsx(BarSeries, {}, void 0),
    gridlines: jsx(GridlineSeries, {}, void 0),
    brush: null
};

const MarimekkoChart = (props) => (jsx(BarChart, Object.assign({}, props), void 0));
MarimekkoChart.defaultProps = {
    series: jsx(MarimekkoBarSeries, {}, void 0),
    xAxis: (jsx(LinearXAxis, { type: "category", tickSeries: jsx(LinearXAxisTickSeries, { tickSize: 15 }, void 0) }, void 0)),
    yAxis: (jsx(LinearYAxis, { type: "value", tickSeries: jsx(LinearYAxisTickSeries, { label: jsx(LinearYAxisTickLabel, { rotation: false, format: (data) => `${data * 100}%` }, void 0) }, void 0) }, void 0))
};

const StackedBarChart = (props) => (jsx(BarChart, Object.assign({}, props), void 0));
StackedBarChart.defaultProps = {
    series: jsx(StackedBarSeries, {}, void 0)
};

const StackedNormalizedBarChart = (props) => jsx(BarChart, Object.assign({}, props), void 0);
StackedNormalizedBarChart.defaultProps = {
    series: jsx(StackedNormalizedBarSeries, {}, void 0),
    yAxis: (jsx(LinearYAxis, { type: "value", tickSeries: jsx(LinearYAxisTickSeries, { label: jsx(LinearYAxisTickLabel, { rotation: false, format: (data) => `${data * 100}%` }, void 0) }, void 0) }, void 0))
};

const HistogramBarChart = (props) => jsx(BarChart, Object.assign({}, props), void 0);
HistogramBarChart.defaultProps = {
    series: jsx(HistogramBarSeries, {}, void 0)
};

var css_248z$d = ".HiveNode-module_node__3bcfx {\n  transition: opacity 100ms ease-in-out;\n  cursor: pointer;\n}\n\n.HiveNode-module_inactive__2bS6R {\n  opacity: 0.2;\n}\n";
var css$d = {"node":"HiveNode-module_node__3bcfx","inactive":"HiveNode-module_inactive__2bS6R"};
styleInject(css_248z$d);

const HiveNode = ({ angle, radius, node, color, onClick, onMouseOver, onMouseOut, active, disabled }) => {
    // If the size exists on the node, use it to specify the node size.
    // Otherwise, calculate a relative size using the node count.
    let size = node.size;
    if (size === undefined) {
        size = node.count || 0;
    }
    return (jsx("circle", { className: classNames(css$d.node, {
            [css$d.inactive]: !active
        }), transform: `rotate(${getDegrees(angle(node.x))})`, cx: radius(node.y), r: size, style: { cursor: disabled ? 'initial' : 'cursor' }, fill: color(node.x), onClick: onClick, onMouseOver: onMouseOver, onMouseOut: onMouseOut }, void 0));
};

var css_248z$c = ".HiveAxis-module_axis__4FERZ {\n  stroke: #575f67;\n  stroke-width: 1.5px;\n}\n";
var css$c = {"axis":"HiveAxis-module_axis__4FERZ"};
styleInject(css_248z$c);

const HiveAxis = ({ radius, index, angle, color }) => {
    const [axisStart, axisEnd] = radius.range();
    const axisLength = axisEnd - axisStart;
    return (jsxs(Fragment, { children: [jsx("line", { className: css$c.axis, style: { stroke: color(index) }, transform: `rotate(${getDegrees(angle(index))})`, x1: axisStart, x2: axisEnd }, void 0),
            jsx("line", { className: css$c.axis, style: { stroke: color(index) }, transform: `rotate(${getDegrees(angle(index)) + 90})`, x1: -axisLength / 20, x2: axisLength / 20, y1: -axisEnd, y2: -axisEnd }, void 0),
            jsx("line", { className: css$c.axis, style: { stroke: color(index) }, transform: `rotate(${getDegrees(angle(index)) + 90})`, x1: -axisStart / 3, x2: 0, y1: axisStart * -0.8, y2: axisStart * -1 }, void 0),
            jsx("line", { className: css$c.axis, style: { stroke: color(index) }, transform: `rotate(${getDegrees(angle(index)) + 90})`, x1: 0, x2: axisStart / 3, y1: -axisStart, y2: axisStart * -0.8 }, void 0)] }, void 0));
};

/**
 * Hive layout
 * Original: https://github.com/d3/d3-plugins/tree/master/hive
 */
function hiveLayout() {
    let source = (d) => d.source;
    let target = (d) => d.target;
    let angle = (d) => d.angle;
    let startRadius = (d) => d.radius;
    let endRadius = startRadius;
    const arcOffset = -Math.PI / 2;
    const link = (d, i) => {
        let s = node(source, this, d, i);
        let t = node(target, this, d, i);
        let x;
        if (t.a < s.a) {
            x = t;
            t = s;
            s = x;
        }
        if (t.a - s.a > Math.PI) {
            s.a += 2 * Math.PI;
        }
        const a1 = s.a + (t.a - s.a) / 3;
        const a2 = t.a - (t.a - s.a) / 3;
        return s.r0 - s.r1 || t.r0 - t.r1
            ? 'M' +
                Math.cos(s.a) * s.r0 +
                ',' +
                Math.sin(s.a) * s.r0 +
                'L' +
                Math.cos(s.a) * s.r1 +
                ',' +
                Math.sin(s.a) * s.r1 +
                'C' +
                Math.cos(a1) * s.r1 +
                ',' +
                Math.sin(a1) * s.r1 +
                ' ' +
                Math.cos(a2) * t.r1 +
                ',' +
                Math.sin(a2) * t.r1 +
                ' ' +
                Math.cos(t.a) * t.r1 +
                ',' +
                Math.sin(t.a) * t.r1 +
                'L' +
                Math.cos(t.a) * t.r0 +
                ',' +
                Math.sin(t.a) * t.r0 +
                'C' +
                Math.cos(a2) * t.r0 +
                ',' +
                Math.sin(a2) * t.r0 +
                ' ' +
                Math.cos(a1) * s.r0 +
                ',' +
                Math.sin(a1) * s.r0 +
                ' ' +
                Math.cos(s.a) * s.r0 +
                ',' +
                Math.sin(s.a) * s.r0
            : 'M' +
                Math.cos(s.a) * s.r0 +
                ',' +
                Math.sin(s.a) * s.r0 +
                'C' +
                Math.cos(a1) * s.r1 +
                ',' +
                Math.sin(a1) * s.r1 +
                ' ' +
                Math.cos(a2) * t.r1 +
                ',' +
                Math.sin(a2) * t.r1 +
                ' ' +
                Math.cos(t.a) * t.r1 +
                ',' +
                Math.sin(t.a) * t.r1;
    };
    const node = (method, thiz, d, i) => {
        const n = method.call(thiz, d, i);
        const a = +(typeof angle === 'function' ? angle.call(thiz, n, i) : angle) +
            arcOffset;
        const r0 = +(typeof startRadius === 'function'
            ? startRadius.call(thiz, n, i)
            : startRadius);
        const r1 = startRadius === endRadius
            ? r0
            : +(typeof endRadius === 'function'
                ? endRadius.call(thiz, n, i)
                : endRadius);
        return { r0, r1, a };
    };
    link.source = (s) => {
        if (!s) {
            return source;
        }
        source = s;
        return link;
    };
    link.target = (t) => {
        if (!t) {
            return target;
        }
        target = t;
        return link;
    };
    link.angle = (a) => {
        if (!a) {
            return angle;
        }
        angle = a;
        return link;
    };
    link.radius = (r) => {
        if (!r) {
            return startRadius;
        }
        startRadius = endRadius = r;
        return link;
    };
    link.startRadius = (r) => {
        if (!r) {
            return startRadius;
        }
        startRadius = r;
        return link;
    };
    link.endRadius = (r) => {
        if (!r) {
            return endRadius;
        }
        endRadius = r;
        return link;
    };
    return link;
}

var css_248z$b = ".HiveLink-module_link__3WwlJ {\n  fill: none;\n  stroke-width: 1.5px;\n  stroke-opacity: 0.5;\n  transition: opacity 100ms ease-in-out;\n}\n\n.HiveLink-module_inactive__3KKt1 {\n  opacity: 0.7;\n}\n";
var css$b = {"link":"HiveLink-module_link__3WwlJ","inactive":"HiveLink-module_inactive__3KKt1"};
styleInject(css_248z$b);

const HiveLink = ({ angle, radius, link, color, active, onMouseOver, onMouseOut }) => {
    const prepareData = () => {
        const hive = hiveLayout();
        return {
            hiveAngle: hive.angle((d) => angle(d.x)),
            hiveRadius: hive.radius((d) => radius(d.y))
        };
    };
    const { hiveAngle, hiveRadius } = useMemo(() => prepareData(), [
        angle,
        radius
    ]);
    const stroke = typeof color === 'string' ? color : color(link.source.x);
    return (jsx("path", { className: classNames(css$b.link, {
            [css$b.inactive]: !active
        }), d: `${hiveAngle(link)} ${hiveRadius(link)}`, stroke: stroke, onMouseOver: onMouseOver, onMouseOut: onMouseOut }, void 0));
};

var css_248z$a = ".HiveLabel-module_label__2I6Uz {\n  fill: rgba(255, 255, 255, 0.5);\n  font-size: 12px;\n  text-transform: uppercase;\n}\n";
var css$a = {"label":"HiveLabel-module_label__2I6Uz"};
styleInject(css_248z$a);

const degrees = (radians) => {
    const res = (radians / Math.PI) * 180;
    return res > 90 ? res + 180 : res;
};
const translate = (d, outerRadius, padding) => d > 90 ? outerRadius + 8 + padding : -(outerRadius + padding);
const HiveLabel = ({ index, text, angle, outerRadius, label }) => {
    const transform = useMemo(() => degrees(angle(index)), [angle, index]);
    return (jsx("text", Object.assign({ dy: translate(transform, outerRadius, label.padding), className: css$a.label, strokeWidth: "0.01", textAnchor: "middle", transform: `rotate(${transform})` }, { children: text }), void 0));
};

var css_248z$9 = ".HiveTooltip-module_label__3PblP {\n  font-size: 16px;\n  margin-bottom: 3px;\n}\n\n.HiveTooltip-module_value__326K_ {\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.7);\n}\n";
var css$9 = {"label":"HiveTooltip-module_label__3PblP","value":"HiveTooltip-module_value__326K_"};
styleInject(css_248z$9);

const HiveTooltip = ({ axis, nodes, node }) => {
    const { label } = axis[node.x];
    const count = nodes.filter((n) => n.value === node.value).length;
    return (jsxs(Fragment$1, { children: [jsxs("div", Object.assign({ className: css$9.label }, { children: [label, " - ", formatValue(node.value)] }), void 0),
            jsxs("div", Object.assign({ className: css$9.value }, { children: [formatValue(count), " Total"] }), void 0)] }, void 0));
};

const HivePlot = ({ axis = [], nodes = [], links = [], disabled = false, activeIds = [], label = {
    show: true,
    padding: 10
}, width, height, innerRadius = 20, className, onNodeClick = () => undefined, onNodeMouseOver = () => undefined, onLinkMouseOver = () => undefined, onNodeMouseOut = () => undefined, onLinkMouseOut = () => undefined, tooltip = {
    show: true,
    placement: 'top',
    formatter: (attr) => attr.value
}, colorScheme = {
    axis: ['#b1b2b6'],
    domain: ['#b1b2b6']
} }) => {
    const [tooltipReference, setTooltipReference] = useState(null);
    const [nodeTooltipData, setNodeTooltipData] = useState(null);
    const [linkTooltipData, setLinkTooltipData] = useState(null);
    const [active, setActive] = useState(null);
    const onNodeMouseOverLocal = useCallback((node, event) => {
        if (!disabled) {
            const activeNodeIndex = nodes.indexOf(node);
            const activeNodes = {};
            for (const link of links) {
                const { source, target } = link;
                if (source.value === node.value || target.value === node.value) {
                    const next = target.value === node.value ? source : target;
                    const idx = nodes.indexOf(next);
                    activeNodes[`node-${idx}`] = true;
                }
            }
            setTooltipReference(event.target);
            setNodeTooltipData(node);
            setActive(Object.assign(Object.assign({ [`node-${activeNodeIndex}`]: true }, activeNodes), links.reduce((accumulator, link, i) => {
                if (link.source.value === node.value ||
                    link.target.value === node.value) {
                    accumulator[`link-${i}`] = true;
                }
                return accumulator;
            }, {})));
        }
        onNodeMouseOver({
            nativeEvent: event,
            node,
            links: getLinksForNode(node)
        });
    }, [links, nodes, onNodeMouseOver, disabled]);
    const activateAdjacentLinks = useCallback((links, target, accumulator) => {
        const activeLinks = [];
        links.forEach((childLink, index) => {
            if (target === childLink.source) {
                if (!accumulator[`link-${index}`]) {
                    accumulator[`link-${index}`] = true;
                    activeLinks.push(childLink, ...activateAdjacentLinks(links, childLink.target, accumulator));
                }
            }
        });
        return activeLinks;
    }, []);
    const activateLink = useCallback((link) => {
        const activeLinkIndex = links.indexOf(link);
        const activeLinksMap = {
            [`link-${activeLinkIndex}`]: true
        };
        const activeLinks = [
            link,
            ...activateAdjacentLinks(links, link.target, activeLinksMap)
        ];
        setActive(Object.assign(Object.assign({}, activeLinksMap), nodes.reduce((accumulator, node, i) => {
            for (const activeLink of activeLinks) {
                const { source, target } = activeLink;
                if (node === source || node === target) {
                    accumulator[`node-${i}`] = true;
                }
            }
            return accumulator;
        }, {})));
    }, [nodes, links]);
    const onLinkMouseOverLocal = useCallback((link, event) => {
        if (!disabled) {
            setTooltipReference(event.target);
            setLinkTooltipData(link);
            activateLink(link);
        }
        onLinkMouseOver({
            nativeEvent: event,
            link
        });
    }, [onLinkMouseOver, disabled]);
    const getLinksForNode = useCallback((node) => links.filter((link) => link.source.value === node.value || link.target.value === node.value), [links]);
    const resetActive = useCallback(() => {
        setActive(null);
        setLinkTooltipData(null);
        setNodeTooltipData(null);
        setTooltipReference(null);
    }, []);
    const onNodeMouseOutLocal = useCallback((node, event) => {
        resetActive();
        onNodeMouseOut({
            nativeEvent: event,
            node,
            links: getLinksForNode(node)
        });
    }, [onNodeMouseOut]);
    const onLinkMouseOutLocal = useCallback((link, event) => {
        resetActive();
        onLinkMouseOut({
            nativeEvent: event,
            link
        });
    }, [onLinkMouseOut]);
    const onNodeClickLocal = useCallback((node, event) => {
        if (!disabled) {
            onNodeClick({
                nativeEvent: event,
                node,
                links: getLinksForNode(node)
            });
        }
    }, [disabled, onNodeClick]);
    const prepareData = useCallback(({ dimension, innerRadius, colorScheme, axis, label }) => {
        let outerRadius = dimension / 2;
        if (label.show) {
            outerRadius = outerRadius - (10 + label.padding);
        }
        return {
            angle: scalePoint()
                .domain(range(axis.length + 1))
                .range([0, 2 * Math.PI]),
            radius: scaleLinear().range([innerRadius, outerRadius]),
            axisColor: scaleOrdinal(colorScheme.axis).domain(range(20)),
            domainColor: scaleOrdinal(colorScheme.domain).domain(range(20)),
            outerRadius
        };
    }, []);
    const renderAxis = useCallback(({ angle, radius, axisColor, outerRadius }) => (jsx(Fragment, { children: axis.map((a, i) => (jsxs("g", { children: [jsx(HiveAxis, { angle: angle, index: i, color: axisColor, radius: radius }, void 0),
                label.show && (jsx(HiveLabel, { index: i, text: a.label, label: label, outerRadius: outerRadius, angle: angle }, void 0))] }, `axis-${a.attribute}`))) }, void 0)), [axis, label]);
    const isActive = useCallback((nodeOrLink, index, type) => {
        // If no there is nothing active, then everything is active.
        if (!active && !activeIds.length) {
            return true;
        }
        // If this node is active because it is being hovered
        if (active && active[`${type}-${index}`]) {
            return true;
        }
        // If the ID matches one of the active IDs passed in the props
        if (!!activeIds.length &&
            !!nodeOrLink.id &&
            activeIds.includes(nodeOrLink.id)) {
            return true;
        }
        return false;
    }, [activeIds, active]);
    const renderLinks = useCallback(({ angle, radius, domainColor }) => (jsx(Fragment, { children: links.map((link, i) => {
            return (jsx(HiveLink, { color: link.color || domainColor, active: isActive(link, i, 'link'), angle: angle, radius: radius, link: link, onMouseOver: (event) => onLinkMouseOverLocal(link, event), onMouseOut: (event) => onLinkMouseOutLocal(link, event) }, `${link.value}-${i}`));
        }) }, void 0)), [links]);
    const renderNodes = useCallback(({ angle, radius, domainColor }) => (jsx(Fragment, { children: nodes.map((node, i) => (jsx(HiveNode, { node: node, active: isActive(node, i, 'node'), color: domainColor, radius: radius, angle: angle, disabled: disabled, onMouseOver: (event) => onNodeMouseOverLocal(node, event), onMouseOut: (event) => onNodeMouseOutLocal(node, event), onClick: (event) => onNodeClickLocal(node, event) }, `${node.value}-${i}`))) }, void 0)), [nodes, disabled]);
    const renderTooltip = useCallback(() => {
        const { formatter, placement, show } = tooltip;
        return (jsx(Fragment, { children: !disabled && show && (jsx(Tooltip, { visible: !!active, reference: tooltipReference, placement: placement, content: () => formatter(axis, nodes, linkTooltipData, nodeTooltipData) ||
                    (nodeTooltipData ? (jsx(HiveTooltip, { node: nodeTooltipData, nodes: nodes, axis: axis }, void 0)) : null) }, void 0)) }, void 0));
    }, [
        tooltip,
        disabled,
        axis,
        nodes,
        active,
        tooltipReference,
        linkTooltipData,
        nodeTooltipData
    ]);
    const renderChart = useCallback(({ height: containerHeight, width: containerWidth }) => {
        const data = prepareData({
            dimension: Math.min(containerHeight, containerWidth),
            innerRadius,
            colorScheme,
            axis,
            label
        });
        return (jsxs(Fragment, { children: [jsx("svg", Object.assign({ width: containerWidth, height: containerHeight, className: classNames(className) }, { children: jsxs("g", Object.assign({ transform: `translate(${containerWidth / 2}, ${containerHeight / 2 + innerRadius})` }, { children: [renderAxis(data), renderLinks(data), renderNodes(data)] }), void 0) }), void 0), renderTooltip()] }, void 0));
    }, [innerRadius, axis, colorScheme, label, className]);
    return (jsx(ChartContainer, Object.assign({ height: height, width: width }, { children: renderChart }), void 0));
};

const LineSeries = (props) => (jsx(AreaSeries, Object.assign({}, props), void 0));
LineSeries.defaultProps = Object.assign(Object.assign({}, AreaSeries.defaultProps), { area: null, line: jsx(Line, { strokeWidth: 3 }, void 0) });

const LineChart = (props) => (jsx(AreaChart, Object.assign({}, props), void 0));
LineChart.defaultProps = Object.assign(Object.assign({}, AreaChart.defaultProps), { series: jsx(LineSeries, {}, void 0) });

const Map$1 = ({ id, width, height, margins, className, containerClassName, markers, data, fill }) => {
    const getProjection = useCallback(({ chartWidth, chartHeight }) => geoMercator().fitSize([chartWidth, chartHeight], data).center([0, 35]), [data]);
    const renderMarker = useCallback((marker, index, projection) => {
        const position = projection(marker.props.coordinates);
        if (!position) {
            console.warn(`Position for ${marker.props.coordinates.toString()} not found.`);
            return null;
        }
        return (jsx(CloneElement, { element: marker, cx: position[0], cy: position[1], index: index }, void 0));
    }, []);
    const renderCountry = useCallback((point, index, path) => {
        // Exclude ATA
        if (point.id === '010') {
            return null;
        }
        return jsx("path", { d: path(point), fill: fill }, `path-${index}`);
    }, [fill]);
    const renderChart = useCallback((containerProps) => {
        if (!data) {
            return null;
        }
        const projection = getProjection(containerProps);
        const path = geoPath().projection(projection);
        return (jsxs(motion.g, Object.assign({ initial: {
                opacity: 0
            }, animate: {
                opacity: 1
            } }, { children: [data.features.map((point, index) => renderCountry(point, index, path)), markers &&
                    markers.map((marker, index) => (jsx(Fragment, { children: renderMarker(marker, index, projection) }, `marker-${index}`)))] }), void 0));
    }, [data, getProjection, markers, renderCountry, renderMarker]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, containerClassName: containerClassName, xAxisVisible: false, yAxisVisible: false, className: className }, { children: (props) => renderChart(props) }), void 0));
};
Map$1.defaultProps = {
    fill: 'rgba(255, 255, 255, 0.3)'
};

var css_248z$8 = ".MapMarker-module_marker__3uyJu {\n  fill: var(--color-primary);\n  cursor: pointer;\n}\n";
var css$8 = {"marker":"MapMarker-module_marker__3uyJu"};
styleInject(css_248z$8);

// Set padding modifier for the tooltips
const modifiers$1 = {
    offset: {
        offset: '0, 3px'
    }
};
const MapMarker = ({ size = 3, index, tooltip, cx, cy, onClick = () => undefined }) => {
    const ref = useRef(null);
    const [active, setActive] = useState(false);
    return (jsxs(Fragment, { children: [jsx(motion.circle, { initial: {
                    opacity: 0,
                    scale: 0.02
                }, animate: {
                    opacity: 1,
                    scale: 1
                }, transition: {
                    delay: index * 0.3
                }, ref: ref, className: css$8.marker, cx: cx, cy: cy, r: size, onMouseEnter: () => setActive(true), onMouseLeave: () => setActive(false), onClick: onClick }, void 0),
            tooltip && (jsx(Tooltip, { visible: active, reference: ref, modifiers: modifiers$1, content: tooltip }, void 0))] }, void 0));
};

const useInterpolate$1 = ({ data, animated, arc }) => {
    const prevEnter = useRef(null);
    const exit = useMemo(() => {
        const startAngle = data.startAngle;
        const endAngle = animated ? startAngle : data.endAngle;
        return Object.assign(Object.assign({}, data), { startAngle,
            endAngle });
    }, [data, animated]);
    const transition = useMemo(() => animated
        ? Object.assign({}, DEFAULT_TRANSITION) : {
        delay: 0
    }, [animated]);
    // Cache the previous for transition use later
    const previousEnter = prevEnter.current
        ? Object.assign({}, prevEnter.current) : undefined;
    prevEnter.current = Object.assign({}, data);
    const d = useMotionValue('');
    const prevPath = useMotionValue(exit);
    const spring = useSpring(prevPath, Object.assign(Object.assign({}, DEFAULT_TRANSITION), { from: 0, to: 1 }));
    useEffect(() => {
        const from = previousEnter || prevPath.get();
        const interpolator = interpolate$1(from, data);
        const unsub = spring.onChange((v) => d.set(arc(interpolator(v))));
        prevPath.set(data);
        return unsub;
    }, [arc, data]);
    return {
        d,
        transition
    };
};

const PieArc = ({ color, data, arc, cursor, animated, disabled, onClick, onMouseEnter, onMouseLeave, tooltip }) => {
    const arcRef = useRef(null);
    const { transition, d } = useInterpolate$1({ animated, arc, data });
    const [active, setActive] = useState(false);
    const fill = useMemo(() => (active ? chroma(color).brighten(0.5) : color), [color, active]);
    return (jsxs("g", Object.assign({ ref: arcRef }, { children: [jsx(motion.path, { role: "graphics-symbol", transition: transition, d: d, style: { cursor }, fill: fill, onMouseEnter: (event) => {
                    if (!disabled) {
                        setActive(true);
                        onMouseEnter({
                            value: data.data,
                            nativeEvent: event
                        });
                    }
                }, onMouseLeave: (event) => {
                    if (!disabled) {
                        setActive(false);
                        onMouseLeave({
                            value: data.data,
                            nativeEvent: event
                        });
                    }
                }, onClick: (event) => {
                    if (!disabled) {
                        onClick({
                            value: data.data,
                            nativeEvent: event
                        });
                    }
                } }, void 0),
            tooltip && !tooltip.props.disabled && (jsx(CloneElement, { element: tooltip, visible: !!active, reference: arcRef, value: { y: data.data.data, x: data.data.key } }, void 0))] }), void 0));
};
PieArc.defaultProps = {
    cursor: 'initial',
    animated: true,
    disabled: false,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined,
    tooltip: jsx(ChartTooltip, {}, void 0)
};

/**
 * Finds intermediate point between two points so that this three points
 * can be nicely connected by two lines. One of this lines must be horizontal
 */
function findBreakPoint([startX, startY], [endX, endY]) {
    let breakPoint = [0, 0];
    // whether we should create breakpoint near pie or near label
    const breakPointCondition = (endY - startY) * Math.sign(startY) >= 0;
    if (breakPointCondition) {
        // extend the line starting from startY till the endY
        let scale = Math.abs(endY / startY) || 1;
        const minScale = 1;
        const maxScale = Math.abs(endX / startX) || 1;
        scale = Math.max(Math.min(maxScale, scale), minScale);
        breakPoint = [startX * scale, endY];
    }
    else {
        // some arbitrary scale to ensure that break point will be placed
        // at some horizontal distance from the end point
        let scale = 0.85;
        const minScale = Math.abs(startX / endX) || 1;
        const maxScale = 1;
        scale = Math.max(Math.min(maxScale, scale), minScale);
        breakPoint = [endX * scale, startY];
    }
    return breakPoint;
}

const getTextAnchor = ({ startAngle, endAngle }) => 
// we could also use the sign of position[0]
startAngle + (endAngle - startAngle) / 2 < Math.PI ? 'start' : 'end';
const PieArcLabel = ({ centroid, data, lineStroke, padding, fontSize, fontFill, format, fontFamily, position, outerRadius, width, height }) => {
    const textAnchor = getTextAnchor(data);
    const text = format
        ? format(Object.assign(Object.assign({}, data.data), { textAnchor }))
        : formatValue(data.data.key);
    const [posX, posY] = position;
    // we want to have at least some pixels of straight line (margin)
    // from pie section till we start to change line direction
    const minRadius = outerRadius + 4;
    const startPoint = centroid(data);
    const innerPoint = arc()
        .innerRadius(minRadius)
        .outerRadius(minRadius)
        .centroid(data);
    const breakPoint = findBreakPoint(innerPoint, position);
    return (jsxs(motion.g, Object.assign({ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: {
            duration: 0.1
        } }, { children: [typeof text === 'string' ? (jsxs(Fragment$1, { children: [jsx("title", { children: text }, void 0),
                    jsx("text", Object.assign({ dy: padding, fill: fontFill, fontSize: fontSize, fontFamily: fontFamily, textAnchor: textAnchor, style: {
                            shapeRendering: 'crispEdges',
                            transform: `translate3d(${posX}px,${posY}px, 0)`
                        } }, { children: text }), void 0)] }, void 0)) : (jsx("foreignObject", Object.assign({ width: width, height: height, style: {
                    transform: `translate3d(${textAnchor === 'start' ? posX : posX - width}px,${posY - height / 2}px, 0)`,
                    color: fontFill,
                    fontFamily,
                    fontSize
                } }, { children: text }), void 0)),
            jsx("polyline", { fill: "none", stroke: lineStroke, points: `${startPoint},${innerPoint},${breakPoint},${position}` }, void 0)] }), void 0));
};
PieArcLabel.defaultProps = {
    format: undefined,
    lineStroke: 'rgba(127,127,127,0.5)',
    fontFill: '#8F979F',
    fontSize: 11,
    fontFamily: 'sans-serif',
    padding: '.35em',
    height: 11
};

const factor = 1.2;
const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;
const labelVisible = (arc) => arc.endAngle - arc.startAngle > Math.PI / 30;
function shouldDisplayLabel(displayAllLabels, arcData) {
    return displayAllLabels || labelVisible(arcData);
}
function calculateOuterRadius(outerRadius, data, point, explode) {
    if (!explode || data === undefined) {
        return outerRadius;
    }
    const maxVal = max(data, (d) => d.value);
    return (outerRadius * point.value) / maxVal;
}
function calculateCentroid(data, innerRadius, outerRadius, explode) {
    return (point) => {
        const newOuter = calculateOuterRadius(outerRadius, data, point, explode);
        return arc()
            .innerRadius(innerRadius)
            .outerRadius(newOuter)
            .centroid(point);
    };
}
function calculateRadius(height, width, label, arcWidth, doughnut) {
    const minDimension = Math.min(width, height);
    let outerRadius = minDimension / 2;
    let labelWidth = 0;
    if (label) {
        labelWidth = label.props.width;
        if (labelWidth) {
            const outerArcRadius = width / 2 - labelWidth;
            outerRadius = Math.min(outerArcRadius / factor, height / 2);
        }
        else {
            outerRadius = minDimension / 3;
            labelWidth = width / 2 - outerRadius * factor;
        }
    }
    const innerRadius = doughnut ? outerRadius * (1 - arcWidth) : 0;
    return {
        outerRadius,
        innerRadius,
        labelWidth
    };
}
function calculateInnerArc(data, innerRadius, outerRadius, cornerRadius, padAngle, padRadius, explode) {
    return (point) => {
        const newOuter = calculateOuterRadius(outerRadius, data, point, explode);
        return arc()
            .innerRadius(innerRadius)
            .outerRadius(newOuter)
            .cornerRadius(cornerRadius)
            .padRadius(padRadius)
            .padAngle(padAngle)(point);
    };
}
function calculateLabelPositions(data, outerRadius, minDistance, cornerRadius, padAngle, padRadius, displayAllLabels) {
    const outerArcRadius = outerRadius * factor;
    const outerArc = arc()
        .innerRadius(outerArcRadius)
        .outerRadius(outerArcRadius)
        .cornerRadius(cornerRadius)
        .padAngle(padAngle)
        .padRadius(padRadius);
    const positions = data.map((d) => {
        if (!shouldDisplayLabel(displayAllLabels, d)) {
            return null;
        }
        const pos = outerArc.centroid(d);
        // reposition the labels to the left/right from outerArc centroid
        // so that all labels won't collide with pie
        // when we will vertically reposition them
        pos[0] = outerArcRadius * (midAngle(d) < Math.PI ? 1 : -1);
        return pos;
    });
    for (let i = 0; i < data.length - 1; i++) {
        if (!positions[i]) {
            continue;
        }
        const [aPosX, aPosY] = positions[i];
        for (let j = i + 1; j < data.length; j++) {
            if (!positions[j]) {
                continue;
            }
            const [bPosX, bPosY] = positions[j];
            // if they're on the same side (both with - or + sign)
            if (bPosX * aPosX > 0) {
                // if they're overlapping
                const overlap = minDistance - Math.abs(bPosY - aPosY);
                if (overlap > 0) {
                    // push the second up or down
                    positions[j][1] += Math.sign(bPosX) * overlap;
                }
            }
        }
    }
    return positions;
}

const PieArcSeries = ({ doughnut, arcWidth, label, colorScheme, width, displayAllLabels, height, explode, animated, cornerRadius, padAngle, padRadius, arc, data }) => {
    const { outerRadius, innerRadius, labelWidth } = calculateRadius(height, width, label, arcWidth, doughnut);
    const innerArc = calculateInnerArc(data, innerRadius, outerRadius, cornerRadius, padAngle, padRadius, explode);
    const positions = label
        ? calculateLabelPositions(data, outerRadius, 
        // 4 is for vertical margins between labels
        label.props.height + 4, cornerRadius, padAngle, padRadius, displayAllLabels)
        : [];
    const centroid = calculateCentroid(data, innerRadius, outerRadius, explode);
    return (jsx(Fragment, { children: data.map((arcData, index) => (jsxs(Fragment, { children: [positions[index] && (jsx(CloneElement, { element: label, data: arcData, centroid: centroid, outerRadius: outerRadius, width: labelWidth, position: positions[index] }, void 0)),
                jsx(CloneElement, { element: arc, data: arcData, animated: animated, arc: innerArc, color: getColor({
                        data,
                        colorScheme,
                        point: arcData.data,
                        index
                    }) }, void 0)] }, arcData.data.key.toString()))) }, void 0));
};
PieArcSeries.defaultProps = {
    animated: true,
    colorScheme: 'cybertron',
    innerRadius: 0,
    cornerRadius: 0,
    padAngle: 0,
    padRadius: 0,
    explode: false,
    displayAllLabels: false,
    arcWidth: 0.25,
    label: jsx(PieArcLabel, {}, void 0),
    arc: jsx(PieArc, {}, void 0)
};

const PieChart = ({ id, width, height, className, containerClassName, displayAllLabels, data = [], margins, series }) => {
    const getData = useMemo(() => {
        const pieLayout = pie().value((d) => Number(d.data));
        // Explode sort doesn't work right...
        if (!series.props.explode) {
            pieLayout.sort(null);
        }
        return pieLayout(data);
    }, [data, series]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, containerClassName: containerClassName, xAxisVisible: false, yAxisVisible: false, center: true, className: classNames(className) }, { children: ({ chartWidth, chartHeight }) => (jsx(CloneElement, { element: series, data: getData, height: chartHeight, width: chartWidth, displayAllLabels: displayAllLabels }, void 0)) }), void 0));
};
PieChart.defaultProps = {
    margins: 10,
    series: jsx(PieArcSeries, {}, void 0)
};

const JUSTIFICATION = {
    justify: sankeyJustify,
    center: sankeyCenter,
    left: sankeyLeft,
    right: sankeyRight
};
class Sankey extends Component {
    constructor() {
        super(...arguments);
        this.state = { activeNodes: [], activeLinks: [] };
    }
    getNodeColor(node, index) {
        const { colorScheme, nodes } = this.props;
        if (colorScheme) {
            return getColor({
                data: nodes,
                colorScheme,
                point: nodes[index],
                index
            });
        }
        else {
            return node.props.color;
        }
    }
    onNodeActive(node) {
        const activeNodes = [node];
        const activeLinks = [];
        if (node.sourceLinks) {
            activeLinks.push(...node.sourceLinks);
            node.sourceLinks.forEach((sourceLink) => {
                const sourceLinkTarget = sourceLink.target;
                if (sourceLinkTarget.index !== node.index) {
                    activeNodes.push(sourceLinkTarget);
                }
            });
        }
        if (node.targetLinks) {
            activeLinks.push(...node.targetLinks);
            node.targetLinks.forEach((targetLink) => {
                const targetLinkSource = targetLink.source;
                if (targetLinkSource.index !== node.index) {
                    activeNodes.push(targetLinkSource);
                }
            });
        }
        this.setState({ activeNodes, activeLinks });
    }
    onLinkActive(link) {
        const activeNodes = [link.source, link.target];
        const activeLinks = [link];
        this.setState({ activeNodes, activeLinks });
    }
    onInactive() {
        this.setState({ activeNodes: [], activeLinks: [] });
    }
    renderNode(computedNode, index, chartWidth, node) {
        const { animated } = this.props;
        const { activeNodes } = this.state;
        const active = activeNodes.some((node) => node.index === computedNode.index);
        const disabled = activeNodes.length > 0 && !active;
        return (jsx(CloneElement, Object.assign({ element: node, active: active, animated: animated, disabled: disabled, chartWidth: chartWidth, onMouseEnter: bind(this.onNodeActive, this, computedNode), onMouseLeave: bind(this.onInactive, this, computedNode) }, computedNode), `node-${index}`));
    }
    renderNodes(nodes, chartWidth) {
        const nodeMap = new Map();
        this.props.nodes.forEach((node) => node && nodeMap.set(node.props.title, node));
        nodes.sort((a, b) => {
            const aX0 = a && a.x0 ? a.x0 : 0;
            const aY0 = a && a.y0 ? a.y0 : 0;
            const bX0 = b && b.x0 ? b.x0 : 0;
            const bY0 = b && b.y0 ? b.y0 : 0;
            return aX0 - bX0 || aY0 - bY0;
        });
        return (jsx(Fragment, { children: nodes.map((node, index) => this.renderNode(node, index, chartWidth, nodeMap.get(node.title))) }, void 0));
    }
    renderLink(computedLink, index, chartId) {
        const { animated, links } = this.props;
        const { activeLinks } = this.state;
        const active = activeLinks.some((link) => link.index === computedLink.index);
        const disabled = activeLinks.length > 0 && !active;
        return (jsx(CloneElement, Object.assign({ element: links[index], active: active, animated: animated, chartId: chartId, disabled: disabled }, computedLink, { onMouseEnter: bind(this.onLinkActive, this, computedLink), onMouseLeave: bind(this.onInactive, this, computedLink) }), `link-${index}`));
    }
    renderChart(containerProps) {
        const { id, chartWidth, chartHeight } = containerProps;
        const { justification, nodeWidth, nodePadding } = this.props;
        const nodesCopy = this.props.nodes.map((node, index) => ({
            id: node.props.id,
            title: node.props.title,
            color: this.getNodeColor(node, index)
        }));
        const linksCopy = this.props.links.map((link) => ({
            source: link.props.source,
            target: link.props.target,
            value: link.props.value
        }));
        const sankeyChart = sankey()
            .extent([
            [1, 1],
            [chartWidth, chartHeight]
        ])
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .nodeAlign(JUSTIFICATION[justification])
            .nodeId((node) => node.id || node.index);
        const { nodes, links } = sankeyChart({
            nodes: nodesCopy,
            links: linksCopy
        });
        return (containerProps.chartSized && (jsxs(Fragment, { children: [links.map((link, index) => this.renderLink(link, index, `sankey-${id}`)),
                this.renderNodes(nodes, chartWidth)] }, "group")));
    }
    render() {
        const { id, width, height, margins, className, containerClassName } = this.props;
        return (jsx(ChartContainer, Object.assign({ id: id, width: width, containerClassName: containerClassName, height: height, margins: margins, className: className }, { children: (props) => this.renderChart(props) }), void 0));
    }
}
Sankey.defaultProps = {
    animated: true,
    justification: 'justify',
    nodeWidth: 15,
    nodePadding: 10
};

var css_248z$7 = ".SankeyLabel-module_label__2_aSZ {\n  font-size: 12px;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  pointer-events: none;\n}\n";
var css$7 = {"label":"SankeyLabel-module_label__2_aSZ"};
styleInject(css_248z$7);

class SankeyLabel extends Component {
    render() {
        const { active, chartWidth, className, fill, node, opacity, padding, visible } = this.props;
        const nodePositions = {
            x0: node && node.x0 ? node.x0 : 0,
            y0: node && node.y0 ? node.y0 : 0,
            x1: node && node.x1 ? node.x1 : 0,
            y1: node && node.y1 ? node.y1 : 0
        };
        const width = chartWidth || 0;
        const showRightSide = nodePositions.x0 < width / 2;
        const textAnchor = showRightSide ? 'start' : 'end';
        return (visible &&
            node && (jsx("text", Object.assign({ className: classNames(css$7.label, className), x: showRightSide ? nodePositions.x1 + 6 : nodePositions.x0 - 6, y: (nodePositions.y1 + nodePositions.y0) / 2, dy: "0.35em", textAnchor: textAnchor, fill: fill, opacity: opacity(active), style: { padding } }, { children: node.title }), void 0)));
    }
}
SankeyLabel.defaultProps = {
    active: false,
    fill: '#fff',
    location: 'outside',
    opacity: (active) => (active ? 1 : 0.5),
    visible: true
};

const DEFAULT_COLOR = 'rgba(255, 255, 255, 0.2)';

var css_248z$6 = ".SankeyLink-module_link__hzYa8 {\n  fill: none;\n  transition: stroke-opacity 100ms ease-in-out, stroke 100ms ease-in-out;\n  mix-blend-mode: screen;\n}\n\n.SankeyLink-module_tooltip__28O9b {\n  text-align: center;\n  pointer-events: none;\n}\n\n.SankeyLink-module_tooltip__28O9b .SankeyLink-module_tooltipLabel__odxY7 {\n    font-size: 16px;\n    margin-bottom: 3px;\n    color: rgba(255, 255, 255, 1);\n    text-align: center;\n  }\n\n.SankeyLink-module_tooltip__28O9b .SankeyLink-module_tooltipValue__cTGcv {\n    font-size: 13px;\n    color: rgba(255, 255, 255, 0.7);\n    text-align: center;\n  }\n";
var css$6 = {"link":"SankeyLink-module_link__hzYa8","tooltip":"SankeyLink-module_tooltip__28O9b","tooltipLabel":"SankeyLink-module_tooltipLabel__odxY7","tooltipValue":"SankeyLink-module_tooltipValue__cTGcv"};
styleInject(css_248z$6);

class SankeyLink extends Component {
    constructor() {
        super(...arguments);
        this.link = createRef();
        this.state = {};
    }
    getEnter() {
        const path = sankeyLinkHorizontal();
        const d = path(this.getLink());
        const strokeWidth = Math.max(1, this.props.width);
        return { d, strokeWidth };
    }
    getExit() {
        const path = sankeyLinkHorizontal();
        const d = path(Object.assign(Object.assign({}, this.getLink()), { width: 0 }));
        return { d, strokeWidth: 0 };
    }
    getLink() {
        const { index, value, y0, y1, source, target, width } = this.props;
        return { index, y0, y1, value, width, source, target };
    }
    getStroke() {
        const { color, index, gradient, chartId } = this.props;
        return gradient ? `url(#${chartId}-gradient-${index})` : color;
    }
    onMouseEnter(event) {
        this.setState({ hovered: true });
        this.props.onMouseEnter(event);
    }
    onMouseLeave(event) {
        this.setState({ hovered: false });
        this.props.onMouseLeave(event);
    }
    renderLink() {
        const { active, className, disabled, index, opacity, style, onClick } = this.props;
        const enterProps = this.getEnter();
        const exitProps = this.getExit();
        return (jsx("g", Object.assign({ ref: this.link }, { children: jsx(motion.path, { className: classNames(css$6.link, className), style: style, initial: exitProps, animate: enterProps, exit: exitProps, transition: {
                    duration: 0.5
                }, stroke: this.getStroke(), strokeOpacity: opacity(active, disabled), onClick: onClick, onMouseEnter: bind(this.onMouseEnter, this), onMouseLeave: bind(this.onMouseLeave, this) }, `sankey-link-${enterProps.d}-${index}`) }), void 0));
    }
    renderTooltipContent() {
        const { source, target, value } = this.props;
        return (jsxs("div", Object.assign({ className: css$6.tooltip }, { children: [jsx("div", Object.assign({ className: css$6.tooltipLabel }, { children: `${source.title} → ${target.title}` }), void 0),
                jsx("div", Object.assign({ className: css$6.tooltipValue }, { children: formatValue(value) }), void 0)] }), void 0));
    }
    render() {
        const { gradient, index, source, target, tooltip, chartId } = this.props;
        const linkSource = source;
        const linkTarget = target;
        return (jsxs(Fragment, { children: [gradient && (jsxs("linearGradient", Object.assign({ id: `${chartId}-gradient-${index}`, gradientUnits: "userSpaceOnUse", x1: linkSource.x1, x2: linkTarget.x0 }, { children: [jsx("stop", { offset: "0%", stopColor: linkSource.color }, void 0),
                        jsx("stop", { offset: "100%", stopColor: linkTarget.color }, void 0)] }), void 0)), this.renderLink(), !tooltip.props.disabled && (jsx(CloneElement, { content: this.renderTooltipContent.bind(this), element: tooltip, visible: this.state.hovered, reference: this.link }, void 0))] }, void 0));
    }
}
SankeyLink.defaultProps = {
    active: false,
    animated: true,
    color: DEFAULT_COLOR,
    disabled: false,
    gradient: true,
    opacity: (active, disabled) => (active ? 0.5 : disabled ? 0.1 : 0.35),
    tooltip: (jsx(Tooltip, { followCursor: true, modifiers: {
            offset: {
                offset: '0, 5px'
            }
        } }, void 0)),
    width: 0,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
};

var css_248z$5 = ".SankeyNode-module_node__1rkj0 {\n  transition: opacity 100ms ease-in-out, fill-opacity 100ms ease-in-out;\n}\n\n.SankeyNode-module_tooltip__1SZ4e {\n  text-align: center;\n  padding: 0 8px;\n  pointer-events: none;\n}\n\n.SankeyNode-module_tooltip__1SZ4e .SankeyNode-module_tooltipLabel__HfJ93 {\n    font-size: 16px;\n    margin-bottom: 3px;\n    color: rgba(255, 255, 255, 1);\n    text-align: center;\n  }\n\n.SankeyNode-module_tooltip__1SZ4e .SankeyNode-module_tooltipValue__lnd_m {\n    font-size: 13px;\n    color: rgba(255, 255, 255, 0.7);\n    text-align: center;\n  }\n";
var css$5 = {"node":"SankeyNode-module_node__1rkj0","tooltip":"SankeyNode-module_tooltip__1SZ4e","tooltipLabel":"SankeyNode-module_tooltipLabel__HfJ93","tooltipValue":"SankeyNode-module_tooltipValue__lnd_m"};
styleInject(css_248z$5);

class SankeyNode extends Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.rect = createRef();
    }
    getNode() {
        const { id, title, color, sourceLinks, targetLinks, value, index, x0, x1, y0, y1 } = this.props;
        return {
            id,
            title,
            color,
            sourceLinks,
            targetLinks,
            value,
            index,
            x0,
            x1,
            y0,
            y1
        };
    }
    onMouseEnter(event) {
        this.setState({ hovered: true });
        this.props.onMouseEnter(event);
    }
    onMouseLeave(event) {
        this.setState({ hovered: false });
        this.props.onMouseLeave(event);
    }
    renderNode() {
        const { active, className, color, disabled, index, opacity, style, width, x0, x1, y0, y1, onClick } = this.props;
        const nodeWidth = width || (x1 && x0 && x1 - x0 > 0 ? x1 - x0 : 0);
        const nodeHeight = y1 && y0 && y1 - y0 > 0 ? y1 - y0 : 0;
        return (jsx(motion.g, Object.assign({ ref: this.rect }, { children: jsx(motion.rect, { className: classNames(css$5.node, className), fillOpacity: opacity(active, disabled), style: style, width: nodeWidth, height: nodeHeight, fill: color, initial: {
                    opacity: 0,
                    attrX: x0,
                    attrY: y0
                }, animate: {
                    opacity: 1,
                    attrX: x0,
                    attrY: y0
                }, exit: {
                    opacity: 0,
                    attrX: x0,
                    attrY: y0
                }, transition: {
                    duration: 0.1
                }, onClick: onClick, onMouseEnter: bind(this.onMouseEnter, this), onMouseLeave: bind(this.onMouseLeave, this) }, `sankey-node-${x0}-${x1}-${y0}-${y1}-${index}`) }), void 0));
    }
    renderTooltipContent() {
        const { title, value } = this.props;
        return (jsxs("div", Object.assign({ className: css$5.tooltip }, { children: [jsx("div", Object.assign({ className: css$5.tooltipLabel }, { children: title }), void 0),
                jsx("div", Object.assign({ className: css$5.tooltipValue }, { children: formatValue(value) }), void 0)] }), void 0));
    }
    render() {
        const { active, chartWidth, label, tooltip, showLabel } = this.props;
        return (jsxs(Fragment, { children: [this.renderNode(), showLabel && (jsx(CloneElement, { active: active, element: label, chartWidth: chartWidth, node: this.getNode() }, void 0)),
                !tooltip.props.disabled && (jsx(CloneElement, { content: this.renderTooltipContent.bind(this), element: tooltip, visible: this.state.hovered, reference: this.rect }, void 0))] }, void 0));
    }
}
SankeyNode.defaultProps = {
    active: false,
    animated: true,
    color: DEFAULT_COLOR,
    disabled: false,
    label: jsx(SankeyLabel, {}, void 0),
    opacity: (active, disabled) => (active ? 1 : disabled ? 0.2 : 0.9),
    showLabel: true,
    tooltip: (jsx(Tooltip, { followCursor: true, modifiers: {
            offset: {
                offset: '0, 5px'
            }
        } }, void 0)),
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
};

const SparklineChart = (props) => jsx(LineChart, Object.assign({}, props), void 0);
SparklineChart.defaultProps = {
    gridlines: null,
    series: (jsx(AreaSeries, { symbols: jsx(PointSeries, { show: "hover" }, void 0), interpolation: "smooth", markLine: null, area: null, line: jsx(Line, { strokeWidth: 2 }, void 0) }, void 0)),
    yAxis: (jsx(LinearYAxis, { scaled: true, type: "value", axisLine: null, tickSeries: jsx(LinearYAxisTickSeries, { line: null, label: null }, void 0) }, void 0)),
    xAxis: (jsx(LinearXAxis, { type: "time", scaled: true, axisLine: null, tickSeries: jsx(LinearXAxisTickSeries, { line: null, label: null }, void 0) }, void 0))
};

const AreaSparklineChart = (props) => jsx(AreaChart, Object.assign({}, props), void 0);
AreaSparklineChart.defaultProps = {
    gridlines: null,
    series: (jsx(AreaSeries, { symbols: jsx(PointSeries, { show: "hover" }, void 0), interpolation: "smooth", markLine: null, area: jsx(Area, { mask: jsx(Stripes, {}, void 0), gradient: jsx(Gradient, { stops: [
                    jsx(GradientStop, { offset: "10%", stopOpacity: 0 }, "start"),
                    jsx(GradientStop, { offset: "80%", stopOpacity: 1 }, "stop")
                ] }, void 0) }, void 0), line: jsx(Line, { strokeWidth: 3 }, void 0) }, void 0)),
    yAxis: (jsx(LinearYAxis, { type: "value", scaled: true, axisLine: null, tickSeries: jsx(LinearYAxisTickSeries, { line: null, label: null }, void 0) }, void 0)),
    xAxis: (jsx(LinearXAxis, { type: "time", scaled: true, axisLine: null, tickSeries: jsx(LinearXAxisTickSeries, { line: null, label: null }, void 0) }, void 0))
};

const BarSparklineChart = (props) => jsx(BarChart, Object.assign({}, props), void 0);
BarSparklineChart.defaultProps = {
    gridlines: null,
    series: jsx(BarSeries, { colorScheme: schemes.cybertron[0] }, void 0),
    yAxis: (jsx(LinearYAxis, { type: "value", axisLine: null, tickSeries: jsx(LinearYAxisTickSeries, { line: null, label: null }, void 0) }, void 0)),
    xAxis: (jsx(LinearXAxis, { type: "category", axisLine: null, tickSeries: jsx(LinearXAxisTickSeries, { line: null, label: null }, void 0) }, void 0))
};

const SonarChart = (props) => (jsx(StackedBarChart, Object.assign({}, props, { margins: 0, gridlines: null, series: jsx(StackedBarSeries, { type: "stackedDiverging", colorScheme: "rgb(17, 207, 247)", tooltip: jsx(TooltipArea, { tooltip: jsx(ChartTooltip, { followCursor: true, modifiers: {
                    offset: '5px, 5px'
                }, content: (data, color) => (jsx(TooltipTemplate, { color: color, value: {
                        x: formatValue(data.x),
                        y: `${formatValue(Math.abs(data.data[0].y))}`
                    } }, void 0)) }, void 0) }, void 0), bar: [
            jsx(Bar, { width: 1, rangeLines: null, minHeight: 1, gradient: jsx(Gradient, { stops: [
                        jsx(GradientStop, { offset: "5%", stopOpacity: 0.7 }, "start"),
                        jsx(GradientStop, { offset: "90%", stopOpacity: 1 }, "stop")
                    ] }, void 0) }, "first"),
            jsx(Bar, { width: 1, rangeLines: null, minHeight: 1, gradient: jsx(Gradient, { stops: [
                        jsx(GradientStop, { offset: "5%", stopOpacity: 1 }, "stop"),
                        jsx(GradientStop, { offset: "90%", stopOpacity: 0.7 }, "start")
                    ] }, void 0) }, "second")
        ] }, void 0), yAxis: jsx(LinearYAxis, { type: "value", axisLine: null, tickSeries: jsx(LinearYAxisTickSeries, { line: null, label: null }, void 0) }, void 0), xAxis: jsx(LinearXAxis, { type: "category", axisLine: null, tickSeries: jsx(LinearXAxisTickSeries, { line: null, label: null }, void 0) }, void 0) }), void 0));

const RadialArea = ({ id, data, className, yScale, color, animated, outerRadius, xScale, innerRadius, interpolation, gradient }) => {
    const transition = useMemo(() => animated
        ? Object.assign({}, DEFAULT_TRANSITION) : {
        type: false,
        delay: 0
    }, [animated]);
    const getFill = useCallback((c) => {
        if (!gradient) {
            return c;
        }
        return `url(#${id}-gradient)`;
    }, [id, gradient]);
    const getPath = useCallback((d) => {
        const curve = interpolation === 'smooth' ? curveCardinalClosed : curveLinearClosed;
        const radialFn = radialArea()
            .angle((dd) => xScale(dd.x))
            .innerRadius((_) => innerRadius)
            .outerRadius((d) => yScale(d.y))
            .curve(curve);
        return radialFn(d);
    }, [xScale, yScale, interpolation, innerRadius]);
    const enter = useMemo(() => ({
        d: getPath(data),
        opacity: 1
    }), [data, getPath]);
    const exit = useMemo(() => {
        const [yStart] = yScale.domain();
        return {
            d: getPath(data.map((d) => (Object.assign(Object.assign({}, d), { y: yStart })))),
            opacity: 0
        };
    }, [data, getPath, yScale]);
    const fill = color(data, 0);
    return (jsxs(Fragment, { children: [jsx(MotionPath, { custom: {
                    enter,
                    exit
                }, transition: transition, pointerEvents: "none", className: className, fill: getFill(color) }, void 0),
            gradient && (jsx(CloneElement, { element: gradient, id: `${id}-gradient`, radius: outerRadius, color: fill }, void 0))] }, void 0));
};
RadialArea.defaultProps = {
    gradient: jsx(RadialGradient, {}, void 0)
};

const RadialLine = ({ xScale, yScale, className, color, data, interpolation, strokeWidth, animated }) => {
    const getPath = useCallback((preData) => {
        const curve = interpolation === 'smooth' ? curveCardinalClosed : curveLinearClosed;
        const radialFn = radialLine()
            .angle((d) => xScale(d.x))
            .radius((d) => yScale(d.y))
            .curve(curve);
        return radialFn(preData);
    }, [xScale, yScale, interpolation]);
    const transition = useMemo(() => animated
        ? Object.assign({}, DEFAULT_TRANSITION) : {
        type: false,
        delay: 0
    }, [animated]);
    const fill = color(data, 0);
    const enter = useMemo(() => ({
        d: getPath(data),
        opacity: 1
    }), [data, getPath]);
    const exit = useMemo(() => {
        const [yStart] = yScale.domain();
        return {
            d: getPath(data.map((d) => (Object.assign(Object.assign({}, d), { y: yStart })))),
            opacity: 0
        };
    }, [data, yScale, getPath]);
    return (jsx(MotionPath, { custom: {
            enter,
            exit
        }, transition: transition, className: className, pointerEvents: "none", stroke: fill, fill: "none", strokeWidth: strokeWidth }, void 0));
};
RadialLine.defaultProps = {
    strokeWidth: 2,
    animated: true
};

const RadialScatterPlot = ({ id, width, height, margins, className, containerClassName, innerRadius, series, axis, data }) => {
    const getScales = useCallback((aggregatedData, outer, inner) => {
        const yDomain = getYDomain({ data: aggregatedData, scaled: false });
        const xDomain = getXDomain({ data: aggregatedData });
        const xScale = scaleTime()
            .range([0, 2 * Math.PI])
            .domain(xDomain);
        const yScale = getRadialYScale(inner, outer, yDomain);
        return {
            yScale,
            xScale
        };
    }, []);
    const renderChart = useCallback((containerProps) => {
        const { chartWidth, chartHeight, id } = containerProps;
        const outerRadius = Math.min(chartWidth, chartHeight) / 2;
        const aggregatedData = buildShallowChartData(data);
        const { yScale, xScale } = getScales(aggregatedData, outerRadius, innerRadius);
        return (jsxs(Fragment, { children: [axis && (jsx(CloneElement, { element: axis, xScale: xScale, height: chartHeight, width: chartWidth, innerRadius: innerRadius }, void 0)),
                jsx(CloneElement, { element: series, id: id, data: aggregatedData, xScale: xScale, yScale: yScale }, void 0)] }, void 0));
    }, [data, getScales, innerRadius, series, axis]);
    return (jsx(ChartContainer, Object.assign({ id: id, containerClassName: containerClassName, width: width, height: height, margins: margins, xAxisVisible: false, yAxisVisible: false, center: true, className: className }, { children: renderChart }), void 0));
};

var css_248z$4 = ".RadialScatterPoint-module_inactive__1RkCR {\n  opacity: 0.4;\n  transition: opacity 200ms ease-in-out;\n}\n";
var css$4 = {"inactive":"RadialScatterPoint-module_inactive__1RkCR"};
styleInject(css_248z$4);

const RadialScatterPoint = (_a) => {
    var { size, data, color, index, symbol, active, tooltip, yScale, xScale, animated, className } = _a, rest = __rest(_a, ["size", "data", "color", "index", "symbol", "active", "tooltip", "yScale", "xScale", "animated", "className"]);
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);
    function onMouseEnter(event) {
        setHovered(true);
        rest.onMouseEnter({
            value: data,
            nativeEvent: event
        });
    }
    function onMouseLeave(event) {
        setHovered(false);
        rest.onMouseLeave({
            value: data,
            nativeEvent: event
        });
    }
    function onClick(event) {
        rest.onClick({
            value: data,
            nativeEvent: event
        });
    }
    function getTranslate(data) {
        const fn = radialLine()
            .radius((d) => yScale(d.y))
            .angle((d) => xScale(d.x));
        // Parse the generated path to get point coordinates
        // Ref: https://bit.ly/2CnZcPl
        const path = fn([data]);
        if (path) {
            const [translateX, translateY] = path.slice(1).slice(0, -1).split(',');
            return {
                translateX: parseFloat(translateX),
                translateY: parseFloat(translateY)
            };
        }
    }
    function getTransition() {
        if (animated) {
            return Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay: index * 0.005 });
        }
        else {
            return {
                type: false,
                delay: 0
            };
        }
    }
    const fill = typeof color === 'function' ? color(data, index) : color;
    const transform = getTranslate(data);
    const sizeVal = typeof size === 'function' ? size(data) : size;
    const transition = getTransition();
    const [yStart] = yScale.domain();
    const exitTransform = getTranslate(Object.assign(Object.assign({}, data), { y: yStart }));
    return (jsxs(Fragment, { children: [jsxs(motion.g, Object.assign({ initial: Object.assign(Object.assign({}, exitTransform), { opacity: 0 }), animate: Object.assign(Object.assign({}, transform), { opacity: 1 }), exit: Object.assign(Object.assign({}, exitTransform), { opacity: 0 }), transition: transition, ref: ref, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onClick: onClick, className: classNames(className, {
                    [css$4.inactive]: !active
                }) }, { children: [symbol && symbol(data), !symbol && jsx("circle", { r: sizeVal, fill: fill }, void 0)] }), void 0),
            tooltip && (jsx(CloneElement, { element: tooltip, visible: hovered, reference: ref, value: data }, void 0))] }, void 0));
};
RadialScatterPoint.defaultProps = {
    size: 3,
    color: schemes.cybertron[0],
    tooltip: jsx(ChartTooltip, {}, void 0),
    active: true,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
};

const RadialScatterSeries = ({ data, point, xScale, yScale, animated, activeIds }) => {
    const [internalActiveIds, setInternalActiveIds] = useState(activeIds);
    useEffect(() => {
        setInternalActiveIds(activeIds || []);
    }, [activeIds]);
    const onMouseEnter = useCallback(({ value }) => {
        // Only perform this on unmanaged activations
        if (!activeIds) {
            setInternalActiveIds([value.id]);
        }
    }, []);
    const onMouseLeave = useCallback(() => {
        // Only perform this on unmanaged activations
        if (!activeIds) {
            setInternalActiveIds([]);
        }
    }, []);
    const renderPoint = useCallback((d, index) => {
        let dataId;
        if (d.id) {
            dataId = d.id;
        }
        else {
            console.warn('No \'id\' property provided for scatter point; provide one via \'id\'.');
        }
        const key = dataId || index;
        const active = !(internalActiveIds && internalActiveIds.length) || internalActiveIds.includes(dataId);
        const visible = point.props.visible;
        if (visible && !visible(d, index)) {
            return jsx(Fragment, {}, key);
        }
        return (jsx(CloneElement, { element: point, data: d, index: index, active: active, xScale: xScale, yScale: yScale, animated: animated, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, key));
    }, [point, internalActiveIds, xScale, yScale, animated, onMouseEnter, onMouseLeave]);
    return jsx(Fragment, { children: data.map(renderPoint) }, void 0);
};
RadialScatterSeries.defaultProps = {
    point: jsx(RadialScatterPoint, {}, void 0),
    animated: true
};

const RadialPointSeries = ({ data, xScale, yScale, animated, color, activeValues, show, point }) => {
    const isVisible = useCallback((point, index) => {
        const isActive = activeValues && point && isEqual(activeValues.x, point.x);
        if (show === 'hover') {
            return isActive;
        }
        else if (show === 'first') {
            if (activeValues) {
                return isActive;
            }
            else {
                return index === 0;
            }
        }
        else if (show === 'last') {
            if (activeValues) {
                return isActive;
            }
            else {
                return index === data.length - 1;
            }
        }
        return show;
    }, [data, activeValues, show]);
    return (jsx(RadialScatterSeries, { animated: animated, data: data, xScale: xScale, yScale: yScale, point: jsx(CloneElement, { element: point, color: color, tooltip: null, visible: isVisible }, void 0) }, void 0));
};
RadialPointSeries.defaultProps = {
    show: 'hover',
    point: jsx(RadialScatterPoint, {}, void 0)
};

const RadialAreaSeries = ({ area, line, symbols, tooltip, xScale, yScale, data, id, animated, width, height, innerRadius, outerRadius, colorScheme, interpolation }) => {
    const [activeValues, setActiveValues] = useState(null);
    const getColorForPoint = useCallback((point, index) => {
        return getColor({
            colorScheme,
            data,
            index,
            point
        });
    }, [colorScheme, data]);
    const renderArea = useCallback(() => (jsx(CloneElement, { element: area, id: `${id}-radial-area`, xScale: xScale, yScale: yScale, animated: animated, color: getColorForPoint, data: data, interpolation: interpolation, outerRadius: outerRadius, innerRadius: innerRadius }, void 0)), [
        animated,
        area,
        data,
        getColorForPoint,
        id,
        innerRadius,
        interpolation,
        outerRadius,
        xScale,
        yScale
    ]);
    const renderLine = useCallback(() => (jsx(CloneElement, { element: line, xScale: xScale, yScale: yScale, animated: animated, interpolation: interpolation, color: getColorForPoint, data: data }, void 0)), [animated, data, getColorForPoint, interpolation, line, xScale, yScale]);
    const renderSymbols = useCallback(() => {
        // Animations are only valid for Area
        const activeSymbols = (symbols && symbols.props.activeValues) || activeValues;
        const isAnimated = area !== undefined && animated && !activeSymbols;
        return (jsx(CloneElement, { element: symbols, activeValues: activeValues, xScale: xScale, yScale: yScale, data: data, animated: isAnimated, color: getColorForPoint }, void 0));
    }, [
        activeValues,
        animated,
        area,
        data,
        getColorForPoint,
        symbols,
        xScale,
        yScale
    ]);
    return (jsx(CloneElement, Object.assign({ element: tooltip, xScale: xScale, yScale: yScale, data: data, height: height, width: width, isRadial: true, innerRadius: innerRadius, outerRadius: outerRadius, color: getColorForPoint, onValueEnter: (event) => setActiveValues(event.value), onValueLeave: () => setActiveValues(null) }, { children: jsxs("g", Object.assign({ clipPath: `url(#${id}-path)` }, { children: [area && renderArea(), line && renderLine(), symbols && renderSymbols()] }), void 0) }), void 0));
};
RadialAreaSeries.defaultProps = {
    colorScheme: schemes.cybertron[0],
    interpolation: 'smooth',
    animated: true,
    area: jsx(RadialArea, {}, void 0),
    line: jsx(RadialLine, {}, void 0),
    symbols: jsx(RadialPointSeries, {}, void 0),
    tooltip: jsx(TooltipArea, {}, void 0)
};

const RadialAreaChart = ({ id, width, height, className, data, containerClassName, innerRadius, series, axis, margins }) => {
    const getScales = useCallback((preData, outerRadius, innerRadius) => {
        const d = buildShallowChartData(preData);
        const yDomain = getYDomain({ data: d, scaled: false });
        let xScale;
        if ((axis === null || axis === void 0 ? void 0 : axis.props.type) === 'category') {
            const xDomain = uniqueBy(d, (dd) => dd.x);
            xScale = scaleBand()
                .range([0, 2 * Math.PI])
                .domain(xDomain);
        }
        else {
            const xDomain = getXDomain({ data: d });
            xScale = scaleTime()
                .range([0, 2 * Math.PI])
                .domain(xDomain);
        }
        const yScale = getRadialYScale(innerRadius, outerRadius, yDomain);
        return {
            yScale,
            xScale,
            result: d
        };
    }, [axis === null || axis === void 0 ? void 0 : axis.props.type]);
    const renderChart = useCallback((containerProps) => {
        const { chartWidth, chartHeight, id } = containerProps;
        const outerRadius = Math.min(chartWidth, chartHeight) / 2;
        const { yScale, xScale, result } = getScales(data, outerRadius, innerRadius);
        return (jsxs(Fragment, { children: [axis && (jsx(CloneElement, { element: axis, xScale: xScale, height: chartHeight, width: chartWidth, innerRadius: innerRadius }, void 0)),
                jsx(CloneElement, { element: series, id: id, data: result, xScale: xScale, yScale: yScale, height: chartHeight, width: chartWidth, outerRadius: outerRadius, innerRadius: innerRadius }, void 0)] }, void 0));
    }, [getScales, data, innerRadius, axis, series]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, containerClassName: containerClassName, margins: margins, xAxisVisible: false, yAxisVisible: false, center: true, className: className }, { children: renderChart }), void 0));
};
RadialAreaChart.defaultProps = {
    innerRadius: 0.1,
    series: jsx(RadialAreaSeries, {}, void 0),
    axis: jsx(RadialAxis, {}, void 0),
    margins: 75
};

const pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path;
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Otherwise, draw an arc!
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }

      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._ += "L" + x0 + "," + y0;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
  },
  toString: function() {
    return this._;
  }
};

const MotionBar = (_a) => {
    var { custom, transition, arc } = _a, rest = __rest(_a, ["custom", "transition", "arc"]);
    const d = useMotionValue('');
    const prevPath = useMotionValue(custom.exit);
    const spring = useSpring(prevPath, Object.assign(Object.assign({}, DEFAULT_TRANSITION), { from: 0, to: 1 }));
    useEffect(() => {
        const from = custom.previousEnter
            ? custom.previousEnter.y
            : prevPath.get().y;
        const interpolator = interpolate$1(from, custom.enter.y);
        const unsub = spring.onChange((v) => d.set(arc(Object.assign(Object.assign({}, custom.enter), { y: interpolator(v) }))));
        prevPath.set(custom.enter);
        return unsub;
    });
    const _b = custom.enter, { d: enterD } = _b, enterRest = __rest(_b, ["d"]);
    const _c = custom.exit, exitRest = __rest(_c, ["d"]);
    return (jsx(motion.path, Object.assign({}, rest, { initial: exitRest, exit: exitRest, animate: enterRest, transition: transition, d: transition.type !== false ? d : enterD }), void 0));
};

const RadialGuideBar = ({ active, path, fill = '#eee', opacity = 0.2 }) => (jsx(motion.path, { d: path, fill: fill, pointerEvents: "none", initial: "hidden", animate: active ? 'visible' : 'hidden', variants: {
        hidden: { opacity: 0 },
        visible: { opacity }
    } }, void 0));
RadialGuideBar.defaultProps = {
    fill: '#eee',
    opacity: 0.2
};

const RadialBar = ({ animated, innerRadius, xScale, yScale, curved, id, gradient, barCount, className, data, active, guide, index, color, onClick, onMouseEnter, onMouseLeave }) => {
    const previousEnter = useRef(null);
    const fill = color(data, index);
    const currentColorShade = active ? chroma(fill).brighten(0.5) : fill;
    const transition = useMemo(() => {
        // const { animated, barCount, index } = this.props;
        if (animated) {
            return Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay: (index / barCount) * 0.5 });
        }
        else {
            return {
                type: false,
                delay: 0
            };
        }
    }, [animated, barCount, index]);
    const getFill = useCallback((color) => {
        if (!gradient) {
            return color;
        }
        return `url(#${id}-gradient)`;
    }, [gradient, id]);
    const getArc = useCallback((data) => {
        const outerRadius = yScale(data.y);
        if (curved) {
            const startAngle = xScale(data.x);
            const endAngle = startAngle + xScale.bandwidth();
            const arcFn = arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .startAngle(startAngle)
                .endAngle(endAngle)
                .padAngle(0.01)
                .padRadius(innerRadius);
            return arcFn(data);
        }
        else {
            const startAngle = xScale(data.x) - Math.PI * 0.5;
            const endAngle = startAngle + xScale.bandwidth();
            const innerAngleDistance = endAngle - startAngle;
            const arcLength = innerRadius * innerAngleDistance;
            const outerAngleDistance = arcLength / outerRadius;
            const halfAngleDistanceDelta = (innerAngleDistance - outerAngleDistance) / 2;
            const pathFn = path();
            pathFn.arc(0, 0, innerRadius, startAngle, endAngle);
            pathFn.arc(0, 0, outerRadius, endAngle - halfAngleDistanceDelta, startAngle + halfAngleDistanceDelta, true);
            return pathFn.toString();
        }
    }, [curved, innerRadius, xScale, yScale]);
    const renderBar = useCallback((color) => {
        const fill = getFill(color);
        // Track previous props
        const prev = previousEnter.current
            ? Object.assign({}, previousEnter.current) : undefined;
        previousEnter.current = Object.assign({}, data);
        const [yStart, yEnd] = yScale.domain();
        const exit = Object.assign(Object.assign({}, data), { y: yStart });
        const guidePath = getArc(Object.assign(Object.assign({}, data), { y: yEnd }));
        return (jsxs(Fragment, { children: [guide && (jsx(CloneElement, { element: guide, active: active, path: guidePath }, void 0)),
                jsx(MotionBar, { arc: getArc, custom: {
                        enter: data,
                        exit,
                        previousEnter: prev
                    }, transition: transition, fill: fill, className: className, onMouseEnter: (event) => onMouseEnter({
                        value: data,
                        nativeEvent: event
                    }), onMouseLeave: (event) => onMouseLeave({
                        value: data,
                        nativeEvent: event
                    }), onClick: (event) => onClick({
                        value: data,
                        nativeEvent: event
                    }) }, void 0)] }, void 0));
    }, [
        active,
        className,
        data,
        getArc,
        getFill,
        guide,
        onClick,
        onMouseEnter,
        onMouseLeave,
        transition,
        yScale
    ]);
    return (jsxs(Fragment, { children: [renderBar(currentColorShade), gradient && jsx(Gradient, { id: `${id}-gradient`, color: currentColorShade }, void 0)] }, void 0));
};
RadialBar.defaultProps = {
    gradient: true,
    curved: false,
    guide: jsx(RadialGuideBar, {}, void 0),
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
};

const RadialBarSeries = ({ data, id, innerRadius, outerRadius, xScale, yScale, height, width, tooltip, colorScheme, bar, animated }) => {
    const [activeValues, setActiveValues] = useState(null);
    const renderBar = useCallback((point, index) => {
        const active = activeValues && data && isEqual(activeValues.x, point.x);
        return (jsx(Fragment, { children: jsx(CloneElement, { element: bar, id: `radialbar-${id}-${index}`, index: index, data: point, xScale: xScale, active: active, yScale: yScale, innerRadius: innerRadius, color: (point) => getColor({ data, point, index: 0, colorScheme }), barCount: data.length, animated: animated }, void 0) }, index));
    }, [
        activeValues,
        animated,
        bar,
        colorScheme,
        data,
        id,
        innerRadius,
        xScale,
        yScale
    ]);
    return (jsx(CloneElement, Object.assign({ element: tooltip, xScale: xScale, yScale: yScale, data: data, height: height, width: width, isRadial: true, innerRadius: innerRadius, outerRadius: outerRadius, onValueEnter: (event) => setActiveValues(event.value), onValueLeave: () => setActiveValues(null), color: (point, index) => getColor({ data, point, index, colorScheme }) }, { children: jsx("g", Object.assign({ clipPath: `url(#${id}-path)` }, { children: data.map(renderBar) }), void 0) }), void 0));
};
RadialBarSeries.defaultProps = {
    colorScheme: schemes.cybertron[0],
    tooltip: jsx(TooltipArea, { tooltip: jsx(ChartTooltip, { followCursor: true }, void 0) }, void 0),
    bar: jsx(RadialBar, {}, void 0),
    animated: true
};

const RadialBarChart = ({ id, width, height, margins, className, containerClassName, data, innerRadius, series, axis }) => {
    const getScales = useCallback((preData, innerRadius, outerRadius) => {
        const newData = buildShallowChartData(preData);
        const xDomain = uniqueBy(newData, (d) => d.x);
        const yDomain = getYDomain({ data: newData, scaled: false });
        const xScale = scaleBand()
            .range([0, 2 * Math.PI])
            .domain(xDomain);
        const yScale = getRadialYScale(innerRadius, outerRadius, yDomain);
        return {
            xScale,
            yScale,
            newData
        };
    }, []);
    const renderChart = useCallback(({ chartWidth, chartHeight, id }) => {
        const outerRadius = Math.min(chartWidth, chartHeight) / 2;
        const { yScale, xScale, newData } = getScales(data, innerRadius, outerRadius);
        return (jsxs(Fragment, { children: [axis && (jsx(CloneElement, { element: axis, xScale: xScale, height: chartHeight, width: chartWidth, innerRadius: innerRadius }, void 0)),
                jsx(CloneElement, { element: series, id: id, data: newData, height: chartHeight, width: chartWidth, xScale: xScale, yScale: yScale, innerRadius: innerRadius, outerRadius: outerRadius }, void 0)] }, void 0));
    }, [axis, data, getScales, innerRadius, series]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, xAxisVisible: false, yAxisVisible: false, center: true, className: className, containerClassName: containerClassName }, { children: renderChart }), void 0));
};
RadialBarChart.defaultProps = {
    innerRadius: 0.1,
    margins: 75,
    axis: jsx(RadialAxis, {}, void 0),
    series: jsx(RadialBarSeries, {}, void 0)
};

const RadialGaugeArc = ({ data, startAngle, endAngle, innerRadius, outerRadius, cornerRadius, padAngle, color, animated, disabled, fill, onClick, onMouseEnter, onMouseLeave, tooltip }) => {
    /**
     * This function will generate the arcs
     * https://github.com/d3/d3-shape#arcs
     */
    const arcGenerator = useMemo(() => {
        return arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(cornerRadius);
    }, [innerRadius, outerRadius, cornerRadius]);
    const arcData = {
        // @ts-ignore Data must be passed
        data: data || {},
        startAngle,
        endAngle,
        padAngle
    };
    return (jsxs("g", { children: [fill && jsx("circle", { fill: fill, r: outerRadius }, void 0),
            jsx(PieArc, { arc: arcGenerator, data: arcData, animated: animated, color: color, disabled: disabled, tooltip: tooltip, onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, void 0)] }, void 0));
};
RadialGaugeArc.defaultProps = {
    cornerRadius: 0,
    padAngle: 0,
    padRadius: 0,
    color: '#353d44',
    animated: true,
    disabled: false,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined,
    tooltip: jsx(ChartTooltip, {}, void 0)
};

var css_248z$3 = ".RadialGaugeLabel-module_valueLabel__1WLmV {\n  font-size: 14px;\n  font-weight: 400;\n  fill: var(--color-on-background);\n  opacity: 0.6;\n}\n";
var css$3 = {"valueLabel":"RadialGaugeLabel-module_valueLabel__1WLmV"};
styleInject(css_248z$3);

const RadialGaugeLabel = ({ data, className, offset, onClick = () => undefined }) => {
    const label = formatValue(data.key);
    return (jsx("text", Object.assign({ x: "0", y: offset, textAnchor: "middle", 
        // This is only valid when placed below the chart
        alignmentBaseline: 'text-after-edge', onClick: (nativeEvent) => onClick({ data, nativeEvent }), className: classNames(className, css$3.valueLabel) }, { children: label }), void 0));
};

var css_248z$2 = ".RadialGaugeValueLabel-module_valueLabel__2IASh {\n  font-size: 18px;\n  font-weight: 400;\n  fill: var(--color-on-background);\n}\n";
var css$2 = {"valueLabel":"RadialGaugeValueLabel-module_valueLabel__2IASh"};
styleInject(css_248z$2);

const RadialGaugeValueLabel = ({ data, className }) => {
    const ref = useCount({
        to: data.data
    });
    return (jsx("text", { dy: "-0.5em", x: "0", y: "15", textAnchor: "middle", className: classNames(className, css$2.valueLabel), ref: ref }, void 0));
};

const RadialGaugeOuterArc = (props) => jsx(RadialGaugeArc, Object.assign({}, props), void 0);
RadialGaugeOuterArc.defaultProps = {
    animated: false,
    disabled: true
};

const RadialGaugeSeries = (_a) => {
    var { data, scale, startAngle, endAngle, arcWidth, outerArc, innerArc, label, valueLabel, colorScheme, padding, minGaugeWidth } = _a, props = __rest(_a, ["data", "scale", "startAngle", "endAngle", "arcWidth", "outerArc", "innerArc", "label", "valueLabel", "colorScheme", "padding", "minGaugeWidth"]);
    const { columns, width, height, xScale, yScale } = useMemo(() => {
        let rows = 1;
        let columns = data.length;
        if (props.width / data.length < minGaugeWidth) {
            while (props.width / columns < minGaugeWidth) {
                rows += 1;
                columns = Math.ceil(data.length / rows);
            }
        }
        const xScale = scaleBand();
        xScale.domain(range(columns));
        xScale.rangeRound([0, props.width], 0.1);
        const yScale = scaleBand();
        yScale.domain(range(rows));
        yScale.rangeRound([0, props.height], 0.1);
        return {
            columns,
            xScale,
            yScale,
            width: xScale.bandwidth(),
            height: yScale.bandwidth()
        };
    }, [data.length, minGaugeWidth, props.height, props.width]);
    const renderGauge = useCallback((point, index) => {
        const dataEndAngle = scale(point.data);
        const outerRadius = min([width - padding * 2, height - padding * 2]) / 2;
        const innerRadius = outerRadius - arcWidth;
        const labelOffset = height / 2;
        const x = xScale(index % columns);
        const y = yScale(Math.floor(index / columns));
        const xOffset = x + width / 2;
        const yOffset = y + height / 2;
        return (jsxs("g", Object.assign({ transform: `translate(${xOffset}, ${yOffset})` }, { children: [outerArc &&
                    cloneElement(outerArc, {
                        outerRadius,
                        innerRadius,
                        startAngle,
                        endAngle
                    }), innerArc &&
                    cloneElement(innerArc, {
                        outerRadius,
                        innerRadius,
                        startAngle,
                        endAngle: dataEndAngle,
                        data: point,
                        color: getColor({
                            data,
                            colorScheme,
                            point,
                            index
                        })
                    }), valueLabel && cloneElement(valueLabel, { data: point }), label && cloneElement(label, { data: point, offset: labelOffset })] }), point.key.toLocaleString()));
    }, [
        arcWidth,
        colorScheme,
        columns,
        data,
        endAngle,
        height,
        innerArc,
        label,
        outerArc,
        padding,
        scale,
        startAngle,
        valueLabel,
        width,
        xScale,
        yScale
    ]);
    return jsx(Fragment, { children: data.map(renderGauge) }, void 0);
};
RadialGaugeSeries.defaultProps = {
    arcWidth: 5,
    outerArc: jsx(RadialGaugeOuterArc, {}, void 0),
    innerArc: jsx(RadialGaugeArc, {}, void 0),
    label: jsx(RadialGaugeLabel, {}, void 0),
    valueLabel: jsx(RadialGaugeValueLabel, {}, void 0),
    colorScheme: ['#00ECB1'],
    padding: 20,
    minGaugeWidth: 50
};

var css_248z$1 = ".StackedRadialGaugeValueLabel-module_stackedValueLabel__1t9Tt {\n  font-size: 18px;\n  font-weight: 400;\n  fill: var(--color-on-background);\n}\n";
var css$1 = {"stackedValueLabel":"StackedRadialGaugeValueLabel-module_stackedValueLabel__1t9Tt"};
styleInject(css_248z$1);

const StackedRadialGaugeValueLabel = ({ label, className, yOffset }) => (jsx(Fragment$1, { children: label && (jsx("text", Object.assign({ x: "0", y: yOffset, textAnchor: "middle", alignmentBaseline: "middle", className: classNames(className, css$1.stackedValueLabel) }, { children: label }), void 0)) }, void 0));
StackedRadialGaugeValueLabel.defaultProps = {
    yOffset: 0
};

const StackedRadialGaugeSeries = ({ data, width, height, scale, startAngle, endAngle, outerArc, innerArc, label, colorScheme, fillFactor, arcPadding }) => {
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * (1 - Math.min(fillFactor, 1));
    const rAxis = scaleBand()
        .domain(range(data.length))
        .range([innerRadius, radius])
        .paddingInner(arcPadding);
    const renderStackedGauges = useCallback((point, index) => {
        const dataEndAngle = scale(point.data);
        const outerRadius = rAxis(index);
        const innerRadius = outerRadius - rAxis.bandwidth();
        return (jsxs("g", { children: [outerArc &&
                    cloneElement(outerArc, {
                        outerRadius,
                        innerRadius,
                        startAngle,
                        endAngle
                    }), innerArc &&
                    cloneElement(innerArc, {
                        outerRadius,
                        innerRadius,
                        startAngle,
                        endAngle: dataEndAngle,
                        data: point,
                        color: getColor({
                            data,
                            colorScheme,
                            point,
                            index
                        })
                    })] }, point.key.toLocaleString()));
    }, [rAxis, colorScheme, data, endAngle, innerArc, outerArc, scale, startAngle]);
    return (jsx(Fragment$1, { children: jsxs("g", Object.assign({ transform: `translate(${width / 2}, ${height / 2})` }, { children: [data.map(renderStackedGauges), label] }), void 0) }, void 0));
};
StackedRadialGaugeSeries.defaultProps = {
    outerArc: jsx(RadialGaugeArc, { disabled: true, animated: false }, void 0),
    innerArc: jsx(RadialGaugeArc, { animated: true }, void 0),
    label: jsx(StackedRadialGaugeValueLabel, {}, void 0),
    colorScheme: ['#00ECB1'],
    fillFactor: 0.2,
    arcPadding: 0.15
};

const RadialGauge = ({ id, width, height, margins, className, data, minValue, maxValue, startAngle, endAngle, series, containerClassName }) => {
    const scale = scaleLinear()
        .domain([minValue, maxValue])
        .range([startAngle, endAngle]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, xAxisVisible: false, yAxisVisible: false, className: className, containerClassName: containerClassName }, { children: (props) => cloneElement(series, {
            scale,
            data,
            startAngle,
            endAngle,
            width: props.width,
            height: props.height
        }) }), void 0));
};
RadialGauge.defaultProps = {
    minValue: 0,
    maxValue: 100,
    startAngle: 0,
    endAngle: Math.PI * 2,
    series: jsx(RadialGaugeSeries, {}, void 0)
};

var css_248z = ".HeatmapCell-module_cell__2iO3O {\n  transition: stroke 150ms ease-in-out;\n}\n";
var css = {"cell":"HeatmapCell-module_cell__2iO3O"};
styleInject(css_248z);

// Set padding modifier for the tooltips
const modifiers = {
    offset: {
        offset: '0, 3px'
    }
};
const HeatmapCell = (_a) => {
    var { rx, ry, cursor, tooltip, onClick, onMouseEnter, onMouseLeave, data, animated, cellIndex, cellCount, fill, x, y, style, className } = _a, rest = __rest(_a, ["rx", "ry", "cursor", "tooltip", "onClick", "onMouseEnter", "onMouseLeave", "data", "animated", "cellIndex", "cellCount", "fill", "x", "y", "style", "className"]);
    const [active, setActive] = useState(false);
    const rect = useRef(null);
    const onMouseEnterWrapper = (event) => {
        setActive(true);
        onMouseEnter({
            value: data,
            nativeEvent: event
        });
    };
    const onMouseLeaveWrapper = (event) => {
        setActive(false);
        onMouseLeave({
            value: data,
            nativeEvent: event
        });
    };
    const onMouseClick = (event) => {
        onClick({
            value: data,
            nativeEvent: event
        });
    };
    const tooltipData = useMemo(() => ({
        y: data.value,
        x: `${data.key} ∙ ${data.x}`,
        data
    }), [data]);
    const transition = useMemo(() => {
        if (animated) {
            return Object.assign(Object.assign({}, DEFAULT_TRANSITION), { delay: (cellIndex / cellCount) * 0.005 });
        }
        else {
            return {
                type: false,
                delay: 0
            };
        }
    }, [animated, cellIndex, cellCount]);
    const extras = constructFunctionProps({ style, className }, data);
    const isTransparent = fill === 'transparent';
    const stroke = active && !isTransparent ? chroma(fill).brighten(1) : fill;
    return (jsxs(Fragment, { children: [jsx("g", Object.assign({ ref: rect }, { children: jsx(motion.rect, Object.assign({}, rest, { fill: fill, stroke: stroke, x: x, y: y, style: Object.assign(Object.assign({}, extras.style), { cursor }), className: classNames(css.cell, extras.className), initial: {
                        opacity: 0
                    }, animate: {
                        opacity: 1
                    }, exit: {
                        opacity: 0
                    }, transition: transition, onMouseEnter: onMouseEnterWrapper, onMouseLeave: onMouseLeaveWrapper, onClick: onMouseClick }), void 0) }), void 0),
            tooltip && !tooltip.props.disabled && !isTransparent && (jsx(CloneElement, { element: tooltip, visible: active, modifiers: tooltip.props.modifiers || modifiers, reference: rect, value: tooltipData }, void 0))] }, void 0));
};
HeatmapCell.defaultProps = {
    rx: 2,
    ry: 2,
    cursor: 'auto',
    tooltip: jsx(ChartTooltip, {}, void 0),
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
};

const getValueScale = (data, colorScheme, emptyColor) => {
    const valueDomain = extent$1(uniqueBy(data, (d) => d.data, (d) => d.value));
    return (point) => {
        // For 0 values, lets show a placeholder fill
        if (point === undefined || point === null) {
            return emptyColor;
        }
        return getColor({
            scale: scaleQuantile,
            domain: valueDomain,
            key: point,
            colorScheme
        });
    };
};
const HeatmapSeries = ({ animated, emptyColor, colorScheme, cell: cellElement, xScale, yScale, data, id }) => {
    const valueScale = getValueScale(data, colorScheme, emptyColor);
    const height = yScale.bandwidth();
    const width = xScale.bandwidth();
    const cellCount = sum([...yScale.domain(), ...xScale.domain()]);
    const renderCell = ({ row, cell, rowIndex, cellIndex, width, height, cellCount }) => {
        const x = xScale(row.key);
        const y = yScale(cell.x);
        const fill = valueScale(cell.value);
        return (jsx(CloneElement, { element: cellElement, animated: animated, cellIndex: rowIndex + cellIndex, cellCount: cellCount, x: x, y: y, fill: fill, width: width, height: height, data: cell }, `${id}-${rowIndex}-${cellIndex}`));
    };
    return (jsx(Fragment, { children: data.map((row, rowIndex) => row.data.map((cell, cellIndex) => renderCell({
            height,
            width,
            valueScale,
            cellCount,
            row,
            cell,
            rowIndex,
            cellIndex
        }))) }, void 0));
};
HeatmapSeries.defaultProps = {
    padding: 0.1,
    animated: true,
    emptyColor: 'rgba(200,200,200,0.08)',
    colorScheme: ['rgba(28, 107, 86, 0.5)', '#2da283'],
    cell: jsx(HeatmapCell, {}, void 0),
};

const Heatmap = ({ data, margins, series, yAxis, xAxis, secondaryAxis, id, width, height, className, containerClassName }) => {
    const getScalesData = useCallback((chartHeight, chartWidth) => {
        const nestedData = buildNestedChartData(data);
        const xDomain = xAxis.props.domain || uniqueBy(nestedData, (d) => d.key);
        const xScale = scaleBand()
            .range([0, chartWidth])
            .domain(xDomain)
            .paddingInner(series.props.padding || 0.1);
        const yDomain = yAxis.props.domain ||
            uniqueBy(nestedData, (d) => d.data, (d) => d.x);
        const yScale = scaleBand()
            .domain(yDomain)
            .range([chartHeight, 0])
            .paddingInner(series.props.padding || 0.1);
        return {
            yScale,
            xScale,
            data: nestedData
        };
    }, [data, xAxis, yAxis, series]);
    const renderChart = (containerProps) => {
        const { chartWidth, chartHeight, updateAxes, id } = containerProps;
        const { xScale, yScale, data: scalesData } = getScalesData(chartHeight, chartWidth);
        return (jsxs(Fragment, { children: [jsx(CloneElement, { element: xAxis, height: chartHeight, width: chartWidth, scale: xScale, onDimensionsChange: (event) => updateAxes('horizontal', event) }, void 0),
                jsx(CloneElement, { element: yAxis, height: chartHeight, width: chartWidth, scale: yScale, onDimensionsChange: (event) => updateAxes('vertical', event) }, void 0),
                secondaryAxis &&
                    secondaryAxis.map((axis, i) => (jsx(CloneElement, { element: axis, height: chartHeight, width: chartWidth, onDimensionsChange: (event) => updateAxes('horizontal', event) }, i))),
                jsx(CloneElement, { element: series, id: `heat-series-${id}`, data: scalesData, xScale: xScale, yScale: yScale }, void 0)] }, void 0));
    };
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, containerClassName: containerClassName, xAxisVisible: isAxisVisible(xAxis.props), yAxisVisible: isAxisVisible(yAxis.props), className: className }, { children: renderChart }), void 0));
};
Heatmap.defaultProps = {
    data: [],
    margins: 10,
    series: jsx(HeatmapSeries, { padding: 0.1 }, void 0),
    yAxis: (jsx(LinearYAxis, { type: "category", axisLine: null, tickSeries: jsx(LinearYAxisTickSeries, { line: null, label: jsx(LinearYAxisTickLabel, { padding: 5 }, void 0) }, void 0) }, void 0)),
    xAxis: (jsx(LinearXAxis, { type: "category", axisLine: null, tickSeries: jsx(LinearXAxisTickSeries, { line: null, label: jsx(LinearXAxisTickLabel, { padding: 5 }, void 0) }, void 0) }, void 0))
};

const getFirstOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addWeeksToDate = (date, weeks) => {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + weeks * 7);
    return d;
};
const getStartOfDay = (date) => {
    const d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    return d;
};
const getNewDayFromDay = (date, num) => {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + num);
    return d;
};
const weekDays = (() => {
    const base = new Date(Date.UTC(2017, 0, 2));
    return range(7).map(() => {
        const name = base.toLocaleDateString('default', { weekday: 'short' });
        base.setDate(base.getDate() + 1);
        return name;
    });
})();
const buildDataScales = (rawData, view) => {
    var _a;
    // Get the most recent date to get the range from
    // From the end date, lets find the start year/month of that
    // From that start year/month, lets find the end year/month for our bounds
    const startDate = min(rawData, (d) => d.key);
    const start = getFirstOfMonth(startDate);
    const endDomain = view === 'year' ? 53 : 5;
    const end = addWeeksToDate(start, endDomain);
    // Base on the view type, swap out some ranges
    const xDomainRange = view === 'year' ? 53 : 5;
    // Build our x/y domains for days of week + number of weeks in year
    const yDomain = range(7).reverse();
    const xDomain = range(xDomainRange);
    // Filter out dates that are not in the start/end ranges
    // and turn them into something our chart can read
    const dates = rawData
        .filter((d) => d.key.getTime() > start.getTime() ||
        d.key.getTime() < end.getTime())
        .map((d) => ({
        key: getStartOfDay(d.key),
        data: d.data
    }));
    // Find the first day of the duration and subtract the delta
    const firstDayOfStart = start.getDay();
    const curDate = getNewDayFromDay(start, -firstDayOfStart);
    const rows = [];
    // Build out the dataset for the n duration
    for (let week = 0; week < xDomainRange; week++) {
        const row = {
            key: week,
            data: []
        };
        for (let day = 0; day <= 6; day++) {
            const dayValue = dates.find((d) => d.key.getTime() === curDate.getTime());
            row.data.push({
                key: day,
                data: (_a = dayValue === null || dayValue === void 0 ? void 0 : dayValue.data) !== null && _a !== void 0 ? _a : undefined,
                metadata: {
                    date: new Date(curDate.getTime()),
                    start: start,
                    end: end
                }
            });
            curDate.setDate(curDate.getDate() + 1);
        }
        rows.push(row);
    }
    return {
        data: rows,
        yDomain,
        xDomain,
        start
    };
};

// Format the xAxis label for the start + n week
const xAxisLabelFormat = (start) => (weeks) => addWeeksToDate(start, weeks).toLocaleString('default', { month: 'long' });
const CalendarHeatmap = (_a) => {
    var { view, series, data } = _a, rest = __rest(_a, ["view", "series", "data"]);
    const { data: domainData, yDomain, xDomain, start } = useMemo(() => buildDataScales(data, view), [data, view]);
    // For month, only pass 1 tick value
    const xTickValues = view === 'year' ? undefined : [1];
    // Get the yAxis label formatting based on view type
    const yAxisLabelFormat = view === 'year' ? (d) => weekDays[d] : () => null;
    return (jsx(Heatmap, Object.assign({}, rest, { data: domainData, yAxis: jsx(LinearYAxis, { type: "category", axisLine: null, domain: yDomain, tickSeries: jsx(LinearYAxisTickSeries, { tickSize: 20, line: null, label: jsx(LinearYAxisTickLabel, { padding: 5, format: yAxisLabelFormat }, void 0) }, void 0) }, void 0), xAxis: jsx(LinearXAxis, { type: "category", axisLine: null, domain: xDomain, tickSeries: jsx(LinearXAxisTickSeries, { line: null, tickValues: xTickValues, label: jsx(LinearXAxisTickLabel, { padding: 5, align: "end", format: xAxisLabelFormat(start) }, void 0) }, void 0) }, void 0) }), void 0));
};
CalendarHeatmap.defaultProps = {
    view: 'year',
    series: (jsx(HeatmapSeries, { padding: 0.3, emptyColor: "transparent", cell: jsx(HeatmapCell, { tooltip: jsx(ChartTooltip, { content: (d) => `${formatValue(d.data.metadata.date)} ∙ ${formatValue(d.data.value)}` }, void 0) }, void 0) }, void 0))
};

const LinearGaugeBar = (props) => (jsx(Bar, Object.assign({}, props), void 0));
LinearGaugeBar.defaultProps = {
    tooltip: (jsx(ChartTooltip, { placement: "top", content: (data) => (jsx(TooltipTemplate, { value: { y: data.value, x: data.y } }, void 0)) }, void 0))
};

const LinearGaugeOuterBar = (_a) => {
    var { height, width, fill } = _a, rest = __rest(_a, ["height", "width", "fill"]);
    return (jsx("rect", Object.assign({}, rest, { fill: fill, width: Math.max(width, 0), height: Math.max(height, 0) }), void 0));
};
LinearGaugeOuterBar.defaultProps = {
    fill: '#484848'
};

const LinearGaugeSeries = (_a) => {
    var { height, width, bar, outerBar, isMultiSeries } = _a, rest = __rest(_a, ["height", "width", "bar", "outerBar", "isMultiSeries"]);
    return (jsxs(Fragment, { children: [!isMultiSeries && outerBar && (jsx(CloneElement, { element: outerBar, height: height, width: width }, void 0)),
            jsx(BarSeries, Object.assign({}, rest, { layout: "horizontal", tooltip: null, bar: jsx(CloneElement, { element: bar }, void 0) }), void 0)] }, void 0));
};
LinearGaugeSeries.defaultProps = {
    outerBar: jsx(LinearGaugeOuterBar, {}, void 0),
    bar: jsx(LinearGaugeBar, {}, void 0)
};

const LinearGauge = ({ id, width, height, margins, className, containerClassName, series, data, minValue, maxValue }) => {
    const transformedData = useMemo(() => {
        if (Array.isArray(data)) {
            return buildBarStackData([
                {
                    key: 'default',
                    data
                }
            ], 'expand', 'horizontal');
        }
        else {
            return buildShallowChartData([data], 'horizontal');
        }
    }, [data]);
    const getScales = useCallback((isMultiSeries, data, width, height, minValue, maxValue) => {
        const domain = !isMultiSeries ? [minValue, maxValue] : undefined;
        const keyScale = getXScale({
            width,
            type: 'value',
            data,
            domain,
            isMultiSeries
        });
        const valueScale = getYScale({
            type: 'category',
            height,
            data,
            isMultiSeries
        });
        return {
            keyScale,
            valueScale
        };
    }, []);
    const renderChart = useCallback(({ chartHeight, chartWidth, id, chartSized }) => {
        const isMultiSeries = Array.isArray(data);
        const type = isMultiSeries ? 'stackedNormalized' : 'standard';
        const { keyScale, valueScale } = getScales(isMultiSeries, transformedData, chartWidth, chartHeight, minValue, maxValue);
        return (jsx(Fragment, { children: chartSized && (jsx(CloneElement, { element: series, id: `linear-gauge-series-${id}`, data: transformedData, isCategorical: true, xScale: keyScale, yScale: valueScale, type: type, height: chartHeight, width: chartWidth, isMultiSeries: isMultiSeries }, void 0)) }, void 0));
    }, [data, getScales, maxValue, minValue, series, transformedData]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, className: className, containerClassName: containerClassName }, { children: renderChart }), void 0));
};
LinearGauge.defaultProps = {
    minValue: 0,
    maxValue: 100,
    series: jsx(LinearGaugeSeries, {}, void 0)
};

const useInterpolate = ({ data, animated }) => {
    const transition = animated
        ? Object.assign({}, DEFAULT_TRANSITION) : {
        delay: 0,
        type: false
    };
    const d = useMotionValue(data.path);
    const prevPath = useMotionValue(data.path);
    const spring = useSpring(prevPath, {
        from: 0,
        to: 1
    });
    useEffect(() => {
        const interpolator = interpolate$1(prevPath.get(), data.path);
        spring.onChange((v) => d.set(interpolator(v)));
        prevPath.set(data.path);
    });
    return { transition, d };
};

const VennArc = ({ data, fill, disabled, animated, stroke, mask, id, style, active, inactiveStyle, activeStyle, initialStyle, strokeWidth, gradient, tooltip, onClick, onMouseEnter, onMouseLeave }) => {
    var _a, _b;
    const [internalActive, setInternalActive] = useState(false);
    const arcRef = useRef(null);
    const { transition, d } = useInterpolate({ animated, data });
    const currentStyle = active
        ? activeStyle
        : active === null
            ? inactiveStyle
            : initialStyle;
    const arcFill = gradient && !mask
        ? `url(#gradient-${id})`
        : mask
            ? `url(#mask-pattern-${id})`
            : fill;
    return (jsxs("g", Object.assign({ title: data.data.key, onMouseEnter: (event) => {
            if (!disabled) {
                setInternalActive(true);
                onMouseEnter({
                    value: data.data,
                    nativeEvent: event
                });
            }
        }, onMouseLeave: (event) => {
            if (!disabled) {
                setInternalActive(false);
                onMouseLeave({
                    value: data.data,
                    nativeEvent: event
                });
            }
        }, onClick: (event) => {
            if (!disabled) {
                onClick({
                    value: data.data,
                    nativeEvent: event
                });
            }
        } }, { children: [jsx(motion.path, { ref: arcRef, fill: arcFill, id: `${id}-arc`, strokeWidth: strokeWidth, stroke: stroke, transition: transition, d: d, initial: initialStyle, animate: currentStyle, style: style }, void 0),
            mask && (jsxs(Fragment, { children: [jsx(Mask, { id: `mask-${id}`, fill: `url(#gradient-${id})` }, void 0),
                    jsx(CloneElement, { element: mask, id: `mask-pattern-${id}`, fill: fill }, void 0)] }, void 0)),
            gradient && (jsx(CloneElement, { element: gradient, id: `gradient-${id}`, color: fill }, void 0)),
            tooltip && !tooltip.props.disabled && (jsx(CloneElement, { element: tooltip, visible: !!internalActive, reference: arcRef, value: { y: data.data.size, x: (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.sets) === null || _b === void 0 ? void 0 : _b.join(' | ') } }, void 0))] }), void 0));
};
VennArc.defaultProps = {
    active: false,
    inactiveStyle: { opacity: 0.3 },
    activeStyle: { opacity: 0.8 },
    initialStyle: { opacity: 0.6 },
    strokeWidth: 3,
    gradient: jsx(Gradient, {}, void 0),
    tooltip: jsx(ChartTooltip, {}, void 0),
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
};

const VennLabel = ({ data, format, id, active, labelType, showAll, wrap, animated, fill, fontSize, fontFamily }) => {
    var _a, _b, _c, _d, _e;
    // If the text area is very large, then lets just skip showing the label
    if (!showAll && !((_a = data.arcs) === null || _a === void 0 ? void 0 : _a.filter((a) => a.large).length)) {
        return null;
    }
    const key = labelType === 'key' ? (_c = (_b = data.data) === null || _b === void 0 ? void 0 : _b.sets) === null || _c === void 0 ? void 0 : _c.join(' | ') : data.data.size;
    const transition = animated ? DEFAULT_TRANSITION : { delay: 0, type: false };
    const text = wrap
        ? wrapText({
            key,
            x: data.text.x,
            fontFamily,
            fontSize,
            width: (_e = (_d = data === null || data === void 0 ? void 0 : data.circles) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.radius
        })
        : key;
    return (jsx(motion.text, Object.assign({ id: `${id}-text`, style: { pointerEvents: 'none', fontFamily, fontSize }, fill: fill, initial: {
            attrX: data.text.x,
            attrY: data.text.y,
            opacity: 1
        }, animate: {
            attrX: data.text.x,
            attrY: data.text.y,
            opacity: active === null ? 0.3 : 1
        }, transition: transition, textAnchor: "middle" }, { children: format ? format(data) : text }), void 0));
};
VennLabel.defaultProps = {
    labelType: 'key',
    showAll: false,
    wrap: true,
    animated: true,
    fill: '#000',
    fontSize: 11,
    fontFamily: 'sans-serif'
};

const VennOuterLabel = ({ data, format, animated, fill, fontSize, fontFamily }) => {
    const transition = animated ? DEFAULT_TRANSITION : { delay: 0, type: false };
    const text = data.set.data.key;
    const label = format ? format(data) : text;
    const isElement = isValidElement(label);
    const showIcon = isElement && data.set.icon;
    // TODO: framer-motion doesn't seem to like the translates on the g
    // initial={pos} animate={pos}
    const pos = {
        x: showIcon ? data.set.icon.x : data.set.text.x,
        y: showIcon ? data.set.icon.y : data.set.text.y
    };
    return (jsx(Fragment, { children: isElement ? (jsx("g", Object.assign({ style: { transform: `translate(${pos.x}px, ${pos.y}px)` } }, { children: label }), void 0)) : (jsx(motion.text, Object.assign({ fill: fill, style: { pointerEvents: 'none', fontFamily, fontSize }, textAnchor: data.set.align === 'middle' ? 'center' : data.set.align, alignmentBaseline: data.set.verticalAlign, initial: {
                attrX: pos.x,
                attrY: pos.y
            }, animate: {
                attrX: pos.x,
                attrY: pos.y
            }, transition: transition }, { children: label }), void 0)) }, void 0));
};
VennOuterLabel.defaultProps = {
    animated: true,
    fill: '#000',
    fontSize: 14,
    fontFamily: 'sans-serif'
};

const getSafeKey = (d) => { var _a, _b; return (_b = (_a = d.data) === null || _a === void 0 ? void 0 : _a.key) === null || _b === void 0 ? void 0 : _b.replace(' ', ''); };
const VennSeries = ({ data, id, selections, animated, disabled, colorScheme, outerLabel, arc, label }) => {
    const transition = animated ? DEFAULT_TRANSITION : { type: false, delay: 0 };
    const [actives, setActives] = useState([]);
    const [hovered, setHovered] = useState(null);
    const onActivate = useCallback((point) => {
        setHovered(point);
        setActives(data
            .filter((d) => { var _a; return ((_a = d.data) === null || _a === void 0 ? void 0 : _a.key.indexOf(point)) > -1; })
            .map((d) => { var _a; return (_a = d.data) === null || _a === void 0 ? void 0 : _a.key; }));
    }, [data]);
    const renderArc = useCallback((d, index) => {
        var _a;
        // Get the colors of the fill
        const fill = getColor({
            data,
            colorScheme,
            point: d.data,
            index
        });
        const textFill = fill
            ? invert(chroma(fill).darken(0.5).hex(), true)
            : 'white';
        const arcFill = arc.props.fill || fill;
        const key = (_a = d === null || d === void 0 ? void 0 : d.data) === null || _a === void 0 ? void 0 : _a.key;
        const safeKey = getSafeKey(d);
        const isSelected = selections === null || selections === void 0 ? void 0 : selections.includes(key);
        // Get the state of the arc
        const isHovered = hovered === key || isSelected;
        const isActive = isSelected ||
            actives.includes(key) ||
            (actives.length > 0 ? null : false);
        // Get the colors for the stroke
        const stroke = typeof arc.props.stroke === 'function'
            ? // @ts-ignore
                arc.props.stroke(data, index, isActive, isHovered)
            : arc.props.stroke;
        const arcStroke = stroke ||
            chroma(arcFill)
                .darken(isActive ? 0.8 : 0.5)
                .hex();
        return (jsxs(Fragment, { children: [jsx(CloneElement, { element: arc, id: `${id}-${safeKey}`, data: d, fill: arcFill, stroke: arcStroke, disabled: disabled, animated: animated, active: isActive, onMouseEnter: () => onActivate(key), onMouseLeave: () => {
                        setActives([]);
                        setHovered(null);
                    } }, void 0),
                jsx(CloneElement, { element: label, data: d, id: `${id}-${safeKey}`, active: isActive, animated: animated, fill: textFill }, void 0),
                d.set && outerLabel && (jsx(CloneElement, { element: outerLabel, data: d, animated: animated }, void 0))] }, safeKey));
    }, [
        colorScheme,
        data,
        arc,
        animated,
        label,
        outerLabel,
        hovered,
        selections,
        actives,
        onActivate
    ]);
    const topArcs = useMemo(() => {
        const result = [];
        if (actives.length > 0) {
            result.push(...actives.filter((s) => s !== hovered));
        }
        if (selections === null || selections === void 0 ? void 0 : selections.length) {
            result.push(...selections.filter((s) => !actives.includes(s) && s !== hovered));
        }
        if (hovered) {
            result.push(hovered);
        }
        return result;
    }, [hovered, actives, selections]);
    return (jsxs(motion.g, Object.assign({ initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, transition: transition }, { children: [data.map(renderArc), topArcs.length > 0 &&
                topArcs.map((a) => (jsx("use", { xlinkHref: `#${id}-${a}-arc`, style: { pointerEvents: 'none' } }, a))),
            data.map((d, index) => (jsx("use", { xlinkHref: `#${id}-${getSafeKey(d)}-text`, style: { pointerEvents: 'none' } }, index)))] }), void 0));
};
VennSeries.defaultProps = {
    animated: true,
    disabled: false,
    colorScheme: 'cybertron',
    outerLabel: jsx(VennOuterLabel, {}, void 0),
    arc: jsx(VennArc, {}, void 0),
    label: jsx(VennLabel, {}, void 0)
};

var sets$5 = [
];
var intersections$5 = [
];
var bb$5 = {
	x: 0,
	y: 0,
	width: 10,
	height: 10
};
var venn0 = {
	sets: sets$5,
	intersections: intersections$5,
	bb: bb$5
};

var sets$4 = [
	{
		cx: 0,
		cy: 0,
		r: 5,
		text: {
			x: 3.5,
			y: -4
		},
		align: "start",
		verticalAlign: "bottom"
	}
];
var intersections$4 = [
	{
		sets: [
			0
		],
		x1: 0,
		y1: 5,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: -5,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: 5,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb$4 = {
	x: -5,
	y: -5,
	width: 10,
	height: 10
};
var venn1 = {
	sets: sets$4,
	intersections: intersections$4,
	bb: bb$4
};

var sets$3 = [
	{
		cx: -4,
		cy: 0,
		r: 5,
		text: {
			x: -7.5,
			y: 4
		},
		align: "end",
		verticalAlign: "top"
	},
	{
		cx: 4,
		cy: 0,
		r: 5,
		text: {
			x: 7.5,
			y: -4
		},
		align: "start",
		verticalAlign: "bottom"
	}
];
var intersections$3 = [
	{
		sets: [
			0
		],
		x1: 0,
		y1: -3,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: 3,
				sweep: false,
				large: true
			},
			{
				mode: "o",
				ref: 1,
				x2: 0,
				y2: -3,
				sweep: true,
				large: false
			}
		],
		text: {
			x: -4,
			y: 0
		}
	},
	{
		sets: [
			1
		],
		x1: 0,
		y1: 3,
		arcs: [
			{
				mode: "i",
				ref: 1,
				x2: 0,
				y2: -3,
				sweep: false,
				large: true
			},
			{
				mode: "o",
				ref: 0,
				x2: 0,
				y2: 3,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 4,
			y: 0
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 0,
		y1: 3,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: -3,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: 0,
				y2: 3,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb$3 = {
	x: -9,
	y: -5,
	width: 18,
	height: 10
};
var venn2 = {
	sets: sets$3,
	intersections: intersections$3,
	bb: bb$3
};

var sets$2 = [
	{
		cx: -3.464,
		cy: -2,
		r: 5,
		text: {
			x: -7,
			y: -6
		},
		align: "end"
	},
	{
		cx: 3.464,
		cy: -2,
		r: 5,
		text: {
			x: 7,
			y: -6
		},
		align: "start"
	},
	{
		cx: 0,
		cy: 4,
		r: 5,
		text: {
			x: 4,
			y: 7.5
		},
		align: "start",
		verticalAlign: "top"
	}
];
var intersections$2 = [
	{
		sets: [
			0
		],
		x1: -4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "o",
				ref: 2,
				x2: -1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "o",
				ref: 1,
				x2: 0,
				y2: -5.606,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: -4.855,
				y2: 2.803,
				sweep: false,
				large: true
			}
		],
		text: {
			x: -4.216,
			y: -2.434
		}
	},
	{
		sets: [
			1
		],
		x1: 0,
		y1: -5.606,
		arcs: [
			{
				mode: "o",
				ref: 0,
				x2: 1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "o",
				ref: 2,
				x2: 4.855,
				y2: 2.803,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: 0,
				y2: -5.606,
				sweep: false,
				large: true
			}
		],
		text: {
			x: 4.216,
			y: -2.434
		}
	},
	{
		sets: [
			2
		],
		x1: -4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "o",
				ref: 0,
				x2: 0,
				y2: 1.606,
				sweep: false,
				large: false
			},
			{
				mode: "o",
				ref: 1,
				x2: 4.855,
				y2: 2.803,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 2,
				x2: -4.855,
				y2: 2.803,
				sweep: true,
				large: true
			}
		],
		text: {
			x: 0,
			y: 4.869
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 0,
		y1: -5.606,
		arcs: [
			{
				mode: "i",
				ref: 1,
				x2: -1.39,
				y2: -0.803,
				sweep: false,
				large: false
			},
			{
				mode: "o",
				ref: 2,
				x2: 1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: -5.606,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 0,
			y: -2.404
		}
	},
	{
		sets: [
			0,
			2
		],
		x1: -4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "i",
				ref: 2,
				x2: -1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "o",
				ref: 1,
				x2: 0,
				y2: 1.606,
				sweep: false,
				large: false
			},
			{
				mode: "i",
				ref: 0,
				x2: -4.855,
				y2: 2.803,
				sweep: true,
				large: false
			}
		],
		text: {
			x: -2.082,
			y: 1.202
		}
	},
	{
		sets: [
			1,
			2
		],
		x1: 4.855,
		y1: 2.803,
		arcs: [
			{
				mode: "i",
				ref: 2,
				x2: 1.39,
				y2: -0.803,
				sweep: false,
				large: false
			},
			{
				mode: "o",
				ref: 0,
				x2: 0,
				y2: 1.606,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: 4.855,
				y2: 2.803,
				sweep: false,
				large: false
			}
		],
		text: {
			x: 2.082,
			y: 1.202
		}
	},
	{
		sets: [
			0,
			1,
			2
		],
		x1: 1.39,
		y1: -0.803,
		arcs: [
			{
				mode: "i",
				ref: 0,
				x2: 0,
				y2: 1.606,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 1,
				x2: -1.39,
				y2: -0.803,
				sweep: true,
				large: false
			},
			{
				mode: "i",
				ref: 2,
				x2: 1.39,
				y2: -0.803,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb$2 = {
	x: -8.464,
	y: -7,
	width: 16.928,
	height: 16
};
var venn3 = {
	sets: sets$2,
	intersections: intersections$2,
	bb: bb$2
};

var sets$1 = [
	{
		cx: 0.439,
		cy: -1.061,
		rx: 2.5,
		ry: 5,
		rotation: 45,
		text: {
			x: 4.5,
			y: -4.5
		},
		align: "start",
		verticalAlign: "bottom"
	},
	{
		cx: 2.561,
		cy: 1.061,
		rx: 2.5,
		ry: 5,
		rotation: 45,
		text: {
			x: 4,
			y: 3.75
		},
		align: "start",
		verticalAlign: "top"
	},
	{
		cx: -2.561,
		cy: 1.061,
		rx: 2.5,
		ry: 5,
		rotation: -45,
		text: {
			x: -4,
			y: 3.7
		},
		align: "end",
		verticalAlign: "top"
	},
	{
		cx: -0.439,
		cy: -1.061,
		rx: 2.5,
		ry: 5,
		rotation: -45,
		text: {
			x: -4.5,
			y: -4.5
		},
		align: "end",
		verticalAlign: "bottom"
	}
];
var intersections$1 = [
	{
		sets: [
			0
		],
		x1: 0,
		y1: -3.94,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: 4.328,
				y2: -2.828,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 2.179,
				y2: -1.858,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0,
				y2: -3.94,
				large: false
			}
		],
		text: {
			x: 2.914,
			y: -3.536
		}
	},
	{
		sets: [
			1
		],
		x1: 4.328,
		y1: -2.828,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 0,
				y2: 5.006,
				sweep: true,
				large: true
			},
			{
				ref: 2,
				mode: "o",
				x2: 1.328,
				y2: 2.828
			},
			{
				ref: 3,
				mode: "o",
				x2: 3.108,
				y2: -0.328
			},
			{
				ref: 0,
				mode: "o",
				x2: 4.328,
				y2: -2.828
			}
		],
		text: {
			x: 5.036,
			y: -1.414
		}
	},
	{
		sets: [
			2
		],
		x1: 0,
		y1: 5.006,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -4.328,
				y2: -2.828,
				sweep: true,
				large: true
			},
			{
				ref: 3,
				mode: "o",
				x2: -3.108,
				y2: -0.328
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.328,
				y2: 2.828
			},
			{
				ref: 1,
				mode: "o",
				x2: 0,
				y2: 5.006
			}
		],
		text: {
			x: -5.036,
			y: -1.414
		}
	},
	{
		sets: [
			3
		],
		x1: -4.328,
		y1: -2.828,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 0,
				y2: -3.94,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -2.179,
				y2: -1.858,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -4.328,
				y2: -2.828,
				large: false
			}
		],
		text: {
			x: -2.914,
			y: -3.536
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 4.328,
		y1: -2.828,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.179,
				y2: -1.858,
				sweep: false,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 4.328,
				y2: -2.828,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 3.205,
			y: -1.672
		}
	},
	{
		sets: [
			0,
			2
		],
		x1: -1.328,
		y1: 2.828,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.969,
				y2: 1.755,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -1.328,
				y2: 2.828,
				large: false
			}
		],
		text: {
			x: -2.212,
			y: 1.591
		}
	},
	{
		sets: [
			0,
			3
		],
		x1: 0,
		y1: -3.94,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 2.179,
				y2: -1.858,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 0,
				y2: 0.188,
				sweep: false,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -2.179,
				y2: -1.858,
				sweep: false,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 0,
				y2: -3.94,
				sweep: true
			}
		],
		text: {
			x: 0,
			y: -1.87
		}
	},
	{
		sets: [
			1,
			2
		],
		x1: 1.328,
		y1: 2.828,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 0,
				y2: 5.006,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -1.328,
				y2: 2.828,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 0,
				y2: 2.346,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 1.328,
				y2: 2.828
			}
		],
		text: {
			x: 0,
			y: 3.393
		}
	},
	{
		sets: [
			1,
			3
		],
		x1: 3.108,
		y1: -0.328,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 1.328,
				y2: 2.828,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 0.969,
				y2: 1.755,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 3.108,
				y2: -0.328,
				large: false
			}
		],
		text: {
			x: 2.212,
			y: 1.591
		}
	},
	{
		sets: [
			2,
			3
		],
		x1: -3.108,
		y1: -0.328,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -4.328,
				y2: -2.828,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -2.179,
				y2: -1.858,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -3.108,
				y2: -0.328,
				large: false
			}
		],
		text: {
			x: -3.205,
			y: -1.672
		}
	},
	{
		sets: [
			0,
			1,
			2
		],
		x1: 0,
		y1: 2.346,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -1.328,
				y2: 2.828,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0,
				y2: 2.346,
				large: false
			}
		],
		text: {
			x: -0.766,
			y: 2.31
		}
	},
	{
		sets: [
			0,
			1,
			3
		],
		x1: 2.179,
		y1: -1.858,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 0,
				y2: 0.188,
				sweep: false,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 2.179,
				y2: -1.858,
				sweep: true
			}
		],
		text: {
			x: 1.558,
			y: -0.056
		}
	},
	{
		sets: [
			0,
			2,
			3
		],
		x1: -0.969,
		y1: 1.755,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -3.108,
				y2: -0.328,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -2.179,
				y2: -1.858,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: 0,
				y2: 0.188,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -0.969,
				y2: 1.755
			}
		],
		text: {
			x: -1.558,
			y: -0.056
		}
	},
	{
		sets: [
			1,
			2,
			3
		],
		x1: 1.328,
		y1: 2.828,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 0,
				y2: 2.346,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 0.969,
				y2: 1.755,
				sweep: false,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: 1.328,
				y2: 2.828,
				sweep: true,
				large: false
			}
		],
		text: {
			x: 0.766,
			y: 2.31
		}
	},
	{
		sets: [
			0,
			1,
			2,
			3
		],
		x1: 0,
		y1: 0.188,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 0,
				y2: 2.346,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -0.969,
				y2: 1.755,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 0,
				y2: 0.188,
				sweep: true
			}
		],
		text: {
			x: 0,
			y: 1.43
		}
	}
];
var bb$1 = {
	x: -6.5,
	y: -5,
	width: 13,
	height: 10
};
var venn4 = {
	sets: sets$1,
	intersections: intersections$1,
	bb: bb$1
};

var sets = [
	{
		cx: 0.5,
		cy: -1,
		rx: 2.5,
		ry: 5,
		rotation: 0,
		text: {
			x: 2.25,
			y: -5
		},
		icon: {
			x: 0,
			y: -6.3
		},
		align: "start",
		verticalAlign: "bottom"
	},
	{
		cx: 1.106,
		cy: 0.167,
		rx: 2.5,
		ry: 5,
		rotation: 72,
		text: {
			x: 4.5,
			y: 1.5
		},
		icon: {
			x: 6.2,
			y: -1.9
		},
		align: "start",
		verticalAlign: "top"
	},
	{
		cx: 0.183,
		cy: 1.103,
		rx: 2.5,
		ry: 5,
		rotation: 144,
		icon: {
			x: 3.2,
			y: 6
		},
		text: {
			x: 4,
			y: 4
		},
		align: "start",
		verticalAlign: "bottom"
	},
	{
		cx: -0.992,
		cy: 0.515,
		rx: 2.5,
		ry: 5,
		rotation: 216,
		icon: {
			x: -4.4,
			y: 5.2
		},
		text: {
			x: -4.7,
			y: 2
		},
		align: "end",
		verticalAlign: "bottom"
	},
	{
		cx: -0.797,
		cy: -0.785,
		rx: 2.5,
		ry: 5,
		rotation: 288,
		icon: {
			x: -6,
			y: -2
		},
		text: {
			x: -4,
			y: -3.6
		},
		align: "end",
		verticalAlign: "bottom"
	}
];
var intersections = [
	{
		sets: [
			0
		],
		x1: -1.653,
		y1: -3.541,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: 2.857,
				y2: -2.666,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 2.5,
				y2: -2.648,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.495,
				y2: -3.303,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -1.653,
				y2: -3.541
			}
		],
		text: {
			x: 0.5,
			y: -5
		}
	},
	{
		sets: [
			1
		],
		x1: 2.857,
		y1: -2.666,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 3.419,
				y2: 1.893,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 3.291,
				y2: 1.559,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 2.988,
				y2: -1.492,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.857,
				y2: -2.666
			}
		],
		text: {
			x: 4.91,
			y: -1.07
		}
	},
	{
		sets: [
			2
		],
		x1: 3.419,
		y1: 1.893,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -0.744,
				y2: 3.837,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.466,
				y2: 3.612,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.342,
				y2: 2.381,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 3.419,
				y2: 1.893
			}
		],
		text: {
			x: 2.534,
			y: 4.339
		}
	},
	{
		sets: [
			3
		],
		x1: -0.744,
		y1: 3.837,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -3.879,
				y2: 0.478,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -3.579,
				y2: 0.673,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -1.54,
				y2: 2.963,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -0.744,
				y2: 3.837
			}
		],
		text: {
			x: -3.343,
			y: 3.751
		}
	},
	{
		sets: [
			4
		],
		x1: -3.879,
		y1: 0.478,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -1.653,
				y2: -3.541,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.746,
				y2: -3.196,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -3.294,
				y2: -0.549,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -3.879,
				y2: 0.478
			}
		],
		text: {
			x: -4.601,
			y: -2.021
		}
	},
	{
		sets: [
			0,
			1
		],
		x1: 2.5,
		y1: -2.648,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 2.857,
				y2: -2.666,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 2.988,
				y2: -1.492,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 2.572,
				y2: -1.839,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.5,
				y2: -2.648
			}
		],
		text: {
			x: 2.741,
			y: -2.152
		}
	},
	{
		sets: [
			0,
			2
		],
		x1: 2.342,
		y1: 2.381,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -0.466,
				y2: 3.612,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0.257,
				y2: 2.922,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 2.342,
				y2: 2.381,
				large: false
			}
		],
		text: {
			x: 0.5,
			y: 3.5
		}
	},
	{
		sets: [
			0,
			3
		],
		x1: -0.495,
		y1: -3.303,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 2.5,
				y2: -2.648,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 1.51,
				y2: -2.515,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -0.495,
				y2: -3.303,
				large: false
			}
		],
		text: {
			x: 1.653,
			y: -3.125
		}
	},
	{
		sets: [
			0,
			4
		],
		x1: -1.653,
		y1: -3.541,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -0.495,
				y2: -3.303,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -0.954,
				y2: -3.015,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -1.746,
				y2: -3.196,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1.653,
				y2: -3.541
			}
		],
		text: {
			x: -1.199,
			y: -3.272
		}
	},
	{
		sets: [
			1,
			2
		],
		x1: 3.291,
		y1: 1.559,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 3.419,
				y2: 1.893,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 2.342,
				y2: 2.381,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.544,
				y2: 1.878,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 3.291,
				y2: 1.559
			}
		],
		text: {
			x: 2.894,
			y: 1.942
		}
	},
	{
		sets: [
			1,
			3
		],
		x1: -1.54,
		y1: 2.963,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: -3.579,
				y2: 0.673,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -2.7,
				y2: 1.147,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -1.54,
				y2: 2.963,
				large: false
			}
		],
		text: {
			x: -3.174,
			y: 1.557
		}
	},
	{
		sets: [
			1,
			4
		],
		x1: 2.988,
		y1: -1.492,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 3.291,
				y2: 1.559,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 2.858,
				y2: 0.659,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.988,
				y2: -1.492,
				large: false
			}
		],
		text: {
			x: 3.483,
			y: 0.606
		}
	},
	{
		sets: [
			2,
			3
		],
		x1: -0.466,
		y1: 3.612,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -0.744,
				y2: 3.837,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -1.54,
				y2: 2.963,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -1,
				y2: 3,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -0.466,
				y2: 3.612
			}
		],
		text: {
			x: -0.953,
			y: 3.352
		}
	},
	{
		sets: [
			2,
			4
		],
		x1: -3.294,
		y1: -0.549,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -1.746,
				y2: -3.196,
				sweep: true
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.925,
				y2: -2.213
			},
			{
				ref: 3,
				mode: "o",
				x2: -3.294,
				y2: -0.549
			}
		],
		text: {
			x: -2.462,
			y: -2.538
		}
	},
	{
		sets: [
			3,
			4
		],
		x1: -3.579,
		y1: 0.673,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -3.879,
				y2: 0.478,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -3.294,
				y2: -0.549,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -3.162,
				y2: -0.024,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -3.579,
				y2: 0.673
			}
		],
		text: {
			x: -3.483,
			y: 0.13
		}
	},
	{
		sets: [
			0,
			1,
			2
		],
		x1: 2.544,
		y1: 1.878,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: 2.342,
				y2: 2.381,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 0.257,
				y2: 2.922,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 0.983,
				y2: 2.049,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 2.544,
				y2: 1.878
			}
		],
		text: {
			x: 1.457,
			y: 2.331
		}
	},
	{
		sets: [
			0,
			1,
			3
		],
		x1: 1.51,
		y1: -2.515,
		arcs: [
			{
				ref: 1,
				mode: "i",
				x2: 2.5,
				y2: -2.648,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: 2.572,
				y2: -1.839,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 1.51,
				y2: -2.515,
				large: false
			}
		],
		text: {
			x: 2.194,
			y: -2.334
		}
	},
	{
		sets: [
			0,
			1,
			4
		],
		x1: 2.572,
		y1: -1.839,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 2.988,
				y2: -1.492,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 2.858,
				y2: 0.659,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 2.253,
				y2: -0.302,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.572,
				y2: -1.839
			}
		],
		text: {
			x: 2.667,
			y: -0.665
		}
	},
	{
		sets: [
			0,
			2,
			3
		],
		x1: 0.257,
		y1: 2.922,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -0.466,
				y2: 3.612,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1,
				y2: 3,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 0.257,
				y2: 2.922,
				large: false
			}
		],
		text: {
			x: -0.403,
			y: 3.178
		}
	},
	{
		sets: [
			0,
			2,
			4
		],
		x1: -1.746,
		y1: -3.196,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -0.954,
				y2: -3.015,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: -1.925,
				y2: -2.213,
				sweep: false,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1.746,
				y2: -3.196,
				sweep: true,
				large: false
			}
		],
		text: {
			x: -1.542,
			y: -2.808
		}
	},
	{
		sets: [
			0,
			3,
			4
		],
		x1: -0.495,
		y1: -3.303,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 1.51,
				y2: -2.515,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: 0.409,
				y2: -2.236,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -0.954,
				y2: -3.015,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -0.495,
				y2: -3.303
			}
		],
		text: {
			x: 0.192,
			y: -2.742
		}
	},
	{
		sets: [
			1,
			2,
			3
		],
		x1: -1.54,
		y1: 2.963,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: -2.7,
				y2: 1.147,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: -1.645,
				y2: 1.568,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -1,
				y2: 3,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -1.54,
				y2: 2.963
			}
		],
		text: {
			x: -1.767,
			y: 2.106
		}
	},
	{
		sets: [
			1,
			2,
			4
		],
		x1: 2.858,
		y1: 0.659,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 3.291,
				y2: 1.559,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "i",
				x2: 2.544,
				y2: 1.878,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: 2.858,
				y2: 0.659,
				large: false
			}
		],
		text: {
			x: 2.898,
			y: 1.365
		}
	},
	{
		sets: [
			1,
			3,
			4
		],
		x1: -2.7,
		y1: 1.147,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -3.579,
				y2: 0.673,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -3.162,
				y2: -0.024,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: -2.7,
				y2: 1.147,
				large: false
			}
		],
		text: {
			x: -3.147,
			y: 0.599
		}
	},
	{
		sets: [
			2,
			3,
			4
		],
		x1: -3.294,
		y1: -0.549,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: -1.925,
				y2: -2.213,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -2,
				y2: -1.08,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -3.162,
				y2: -0.024,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -3.294,
				y2: -0.549
			}
		],
		text: {
			x: -2.548,
			y: -1.029
		}
	},
	{
		sets: [
			0,
			1,
			2,
			3
		],
		x1: 0.983,
		y1: 2.049,
		arcs: [
			{
				ref: 3,
				mode: "i",
				x2: 0.257,
				y2: 2.922,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -1,
				y2: 3,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -1.645,
				y2: 1.568,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "o",
				x2: 0.983,
				y2: 2.049
			}
		],
		text: {
			x: -0.407,
			y: 2.31
		}
	},
	{
		sets: [
			0,
			1,
			2,
			4
		],
		x1: 2.253,
		y1: -0.302,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 2.858,
				y2: 0.659,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: 2.544,
				y2: 1.878,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "i",
				x2: 0.983,
				y2: 2.049,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "o",
				x2: 2.253,
				y2: -0.302
			}
		],
		text: {
			x: 2.071,
			y: 1.101
		}
	},
	{
		sets: [
			0,
			1,
			3,
			4
		],
		x1: 1.51,
		y1: -2.515,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: 2.572,
				y2: -1.839,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: 2.253,
				y2: -0.302,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "o",
				x2: 0.409,
				y2: -2.236,
				sweep: false,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: 1.51,
				y2: -2.515,
				sweep: true
			}
		],
		text: {
			x: 1.687,
			y: -1.63
		}
	},
	{
		sets: [
			0,
			2,
			3,
			4
		],
		x1: -2,
		y1: -1.08,
		arcs: [
			{
				ref: 0,
				mode: "i",
				x2: -1.925,
				y2: -2.213,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: -0.954,
				y2: -3.015,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: 0.409,
				y2: -2.236,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "o",
				x2: -2,
				y2: -1.08
			}
		],
		text: {
			x: -1.028,
			y: -2.108
		}
	},
	{
		sets: [
			1,
			2,
			3,
			4
		],
		x1: -1.645,
		y1: 1.568,
		arcs: [
			{
				ref: 4,
				mode: "i",
				x2: -2.7,
				y2: 1.147,
				sweep: true,
				large: false
			},
			{
				ref: 2,
				mode: "i",
				x2: -3.162,
				y2: -0.024,
				sweep: true,
				large: false
			},
			{
				ref: 1,
				mode: "i",
				x2: -2,
				y2: -1.08,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "o",
				x2: -1.645,
				y2: 1.568
			}
		],
		text: {
			x: -2.323,
			y: 0.327
		}
	},
	{
		sets: [
			0,
			1,
			2,
			3,
			4
		],
		x1: 0.409,
		y1: -2.236,
		arcs: [
			{
				ref: 2,
				mode: "i",
				x2: 2.253,
				y2: -0.302,
				sweep: true,
				large: false
			},
			{
				ref: 3,
				mode: "i",
				x2: 0.983,
				y2: 2.049,
				sweep: true,
				large: false
			},
			{
				ref: 4,
				mode: "i",
				x2: -1.645,
				y2: 1.568,
				sweep: true,
				large: false
			},
			{
				ref: 0,
				mode: "i",
				x2: -2,
				y2: -1.08,
				sweep: true
			},
			{
				ref: 1,
				mode: "i",
				x2: 0.409,
				y2: -2.236,
				sweep: true
			}
		],
		text: {
			x: 0,
			y: 0
		}
	}
];
var bb = {
	x: -5.5,
	y: -6,
	width: 11.6,
	height: 11.8
};
var venn5 = {
	sets: sets,
	intersections: intersections,
	bb: bb
};

// Static shapes for rendering
const shapes = [venn0, venn1, venn2, venn3, venn4, venn5];
/**
 * Sort helper.
 * Reference: https://stackoverflow.com/a/64449554/1288340
 */
const upto = (limit) => Array.from({ length: limit }, (_, i) => i);
/**
 * Detect ellipse.
 * Reference: https://github.com/upsetjs/chartjs-chart-venn/blob/master/src/model/generate.ts#L4
 */
function isEllipse(d) {
    return typeof d.rx === 'number';
}
/**
 * Generate all combinations of a given array.
 * Reference: https://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array
 */
function combinations(array) {
    return new Array(1 << array.length)
        .fill()
        .map((_e1, i) => array.filter((_e2, j) => i & (1 << j)));
}
/**
 * Given a array set, lookup the data.
 */
function lookup(combo, data) {
    const key = combo.join('|');
    const found = data.find((d) => d.key === key);
    return {
        key,
        sets: combo,
        size: (found === null || found === void 0 ? void 0 : found.size) || 0
    };
}
/**
 * Build the data combinations for the layout.
 */
function buildData(data) {
    // Collect all unique sets and sort by size
    const uniqueSets = data
        .filter((d) => d.sets.length === 1)
        .sort((a, b) => b.size - a.size);
    // Map our unique sets
    const uniqueSetKeys = uniqueSets.map((u) => u.key);
    // Build all combos and return 1+ combos
    const sets = combinations(uniqueSetKeys);
    const filteredSets = sets.slice(1, sets.length);
    // Sort the child sets based on the parent
    const result = filteredSets.map((d) => [...d].sort((a, b) => uniqueSetKeys.indexOf(a) - uniqueSetKeys.indexOf(b)));
    // Sort the data based on index of keys and length
    // Reference: https://stackoverflow.com/a/64449554/1288340
    result.sort((a, b) => a.length - b.length ||
        upto(a.length).reduce((diff, i) => diff || uniqueSetKeys.indexOf(a[i]) - uniqueSetKeys.indexOf(b[i]), 0));
    // reshape the data key so they will match combos
    const keyedData = data.map((d) => {
        const sets = [...d.sets].sort((a, b) => uniqueSetKeys.indexOf(a) - uniqueSetKeys.indexOf(b));
        const key = sets.join('|');
        return {
            size: d.size,
            sets,
            key
        };
    });
    return {
        uniqueCount: uniqueSets.length,
        data: result.map((r) => lookup(r, keyedData))
    };
}
/**
 * Generate the arc slice path.
 * Reference: https://github.com/upsetjs/chartjs-chart-venn/blob/master/src/model/generate.ts#L4
 */
function generateArcSlicePath(s, refs) {
    return `M ${s.x1},${s.y1} ${s.arcs
        .map((arc) => {
        const ref = refs[arc.ref];
        const rx = isEllipse(ref) ? ref.rx : ref.r;
        const ry = isEllipse(ref) ? ref.ry : ref.r;
        const rot = isEllipse(ref) ? ref.rotation : 0;
        return `A ${rx} ${ry} ${rot} ${arc.large ? 1 : 0} ${arc.sweep ? 1 : 0} ${arc.x2} ${arc.y2}`;
    })
        .join(' ')}`;
}
/**
 * Build the layout for the given chart.
 * Reference: https://github.com/upsetjs/chartjs-chart-venn/blob/master/src/model/generate.ts#L4
 */
function buildLayout({ data, uniqueCount }, box) {
    const shape = shapes[Math.min(shapes.length - 1, uniqueCount)];
    const f = Math.min(box.width / shape.bb.width, box.height / shape.bb.height);
    const x = f * -shape.bb.x + (box.width - f * shape.bb.width) / 2 + 0;
    const y = f * -shape.bb.y + (box.height - f * shape.bb.height) / 2 + 0;
    const mx = (v) => x + f * v;
    const my = (v) => y + f * v;
    const shapeSets = shape.sets.map((c, i) => (Object.assign(Object.assign(Object.assign({}, c), Object.assign({ data: data[i], cx: mx(c.cx), cy: my(c.cy), text: {
            x: mx(c.text.x),
            y: my(c.text.y)
        } }, (c.icon
        ? {
            icon: {
                x: mx(c.icon.x),
                y: my(c.icon.y)
            }
        }
        : {}))), (isEllipse(c)
        ? {
            rx: c.rx * f,
            ry: c.ry * f
        }
        : {
            r: c.r * f
        }))));
    const intersections = shape.intersections.map((c, i) => ({
        text: {
            x: mx(c.text.x),
            y: my(c.text.y)
        },
        x1: mx(c.x1),
        y1: my(c.y1),
        data: data[i],
        set: shapeSets[i],
        arcs: c.arcs.map((a) => (Object.assign(Object.assign({}, a), { x2: mx(a.x2), y2: my(a.y2) })))
    }));
    return intersections.map((i) => (Object.assign(Object.assign({}, i), { path: generateArcSlicePath(i, shapeSets) })));
}
/**
 * Generate the star euler layout.
 * Adapted from: https://github.com/upsetjs/chartjs-chart-venn
 */
function starEulerLayout(data, bb) {
    return buildLayout(buildData(data), bb);
}

const VennDiagram = ({ id, type, width, height, margins, className, containerClassName, data, disabled, series }) => {
    const renderChart = useCallback((containerProps) => {
        const normalized = data.map((d) => ({
            key: d.key.join('|'),
            sets: d.key,
            size: d.data
        }));
        let layoutData;
        if (type === 'starEuler') {
            layoutData = starEulerLayout(normalized, {
                height: containerProps.height,
                width: containerProps.width
            });
        }
        else {
            layoutData = layout(normalized, {
                height: containerProps.height,
                width: containerProps.width,
                distinct: type !== 'euler'
            });
        }
        return (jsx(CloneElement, { element: series, data: layoutData, disabled: disabled, id: containerProps.id }, void 0));
    }, [data, disabled, series, type]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, margins: margins, containerClassName: containerClassName, xAxisVisible: false, yAxisVisible: false, center: false, className: className }, { children: renderChart }), void 0));
};
VennDiagram.defaultProps = {
    type: 'venn',
    series: jsx(VennSeries, {}, void 0)
};

const Bubble = ({ id, data, fill, mask, gradient, onClick, onMouseEnter, onMouseLeave, animated, tooltip = jsx(ChartTooltip, {}, void 0) }) => {
    const [internalActive, setInternalActive] = useState(false);
    const bubbleRef = useRef(null);
    const transition = animated ? DEFAULT_TRANSITION : { type: false, delay: 0 };
    const arcFill = gradient && !mask
        ? `url(#gradient-${id})`
        : mask
            ? `url(#mask-pattern-${id})`
            : fill;
    return (jsxs(Fragment, { children: [jsx(motion.circle, { id: `${id}-bubble`, ref: bubbleRef, fill: arcFill, initial: {
                    r: data.r,
                    cx: data.x,
                    cy: data.y
                }, animate: {
                    r: data.r,
                    cx: data.x,
                    cy: data.y
                }, transition: transition, onClick: onClick, onMouseEnter: (event) => {
                    setInternalActive(true);
                    onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(event);
                }, onMouseLeave: (event) => {
                    setInternalActive(false);
                    onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(event);
                } }, void 0),
            mask && (jsxs(Fragment, { children: [jsx(Mask, { id: `mask-${id}`, fill: `url(#gradient-${id})` }, void 0),
                    jsx(CloneElement, { element: mask, id: `mask-pattern-${id}`, fill: fill }, void 0)] }, void 0)),
            gradient && (jsx(CloneElement, { element: gradient, id: `gradient-${id}`, color: fill }, void 0)),
            tooltip && !tooltip.props.disabled && (jsx(CloneElement, { element: tooltip, visible: !!internalActive, reference: bubbleRef, value: { y: data.data.data, x: data.data.key } }, void 0))] }, void 0));
};

const BubbleLabel = ({ id, data, format, wrap = true, fill = '#000', fontSize = 14, fontFamily = 'sans-serif', animated }) => {
    const transition = animated ? DEFAULT_TRANSITION : { type: false, delay: 0 };
    let isElement = false;
    let label;
    if (format) {
        label = format(data);
        isElement = isValidElement(label);
    }
    if (!isElement) {
        const text = wrap
            ? wrapText({
                key: data.data.key,
                fontFamily,
                fontSize,
                width: data.r
            })
            : data.data.key;
        return (jsx(motion.text, Object.assign({ initial: {
                x: data.x,
                y: data.y
            }, animate: {
                x: data.x,
                y: data.y
            }, transition: transition, id: `${id}-text`, style: { pointerEvents: 'none', fontFamily, fontSize }, fill: fill, textAnchor: "middle" }, { children: text }), void 0));
    }
    return (jsx("g", Object.assign({ style: { transform: `translate(${data.x}px, ${data.y}px)` } }, { children: label }), void 0));
};

const BubbleSeries = ({ id, data, colorScheme = 'cybertron', animated = true, bubble = jsx(Bubble, {}, void 0), label = jsx(BubbleLabel, {}, void 0) }) => {
    const transition = animated ? DEFAULT_TRANSITION : { type: false, delay: 0 };
    const renderBubble = (item, index) => {
        const fill = getColor({
            data,
            colorScheme,
            point: item.data,
            index
        });
        const textFill = fill
            ? invert(chroma(fill).darken(0.5).hex(), true)
            : 'white';
        return (jsxs(motion.g, Object.assign({ initial: {
                scale: 0.5,
                opacity: 0
            }, animate: {
                scale: 1,
                opacity: 1
            }, transition: transition }, { children: [jsx(CloneElement, { element: bubble, id: `${id}-bubble`, animated: animated, data: item, fill: fill }, void 0),
                jsx(CloneElement, { element: label, id: `${id}-label`, animated: animated, data: item, fill: textFill }, void 0)] }), item.data.key));
    };
    return jsx(Fragment, { children: data.map(renderBubble) }, void 0);
};

const BubbleChart = ({ data = [], id, width, height, className, containerClassName, margins = 10, series = jsx(BubbleSeries, {}, void 0) }) => {
    const getData = useCallback((cw, ch) => {
        const bubble = pack().size([cw, ch]).padding(3);
        const root = hierarchy({ children: data })
            .sum((d) => d.data)
            .sort((a, b) => b.data - a.data);
        return bubble(root).leaves();
    }, [data]);
    const renderChart = useCallback((_a) => {
        var { chartWidth, chartHeight } = _a, rest = __rest(_a, ["chartWidth", "chartHeight"]);
        const circles = getData(chartWidth, chartHeight);
        return (jsx(CloneElement, { element: series, id: `${rest.id}-series`, data: circles }, void 0));
    }, [series, getData]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, containerClassName: containerClassName, margins: margins, xAxisVisible: false, yAxisVisible: false, className: className }, { children: renderChart }), void 0));
};

const TreeMapLabel = ({ id, data, fill, wrap, fontSize, fontFamily }) => {
    const key = data.data.key;
    const text = wrap ? wrapText({
        key,
        fontFamily,
        fontSize,
        paddingX: 10,
        paddingY: 10,
        width: data.x1 - data.x0,
        height: data.y1 - data.y0
    }) : key;
    return (jsx("g", Object.assign({ style: { transform: 'translate(10px, 15px)' } }, { children: jsx("text", Object.assign({ id: `${id}-text`, style: { pointerEvents: 'none', fontFamily, fontSize }, fill: fill }, { children: text }), void 0) }), void 0));
};
TreeMapLabel.defaultProps = {
    fill: '#FFF',
    wrap: true,
    fontSize: 14,
    fontFamily: 'sans-serif'
};

const TreeMapRect = ({ data, fill, animated, cursor, tooltip, onMouseEnter, onMouseLeave, onClick }) => {
    const [internalActive, setInternalActive] = useState(false);
    const rectRef = useRef(null);
    const transition = animated ? DEFAULT_TRANSITION : { type: false, delay: 0 };
    const currentFill = internalActive ? chroma(fill).darken(0.8).hex() : fill;
    return (jsxs(Fragment, { children: [jsx(motion.rect, { ref: rectRef, initial: {
                    fill: currentFill,
                    width: data.x1 - data.x0,
                    height: data.y1 - data.y0
                }, animate: {
                    fill: currentFill,
                    width: data.x1 - data.x0,
                    height: data.y1 - data.y0
                }, style: { cursor }, transition: transition, onClick: (event) => {
                    onClick === null || onClick === void 0 ? void 0 : onClick(event, data);
                }, onMouseEnter: (event) => {
                    setInternalActive(true);
                    onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(event, data);
                }, onMouseLeave: (event) => {
                    setInternalActive(false);
                    onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(event, data);
                } }, void 0),
            tooltip && !tooltip.props.disabled && (jsx(CloneElement, { element: tooltip, visible: !!internalActive, reference: rectRef, value: { y: data.data.data, x: data.data.key } }, void 0))] }, void 0));
};
TreeMapRect.defaultProps = {
    cursor: 'pointer',
    tooltip: jsx(ChartTooltip, {}, void 0)
};

const TreeMapSeries = ({ id, data, colorScheme, animated, rect, label }) => {
    const transition = animated ? DEFAULT_TRANSITION : { type: false, delay: 0 };
    const renderItem = (item, index) => {
        const fill = getColor({
            data,
            colorScheme,
            point: item.data,
            index
        });
        const textFill = fill
            ? invert(chroma(fill).darken(0.5).hex(), true)
            : 'white';
        return (jsxs(motion.g, Object.assign({ initial: {
                scale: 0.5,
                opacity: 0,
                x: item.x0,
                y: item.y0
            }, animate: {
                scale: 1,
                opacity: 1,
                x: item.x0,
                y: item.y0
            }, transition: transition }, { children: [jsx(CloneElement, { element: rect, id: `${id}-rect`, animated: animated, data: item, fill: fill }, void 0),
                jsx(CloneElement, { element: label, id: `${id}-label`, data: item, fill: textFill }, void 0)] }), item.data.key));
    };
    return jsx(Fragment, { children: data.map((d, index) => renderItem(d, index)) }, void 0);
};
TreeMapSeries.defaultProps = {
    colorScheme: 'cybertron',
    animated: true,
    rect: jsx(TreeMapRect, {}, void 0),
    label: jsx(TreeMapLabel, {}, void 0)
};

const TreeMap = ({ data, id, containerClassName, width, height, className, margins, series }) => {
    const getData = useCallback((cw, ch) => {
        const root = hierarchy({ children: data })
            .sum((d) => d.data)
            .sort((a, b) => b.data - a.data);
        const t = treemap()
            .size([cw, ch])
            .tile(treemapSquarify)
            .round(true)
            .padding(1);
        return t(root).leaves();
    }, [data]);
    const renderChart = useCallback((_a) => {
        var { chartWidth, chartHeight } = _a, rest = __rest(_a, ["chartWidth", "chartHeight"]);
        const datas = getData(chartWidth, chartHeight);
        return (jsx(CloneElement, Object.assign({ element: series }, rest, { id: `${id}-series`, data: datas }), void 0));
    }, [series, getData, id]);
    return (jsx(ChartContainer, Object.assign({ id: id, width: width, height: height, containerClassName: containerClassName, margins: margins, xAxisVisible: false, yAxisVisible: false, className: className }, { children: renderChart }), void 0));
};
TreeMap.defaultProps = {
    margins: 0,
    series: jsx(TreeMapSeries, {}, void 0),
    data: []
};

export { Area, AreaChart, AreaSeries, AreaSparklineChart, Bar, BarChart, BarLabel, BarSeries, BarSparklineChart, Brush, BrushSlice, Bubble, BubbleChart, BubbleLabel, BubbleSeries, COUNT_DEFAULTS, CalendarHeatmap, ChartBrush, ChartContainer, ChartTooltip, ChartZoomPan, Count, DEFAULT_TRANSITION, DiscreteLegend, DiscreteLegendEntry, DiscreteLegendSymbol, Gradient, GradientStop, GridStripe, Gridline, GridlineSeries, GuideBar, Heatmap, HeatmapCell, HeatmapSeries, HistogramBarChart, HistogramBarSeries, HivePlot, Line, LineChart, LineSeries, LinearAxis, LinearAxisLine, LinearAxisTickLabel, LinearAxisTickLine, LinearAxisTickSeries, LinearGauge, LinearGaugeBar, LinearGaugeOuterBar, LinearGaugeSeries, LinearXAxis, LinearXAxisTickLabel, LinearXAxisTickLine, LinearXAxisTickSeries, LinearYAxis, LinearYAxisTickLabel, LinearYAxisTickLine, LinearYAxisTickSeries, Map$1 as Map, MapMarker, MarimekkoBarSeries, MarimekkoChart, MarkLine, Mask, MotionPath, Move, Pan, PieArc, PieArcLabel, PieArcSeries, PieChart, PointSeries, RadialArea, RadialAreaChart, RadialAreaSeries, RadialAxis, RadialAxisArc, RadialAxisArcSeries, RadialAxisTick, RadialAxisTickLabel, RadialAxisTickLine, RadialAxisTickSeries, RadialBar, RadialBarChart, RadialBarSeries, RadialGauge, RadialGaugeArc, RadialGaugeLabel, RadialGaugeOuterArc, RadialGaugeSeries, RadialGaugeValueLabel, RadialGradient, RadialGuideBar, RadialLine, RadialPointSeries, RadialScatterPlot, RadialScatterPoint, RadialScatterSeries, RangeLines, Sankey, SankeyLabel, SankeyLink, SankeyNode, ScatterPlot, ScatterPoint, ScatterSeries, SequentialLegend, SonarChart, SparklineChart, StackedAreaChart, StackedAreaSeries, StackedBarChart, StackedBarSeries, StackedNormalizedAreaChart, StackedNormalizedAreaSeries, StackedNormalizedBarChart, StackedNormalizedBarSeries, StackedRadialGaugeSeries, StackedRadialGaugeValueLabel, Stripes, TooltipArea, TooltipTemplate, TreeMap, TreeMapLabel, TreeMapRect, TreeMapSeries, VennArc, VennDiagram, VennLabel, VennOuterLabel, VennSeries, Zoom, ZoomPan, addWeeksToDate, bigIntegerToLocaleString, buildBarStackData, buildBins, buildDataScales, buildMarimekkoData, buildNestedChartData, buildShallowChartData, buildStackData, buildWaterfall, calculateDimensions, calculateShowStroke, constrainMatrix, constructFunctionProps, extent, formatValue, functionProps, getClosestPoint, getColor, getDegrees, getDimension, getDurationTicks, getLimitMatrix, getMaxBigIntegerForNested, getMaxBigIntegerForShallow, getMaxTicks, getParentSVG, getPointFromMatrix, getPositionForTarget, getTicks, getXDomain, getYDomain, humanFormatBigInteger, interpolate, isAxisVisible, isZoomLevelGoingOutOfBounds, normalizeValue, normalizeValueForFormatting, reduceTicks, schemes, toggleTextSelection, uniqueBy, useCount, weekDays, wrapText };
