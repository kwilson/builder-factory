export default class Builder<T extends object> {
    private instance;
    private withoutProperties;
    static create<T extends object>(instance: T): default<T>;
    private constructor();
    with(property: keyof T, value: any): Builder<T>;
    without(...properties: Array<keyof T>): Builder<T>;
    build(): T;
}
