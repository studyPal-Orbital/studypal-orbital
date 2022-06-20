import React from 'react';
declare const _default: {
    title: string;
    component: React.FC<Partial<import("./Heatmap").HeatmapProps>>;
    subcomponents: {
        HeatmapSeries: React.FC<Partial<import("./HeatmapSeries").HeatmapSeriesProps>>;
        HeatmapCell: React.FC<Partial<import("./HeatmapSeries").HeatmapCellProps>>;
    };
};
export default _default;
export declare const Basic: () => JSX.Element;
export declare const BasicLegend: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
export declare const MultiAxis: () => JSX.Element;
