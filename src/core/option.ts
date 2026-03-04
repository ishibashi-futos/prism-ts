export type None = Readonly<{
  _tag: "None";
}>;

export type Some<A> = Readonly<{
  _tag: "Some";
  value: A;
}>;

export type Option<A> = None | Some<A>;

export interface OptionMethods<A> {
  isSome(): this is Some<A> & OptionMethods<A>;
  isNone(): this is None & OptionMethods<A>;
  map<B>(fn: (value: A) => B): ChainableOption<B>;
  flatMap<B>(
    fn: (value: A) => Option<B> | ChainableOption<B>,
  ): ChainableOption<B>;
  fold<B>(onNone: () => B, onSome: (value: A) => B): B;
  match<B>(patterns: { None: () => B; Some: (value: A) => B }): B;
  getOrElse(fallback: () => A): A;
  orElse(onNone: () => Option<A> | ChainableOption<A>): ChainableOption<A>;
  filter(predicate: (value: A) => boolean): ChainableOption<A>;
  tap(effect: (value: A) => void): ChainableOption<A>;
  toNullable(): A | null;
}

export type ChainableOption<A> = Option<A> & OptionMethods<A>;

type AnyOption = Option<unknown>;

const optionPrototype = {
  isSome(this: AnyOption): boolean {
    return isSome(this);
  },
  isNone(this: AnyOption): boolean {
    return isNone(this);
  },
  map<B>(this: AnyOption, fn: (value: unknown) => B): ChainableOption<B> {
    return map(this, fn);
  },
  flatMap<B>(
    this: AnyOption,
    fn: (value: unknown) => Option<B> | ChainableOption<B>,
  ): ChainableOption<B> {
    return flatMap(this, fn);
  },
  fold<B>(this: AnyOption, onNone: () => B, onSome: (value: unknown) => B): B {
    return fold(this, onNone, onSome);
  },
  match<B>(
    this: AnyOption,
    patterns: { None: () => B; Some: (value: unknown) => B },
  ): B {
    return match(this, patterns);
  },
  getOrElse(this: AnyOption, fallback: () => unknown): unknown {
    return getOrElse(this, fallback);
  },
  orElse(
    this: AnyOption,
    onNone: () => Option<unknown> | ChainableOption<unknown>,
  ): ChainableOption<unknown> {
    return orElse(this, onNone);
  },
  filter(
    this: AnyOption,
    predicate: (value: unknown) => boolean,
  ): ChainableOption<unknown> {
    return filter(this, predicate);
  },
  tap(
    this: AnyOption,
    effect: (value: unknown) => void,
  ): ChainableOption<unknown> {
    return tap(this, effect);
  },
  toNullable(this: AnyOption): unknown | null {
    return toNullable(this);
  },
};

const withMethods = <A>(option: Option<A>): ChainableOption<A> =>
  Object.setPrototypeOf(option, optionPrototype) as ChainableOption<A>;

const ensureMethods = <A>(
  option: Option<A> | ChainableOption<A>,
): ChainableOption<A> =>
  Object.getPrototypeOf(option) === optionPrototype
    ? (option as ChainableOption<A>)
    : withMethods(option as Option<A>);

/** Creates an Option in the Some state. */
export const some = <A>(value: A): ChainableOption<A> =>
  withMethods({
    _tag: "Some",
    value,
  });

/** Creates an Option in the None state. */
export const none = <A = never>(): ChainableOption<A> =>
  withMethods({
    _tag: "None",
  });

/** Returns true when the Option is Some. */
export const isSome = <A>(option: Option<A>): option is Some<A> =>
  option._tag === "Some";

/** Returns true when the Option is None. */
export const isNone = <A>(option: Option<A>): option is None =>
  option._tag === "None";

/** Creates an Option from a nullable value. */
export const fromNullable = <A>(
  value: A | null | undefined,
): ChainableOption<A> => (value == null ? none<A>() : some(value));

/** Converts an Option into a nullable value. */
export const toNullable = <A>(option: Option<A>): A | null =>
  isSome(option) ? option.value : null;

/** Maps the Some value of an Option. */
export const map = <A, B>(
  option: Option<A>,
  fn: (value: A) => B,
): ChainableOption<B> => (isSome(option) ? some(fn(option.value)) : none());

/** Flat maps the Some value of an Option. */
export const flatMap = <A, B>(
  option: Option<A>,
  fn: (value: A) => Option<B> | ChainableOption<B>,
): ChainableOption<B> =>
  isSome(option) ? ensureMethods(fn(option.value)) : none();

/** Folds an Option into a single value. */
export const fold = <A, B>(
  option: Option<A>,
  onNone: () => B,
  onSome: (value: A) => B,
): B => (isSome(option) ? onSome(option.value) : onNone());

/** Pattern matching helper for Option. */
export const match = <A, B>(
  option: Option<A>,
  patterns: {
    None: () => B;
    Some: (value: A) => B;
  },
): B => (isSome(option) ? patterns.Some(option.value) : patterns.None());

/** Extracts the Some value or computes a fallback from None. */
export const getOrElse = <A>(option: Option<A>, fallback: () => A): A =>
  isSome(option) ? option.value : fallback();

/** Recovers from None by providing another Option. */
export const orElse = <A>(
  option: Option<A>,
  onNone: () => Option<A> | ChainableOption<A>,
): ChainableOption<A> =>
  isSome(option) ? ensureMethods(option) : ensureMethods(onNone());

/** Keeps Some only when predicate returns true. */
export const filter = <A>(
  option: Option<A>,
  predicate: (value: A) => boolean,
): ChainableOption<A> =>
  isSome(option) && predicate(option.value) ? ensureMethods(option) : none();

/** Runs a side effect for Some without changing the Option. */
export const tap = <A>(
  option: Option<A>,
  effect: (value: A) => void,
): ChainableOption<A> => {
  if (isSome(option)) {
    effect(option.value);
  }
  return ensureMethods(option);
};
