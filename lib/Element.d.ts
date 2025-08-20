import * as React from 'react';
import { Actions, Element as ElementConfig, Xml } from './types';
interface Props {
    actions: Actions;
    attributes?: {
        [key: string]: string;
    };
    childElements?: ElementConfig[];
    collapsed?: boolean;
    id: string[];
    name: string;
    xml: Xml;
}
export default class Element extends React.Component<Props> {
    private ref;
    constructor(props: Props);
    render(): React.ReactNode;
    private onClick;
    private onCollapse;
    private getAttributes;
}
export {};
