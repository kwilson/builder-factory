import { cloneDeep, set, isNil } from 'lodash';

export default class Builder<T extends object> {
  static create<T extends object>(instance: T) {
    if (isNil(instance)) {
      throw Error(`Seed value cannot be null or undefined. Value was ${instance}.`);
    }

    return new Builder(instance);
  }

  private constructor(private instance: T, private withoutProperties: Array<keyof T> = []) {
  }

  with(property: keyof T, value: any): Builder<T> {
    const cloned = cloneDeep(this.instance);
    set(cloned, property, value);
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
