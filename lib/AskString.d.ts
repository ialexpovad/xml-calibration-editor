import * as React from 'react';
import { Actions, Xml } from './types';
export declare enum AskStringType {
    LONG = 0,
    SHORT = 1
}
interface Props {
    actions: Actions;
    defaultValue: string;
    id: string[];
    type: AskStringType;
    xml: Xml;
}
interface State {
    value: string;
}
export default class AskString extends React.Component<Props, State> {
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    render(): React.ReactNode;
    private getShortString;
    private getLongString;
    private onSubmit;
    private onChange;
}
export {};
