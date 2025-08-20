import * as React from 'react';
import { Actions } from './types';
interface Props {
    actions: Actions;
    attributes: {
        [key: string]: string;
    };
    id: string[];
    element: string;
}
export default class Attributes extends React.Component<Props> {
    render(): React.ReactNode;
}
export {};
