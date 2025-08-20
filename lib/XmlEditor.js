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
var Bubble_1 = require("./Bubble");
var Element_1 = require("./Element");
var Parser_1 = require("./Parser");
var types_1 = require("./types");
var XmlEditor = /** @class */ (function (_super) {
    __extends(XmlEditor, _super);
    function XmlEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.setXml = _this.setXml.bind(_this);
        _this.showBubble = _this.showBubble.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.state = {
            bubble: {
                attribute: '',
                element: '',
                id: [],
                left: 0,
                show: false,
                top: 0,
                type: types_1.BubbleType.ASKER,
                value: '',
            },
        };
        return _this;
    }
    XmlEditor.prototype.componentDidMount = function () {
        var _this = this;
        var xml = this.props.xml;
        var parser = new Parser_1.default();
        parser.parseString(xml).then(function (result) {
            _this.setState({
                xml: result,
            });
        });
    };
    XmlEditor.prototype.getXml = function () {
        var xml = this.state.xml;
        return xml;
    };
    XmlEditor.prototype.loadString = function (xmlStr) {
        var _this = this;
        var parser = new Parser_1.default();
        parser.parseString(xmlStr).then(function (result) {
            _this.setState({ xml: result });
        });
    };
    XmlEditor.prototype.onClick = function () {
        this.showBubble({
            show: false,
        });
    };
    XmlEditor.prototype.setXml = function (xml) {
        var onChange = this.props.onChange;
        this.setState({
            xml: xml,
        }, function () {
            if (onChange) {
                onChange();
            }
        });
    };
    XmlEditor.prototype.showBubble = function (askOptions) {
        this.setState(function (prevState) { return ({
            bubble: Object.assign(prevState.bubble, askOptions),
        }); });
    };
    XmlEditor.prototype.render = function () {
        var mode = this.props.mode;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "xonomy ".concat(mode), onClick: this.onClick }, this.getRootNode()),
            this.getBubble()));
    };
    XmlEditor.prototype.getActions = function () {
        return {
            setXml: this.setXml,
            showBubble: this.showBubble,
        };
    };
    XmlEditor.prototype.getBubble = function () {
        var _a = this.props, docSpec = _a.docSpec, mode = _a.mode;
        var _b = this.state, bubble = _b.bubble, xml = _b.xml;
        if (xml) {
            return (React.createElement(Bubble_1.default, { actions: this.getActions(), attribute: bubble.attribute, docSpec: docSpec, element: bubble.element, id: bubble.id, left: bubble.left, mode: mode, show: bubble.show, top: bubble.top, type: bubble.type, value: bubble.value, xml: xml }));
        }
        return null;
    };
    XmlEditor.prototype.getRootNode = function () {
        var xml = this.state.xml;
        if (xml) {
            var key = Object.keys(xml)[0];
            return (React.createElement(Element_1.default, { actions: this.getActions(), attributes: xml[key].$, childElements: xml[key].$$, collapsed: xml[key]['#collapsed'], id: [key], name: key, xml: xml }));
        }
        return null;
    };
    XmlEditor.defaultProps = {
        mode: 'nerd',
    };
    return XmlEditor;
}(React.Component));
exports.default = XmlEditor;
//# sourceMappingURL=XmlEditor.js.map