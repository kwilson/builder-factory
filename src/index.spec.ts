import Builder from './index';

describe('Builder', () => {
  interface IPerson {
    name: string;
    age: number;
    isActive: boolean;
  }

  const seed: IPerson = {
    name: 'User name',
    age: 37,
    isActive: true
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

  describe('with', () => {
    let builder: Builder<IPerson>;
    beforeEach(() => {
      builder = Builder.create(seed);
    });

    it('sets the value of the specified property', () => {
      // Arrange
      const newName = 'Different Name';
      const newAge = 21;
      const newIsActive = false;

      // Assert
      expect(builder.with('name', newName).build().name).toEqual(newName);
      expect(builder.with('age', newAge).build().age).toEqual(newAge);
      expect(builder.with('isActive', newIsActive).build().isActive).toEqual(newIsActive);
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
});
