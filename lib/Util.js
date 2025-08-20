"use strict";
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
exports.askLongString = exports.askString = exports.askPicklist = exports.push = exports.deleteAttribute = exports.deleteElement = exports.newAttribute = exports.moveElementDown = exports.canMoveElementDown = exports.canMoveElementUp = exports.moveElementUp = exports.duplicateElement = exports.newElementAfter = exports.newElementBefore = exports.newTextChild = exports.newElementChild = exports.updateNode = exports.deleteNode = exports.getXmlNode = exports.modifyXml = void 0;
var React = require("react");
var AskPicklist_1 = require("./AskPicklist");
var AskString_1 = require("./AskString");
var Parser_1 = require("./Parser");
var modifyXml = function (xml, id, modifier) {
    if (id.length > 1) {
        var idClone = id.slice(0);
        var first = idClone.splice(0, 1);
        xml[first[0]] = (0, exports.modifyXml)(xml[first[0]], idClone, modifier);
        return xml;
    }
    xml[id[0]] = modifier(xml[id[0]]);
    return xml;
};
exports.modifyXml = modifyXml;
var modifyElement = function (xml, id, modifier) {
    var idClone = id.slice(0);
    var arrayIndex = parseInt(idClone.splice(-1, 1)[0], 10);
    if (!isNaN(arrayIndex)) {
        return (0, exports.modifyXml)(xml, idClone, function (parent) {
            if (Array.isArray(parent)) {
                return modifier(parent, arrayIndex);
            }
            throw new Error("Failed to find node: ".concat(id));
        });
    }
    throw new Error("Invalid id: ".concat(id));
};
var getXmlNode = function (xml, id) {
    if (id.length > 1) {
        var idClone = id.slice(0);
        var first = idClone.splice(0, 1);
        return (0, exports.getXmlNode)(xml[first[0]], idClone);
    }
    return xml[id[0]];
};
exports.getXmlNode = getXmlNode;
var deleteNode = function (xml, id) {
    var idClone = id.slice(0);
    var nodeKey = idClone.splice(-1, 1);
    return (0, exports.modifyXml)(xml, idClone, function (parent) {
        if (Array.isArray(parent)) {
            parent.splice(parseInt(nodeKey[0], 10), 1);
        }
        else {
            delete parent[nodeKey[0]];
        }
        return parent;
    });
};
exports.deleteNode = deleteNode;
var updateNode = function (xml, id, value) {
    return (0, exports.modifyXml)(xml, id, function () {
        return value;
    });
};
exports.updateNode = updateNode;
var newElementChild = function (parameter) { return function (xml, id) { return __awaiter(void 0, void 0, void 0, function () {
    var parser, child;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parser = new Parser_1.default();
                return [4 /*yield*/, parser.parseString(parameter)];
            case 1:
                child = _a.sent();
                return [2 /*return*/, (0, exports.modifyXml)(xml, id, function (parent) {
                        if (!parent.$$) {
                            parent.$$ = [];
                        }
                        parent.$$.push(child[Object.keys(child)[0]]);
                        return parent;
                    })];
        }
    });
}); }; };
exports.newElementChild = newElementChild;
var newTextChild = function (parameter) { return function (xml, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.modifyXml)(xml, id, function (parent) {
                if (!parent.$$) {
                    parent.$$ = [];
                }
                parent.$$.push({
                    '#name': '__text__',
                    _: parameter,
                });
                return parent;
            })];
    });
}); }; };
exports.newTextChild = newTextChild;
var newElementSibling = function (xml, id, sibling, indexDelta) { return __awaiter(void 0, void 0, void 0, function () {
    var parser, element;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parser = new Parser_1.default();
                return [4 /*yield*/, parser.parseString(sibling)];
            case 1:
                element = _a.sent();
                return [2 /*return*/, modifyElement(xml, id, function (parent, arrayIndex) {
                        parent.splice(arrayIndex + indexDelta, 0, element[Object.keys(element)[0]]);
                        return parent;
                    })];
        }
    });
}); };
var newElementBefore = function (parameter) {
    return function (xml, id) {
        return newElementSibling(xml, id, parameter, 0);
    };
};
exports.newElementBefore = newElementBefore;
var newElementAfter = function (parameter) {
    return function (xml, id) {
        return newElementSibling(xml, id, parameter, 1);
    };
};
exports.newElementAfter = newElementAfter;
var duplicateElement = function (xml, id) {
    return modifyElement(xml, id, function (parent, arrayIndex) {
        parent.splice(arrayIndex + 1, 0, Object.assign({}, parent[arrayIndex]));
        return parent;
    });
};
exports.duplicateElement = duplicateElement;
var swap = function (arr, index1, index2) {
    var temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
};
var moveElementUp = function (xml, id) {
    return modifyElement(xml, id, function (parent, arrayIndex) {
        if (arrayIndex > 0) {
            swap(parent, arrayIndex - 1, arrayIndex);
        }
        return parent;
    });
};
exports.moveElementUp = moveElementUp;
var canMoveElementUp = function (xml, id) {
    if (id.length > 0) {
        return parseInt(id[id.length - 1], 10) > 0;
    }
    return false;
};
exports.canMoveElementUp = canMoveElementUp;
var canMoveElementDown = function (xml, id) {
    var idClone = id.slice(0);
    idClone.splice(-1, 1);
    var parent = (0, exports.getXmlNode)(xml, idClone);
    return Array.isArray(parent) &&
        id.length > 0 &&
        parent.length - 1 > parseInt(id[id.length - 1], 10);
};
exports.canMoveElementDown = canMoveElementDown;
var moveElementDown = function (xml, id) {
    return modifyElement(xml, id, function (parent, arrayIndex) {
        if (arrayIndex < parent.length - 1) {
            swap(parent, arrayIndex + 1, arrayIndex);
        }
        return parent;
    });
};
exports.moveElementDown = moveElementDown;
var newAttribute = function (parameter) {
    return function (xml, id) {
        return (0, exports.modifyXml)(xml, id, function (parent) {
            if (!parent.$) {
                parent.$ = {};
            }
            parent.$[parameter.name] = parameter.value;
            return parent;
        });
    };
};
exports.newAttribute = newAttribute;
var deleteElement = function (xml, id) {
    return (0, exports.deleteNode)(xml, id);
};
exports.deleteElement = deleteElement;
var deleteAttribute = function (xml, id) { return (0, exports.deleteNode)(xml, id); };
exports.deleteAttribute = deleteAttribute;
var push = function (arr) {
    var newValues = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        newValues[_i - 1] = arguments[_i];
    }
    var clone = arr.slice(0);
    clone.push.apply(clone, newValues);
    return clone;
};
exports.push = push;
var askPicklist = function (parameter) { return function (options) { return (React.createElement(AskPicklist_1.default, { actions: options.actions, id: options.id, parameter: parameter, xml: options.xml })); }; };
exports.askPicklist = askPicklist;
var askString = function (options) { return (React.createElement(AskString_1.default, { actions: options.actions, defaultValue: options.defaultValue, id: options.id, type: AskString_1.AskStringType.SHORT, xml: options.xml })); };
exports.askString = askString;
var askLongString = function (options) { return (React.createElement(AskString_1.default, { actions: options.actions, defaultValue: options.defaultValue, id: options.id, type: AskString_1.AskStringType.LONG, xml: options.xml })); };
exports.askLongString = askLongString;
//# sourceMappingURL=Util.js.map