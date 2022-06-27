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
export declare const _LargeDataset: () => JSX.Element;
export declare const _Labels: () => JSX.Element;
export declare const _Autosize: () => JSX.Element;
export declare const _Waterfall: () => JSX.Element;
export declare const Duration: () => JSX.Element;
export declare const _NonZero: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
