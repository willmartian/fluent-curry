type FluentCurry<T, Return> = T extends never ? never : (
  & {
    [Prop in keyof T]-?: (
      value: UndefinedToVoid<T[Prop]>,
    ) => FluentCurry<Omit<T, Prop>, Return>;
  }
  & {
    call: T extends EmptyObject ? () => Return : (args: T) => Return;
  }
);

type UndefinedToVoid<T> = T extends undefined ? Exclude<T | void, undefined>
  : T;

type EmptyObject = {
  [K in any]: never;
};

type StringTuple<T> = {
  [P in keyof T]: string;
};

/**
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

type AllowedArgs = {
  [key: string]: any;
} & { call?: never };

function fluentCurry<
  Args extends any[],
  Return,
  K extends StringTuple<Args>,
>(
  func: (...args: Args) => Return,
  paramList: readonly [...K],
): FluentCurry<Reducer<K, Args>, Return>;

function fluentCurry<FirstParam extends AllowedArgs, Return>(
  func: (arg: FirstParam) => Return,
): FluentCurry<FirstParam, Return>;

function fluentCurry(func: Function, paramList?: readonly string[]): unknown {
  const argMap: (args: Record<string, any>) => any[] = paramList 
    ? args => paramList.map((k) => args[k as string]) 
    : args => [args];

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
            argMap(combinedArgs),
          );
        };
      }

      return (arg: unknown) => {
        target._args[p] = arg;
        return receiver;
      };
    },
  });
}

export { fluentCurry };
