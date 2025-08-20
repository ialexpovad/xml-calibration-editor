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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var types_1 = require("./types");
var Util_1 = require("./Util");
var formatCaption = function (caption) {
    var key = 1;
    return caption.split(/((?:<\/?[^>]+\/?>)|(?:@[^ =]+(?:="[^"]*")?))/).map(function (piece) {
        var elementMatches = piece.match(/<(\/?)([^>\/]+)(\/?)>/);
        var attrMatches = piece.match(/@(?:([^ ="]+))?=?(?:"([^"]*)")?/);
        if (elementMatches) {
            return (React.createElement("span", { className: "techno", key: key++ },
                React.createElement("span", { className: "punc" },
                    "<",
                    elementMatches[1]),
                React.createElement("span", { className: "elName" }, elementMatches[2]),
                React.createElement("span", { className: "punc" },
                    elementMatches[3],
                    ">")));
        }
        else if (attrMatches) {
            var name_1;
            if (attrMatches[1]) {
                name_1 = React.createElement("span", { className: "atName" }, attrMatches[1]);
            }
            var value = void 0;
            if (typeof attrMatches[2] !== 'undefined') {
                var equals = void 0;
                if (name_1) {
                    equals = React.createElement("span", { className: "punc equals" }, "=");
                }
                value = (React.createElement(React.Fragment, null,
                    equals,
                    React.createElement("span", { className: "punc" }, "\""),
                    attrMatches[2] && React.createElement("span", { className: "atValue" }, attrMatches[2]),
                    React.createElement("span", { className: "punc" }, "\"")));
            }
            return (React.createElement("span", { className: "techno", key: key++ },
                name_1,
                value));
        }
        return piece;
    });
};
var Bubble = /** @class */ (function (_super) {
    __extends(Bubble, _super);
    function Bubble(props) {
        var _this = _super.call(this, props) || this;
        _this.showMenuItem = _this.showMenuItem.bind(_this);
        return _this;
    }
    Bubble.prototype.render = function () {
        var _a = this.props, id = _a.id, show = _a.show;
        if (!show) {
            return null;
        }
        if (id.length > 2 && id[id.length - 2] === '$') {
            return this.getAttributeBubble();
        }
        else if (id.length > 2 && id[id.length - 2] === '$$') {
            return this.getElementBubble();
        }
        else if (id.length > 1 && id[id.length - 1] === '_') {
            return this.getTextBubble();
        }
        return null;
    };
    Bubble.prototype.getTextBubble = function () {
        var _a, _b;
        var _c = this.props, actions = _c.actions, docSpec = _c.docSpec, element = _c.element, id = _c.id, left = _c.left, mode = _c.mode, top = _c.top, value = _c.value, xml = _c.xml;
        var asker = ((_b = (_a = docSpec.elements) === null || _a === void 0 ? void 0 : _a[element]) === null || _b === void 0 ? void 0 : _b.asker) || Util_1.askLongString;
        return (React.createElement("div", { className: "xonomyBubble ".concat(mode), style: { left: left, top: top, display: 'block' } },
            React.createElement("div", { className: "inside" },
                React.createElement("div", { className: "xonomyBubbleContent" }, asker({
                    actions: actions,
                    defaultValue: value,
                    id: id,
                    xml: xml,
                })))));
    };
    Bubble.prototype.getElementBubble = function () {
        var _this = this;
        var _a, _b;
        var _c = this.props, actions = _c.actions, docSpec = _c.docSpec, element = _c.element, id = _c.id, left = _c.left, mode = _c.mode, top = _c.top, xml = _c.xml;
        var menu = (_b = (_a = docSpec.elements) === null || _a === void 0 ? void 0 : _a[element]) === null || _b === void 0 ? void 0 : _b.menu;
        if (menu) {
            var menuItems = menu.filter(this.showMenuItem).map(function (menuItemSpec, index) {
                var icon;
                if (menuItemSpec.icon) {
                    icon = (React.createElement("span", { className: "icon" },
                        React.createElement("img", { src: menuItemSpec.icon })));
                }
                return (React.createElement("div", { className: "menuItem focusme", key: index, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = actions).setXml;
                                    return [4 /*yield*/, menuItemSpec.action(xml, id)];
                                case 1:
                                    _b.apply(_a, [_c.sent()]);
                                    actions.showBubble({ show: false });
                                    return [2 /*return*/];
                            }
                        });
                    }); } },
                    icon,
                    formatCaption(menuItemSpec.caption)));
            });
            return (React.createElement("div", { className: "xonomyBubble ".concat(mode), style: { left: left, top: top, display: 'block' } },
                React.createElement("div", { className: "inside" },
                    React.createElement("div", { className: "xonomyBubbleContent" },
                        React.createElement("div", { className: "menu" }, menuItems)))));
        }
        return null;
    };
    Bubble.prototype.getAttributeBubble = function () {
        var type = this.props.type;
        if (type === types_1.BubbleType.ASKER) {
            return this.getAttributeAskerBubble();
        }
        return this.getAttributeMenuBubble();
    };
    Bubble.prototype.getAttributeMenuBubble = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var _e = this.props, actions = _e.actions, attribute = _e.attribute, docSpec = _e.docSpec, element = _e.element, id = _e.id, left = _e.left, mode = _e.mode, top = _e.top, xml = _e.xml;
        var menu = (_d = (_c = (_b = (_a = docSpec.elements) === null || _a === void 0 ? void 0 : _a[element]) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c[attribute]) === null || _d === void 0 ? void 0 : _d.menu;
        if (menu) {
            var menuItems = menu.filter(this.showMenuItem).map(function (menuItemSpec, index) { return (React.createElement("div", { className: "menuItem focusme", key: index, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = actions).setXml;
                                return [4 /*yield*/, menuItemSpec.action(xml, id)];
                            case 1:
                                _b.apply(_a, [_c.sent()]);
                                actions.showBubble({ show: false });
                                return [2 /*return*/];
                        }
                    });
                }); } }, menuItemSpec.caption)); });
            return (React.createElement("div", { className: "xonomyBubble ".concat(mode), style: { left: left, top: top, display: 'block' } },
                React.createElement("div", { className: "inside" },
                    React.createElement("div", { className: "xonomyBubbleContent" },
                        React.createElement("div", { className: "menu" }, menuItems)))));
        }
        return null;
    };
    Bubble.prototype.getAttributeAskerBubble = function () {
        var _a, _b, _c;
        var _d = this.props, actions = _d.actions, attribute = _d.attribute, docSpec = _d.docSpec, element = _d.element, id = _d.id, left = _d.left, mode = _d.mode, top = _d.top, value = _d.value, xml = _d.xml;
        var attributeSpec = (_c = (_b = (_a = docSpec.elements) === null || _a === void 0 ? void 0 : _a[element]) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c[attribute];
        if (attributeSpec && attributeSpec.asker) {
            var asker = attributeSpec.asker;
            return (React.createElement("div", { className: "xonomyBubble ".concat(mode), style: { left: left, top: top, display: 'block' } },
                React.createElement("div", { className: "inside" },
                    React.createElement("div", { className: "xonomyBubbleContent" }, asker({
                        actions: actions,
                        defaultValue: value,
                        id: id,
                        xml: xml,
                    })))));
        }
        return null;
    };
    Bubble.prototype.showMenuItem = function (menuItemSpec) {
        var _a = this.props, id = _a.id, xml = _a.xml;
        if (menuItemSpec.hideIf) {
            return !menuItemSpec.hideIf(xml, id);
        }
        return true;
    };
    return Bubble;
}(React.Component));
exports.default = Bubble;
//# sourceMappingURL=Bubble.js.map