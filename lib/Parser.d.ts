import { Xml } from './types';
export default class Parser {
    private parser;
    constructor();
    parseString(xml: string): Promise<Xml>;
}
