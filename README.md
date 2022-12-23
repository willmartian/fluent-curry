# fluent-curry
[![npm](https://img.shields.io/npm/v/fluent-curry)](https://www.npmjs.com/package/fluent-curry)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/fluent-curry)](https://bundlephobia.com/package/fluent-curry)

Curry functions using a type-safe fluent API.

```ts
curried.name('Will').age(25).call()
```

## Example: Multiple paramters

For functions that take multiple parameters, we must supply an array of paramter names in the same order that they appear in the function signature.

```ts
const adLib = (name: string, age: number) => {
  return `${name} is ${age}.`;
};

const curried = fluentCurry(adLib, ['name', 'age']);

curried.name('Will').age(25).call() === adLib('Will', 25);

```

## Example: Options object

For functions that take a single object parameter, the type of the curried result is infered from the object parameter type.

```ts
import { fluentCurry } from "fluent-curry";

const adLib = (args: { name: string; age: number; }) => {
  return `${args.name} is ${args.age}.`;
};

const curried = fluentCurry(adLib);

curried.name('Will').age(25).call() === adLib({ name: 'Will', age: 25 });

```

## Partial Applications

`fluent-curry` makes working with partial applications easy. Create reusable logic without a cumbersome `bind` method.

```ts

const partialWill = curried.name('Will');

partialWill.age(25).call() === adLib({ name: 'Will', age: 25 });

```

Any parameters that have not been previously applied can be supplied in the `call` function as an options object.

```ts

// Call with Parameters

partialWill.call({ age: 25 }) === adLib({ name: 'Will', age: 25 });

curried.call({ name: 'Will', age: 25 }) === adLib({ name: 'Will', age: 25 });

```

## Why?

Currying (and, relatedly, partial applications) are two powerful patterns in functional programming. However, the traditional approach to currying has poor syntax.

```ts
const func = (a, b, c) => {}
const curried = curry(func);

curried('foo')('bar')('foobar');

```

While terse, using positional arguments sacrifices readability. Furthermore, this syntax tends to trip up programmers with less functional programming experience.

Traditional currying also makes it difficult to skip over optional arguments or create partial applications--usually, libraries will rely on some sort of special skip value:

```ts
import { _ } from 'some-other-curry-library';

const partialBar = curried(_)('bar')(_);
```

While the approach taken by `fluent-curry` definitely requires more typing, it is always clear to the developer what argument is being passed. Arguments can also occur in any order, and can be easily left off to create partial applications.

```ts

const curried = fluentCurry((a: number, b: number, c: number) => {
  return a + b + c;
}, ['a', 'b', 'c'])

const abc = curried.a(1).b(2).c(3).call();
const bca = curried.b(2).c(3).a(1).call();
const cba = curried.c(3).b(2).a(1).call();
const ab = curried.a(1).b(2);

abc === bca === cba === ab.c(3).call();
```
