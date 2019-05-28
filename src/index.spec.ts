import Builder from './index';

describe('Builder', () => {
  interface IPerson {
    name: string;
    age: number;
    isActive: boolean;
    123: string;
  }

  const seed: IPerson = {
    name: 'User name',
    age: 37,
    isActive: true,
    123: 'hello'
  };

  describe('construction', () => {
    it('returns a different instance on calls to build', () => {
      // Act
      const result = Builder.create<IPerson>(seed).build();

      // Assert
      expect(result).not.toBe(seed);
      expect(result).toEqual(seed);
    });

    [undefined, null].forEach(value => {
      it(`throws an error if the seed value is ${value}`, () => {
        expect(() => {
          const val = Builder.create<IPerson>(value as any);
        }).toThrow();
      });
    });
  });

  describe('with property', () => {
    let builder: Builder<IPerson>;
    beforeEach(() => {
      builder = Builder.create(seed);
    });

    it('sets the value of the specified property', () => {
      // Arrange
      const newName = 'Different Name';
      const newAge = 21;
      const newIsActive = false;
      const new123 = 'new 123';

      // Assert
      expect(builder.with('name', newName).build()).toEqual(expect.objectContaining({
        ...seed,
        name: newName
      }));

      expect(builder.with('age', newAge).build()).toEqual(expect.objectContaining({
        ...seed,
        age: newAge
      }));

      expect(builder.with('isActive', newIsActive).build()).toEqual(expect.objectContaining({
        ...seed,
        isActive: newIsActive
      }));

      expect(builder.with(123, new123).build()).toEqual(expect.objectContaining({
        ...seed,
        123: new123
      }));
    });
  });

  describe('with object', () => {
    let builder: Builder<IPerson>;
    beforeEach(() => {
      builder = Builder.create(seed);
    });

    it('sets the values of the specified properties', () => {
      // Arrange
      const newName = 'Different Name';
      const newIsActive = false;
      const new123 = 'new 123';

      // Act
      const result = builder.with({
        name: newName,
        isActive: newIsActive,
        123: new123
      }).build();

      // Assert
      expect(result).toEqual({
        ...seed,
        name: newName,
        isActive: newIsActive,
        123: new123
      });

      expect(builder.build()).toEqual(seed);
    });

    it('sets the values of the specified extended object properties', () => {
      // Arrange
      interface IExtendedPerson extends IPerson {
        isExtended: boolean;
      }

      const newName = 'Different Name';
      const newIsActive = false;
      const newIsExtended = true;

      // Act
      const result = builder.with<IExtendedPerson>({
        name: newName,
        isActive: newIsActive,
        isExtended: newIsExtended
      }).build();

      // Assert
      expect(result.name).toEqual(newName);
      expect(result.isActive).toEqual(newIsActive);
      expect(result.isExtended).toEqual(newIsExtended);

      expect(result.age).toEqual(seed.age);
      expect(result[123]).toEqual(seed[123]);

      expect(builder.build()).toEqual(seed);
    });
  });

  describe('without', () => {
    let builder: Builder<IPerson>;
    beforeEach(() => {
      builder = Builder.create(seed);
    });

    it('drops the specified property from the output', () => {
      expect(builder.without('name').build().name).not.toBeDefined();
      expect(builder.without('age').build().age).not.toBeDefined();
      expect(builder.without('isActive').build().isActive).not.toBeDefined();
      expect(builder.without(123).build()[123]).not.toBeDefined();
    });

    it('does not modify the original', () => {
      // Assert
      expect(builder.without('name').build()).toEqual(expect.objectContaining({
        age: seed.age,
        isActive: seed.isActive
      }));

      expect(builder.without('age').build()).toEqual(expect.objectContaining({
        name: seed.name,
        isActive: seed.isActive
      }));

      expect(builder.without('age', 'isActive').build()).toEqual(expect.objectContaining({
        name: seed.name
      }));
    });
  });

  describe('build', () => {
    let builder: Builder<IPerson>;
    beforeEach(() => {
      builder = Builder.create(seed);
    });

    it('returns a new object on each build', () => {
      // Act
      const first = builder.build();
      const second = builder.build();

      // Assert
      expect(first).not.toBe(seed);
      expect(second).not.toBe(seed);

      expect(second).not.toBe(first);

      expect(first).toEqual(seed);
      expect(second).toEqual(seed);
    });

    it('returns a new object on each build from a mutated source', () => {
      // Arrange
      const updatedName = 'Updated Name';
      builder = builder.with('name', updatedName);

      // Act
      const first = builder.build();
      const second = builder.build();

      // Assert
      expect(first).not.toBe(seed);
      expect(second).not.toBe(seed);

      expect(second).not.toBe(first);

      expect(first).not.toEqual(seed);
      expect(first.name).toEqual(updatedName);
      expect(second).toEqual(first);
    });
  });

  describe('chaining', () => {
    let builder: Builder<IPerson>;
    beforeEach(() => {
      builder = Builder.create(seed);
    });

    it('handles chaining of without then with key', () => {
      const b = builder
        .without('name', 'isActive')
        .with('age', 9999999)
        .build();

      expect(b.name).not.toBeDefined();
      expect(b.isActive).not.toBeDefined();
      expect(b.age).toBe(99);
    });

    it('handles chaining of without then with key when re-adding value', () => {
      const b = builder
        .without('name', 'age', 'isActive')
        .with('age', 99)
        .build();

      expect(b.name).not.toBeDefined();
      expect(b.isActive).not.toBeDefined();
      expect(b.age).toBe(99);
    });

    it('handles chaining of without then with object', () => {
      const b = builder
        .without('name', 'isActive')
        .with({
          age: 99
        })
        .build();

      expect(b.name).not.toBeDefined();
      expect(b.isActive).not.toBeDefined();
      expect(b.age).toBe(99);
    });

    it('handles chaining of without then with object when re-adding value', () => {
      const b = builder
        .without('name', 'age', 'isActive')
        .with({
          age: 99
        })
        .build();

      expect(b.name).not.toBeDefined();
      expect(b.isActive).not.toBeDefined();
      expect(b.age).toBe(99);
    });
  });

  describe('buildMany', () => {
    let builder: Builder<IPerson>;
    beforeEach(() => {
      builder = Builder.create(seed);
    });

    it('returns an empty array when building 0 items', () => {
      const b = builder.buildMany(0);
      expect(b).toHaveLength(0);
    });

    it('returns an empty array when building < 0 items', () => {
      const b = builder.buildMany(-1);
      expect(b).toHaveLength(0);
    });

    it('returns the correct number of items', () => {
      const b = builder.buildMany(5);
      expect(b).toHaveLength(5);

      b.forEach((x) => expect(x).toEqual(seed));
    });

    it('returns the correct number of manipulated items', () => {
      const b = builder.buildMany(5, (builder, i) => builder.with({ age: i }));
      expect(b).toHaveLength(5);

      b.forEach((x, i) => expect(x).toEqual({
        ...seed,
        age: i
      }));
    });

    it('returns the correct number of manipulated items with multiple changes', () => {
      const b = builder.buildMany(
        5,
        (builder, i) => builder
          .with({ age: i })
          .without('name')
      );

      expect(b).toHaveLength(5);

      b.forEach((x, i) => expect(x).toEqual({
        ...seed,
        age: i,
        name: undefined
      }));
    });
  });
});
