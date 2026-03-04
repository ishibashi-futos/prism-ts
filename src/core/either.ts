export type Left<E> = Readonly<{
  _tag: "Left";
  left: E;
}>;

export type Right<A> = Readonly<{
  _tag: "Right";
  right: A;
}>;

export type Either<E, A> = Left<E> | Right<A>;

export interface EitherMethods<E, A> {
  isLeft(): this is Left<E> & EitherMethods<E, A>;
  isRight(): this is Right<A> & EitherMethods<E, A>;
  map<B>(fn: (value: A) => B): ChainableEither<E, B>;
  mapLeft<F>(fn: (error: E) => F): ChainableEither<F, A>;
  flatMap<F, B>(
    fn: (value: A) => Either<F, B> | ChainableEither<F, B>,
  ): ChainableEither<E | F, B>;
  fold<B>(onLeft: (error: E) => B, onRight: (value: A) => B): B;
  match<B>(patterns: { Left: (error: E) => B; Right: (value: A) => B }): B;
  getOrElse(onLeft: (error: E) => A): A;
  orElse<F, B>(
    onLeft: (error: E) => Either<F, B> | ChainableEither<F, B>,
  ): ChainableEither<F, A | B>;
  swap(): ChainableEither<A, E>;
  tap(effect: (value: A) => void): ChainableEither<E, A>;
  tapLeft(effect: (error: E) => void): ChainableEither<E, A>;
}

export type ChainableEither<E, A> = Either<E, A> & EitherMethods<E, A>;

type AnyEither = Either<unknown, unknown>;

const eitherPrototype = {
  isLeft(this: AnyEither): boolean {
    return isLeft(this);
  },
  isRight(this: AnyEither): boolean {
    return isRight(this);
  },
  map<B>(
    this: AnyEither,
    fn: (value: unknown) => B,
  ): ChainableEither<unknown, B> {
    return map(this, fn);
  },
  mapLeft<F>(
    this: AnyEither,
    fn: (error: unknown) => F,
  ): ChainableEither<F, unknown> {
    return mapLeft(this, fn);
  },
  flatMap<F, B>(
    this: AnyEither,
    fn: (value: unknown) => Either<F, B> | ChainableEither<F, B>,
  ): ChainableEither<unknown | F, B> {
    return flatMap(this, fn);
  },
  fold<B>(
    this: AnyEither,
    onLeft: (error: unknown) => B,
    onRight: (value: unknown) => B,
  ): B {
    return fold(this, onLeft, onRight);
  },
  match<B>(
    this: AnyEither,
    patterns: { Left: (error: unknown) => B; Right: (value: unknown) => B },
  ): B {
    return match(this, patterns);
  },
  getOrElse(this: AnyEither, onLeft: (error: unknown) => unknown): unknown {
    return getOrElse(this, onLeft);
  },
  orElse<F, B>(
    this: AnyEither,
    onLeft: (error: unknown) => Either<F, B> | ChainableEither<F, B>,
  ): ChainableEither<F, unknown | B> {
    return orElse(this, onLeft);
  },
  swap(this: AnyEither): ChainableEither<unknown, unknown> {
    return swap(this);
  },
  tap(
    this: AnyEither,
    effect: (value: unknown) => void,
  ): ChainableEither<unknown, unknown> {
    return tap(this, effect);
  },
  tapLeft(
    this: AnyEither,
    effect: (error: unknown) => void,
  ): ChainableEither<unknown, unknown> {
    return tapLeft(this, effect);
  },
};

const withMethods = <E, A>(either: Either<E, A>): ChainableEither<E, A> =>
  Object.setPrototypeOf(either, eitherPrototype) as ChainableEither<E, A>;

const ensureMethods = <E, A>(
  either: Either<E, A> | ChainableEither<E, A>,
): ChainableEither<E, A> =>
  Object.getPrototypeOf(either) === eitherPrototype
    ? (either as ChainableEither<E, A>)
    : withMethods(either as Either<E, A>);

/** Creates an Either in the Left state. */
export const left = <E, A = never>(value: E): ChainableEither<E, A> =>
  withMethods({
    _tag: "Left",
    left: value,
  });

/** Creates an Either in the Right state. */
export const right = <A, E = never>(value: A): ChainableEither<E, A> =>
  withMethods({
    _tag: "Right",
    right: value,
  });

/** Returns true when the Either is Left. */
export const isLeft = <E, A>(either: Either<E, A>): either is Left<E> =>
  either._tag === "Left";

/** Returns true when the Either is Right. */
export const isRight = <E, A>(either: Either<E, A>): either is Right<A> =>
  either._tag === "Right";

/** Maps the Right value of an Either. */
export const map = <E, A, B>(
  either: Either<E, A>,
  fn: (value: A) => B,
): ChainableEither<E, B> =>
  isRight(either) ? right(fn(either.right)) : ensureMethods(either);

/** Maps the Left value of an Either. */
export const mapLeft = <E, A, F>(
  either: Either<E, A>,
  fn: (error: E) => F,
): ChainableEither<F, A> =>
  isLeft(either) ? left(fn(either.left)) : ensureMethods(either);

/** Flat maps the Right value of an Either. */
export const flatMap = <E, A, F, B>(
  either: Either<E, A>,
  fn: (value: A) => Either<F, B> | ChainableEither<F, B>,
): ChainableEither<E | F, B> =>
  isRight(either) ? ensureMethods(fn(either.right)) : ensureMethods(either);

/** Folds an Either into a single value. */
export const fold = <E, A, B>(
  either: Either<E, A>,
  onLeft: (error: E) => B,
  onRight: (value: A) => B,
): B => (isLeft(either) ? onLeft(either.left) : onRight(either.right));

/** Pattern matching helper for Either. */
export const match = <E, A, B>(
  either: Either<E, A>,
  patterns: {
    Left: (error: E) => B;
    Right: (value: A) => B;
  },
): B =>
  isLeft(either) ? patterns.Left(either.left) : patterns.Right(either.right);

/** Extracts the Right value or computes a fallback from Left. */
export const getOrElse = <E, A>(
  either: Either<E, A>,
  onLeft: (error: E) => A,
): A => (isRight(either) ? either.right : onLeft(either.left));

/** Recovers from Left by providing another Either. */
export const orElse = <E, A, F, B>(
  either: Either<E, A>,
  onLeft: (error: E) => Either<F, B> | ChainableEither<F, B>,
): ChainableEither<F, A | B> =>
  isLeft(either) ? ensureMethods(onLeft(either.left)) : ensureMethods(either);

/** Swaps Left and Right. */
export const swap = <E, A>(either: Either<E, A>): ChainableEither<A, E> =>
  isLeft(either) ? right(either.left) : left(either.right);

/** Runs a side effect for Right without changing the Either. */
export const tap = <E, A>(
  either: Either<E, A>,
  effect: (value: A) => void,
): ChainableEither<E, A> => {
  if (isRight(either)) {
    effect(either.right);
  }
  return ensureMethods(either);
};

/** Runs a side effect for Left without changing the Either. */
export const tapLeft = <E, A>(
  either: Either<E, A>,
  effect: (error: E) => void,
): ChainableEither<E, A> => {
  if (isLeft(either)) {
    effect(either.left);
  }
  return ensureMethods(either);
};
