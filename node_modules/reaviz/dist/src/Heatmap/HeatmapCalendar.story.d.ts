import React from 'react';
declare const _default: {
    title: string;
    component: React.FC<Partial<import("./CalendarHeatmap").CalendarHeatmapProps>>;
    subcomponents: {
        HeatmapSeries: React.FC<Partial<import("./HeatmapSeries").HeatmapSeriesProps>>;
        HeatmapCell: React.FC<Partial<import("./HeatmapSeries").HeatmapCellProps>>;
    };
};
export default _default;
export declare const YearCalendar: () => JSX.Element;
export declare const YearCalendarWMarchStart: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
export declare const MonthCalendar: () => JSX.Element;
export declare const MultiMonthCalendar: () => JSX.Element;
