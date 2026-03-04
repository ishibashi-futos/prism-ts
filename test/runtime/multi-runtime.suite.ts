import { describe, expect, test } from "vitest";

import {
  err,
  flatMap as eitherFlatMap,
  fold,
  left,
  map as eitherMap,
  mapErr,
  maybe,
  ok,
  option,
  orElse,
  right,
} from "../../src/lib";

describe("multi-runtime compatibility", () => {
  test("Option and Maybe expose stable behavior", () => {
    const optionValue = option
      .some(10)
      .map((value) => value + 5)
      .filter((value) => value > 10)
      .getOrElse(() => 0);

    const maybeValue = maybe
      .nothing<number>()
      .orElse(() => maybe.just(7))
      .map((value) => value * 2)
      .toNullable();

    expect(optionValue).toBe(15);
    expect(maybeValue).toBe(14);
  });

  test("Either and Result aliases stay interoperable", () => {
    const eitherValue = right(4)
      .flatMap((value) => right(value + 1))
      .fold(
        () => -1,
        (value) => value,
      );

    const eitherRecovered = left<string, number>("boom").getOrElse(
      (error) => error.length,
    );

    const resultRecovered = fold(
      orElse(
        mapErr(err<string, number>("failed"), (error) => `E:${error}`),
        (error) => ok(error.length),
      ),
      () => -1,
      (value) => value,
    );

    expect(eitherValue).toBe(5);
    expect(eitherRecovered).toBe(4);
    expect(resultRecovered).toBe(8);
  });

  test("handles boundary branches across Option/Maybe/Either", () => {
    const optionBoundary = option
      .none<number>()
      .flatMap((value) => option.some(value + 1))
      .orElse(() => option.some(42))
      .getOrElse(() => 0);

    const maybeBoundary = maybe
      .nothing<number>()
      .flatMap((value) => maybe.just(value + 1))
      .orElse(() => maybe.just(5))
      .getOrElse(() => 0);

    let calledOnLeft = false;
    const eitherBoundary = left<string, number>("x")
      .flatMap((value) => {
        calledOnLeft = true;
        return right(value + 1);
      })
      .orElse((error) => right(error.length))
      .fold(
        () => -1,
        (value) => value,
      );

    expect(optionBoundary).toBe(42);
    expect(maybeBoundary).toBe(5);
    expect(calledOnLeft).toBe(false);
    expect(eitherBoundary).toBe(1);
  });

  test("keeps source values stable after transformations", () => {
    const baseOption = option.some({ count: 1 });
    const mappedOption = baseOption.map((value) => ({
      ...value,
      count: value.count + 1,
    }));
    const tappedOption = option.tap(baseOption, () => {});

    const baseEither = right({ total: 2 });
    const mappedEither = baseEither.map((value) => ({
      ...value,
      total: value.total * 2,
    }));
    const tappedEither = baseEither.tap(() => {});

    expect(
      baseOption.fold(
        () => -1,
        (value) => value.count,
      ),
    ).toBe(1);
    expect(
      mappedOption.fold(
        () => -1,
        (value) => value.count,
      ),
    ).toBe(2);
    expect(
      tappedOption.fold(
        () => -1,
        (value) => value.count,
      ),
    ).toBe(1);

    expect(
      baseEither.fold(
        () => -1,
        (value) => value.total,
      ),
    ).toBe(2);
    expect(
      mappedEither.fold(
        () => -1,
        (value) => value.total,
      ),
    ).toBe(4);
    expect(
      tappedEither.fold(
        () => -1,
        (value) => value.total,
      ),
    ).toBe(2);
  });

  test("method and function APIs produce equivalent results", () => {
    const eitherViaMethods = right(3)
      .map((value) => value + 2)
      .flatMap((value) => right(value * 2))
      .getOrElse(() => 0);

    const eitherViaFunctions = fold(
      eitherFlatMap(
        eitherMap(right(3), (value) => value + 2),
        (value) => right(value * 2),
      ),
      () => 0,
      (value) => value,
    );

    const resultViaMethods = err<string, number>("failed")
      .orElse((error) => ok(error.length))
      .fold(
        () => -1,
        (value) => value,
      );

    const resultViaFunctions = fold(
      orElse(err<string, number>("failed"), (error) => ok(error.length)),
      () => -1,
      (value) => value,
    );

    expect(eitherViaMethods).toBe(eitherViaFunctions);
    expect(resultViaMethods).toBe(resultViaFunctions);
  });
});
