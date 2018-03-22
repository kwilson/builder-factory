import cloneDeep = require('lodash/cloneDeep');
import set = require('lodash/set');
import isNil = require('lodash/isNil');

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export default class Builder<T extends object> {
  static create<T extends object>(instance: T) {
    if (isNil(instance)) {
      throw Error(`Seed value cannot be null or undefined. Value was ${instance}.`);
    }

    return new Builder(instance);
  }

  private constructor(private instance: T, private withoutProperties: Array<keyof T> = []) {
  }

  with<TExtended extends T>(data: Partial<TExtended>): Builder<TExtended>;
  with<K extends keyof T>(property: K, value: T[K]): Builder<T>;
  with<K extends keyof T>(keyOrObject: K | Partial<T>, value?: any): Builder<T> {
    if (typeof keyOrObject === 'string') {
      return this.withProperty(keyOrObject, value);
    }

    return this.withObject(keyOrObject);
  }

  private withProperty<K extends keyof T>(property: K, value: T[K]): Builder<T> {
    const updated = set(cloneDeep(this.instance), property, value);
    const without = this.withoutProperties.filter((x) => x !== property);

    return new Builder(updated, without);
  }

  private withObject(data: { [P in keyof T]?: T[P] }): Builder<T> {
    const cloned = cloneDeep(this.instance);

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        set(cloned, key, data[key]);
      }
    }

    const dataKeys = Object.keys(data);
    const without = this.withoutProperties.filter((x) => dataKeys.indexOf(x) === -1);

    return new Builder(cloned, without);
  }

  without(...properties: Array<keyof T>): Builder<T> {
    const cloned = cloneDeep(this.instance);
    const without = [...this.withoutProperties, ...properties];

    return new Builder(cloned, without);
  }

  build(): T {
    const cloned = cloneDeep(this.instance);
    this.withoutProperties.forEach((prop) => {
      delete cloned[prop];
    });

    return cloned;
  }
}
