import { cloneDeep, set, isNil } from 'lodash';

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

  with<K extends keyof T>(data: Partial<T>): Builder<T>;
  with<K extends keyof T>(property: K, value: T[K]): Builder<T>;
  with<K extends keyof T>(keyOrObject: K | Partial<T>, value?: any): Builder<T> {
    if (typeof keyOrObject === 'string') {
      return this.withProperty(keyOrObject, value);
    }

    return this.withObject(keyOrObject);
  }

  private withProperty<K extends keyof T>(property: K, value: T[K]): Builder<T> {
    const updated = set(cloneDeep(this.instance), property, value);
    return new Builder(updated);
  }

  private withObject(data: { [P in keyof T]?: T[P] }): Builder<T> {
    const cloned = cloneDeep(this.instance);

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        set(cloned, key, data[key]);
      }
    }

    return new Builder(cloned);
  }

  without(...properties: Array<keyof T>): Builder<T> {
    this.withoutProperties.push(...properties);
    return this;
  }

  build(): T {
    const cloned = cloneDeep(this.instance);
    this.withoutProperties.forEach((prop) => {
      delete cloned[prop];
    });

    return cloned;
  }
}
