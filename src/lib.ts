export * from "./core/either";
export * as maybe from "./core/maybe";
export * as option from "./core/option";
export {
  err,
  isErr,
  isOk,
  mapErr,
  ok,
  tapErr,
  type ChainableResult,
  type Err,
  type Ok,
  type Result,
  type ResultMethods,
} from "./core/result";
export {
  fromNullable,
  isNone,
  isSome,
  none,
  some,
  toNullable,
  type ChainableOption,
  type None,
  type Option,
  type OptionMethods,
  type Some,
} from "./core/option";
export {
  isJust,
  isNothing,
  just,
  nothing,
  type ChainableMaybe,
  type Just,
  type Maybe,
  type MaybeMethods,
  type Nothing,
} from "./core/maybe";
