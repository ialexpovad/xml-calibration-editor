"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xml2js = require("xml2js");
var Parser = /** @class */ (function () {
    function Parser() {
        this.parser = new xml2js.Parser({
            charsAsChildren: true,
            explicitChildren: true,
            preserveChildrenOrder: true,
        });
    }
    Parser.prototype.parseString = function (xml) {
        return this.parser.parseStringPromise(xml);
    };
    return Parser;
}());
exports.default = Parser;
//# sourceMappingURL=Parser.js.map