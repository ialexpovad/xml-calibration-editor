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
var TextNode = /** @class */ (function (_super) {
    __extends(TextNode, _super);
    function TextNode(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = _this.onClick.bind(_this);
        _this.ref = React.createRef();
        return _this;
    }
    TextNode.prototype.render = function () {
        var text = this.props.text;
        return (React.createElement("div", { className: "textnode focusable", onClick: this.onClick, ref: this.ref },
            React.createElement("span", { className: "value" }, text)));
    };
    TextNode.prototype.onClick = function (event) {
        var _a = this.props, actions = _a.actions, element = _a.element, id = _a.id, text = _a.text;
        var bubbleOptions = {
            id: id,
            element: element,
            show: true,
            value: text,
        };
        if (this.ref.current) {
            var rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
        event.stopPropagation();
    };
    return TextNode;
}(React.Component));
exports.default = TextNode;
//# sourceMappingURL=TextNode.js.map