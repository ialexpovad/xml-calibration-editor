"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Collapsoid = /** @class */ (function (_super) {
    __extends(Collapsoid, _super);
    function Collapsoid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collapsoid.prototype.render = function () {
        var elements = this.props.elements;
        return this.renderElements(elements);
    };
    Collapsoid.prototype.renderElements = function (elements) {
        var _this = this;
        var collapsoid = '';
        elements.every(function (element) {
            if (element._ && element['#name'] === '__text__') {
                collapsoid += element._ + ' ';
            }
            if (element.$$) {
                collapsoid += _this.renderElements(element.$$) + ' ';
            }
            return collapsoid.length < Collapsoid.maxLength;
        });
        return collapsoid.trim().slice(0, Collapsoid.maxLength);
    };
    Collapsoid.maxLength = 35;
    return Collapsoid;
}(React.Component));
exports.default = Collapsoid;
//# sourceMappingURL=Collapsoid.js.map