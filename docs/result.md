# Result API

`Result<E, A>` is an alias of `Either<E, A>` with Result-oriented names.

- `Err<E>` is `Left<E>`
- `Ok<A>` is `Right<A>`

## Import

```ts
import {
  type Result,
  type Err,
  type Ok,
  err,
  ok,
  isErr,
  isOk,
  map,
  mapErr,
  flatMap,
  fold,
  match,
  getOrElse,
  orElse,
  swap,
  tap,
  tapErr,
} from "prism-ts";
```

## Constructors

```ts
const a = err("invalid");
const b = ok(42);
```

## Type Guards

```ts
if (isOk(b)) {
  // b.right is number
}

if (isErr(a)) {
  // a.left is string
}
```

## Transform

```ts
const n1 = map(ok(2), (n) => n + 1); // Ok(3)
const e1 = mapErr(err("e"), (e) => `ERR:${e}`); // Err("ERR:e")
const n2 = flatMap(ok(2), (n) => ok(n * 10)); // Ok(20)
```

## Consume / Recovery

```ts
const value = getOrElse(err("e"), (e) => e.length); // 1
const recovered = orElse(err("e"), (e) => ok(e.length)); // Ok(1)

const text = fold(
  ok(10),
  (e) => `ERR:${e}`,
  (n) => `OK:${n}`,
); // "OK:10"

const swapped = swap(err("x")); // Ok("x")
```

## Side Effects

```ts
tap(ok(5), (n) => console.log(n));
tapErr(err("boom"), (e) => console.error(e));
```

## Notes

- Runtime shape is the same as `Either` (`Left` / `Right`).
- Result-focused aliases exported from `prism-ts` are:
  - values: `ok`, `err`, `isOk`, `isErr`, `mapErr`, `tapErr`
  - types: `Result`, `Ok`, `Err`, `ResultMethods`, `ChainableResult`
- Generic helper names (`map`, `flatMap`, `fold`, etc.) are shared with `Either`.
