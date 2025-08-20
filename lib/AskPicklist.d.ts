import * as React from 'react';
import { Actions, AskerParameter, Xml } from './types';
interface Props {
    actions: Actions;
    id: string[];
    parameter: AskerParameter;
    xml: Xml;
}
export default class AskPicklist extends React.Component<Props> {
    render(): React.ReactNode;
    private onClick;
}
export {};
