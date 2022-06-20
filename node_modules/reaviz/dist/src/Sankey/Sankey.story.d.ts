import { Sankey } from './Sankey';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';
import { SankeyLabel } from './SankeyLabel';
declare const _default: {
    title: string;
    component: typeof Sankey;
    subcomponents: {
        SankeyNode: typeof SankeyNode;
        SankeyLink: typeof SankeyLink;
        SankeyLabel: typeof SankeyLabel;
    };
};
export default _default;
export declare const Simple: () => JSX.Element;
export declare const Filtering: () => JSX.Element;
export declare const Multilevels: () => JSX.Element;
export declare const Autosize: () => JSX.Element;
export declare const Justification: () => JSX.Element;
