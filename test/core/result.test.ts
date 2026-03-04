import { describe, expect, test } from "bun:test";
import {
  err,
  flatMap,
  fold,
  getOrElse,
  isErr,
  isOk,
  map,
  mapErr,
  match,
  ok,
  orElse,
  swap,
  tap,
  tapErr,
} from "@/core/result";

describe("Result", () => {
  test("creates Err and Ok", () => {
    const e = err("error");
    const o = ok(42);

    expect(e).toMatchObject({ _tag: "Left", left: "error" });
    expect(o).toMatchObject({ _tag: "Right", right: 42 });
  });

  test("narrows with Result type guards", () => {
    const e = err("e");
    const o = ok(1);

    expect(isErr(e)).toBe(true);
    expect(isOk(e)).toBe(false);
    expect(isErr(o)).toBe(false);
    expect(isOk(o)).toBe(true);
  });

  test("supports Either-compatible operations", () => {
    expect(map(ok(2), (n) => n * 2)).toEqual(ok(4));
    expect(map(err("e"), (n: number) => n * 2)).toEqual(err("e"));

    expect(mapErr(err("e"), (e) => `x:${e}`)).toEqual(err("x:e"));
    expect(mapErr(ok(2), (e: string) => `x:${e}`)).toEqual(ok(2));

    expect(flatMap(ok(2), (n) => ok(n + 1))).toEqual(ok(3));
    expect(flatMap(ok(2), () => err("bad"))).toEqual(err("bad"));
    expect(flatMap(err("e"), (n: number) => ok(n + 1))).toEqual(err("e"));
  });

  test("fold/match/getOrElse/orElse/swap behave as aliases", () => {
    const onErr = (e: string) => `E:${e}`;
    const onOk = (n: number) => `O:${n}`;

    expect(fold(err("e"), onErr, onOk)).toBe("E:e");
    expect(fold(ok(5), onErr, onOk)).toBe("O:5");
    expect(match(err("x"), { Left: onErr, Right: onOk })).toBe("E:x");
    expect(match(ok(9), { Left: onErr, Right: onOk })).toBe("O:9");

    expect(getOrElse(err("e"), (e) => e.length)).toBe(1);
    expect(getOrElse(ok(10), () => 0)).toBe(10);
    expect(orElse(err("e"), (e) => ok(e.length))).toEqual(ok(1));
    expect(orElse(ok(10), () => ok(0))).toEqual(ok(10));

    expect(swap(err("e"))).toEqual(ok("e"));
    expect(swap(ok(3))).toEqual(err(3));
  });

  test("tap and tapErr run side effects on matching side only", () => {
    let value = 0;
    let error = "";

    const a = tap(ok(7), (n) => {
      value = n;
    });
    const b = tap(err("x"), () => {
      value = 999;
    });
    const c = tapErr(err("boom"), (e) => {
      error = e;
    });
    const d = tapErr(ok(1), () => {
      error = "nope";
    });

    expect(a).toEqual(ok(7));
    expect(b).toEqual(err("x"));
    expect(c).toEqual(err("boom"));
    expect(d).toEqual(ok(1));
    expect(value).toBe(7);
    expect(error).toBe("boom");
  });
});
