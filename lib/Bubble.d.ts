import * as React from 'react';
import { BubbleType, Actions, DocSpec, Xml } from './types';
interface Props {
    actions: Actions;
    attribute: string;
    docSpec: DocSpec;
    element: string;
    id: string[];
    left: number;
    mode: 'laic' | 'nerd';
    show: boolean;
    top: number;
    type: BubbleType;
    value: string;
    xml: Xml;
}
export default class Bubble extends React.Component<Props> {
    constructor(props: Props);
    render(): React.ReactNode;
    private getTextBubble;
    private getElementBubble;
    private getAttributeBubble;
    private getAttributeMenuBubble;
    private getAttributeAskerBubble;
    private showMenuItem;
}
export {};
