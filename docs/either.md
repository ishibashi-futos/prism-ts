# Either API

`Either<E, A>` is a tagged union for computations that can fail.

- `Left<E>`: failure branch (`_tag: "Left"`)
- `Right<A>`: success branch (`_tag: "Right"`)

## Import

```ts
import {
  type Either,
  left,
  right,
  isLeft,
  isRight,
  map,
  mapLeft,
  flatMap,
  fold,
  match,
  getOrElse,
  orElse,
  swap,
  tap,
  tapLeft,
} from "prism-ts";
```

## Constructors

```ts
const a = left("invalid");
const b = right(42);
```

## Type Guards

```ts
if (isRight(b)) {
  // b.right is number
}

if (isLeft(a)) {
  // a.left is string
}
```

## Transform

```ts
const n1 = map(right(2), (n) => n + 1); // Right(3)
const e1 = mapLeft(left("e"), (e) => `ERR:${e}`); // Left("ERR:e")
const n2 = flatMap(right(2), (n) => right(n * 10)); // Right(20)
```

## Consume

```ts
const value = fold(
  right(10),
  () => 0,
  (n) => n,
); // 10

const label = match(left("x"), {
  Left: (e) => `L:${e}`,
  Right: (n) => `R:${n}`,
}); // "L:x"
```

## Recovery

```ts
const value = getOrElse(left("e"), (e) => e.length); // 1
const recovered = orElse(left("e"), (e) => right(e.length)); // Right(1)
const swapped = swap(left("e")); // Right("e")
```

## Side Effects

```ts
tap(right(5), (n) => console.log(n));
tapLeft(left("boom"), (e) => console.error(e));
```

## Method Chain Style

Constructors return chainable values.

```ts
const result = right(2)
  .map((n) => n + 3)
  .flatMap((n) => right(n * 2))
  .getOrElse(() => 0); // 10
```
