import React from 'react';
declare const _default: {
    title: string;
    component: React.FC<Partial<import("./BarChart").BarChartProps>>;
    subcomponents: {
        BarSeries: React.FC<Partial<import("./BarSeries").BarSeriesProps>>;
        StackedBarSeries: React.FC<Partial<import("./BarSeries").BarSeriesProps>>;
        StackedNormalizedBarSeries: React.FC<Partial<import("./BarSeries").BarSeriesProps>>;
        MarimekkoBarSeries: React.FC<Partial<import("./BarSeries").BarSeriesProps>>;
        RangeLines: React.FC<Partial<import("./BarSeries").RangeLinesProps>>;
        Bar: React.FC<Partial<import("./BarSeries").BarProps>>;
        BarLabel: React.FC<import("./BarSeries").BarLabelProps>;
        GuideBar: React.FC<Partial<import("./BarSeries").GuideBarProps>>;
        HistogramBarSeries: React.FC<Partial<import("./BarSeries").BarSeriesProps>>;
    };
};
export default _default;
export declare const Simple: () => JSX.Element;
export declare const Stacked: () => JSX.Element;
export declare const StackedCustomStyle: () => JSX.Element;
export declare const StackedDiverging: () => JSX.Element;
export declare const StackedNormalized: () => JSX.Element;
export declare const Marimekko: () => JSX.Element;
