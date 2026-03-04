# Option API

`Option<A>` is a tagged union for optional values.

- `None`: absence (`_tag: "None"`)
- `Some<A>`: presence (`_tag: "Some"`)

## Import

```ts
import {
  type Option,
  type Some,
  type None,
  some,
  none,
  isSome,
  isNone,
  fromNullable,
  toNullable,
  option,
} from "prism-ts";
```

For generic helpers such as `map` / `flatMap`, use the `option` namespace.

```ts
const value = option.map(some(2), (n) => n + 1); // Some(3)
```

## Constructors

```ts
const a = some(42);
const b = none<number>();
```

## Type Guards

```ts
if (isSome(a)) {
  // a.value is number
}

if (isNone(b)) {
  // b is None
}
```

## Convert

```ts
const a = fromNullable("x"); // Some("x")
const b = fromNullable(null); // None
const c = toNullable(a); // "x"
```

## Method Chain Style

Constructors return chainable values.

```ts
const value = some(2)
  .map((n) => n + 3)
  .flatMap((n) => some(n * 2))
  .getOrElse(() => 0); // 10
```
