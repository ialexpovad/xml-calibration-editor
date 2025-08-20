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
var Attributes_1 = require("./Attributes");
var Collapsoid_1 = require("./Collapsoid");
var TextNode_1 = require("./TextNode");
var Util_1 = require("./Util");
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element(props) {
        var _this = _super.call(this, props) || this;
        _this.onCollapse = _this.onCollapse.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.ref = React.createRef();
        return _this;
    }
    Element.prototype.render = function () {
        var _a = this.props, actions = _a.actions, childElements = _a.childElements, collapsed = _a.collapsed, id = _a.id, name = _a.name, xml = _a.xml;
        var elements = [];
        if (childElements) {
            childElements.forEach(function (childElement, index) {
                if (childElement['#name'] !== '__text__') {
                    elements.push(React.createElement(Element, { actions: actions, attributes: childElement.$, childElements: childElement.$$, collapsed: childElement['#collapsed'], id: (0, Util_1.push)(id, '$$', "".concat(index)), key: index, name: childElement['#name'], xml: xml }));
                }
                else if (childElement._) {
                    elements.push(React.createElement(TextNode_1.default, { actions: actions, element: name, id: (0, Util_1.push)(id, '$$', "".concat(index), '_'), key: index, text: childElement._ }));
                }
            });
        }
        var childrenContainer;
        childrenContainer = (React.createElement(React.Fragment, null,
            React.createElement("span", { className: "prominentChildren" }),
            React.createElement("span", { className: "childrenCollapsed focusable" }, childElements && React.createElement(Collapsoid_1.default, { elements: childElements })),
            React.createElement("div", { className: "children" }, elements)));
        var elementClass = '';
        if (elements.length === 0) {
            elementClass = ' noChildren';
        }
        var expandCollapseLabel = 'Collapse';
        if (collapsed) {
            elementClass += ' collapsed';
            expandCollapseLabel = 'Expand';
        }
        var openingTag = (React.createElement("span", { className: "tag opening" },
            React.createElement("span", { className: "punc" }, "<"),
            React.createElement("span", { className: "name", onClick: this.onClick, ref: this.ref }, name),
            this.getAttributes(),
            React.createElement("span", { className: "punc slash" }, "/"),
            React.createElement("span", { className: "punc" }, ">")));
        var closingTag;
        if (elements.length > 0) {
            closingTag = (React.createElement("span", { className: "tag closing" },
                React.createElement("span", { className: "punc" }, "<"),
                React.createElement("span", { className: "punc slash" }, "/"),
                React.createElement("span", { className: "name" }, name),
                React.createElement("span", { className: "punc" }, ">")));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "element".concat(elementClass) },
                React.createElement("span", { className: "connector" },
                    React.createElement("span", { className: "plusminus", onClick: this.onCollapse, title: expandCollapseLabel }),
                    React.createElement("span", { className: "draghandle", draggable: "true" })),
                openingTag,
                childrenContainer,
                closingTag)));
    };
    Element.prototype.onClick = function (event) {
        var _a = this.props, actions = _a.actions, id = _a.id, name = _a.name;
        var bubbleOptions = {
            id: id,
            element: name,
            show: true,
            value: name,
        };
        if (this.ref.current) {
            var rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
        event.stopPropagation();
    };
    Element.prototype.onCollapse = function () {
        var _a = this.props, actions = _a.actions, collapsed = _a.collapsed, id = _a.id, xml = _a.xml;
        var collapseId = (0, Util_1.push)(id, '#collapsed');
        actions.showBubble({
            show: false,
        });
        actions.setXml((0, Util_1.updateNode)(xml, collapseId, !collapsed));
    };
    Element.prototype.getAttributes = function () {
        var _a = this.props, actions = _a.actions, attributes = _a.attributes, id = _a.id, name = _a.name;
        if (attributes) {
            return (React.createElement(Attributes_1.default, { actions: actions, attributes: attributes, element: name, id: id }));
        }
        return null;
    };
    return Element;
}(React.Component));
exports.default = Element;
//# sourceMappingURL=Element.js.map