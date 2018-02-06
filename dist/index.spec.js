"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
describe('Builder', function () {
    var seed = {
        name: 'User name',
        age: 37,
        isActive: true
    };
    describe('construction', function () {
        it('returns a different instance on calls to build', function () {
            // Act
            var result = _1.Builder.create(seed).build();
            // Assert
            expect(result).not.toBe(seed);
            expect(result).toEqual(seed);
        });
        [undefined, null].forEach(function (value) {
            it("throws an error if the seed value is " + value, function () {
                expect(function () {
                    var val = _1.Builder.create(value);
                }).toThrow();
            });
        });
    });
    describe('with', function () {
        var builder;
        beforeEach(function () {
            builder = _1.Builder.create(seed);
        });
        it('sets the value of the specified property', function () {
            // Arrange
            var newName = 'Different Name';
            var newAge = 21;
            var newIsActive = false;
            // Assert
            expect(builder.with('name', newName).build().name).toEqual(newName);
            expect(builder.with('age', newAge).build().age).toEqual(newAge);
            expect(builder.with('isActive', newIsActive).build().isActive).toEqual(newIsActive);
        });
    });
    describe('without', function () {
        var builder;
        beforeEach(function () {
            builder = _1.Builder.create(seed);
        });
        it('drops the specified property from the output', function () {
            expect(builder.without('name').build().name).not.toBeDefined();
            expect(builder.without('age').build().age).not.toBeDefined();
            expect(builder.without('isActive').build().isActive).not.toBeDefined();
        });
    });
    describe('build', function () {
        var builder;
        beforeEach(function () {
            builder = _1.Builder.create(seed);
        });
        it('returns a new object on each build', function () {
            // Act
            var first = builder.build();
            var second = builder.build();
            // Assert
            expect(first).not.toBe(seed);
            expect(second).not.toBe(seed);
            expect(second).not.toBe(first);
            expect(first).toEqual(seed);
            expect(second).toEqual(seed);
        });
        it('returns a new object on each build from a mutated source', function () {
            // Arrange
            var updatedName = 'Updated Name';
            builder = builder.with('name', updatedName);
            // Act
            var first = builder.build();
            var second = builder.build();
            // Assert
            expect(first).not.toBe(seed);
            expect(second).not.toBe(seed);
            expect(second).not.toBe(first);
            expect(first).not.toEqual(seed);
            expect(first.name).toEqual(updatedName);
            expect(second).toEqual(first);
        });
    });
});
