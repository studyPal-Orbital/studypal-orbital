import { FC, ReactElement } from 'react';
import { ChartProps } from '../common/containers/ChartContainer';
import { ChartShallowDataShape } from '../common/data';
import { TreeMapSeries, TreeMapSeriesProps } from './TreeMapSeries';
export interface TreeMapProps extends ChartProps {
    /**
     * Data the chart will receive to render.
     */
    data: ChartShallowDataShape[];
    /**
     * The series component that renders the components.
     */
    series?: ReactElement<TreeMapSeriesProps, typeof TreeMapSeries>;
}
export declare const TreeMap: FC<Partial<TreeMapProps>>;
