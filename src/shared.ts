export type FluentCurry<T, Return> = T extends never ? never : (
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
