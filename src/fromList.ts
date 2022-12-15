import { FluentCurry } from "./shared";

type StringTuple<T> = {
  [P in keyof T]: string;
};

/**
 * This seems overly complicated. We are just trying to map a tuple to an object.
 * https://stackoverflow.com/a/69143630
 */
type Reducer<
  Keys extends Array<string>,
  Values extends Array<unknown>,
  Result extends Record<number, unknown> = {},
  Index extends number[] = [],
> = Values extends [] ? Result
  : Values extends [infer Head, ...infer Tail] ? Reducer<
      Keys,
      [...Tail],
      Result & Record<Keys[Index["length"]], Head>,
      [...Index, 1]
    >
  : Readonly<Result>;

/**
 * Transform a function that takes positional arguments into a fluent curried function.
 * @param func The function to curry.
 * @param paramList A tuple of parameter names for the supplied function.
 */
export const fromList = <
  Args extends any[],
  Return,
  K extends StringTuple<Args>,
>(
  func: (...args: Args) => Return,
  paramList: readonly [...K],
) => {
  return new Proxy({
    _args: {} as any,
  }, {
    get(target, p, receiver) {
      if (p === "call") {
        return function call(
          missingArgs = {},
        ) {
          const combinedArgs = { ...target._args, ...missingArgs } as Record<
            string,
            any
          >;
          return func.apply(
            null,
            paramList.map((k) => combinedArgs[k as string]) as Args,
          );
        };
      }

      return (arg: unknown) => {
        target._args[p] = arg;
        return receiver;
      };
    },
  }) as unknown as FluentCurry<Reducer<K, Args>, Return>;
};
