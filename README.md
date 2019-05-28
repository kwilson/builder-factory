# builder-factory
Factory for creating basic object types during testing.

[![Build Status](https://kevinwilson.visualstudio.com/builder-factory/_apis/build/status/kwilson.builder-factory?branchName=master)](https://kevinwilson.visualstudio.com/builder-factory/_build/latest?definitionId=11&branchName=master)

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

### Build A Collection
If you want to build a collection of objects, use `buildMany`.

```js
import Builder from 'builder-factory';

const builder = Builder.create({
  name: 'User name',
  age: 37,
  isActive: true
});

console.log(builder.buildMany(5));
// [
//   { name: 'User name', age: 37, isActive: true },
//   { name: 'User name', age: 37, isActive: true },
//   { name: 'User name', age: 37, isActive: true },
//   { name: 'User name', age: 37, isActive: true },
//   { name: 'User name', age: 37, isActive: true }
// ]
```

You can optionally supply a factory wrapper to manipulate the items as they
are created.

```js
import Builder from 'builder-factory';

const builder = Builder.create({
  name: 'User name',
  age: 37,
  isActive: true
});

console.log(
  builder.buildMany(
    5,
    (builder, i) => builder.with({ age: i }).without('isActive')
  )
);
// [
//   { name: 'User name', age: 0 },
//   { name: 'User name', age: 1 },
//   { name: 'User name', age: 2 },
//   { name: 'User name', age: 3 },
//   { name: 'User name', age: 4 }
// ]
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

You can also set values by passing a compatible object:
```js
const updated = builder.with({
  age: 21,
  isActive: false
});

console.log(updated.build());
// { name: 'User name', age: 21, isActive: false }
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
