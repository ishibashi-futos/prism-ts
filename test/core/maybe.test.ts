import { describe, expect, test } from "bun:test";
import {
  filter,
  flatMap,
  fold,
  fromNullable,
  getOrElse,
  isJust,
  isNothing,
  just,
  map,
  match,
  nothing,
  orElse,
  tap,
  toNullable,
} from "@/core/maybe";

describe("Maybe", () => {
  test("uses Just/Nothing aliases", () => {
    expect(just(1)).toMatchObject({ _tag: "Some", value: 1 });
    expect(nothing<number>()).toMatchObject({ _tag: "None" });
    expect(isJust(just(1))).toBe(true);
    expect(isNothing(nothing())).toBe(true);
  });

  test("delegates Option-compatible operations", () => {
    expect(map(just(2), (n) => n + 1)).toEqual(just(3));
    expect(map(nothing<number>(), (n) => n + 1)).toEqual(nothing());

    expect(flatMap(just(2), (n) => just(n * 10))).toEqual(just(20));
    expect(flatMap(just(2), () => nothing())).toEqual(nothing());

    const onNothing = () => "N";
    const onJust = (n: number) => `J:${n}`;

    expect(fold(nothing<number>(), onNothing, onJust)).toBe("N");
    expect(match(just(5), { None: onNothing, Some: onJust })).toBe("J:5");

    expect(getOrElse(nothing<number>(), () => 7)).toBe(7);
    expect(orElse(nothing<number>(), () => just(9))).toEqual(just(9));
    expect(filter(just(3), (n) => n > 5)).toEqual(nothing());

    let value = 0;
    tap(just(8), (n) => {
      value = n;
    });
    expect(value).toBe(8);

    expect(fromNullable(null)).toEqual(nothing());
    expect(toNullable(just(4))).toBe(4);
  });
});
