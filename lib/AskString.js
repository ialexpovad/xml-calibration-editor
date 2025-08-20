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
exports.AskStringType = void 0;
var React = require("react");
var Util_1 = require("./Util");
var AskStringType;
(function (AskStringType) {
    AskStringType[AskStringType["LONG"] = 0] = "LONG";
    AskStringType[AskStringType["SHORT"] = 1] = "SHORT";
})(AskStringType || (exports.AskStringType = AskStringType = {}));
var AskString = /** @class */ (function (_super) {
    __extends(AskString, _super);
    function AskString(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = _this.onChange.bind(_this);
        _this.onSubmit = _this.onSubmit.bind(_this);
        _this.state = {
            value: props.defaultValue,
        };
        return _this;
    }
    AskString.prototype.componentDidUpdate = function (prevProps) {
        var defaultValue = this.props.defaultValue;
        if (prevProps.defaultValue !== defaultValue) {
            this.setState({
                value: this.props.defaultValue,
            });
        }
    };
    AskString.prototype.render = function () {
        var type = this.props.type;
        return (React.createElement("form", { onSubmit: this.onSubmit }, type === AskStringType.LONG ? this.getLongString() : this.getShortString()));
    };
    AskString.prototype.getShortString = function () {
        var value = this.state.value;
        return (React.createElement(React.Fragment, null,
            React.createElement("input", { "aria-label": "Value", name: "val", className: "textbox focusme", onChange: this.onChange, value: value }),
            React.createElement("input", { type: "submit", value: "OK" })));
    };
    AskString.prototype.getLongString = function () {
        var value = this.state.value;
        return (React.createElement(React.Fragment, null,
            React.createElement("textarea", { name: "val", className: "textbox focusme", onChange: this.onChange, value: value }),
            React.createElement("div", { className: "submitline" },
                React.createElement("input", { type: "submit", value: "OK" }))));
    };
    AskString.prototype.onSubmit = function (e) {
        var _a = this.props, actions = _a.actions, id = _a.id, xml = _a.xml;
        var value = this.state.value;
        actions.setXml((0, Util_1.updateNode)(xml, id, value));
        actions.showBubble({
            show: false,
        });
        e.preventDefault();
    };
    AskString.prototype.onChange = function (e) {
        this.setState({
            value: e.target.value,
        });
    };
    return AskString;
}(React.Component));
exports.default = AskString;
//# sourceMappingURL=AskString.js.map