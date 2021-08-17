declare module "d3plus-common" {
  interface BaseClassConfig<T> {
    locale: string | d3plus.FormatLocale;
    on: Record<string, (evt: Event) => void>;
    translate: (label: string) => string;
  }

  type AccessorFn<T> = (d: T, index: number) => T[keyof T];
  type Accessor<T> = keyof T | AccessorFn<T>;
  type TypedAccessorFn<T, U> = (d: T, index: number) => U;
  type TypedAccessor<T, U> = U | TypedAccessorFn<T, U>
  type StringLike = { toString(): string };

  type SorterFn<T> = (a: T, b: T) => number;
  type FilterFn<T> = (d: T, index: number) => boolean;

  export class BaseClass<T> { }

  export function assign<T>(target: Partial<T>, ...args: Partial<T>[]): Partial<T>;
  export function uuid(): string;
}
