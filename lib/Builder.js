"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("xmlbuilder");
var Builder = /** @class */ (function () {
    function Builder(options) {
        this.attrKey = '$';
        this.charKey = '_';
        this.childKey = '$$';
        this.textKey = '__text__';
        this.headless = options.headless || false;
        this.xmldec = options.xmldec || {
            encoding: 'UTF-8',
            standalone: true,
            version: '1.0',
        };
        this.doctype = options.doctype;
    }
    Builder.prototype.buildObject = function (rootObj) {
        var rootName;
        if (Object.keys(rootObj).length === 1) {
            rootName = Object.keys(rootObj)[0];
        }
        else {
            throw new Error('invalid');
        }
        var rootElement = builder.create(rootName, this.xmldec, this.doctype, {
            headless: this.headless,
        });
        return this.render(rootElement, rootObj[rootName]).end({
            indent: '  ',
            newline: '\n',
            pretty: true,
        });
    };
    Builder.prototype.render = function (element, obj) {
        var _this = this;
        if (Array.isArray(obj)) {
            obj.forEach(function (child) {
                if ('#name' in child) {
                    if (child['#name'] === _this.textKey) {
                        element = element.txt(child[_this.charKey]);
                    }
                    else {
                        element = _this.render(element.ele(child['#name']), child).up();
                    }
                }
            });
        }
        else {
            if (this.attrKey in obj) {
                var child_1 = obj[this.attrKey];
                Object.keys(child_1).forEach(function (attr) {
                    var value = child_1[attr];
                    element = element.att(attr, value);
                });
            }
            if (this.childKey in obj) {
                var child = obj[this.childKey];
                if (Array.isArray(child)) {
                    element = this.render(element, child);
                }
            }
        }
        return element;
    };
    return Builder;
}());
exports.default = Builder;
//# sourceMappingURL=Builder.js.map