import { expect, test } from "vitest";
import { fluentCurry } from "../src/fluentCurry";

const uncurried = (
  args: {
    name: string;
    age: number;
    color: string;
  },
) => {
  return args;
};
const curried = fluentCurry(uncurried);

test("basic", () => {
    expect(
        uncurried({ name: 'Will', age: 25, color: 'Blue' })
    ).toEqual(
        curried.name('Will').age(25).color('Blue').call()
    )
});

test("partial applications", () => {
    const baseRes = uncurried({ name: 'Bill', age: 25, color: 'Blue' });
    const withName = curried.name('Bill');

    expect(
        baseRes
    ).toEqual(
        withName.age(25).color('Blue').call()
    )

    const withNameAge = withName.age(25);

    expect(
        baseRes
    ).toEqual(
        withNameAge.color('Blue').call()
    )

    const withAll = withNameAge.color('Blue');

    expect(
        baseRes
    ).toEqual(
        withAll.call()
    )
});

test("call with params", () => {
    const baseRes = uncurried({ name: 'Bill', age: 25, color: 'Blue' });
    expect(
        baseRes
    ).toEqual(
        curried.call({ name: 'Bill', age: 25, color: 'Blue' })
    ) 
    
    const withName = curried.name('Bill');

    expect(
        baseRes
    ).toEqual(
        withName.call({ age: 25, color: 'Blue' })
    )

    const withNameAge = withName.age(25);

    expect(
        baseRes
    ).toEqual(
        withNameAge.call({ color: 'Blue' })
    )
});
