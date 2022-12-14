type FluentCurry<T, Return> = T extends never ? never : (
  & {
    [Prop in keyof T]-?: (
      arg: UndefinedToVoid<T[Prop]>,
    ) => FluentCurry<Omit<T, Prop>, Return>;
  }
  & {
    call: T extends EmptyObject ? () => Return : (arg: T) => Return;
  }
);

type UndefinedToVoid<T> = T extends undefined ? Exclude<T | void, undefined>
  : T;

type EmptyObject = {
  [K in any]: never;
}

type AllowedArgs = {
  [key: string]: any
} & { call?: never };

export const fluentCurry = <FirstParam extends AllowedArgs, Return>(func: (arg: FirstParam) => Return) => {
  return new Proxy({
    _args: {},
  }, {
    get(target, p, receiver) {
      if (p === "call") {
        return function call(
          missingArgs = {}
        ) {
          return func.call(null, { ...target._args, ...missingArgs } as FirstParam);
        };
      }

      return (arg: unknown) => {
        target._args = { ...target._args, [p]: arg };
        return receiver;
      };
    },
  }) as unknown as FluentCurry<FirstParam, Return>;
};
