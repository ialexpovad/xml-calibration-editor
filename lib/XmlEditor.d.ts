import * as React from 'react';
import { BubbleOptions, DocSpec, Xml } from './types';
type DefaultProps = {
    mode: 'laic' | 'nerd';
};
type Props = {
    docSpec: DocSpec;
    onChange?: () => void;
    ref: React.RefObject<XmlEditor | null>;
    xml: string;
} & Partial<DefaultProps>;
interface State {
    bubble: BubbleOptions;
    xml?: Xml;
}
export default class XmlEditor extends React.Component<Props & DefaultProps, State> {
    static defaultProps: DefaultProps;
    constructor(props: Props & DefaultProps);
    componentDidMount(): void;
    getXml(): Xml | undefined;
    loadString(xmlStr: string): void;
    private onClick;
    private setXml;
    private showBubble;
    render(): React.ReactNode;
    private getActions;
    private getBubble;
    private getRootNode;
}
export {};
