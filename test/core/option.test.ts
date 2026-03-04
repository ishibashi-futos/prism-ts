import { describe, expect, test } from "bun:test";
import {
  filter,
  flatMap,
  fold,
  fromNullable,
  getOrElse,
  isNone,
  isSome,
  map,
  match,
  none,
  orElse,
  some,
  tap,
  toNullable,
} from "@/core/option";

describe("Option", () => {
  test("supports method-style type checks", () => {
    expect(some(1).isSome()).toBe(true);
    expect(some(1).isNone()).toBe(false);
    expect(none().isSome()).toBe(false);
    expect(none().isNone()).toBe(true);
  });

  test("supports method chaining", () => {
    const value = some(2)
      .map((n) => n + 3)
      .flatMap((n) => some(n * 2))
      .getOrElse(() => 0);

    const fallback = none<number>()
      .orElse(() => some(7))
      .filter((n) => n > 5)
      .toNullable();

    expect(value).toBe(10);
    expect(fallback).toBe(7);
  });

  test("creates Some and None", () => {
    const s = some(42);
    const n = none<number>();

    expect(s).toMatchObject({ _tag: "Some", value: 42 });
    expect(n).toMatchObject({ _tag: "None" });
  });

  test("narrows with type guards", () => {
    const s = some(1);
    const n = none<number>();

    expect(isSome(s)).toBe(true);
    expect(isNone(s)).toBe(false);
    expect(isSome(n)).toBe(false);
    expect(isNone(n)).toBe(true);
  });

  test("fromNullable and toNullable convert values", () => {
    expect(fromNullable(1)).toEqual(some(1));
    expect(fromNullable(null)).toEqual(none());
    expect(fromNullable(undefined)).toEqual(none());
    expect(toNullable(some(9))).toBe(9);
    expect(toNullable(none())).toBeNull();
  });

  test("map transforms only Some", () => {
    expect(map(some(2), (n) => n * 2)).toEqual(some(4));
    expect(map(none<number>(), (n) => n * 2)).toEqual(none());
  });

  test("flatMap chains only Some", () => {
    expect(flatMap(some(2), (n) => some(n + 1))).toEqual(some(3));
    expect(flatMap(some(2), () => none())).toEqual(none());
    expect(flatMap(none<number>(), (n) => some(n + 1))).toEqual(none());
  });

  test("fold and match produce values", () => {
    const onNone = () => "N";
    const onSome = (n: number) => `S:${n}`;

    expect(fold(none<number>(), onNone, onSome)).toBe("N");
    expect(fold(some(5), onNone, onSome)).toBe("S:5");
    expect(match(none<number>(), { None: onNone, Some: onSome })).toBe("N");
    expect(match(some(9), { None: onNone, Some: onSome })).toBe("S:9");
  });

  test("getOrElse and orElse recover from None", () => {
    expect(getOrElse(none<number>(), () => 1)).toBe(1);
    expect(getOrElse(some(10), () => 0)).toBe(10);

    expect(orElse(none<number>(), () => some(7))).toEqual(some(7));
    expect(orElse(some(10), () => some(0))).toEqual(some(10));
  });

  test("filter and tap apply only for Some", () => {
    let value = 0;

    const a = filter(some(7), (n) => n > 5);
    const b = filter(some(2), (n) => n > 5);
    const c = filter(none<number>(), (n) => n > 5);

    const d = tap(some(7), (n) => {
      value = n;
    });
    const e = tap(none<number>(), () => {
      value = 999;
    });

    expect(a).toEqual(some(7));
    expect(b).toEqual(none());
    expect(c).toEqual(none());
    expect(d).toEqual(some(7));
    expect(e).toEqual(none());
    expect(value).toBe(7);
  });
});
