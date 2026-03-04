# Maybe API

`Maybe<A>` is an alias of `Option<A>` with `Just` / `Nothing` naming.

- `Just<A>` is `Some<A>`
- `Nothing` is `None`

## Import

```ts
import {
  type Maybe,
  type Just,
  type Nothing,
  just,
  nothing,
  isJust,
  isNothing,
  maybe,
} from "prism-ts";
```

For generic helpers such as `map` / `flatMap`, use the `maybe` namespace.

```ts
const value = maybe.map(just(2), (n) => n + 1); // Just(3)
```

## Constructors

```ts
const a = just(42);
const b = nothing<number>();
```

## Method Chain Style

`just` / `nothing` values are chainable exactly like `Option`.

```ts
const value = just(2)
  .map((n) => n + 3)
  .flatMap((n) => just(n * 2))
  .getOrElse(() => 0); // 10
```
