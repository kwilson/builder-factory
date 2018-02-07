"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Builder = /** @class */ (function () {
    function Builder(instance, withoutProperties) {
        if (withoutProperties === void 0) { withoutProperties = []; }
        this.instance = instance;
        this.withoutProperties = withoutProperties;
    }
    Builder.create = function (instance) {
        if (lodash_1.isNil(instance)) {
            throw Error("Seed value cannot be null or undefined. Value was " + instance + ".");
        }
        return new Builder(instance);
    };
    Builder.prototype.with = function (property, value) {
        var cloned = lodash_1.cloneDeep(this.instance);
        lodash_1.set(cloned, property, value);
        return new Builder(cloned);
    };
    Builder.prototype.without = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        (_a = this.withoutProperties).push.apply(_a, properties);
        return this;
        var _a;
    };
    Builder.prototype.build = function () {
        var cloned = lodash_1.cloneDeep(this.instance);
        this.withoutProperties.forEach(function (prop) {
            delete cloned[prop];
        });
        return cloned;
    };
    return Builder;
}());
exports.default = Builder;
