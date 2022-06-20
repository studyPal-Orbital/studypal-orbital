import React from 'react';
declare const _default: {
    title: string;
    component: React.FC<import("./PieChart").PieChartProps>;
    subcomponents: {
        PieArc: React.FC<import("./PieArcSeries").PieArcProps>;
        PieArcLabel: React.FC<Partial<import("./PieArcSeries").PieArcLabelProps>>;
        PieArcSeries: React.FC<Partial<import("./PieArcSeries").PieArcSeriesProps>>;
    };
};
export default _default;
export declare const Simple: () => JSX.Element;
export declare const Explode: () => JSX.Element;
export declare const NoAnimation: () => JSX.Element;
export declare const HtmlLabels: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
export declare const LabelOverlap: () => JSX.Element;
export declare const DisplayAllLabels: () => JSX.Element;
export declare const LiveUpdating: () => JSX.Element;
export declare const Autosize: () => JSX.Element;
