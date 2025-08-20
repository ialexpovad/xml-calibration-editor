import * as React from 'react';
import { Actions } from './types';
interface Props {
    actions: Actions;
    element: string;
    id: string[];
    name: string;
    value: string;
}
export default class Attribute extends React.Component<Props> {
    private ref;
    constructor(props: Props);
    render(): React.ReactNode;
    private onClickName;
    private onClickValue;
}
export {};
