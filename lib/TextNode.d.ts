import * as React from 'react';
import { Actions } from './types';
interface Props {
    actions: Actions;
    element: string;
    id: string[];
    text: string;
}
export default class TextNode extends React.Component<Props> {
    private ref;
    constructor(props: Props);
    render(): React.ReactNode;
    private onClick;
}
export {};
