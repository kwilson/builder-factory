# builder-factory
Factory for creating basic object types during testing.

## Usage

### Create A Builder
Each builder instance is initialised with a seed object. This will be the default return object of that instance's `build` call.

```js
import Builder from 'builder-factory';

const builder = Builder.create({
  name: 'User name',
  age: 37,
  isActive: true
});

console.log(builder.build());
// { name: 'User name', age: 37, isActive: true }
```

### Set Values
Use `with` to set values.

```js
const updated = builder.with('age', 21);

console.log(updated.build());
// { name: 'User name', age: 21, isActive: true }
```

The original value is not mutated.
```js
console.log(builder.build());
// { name: 'User name', age: 37, isActive: true }
```


### Drop Values
Use `without` to drop values.

```js
const updated = builder.without('age');

console.log(updated.build());
// { name: 'User name', isActive: true }
```

The original value is not mutated.
```js
console.log(builder.build());
// { name: 'User name', age: 37, isActive: true }
```
