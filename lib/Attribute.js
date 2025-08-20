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
var types_1 = require("./types");
var Attribute = /** @class */ (function (_super) {
    __extends(Attribute, _super);
    function Attribute(props) {
        var _this = _super.call(this, props) || this;
        _this.ref = React.createRef();
        _this.onClickName = _this.onClickName.bind(_this);
        _this.onClickValue = _this.onClickValue.bind(_this);
        return _this;
    }
    Attribute.prototype.render = function () {
        var _a = this.props, name = _a.name, value = _a.value;
        return (React.createElement("span", { className: "attribute" },
            React.createElement("span", { className: "punc" }, " "),
            React.createElement("span", { className: "name", onClick: this.onClickName }, name),
            React.createElement("span", { className: "punc" }, "="),
            React.createElement("span", { className: "valueContainer", onClick: this.onClickValue, ref: this.ref },
                React.createElement("span", { className: "punc" }, "\""),
                React.createElement("span", { className: "value" }, value),
                React.createElement("span", { className: "punc" }, "\""))));
    };
    Attribute.prototype.onClickName = function (event) {
        var _a = this.props, actions = _a.actions, element = _a.element, id = _a.id, name = _a.name, value = _a.value;
        var bubbleOptions = {
            attribute: name,
            element: element,
            id: id,
            show: true,
            type: types_1.BubbleType.MENU,
            value: value,
        };
        if (this.ref.current) {
            var rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
        event.stopPropagation();
    };
    Attribute.prototype.onClickValue = function (event) {
        var _a = this.props, actions = _a.actions, element = _a.element, id = _a.id, name = _a.name, value = _a.value;
        var bubbleOptions = {
            attribute: name,
            element: element,
            id: id,
            show: true,
            type: types_1.BubbleType.ASKER,
            value: value,
        };
        if (this.ref.current) {
            var rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
        event.stopPropagation();
    };
    return Attribute;
}(React.Component));
exports.default = Attribute;
//# sourceMappingURL=Attribute.js.map