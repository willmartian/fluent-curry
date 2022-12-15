import { describe, expect, test } from "vitest";
import { fromList, fromObject } from "../src";

describe("fromObj", () => {
  suite(
    uncurriedObj({ name: "Will", age: 25, color: "Blue" }),
    curriedObj,
  );
});

describe("fromList", () => {
  suite(
    uncurriedList("Will", 25, "Blue"),
    curriedList,
  );
});

const uncurriedObj = (
  args: {
    name: string;
    age: number;
    color: string;
  },
) => {
  return args;
};
const curriedObj = fromObject(uncurriedObj);

const uncurriedList = (
  name: string,
  age: number,
  color: string,
) => {
  return { name, age, color };
};
const curriedList = fromList(uncurriedList, ["name", "age", "color"]);

const suite = (
  baseRes: any,
  curried: typeof curriedObj | typeof curriedList,
) => {
  test("basic", () => {
    expect(
      baseRes,
    ).toEqual(
      curried.name("Will").age(25).color("Blue").call(),
    );
  });

  test("partial applications", () => {
    const withName = curried.name("Will");
    expect(
      baseRes,
    ).toEqual(
      withName.age(25).color("Blue").call(),
    );

    const withNameAge = withName.age(25);
    expect(
      baseRes,
    ).toEqual(
      withNameAge.color("Blue").call(),
    );

    const withAll = withNameAge.color("Blue");
    expect(
      baseRes,
    ).toEqual(
      withAll.call(),
    );
  });

  test("call with extra params", () => {
    expect(
      baseRes,
    ).toEqual(
      curried.call({ name: "Will", age: 25, color: "Blue" }),
    );

    const withName = curried.name("Will");
    expect(
      baseRes,
    ).toEqual(
      withName.call({ age: 25, color: "Blue" }),
    );

    const withNameAge = withName.age(25);
    expect(
      baseRes,
    ).toEqual(
      withNameAge.call({ color: "Blue" }),
    );
  });
};
