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
var Attribute_1 = require("./Attribute");
var Util_1 = require("./Util");
var Attributes = /** @class */ (function (_super) {
    __extends(Attributes, _super);
    function Attributes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Attributes.prototype.render = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, attributes = _a.attributes, element = _a.element, id = _a.id;
        return (React.createElement("span", { className: "attributes" }, Object.keys(attributes).map(function (name) { return (React.createElement(Attribute_1.default, { actions: actions, element: element, id: (0, Util_1.push)(id, '$', name), key: name, name: name, value: _this.props.attributes[name] })); })));
    };
    return Attributes;
}(React.Component));
exports.default = Attributes;
//# sourceMappingURL=Attributes.js.map