import React from 'react';
declare const _default: {
    title: string;
    component: React.FC<Partial<import("./AreaChart").AreaChartProps>>;
    subcomponents: {
        AreaSeries: React.FC<Partial<import("./AreaSeries").AreaSeriesProps>>;
        Area: React.FC<Partial<import("./AreaSeries").AreaProps>>;
        Line: React.FC<Partial<import("./AreaSeries").LineProps>>;
        PointSeries: React.FC<Partial<import("./AreaSeries").PointSeriesProps>>;
        StackedAreaSeries: React.FC<Partial<import("./AreaSeries").AreaSeriesProps>>;
        StackedNormalizedAreaSeries: React.FC<Partial<import("./AreaSeries").AreaSeriesProps>>;
    };
};
export default _default;
export declare const Simple: () => JSX.Element;
export declare const Masks: () => JSX.Element;
export declare const NoAnimation: () => JSX.Element;
export declare const NonZero: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
export declare const Interval: () => JSX.Element;
export declare const Autosize: () => JSX.Element;
export declare const SingleValue: () => JSX.Element;
export declare const Performance: () => any;
export declare const BigInt: () => JSX.Element;
