import {
  type ChainableOption,
  type None,
  type Option,
  type OptionMethods,
  type Some,
  filter as optionFilter,
  flatMap as optionFlatMap,
  fold as optionFold,
  fromNullable as optionFromNullable,
  getOrElse as optionGetOrElse,
  isNone as optionIsNone,
  isSome as optionIsSome,
  map as optionMap,
  match as optionMatch,
  none as optionNone,
  orElse as optionOrElse,
  some as optionSome,
  tap as optionTap,
  toNullable as optionToNullable,
} from "./option";

export type Nothing = None;
export type Just<A> = Some<A>;
export type Maybe<A> = Option<A>;
export type MaybeMethods<A> = OptionMethods<A>;
export type ChainableMaybe<A> = ChainableOption<A>;

export const nothing = optionNone;
export const just = optionSome;
export const isNothing = optionIsNone;
export const isJust = optionIsSome;
export const fromNullable = optionFromNullable;
export const toNullable = optionToNullable;
export const map = optionMap;
export const flatMap = optionFlatMap;
export const fold = optionFold;
export const match = optionMatch;
export const getOrElse = optionGetOrElse;
export const orElse = optionOrElse;
export const filter = optionFilter;
export const tap = optionTap;
