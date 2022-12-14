# fluent-curry

Curry functions using a type-safe fluent API.

## Examples 

```ts
import { fluentCurry } from "fluent-curry";

const adLib = (args: { name: string; age: number; }) => {
  return `${args.name} is ${args.adjective}.`;
};

const curried = fluentCurry(adLib);

curried.name('Will').age(25).call() === adLib({ name: 'Will', age: 25 });

// Partial Applications

const partialWill = curried.name('Will');

partialWill.age(25).call() === adLib({ name: 'Will', age: 25 });

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

While terse, using positional arguments sacrifices readability. Furthemore, this syntax tends to trip up programmers with less functional programming experience.

Traditional currying also makes it difficult to skip over optional arguments or create partial applications--usually, libraries rely on some sort of special skip value:

```ts
import { _ } from 'some-curry-library';

const partialBar = curried(_)('bar')(_);
```

While the approach taken by `fluent-curry` definitely requires more typing, it is always clear to the developer what argument is being passed. Arguments can also occur in any order, and can be easily left off to create partial applications.