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
export declare const CustomStyle: () => JSX.Element;
export declare const LargeDataset: () => JSX.Element;
export declare const Mask: () => JSX.Element;
export declare const CustomColors: () => JSX.Element;
export declare const Labels: () => JSX.Element;
export declare const CustomBarWidth: () => JSX.Element;
export declare const LiveUpdating: () => JSX.Element;
export declare const Autosize: () => JSX.Element;
export declare const Performance: () => any;
export declare const NoAnimation: () => JSX.Element;
export declare const Waterfall: () => JSX.Element;
export declare const NonZero: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
