import {
  flatMap as eitherFlatMap,
  fold as eitherFold,
  getOrElse as eitherGetOrElse,
  isLeft as eitherIsLeft,
  isRight as eitherIsRight,
  left as eitherLeft,
  map as eitherMap,
  mapLeft as eitherMapLeft,
  match as eitherMatch,
  orElse as eitherOrElse,
  right as eitherRight,
  swap as eitherSwap,
  tap as eitherTap,
  tapLeft as eitherTapLeft,
} from "./either";
import type {
  ChainableEither,
  Either,
  EitherMethods,
  Left,
  Right,
} from "./either";

export type Err<E> = Left<E>;
export type Ok<A> = Right<A>;
export type Result<E, A> = Either<E, A>;
export type ResultMethods<E, A> = EitherMethods<E, A>;
export type ChainableResult<E, A> = ChainableEither<E, A>;

export const err = eitherLeft;
export const ok = eitherRight;
export const isErr = eitherIsLeft;
export const isOk = eitherIsRight;
export const map = eitherMap;
export const mapErr = eitherMapLeft;
export const flatMap = eitherFlatMap;
export const fold = eitherFold;
export const match = eitherMatch;
export const getOrElse = eitherGetOrElse;
export const orElse = eitherOrElse;
export const swap = eitherSwap;
export const tap = eitherTap;
export const tapErr = eitherTapLeft;
