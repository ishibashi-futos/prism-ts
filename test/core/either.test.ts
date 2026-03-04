import { describe, expect, test } from "bun:test";
import {
  flatMap,
  fold,
  getOrElse,
  isLeft,
  isRight,
  left,
  map,
  mapLeft,
  match,
  orElse,
  right,
  swap,
  tap,
  tapLeft,
} from "@/core/either";

describe("Either", () => {
  test("supports method-style type checks", () => {
    expect(left("l").isLeft()).toBe(true);
    expect(left("l").isRight()).toBe(false);
    expect(right(1).isLeft()).toBe(false);
    expect(right(1).isRight()).toBe(true);
  });

  test("supports method chaining", () => {
    const ok = right(2)
      .map((n) => n + 3)
      .flatMap((n) => right(n * 2))
      .fold(
        () => 0,
        (n) => n,
      );

    const recovered = left("err")
      .map((n: number) => n + 1)
      .orElse((e) => right(e.length))
      .getOrElse(() => 0);

    expect(ok).toBe(10);
    expect(recovered).toBe(3);
  });

  test("creates Left and Right", () => {
    const l = left("error");
    const r = right(42);

    expect(l).toMatchObject({ _tag: "Left", left: "error" });
    expect(r).toMatchObject({ _tag: "Right", right: 42 });
  });

  test("narrows with type guards", () => {
    const l = left("e");
    const r = right(1);

    expect(isLeft(l)).toBe(true);
    expect(isRight(l)).toBe(false);
    expect(isLeft(r)).toBe(false);
    expect(isRight(r)).toBe(true);
  });

  test("map transforms only Right", () => {
    expect(map(right(2), (n) => n * 2)).toEqual(right(4));
    expect(map(left("e"), (n: number) => n * 2)).toEqual(left("e"));
  });

  test("mapLeft transforms only Left", () => {
    expect(mapLeft(left("e"), (e) => `x:${e}`)).toEqual(left("x:e"));
    expect(mapLeft(right(2), (e: string) => `x:${e}`)).toEqual(right(2));
  });

  test("flatMap chains only Right", () => {
    expect(flatMap(right(2), (n) => right(n + 1))).toEqual(right(3));
    expect(flatMap(right(2), () => left("bad"))).toEqual(left("bad"));
    expect(flatMap(left("e"), (n: number) => right(n + 1))).toEqual(left("e"));
  });

  test("fold and match produce values", () => {
    const onLeft = (e: string) => `L:${e}`;
    const onRight = (n: number) => `R:${n}`;

    expect(fold(left("e"), onLeft, onRight)).toBe("L:e");
    expect(fold(right(5), onLeft, onRight)).toBe("R:5");
    expect(match(left("x"), { Left: onLeft, Right: onRight })).toBe("L:x");
    expect(match(right(9), { Left: onLeft, Right: onRight })).toBe("R:9");
  });

  test("getOrElse and orElse recover from Left", () => {
    expect(getOrElse(left("e"), (e) => e.length)).toBe(1);
    expect(getOrElse(right(10), () => 0)).toBe(10);

    expect(orElse(left("e"), (e) => right(e.length))).toEqual(right(1));
    expect(orElse(right(10), () => right(0))).toEqual(right(10));
  });

  test("swap flips Left and Right", () => {
    expect(swap(left("e"))).toEqual(right("e"));
    expect(swap(right(3))).toEqual(left(3));
  });

  test("tap and tapLeft run side effects on matching side only", () => {
    let value = 0;
    let error = "";

    const a = tap(right(7), (n) => {
      value = n;
    });
    const b = tap(left("x"), () => {
      value = 999;
    });
    const c = tapLeft(left("boom"), (e) => {
      error = e;
    });
    const d = tapLeft(right(1), () => {
      error = "nope";
    });

    expect(a).toEqual(right(7));
    expect(b).toEqual(left("x"));
    expect(c).toEqual(left("boom"));
    expect(d).toEqual(right(1));
    expect(value).toBe(7);
    expect(error).toBe("boom");
  });
});
