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
var Util_1 = require("./Util");
var hasCaption = function (menuItem) {
    return menuItem.caption !== undefined;
};
var AskPicklist = /** @class */ (function (_super) {
    __extends(AskPicklist, _super);
    function AskPicklist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AskPicklist.prototype.render = function () {
        var _this = this;
        var parameter = this.props.parameter;
        var menuItems = parameter.map(function (menuItem) {
            var caption;
            var value;
            if (hasCaption(menuItem)) {
                caption = React.createElement("span", { className: "explainer" }, menuItem.caption);
                value = menuItem.value;
            }
            else {
                value = menuItem;
            }
            return (React.createElement("div", { className: "menuItem focusme techno", key: value, onClick: function (e) {
                    _this.onClick(value);
                    e.preventDefault();
                } },
                React.createElement("span", { className: "punc" }, "\""),
                value,
                React.createElement("span", { className: "punc" }, "\""),
                caption));
        });
        return (React.createElement("div", { className: "menu" }, menuItems));
    };
    AskPicklist.prototype.onClick = function (value) {
        var _a = this.props, actions = _a.actions, id = _a.id, xml = _a.xml;
        actions.setXml((0, Util_1.updateNode)(xml, id, value));
        actions.showBubble({
            show: false,
        });
    };
    return AskPicklist;
}(React.Component));
exports.default = AskPicklist;
//# sourceMappingURL=AskPicklist.js.map