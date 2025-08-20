import { Xml } from './types';
export interface BuilderOptions {
    doctype?: {
        pubID?: string;
        sysID?: string;
    };
    headless?: boolean;
    renderOpts?: {};
    xmldec?: {
        encoding?: string;
        standalone?: boolean;
        version?: '1.0';
    };
}
export default class Builder {
    private attrKey;
    private charKey;
    private childKey;
    private textKey;
    private headless;
    private xmldec;
    private doctype?;
    constructor(options: BuilderOptions);
    buildObject(rootObj: Xml): string;
    private render;
}
