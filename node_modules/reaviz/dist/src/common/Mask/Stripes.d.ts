import { FC } from 'react';
import { MaskProps } from './Mask';
interface StripesProps extends MaskProps {
    id?: string;
    fill?: string;
}
export declare const Stripes: FC<StripesProps>;
export {};
