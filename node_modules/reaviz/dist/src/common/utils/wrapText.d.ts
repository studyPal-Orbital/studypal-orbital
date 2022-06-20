export interface WrapTextInputs {
    key: string;
    x?: any;
    y?: number;
    paddingY?: number;
    paddingX?: number;
    width: number;
    height?: number;
    fontFamily: string;
    fontSize: number;
}
export declare function wrapText({ key, x, y, paddingY, paddingX, width, height, fontFamily, fontSize }: WrapTextInputs): JSX.Element | JSX.Element[];
