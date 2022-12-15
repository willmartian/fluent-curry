import { FluentCurry } from "./shared";

type AllowedArgs = {
  [key: string]: any;
} & { call?: never };

/**
 * Transform a function that takes an argument object into a fluent curried function.
 * @param func The function to curry.
 * @param paramNames A tuple of parameter names for the supplied function.
 */
export const fromObject = <FirstParam extends AllowedArgs, Return>(
  func: (arg: FirstParam) => Return,
) => {
  return new Proxy({
    _args: {} as any,
  }, {
    get(target, p, receiver) {
      if (p === "call") {
        return function call(
          missingArgs = {},
        ) {
          return func.call(
            null,
            { ...target._args, ...missingArgs } as FirstParam,
          );
        };
      }

      return (arg: unknown) => {
        target._args[p] = arg;
        return receiver;
      };
    },
  }) as unknown as FluentCurry<FirstParam, Return>;
};
