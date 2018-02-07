# builder-factory
Factory for creating basic object types during testing.

## Usage

### Create A Builder
Each builder instance is initialised with a seed object. This will be the default return object of that instance's `build` call.

```js
import * as Builder from 'builder';

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
builder.with('age', 21);

console.log(builder.build());
// { name: 'User name', age: 21, isActive: true }
```

### Drop Values
Use `without` to drop values.

```js
builder.without('age');

console.log(builder.build());
// { name: 'User name', isActive: true }
```
