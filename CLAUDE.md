## Purpose

prism-ts is a zero-dependency functional core library for TypeScript/JavaScript.

It provides algebraic data types and functional primitives such as:
Option, Either, Result, Validation, Effect, and pattern matching helpers.

The library must run in both Node.js and browser environments.

Backward compatibility is not a priority at this stage.

## Hard Constraints

- Zero runtime dependencies
  - No external runtime packages
  - No polyfills
- Runtime portability
  - Must work in Node.js and Web (browser) environments
  - Do not use Node-specific APIs (e.g., `process`, `Buffer`, `fs`)
  - Do not rely on environment-specific globals
- Core TypeScript/JavaScript only
  - No experimental language features
  - No decorators
  - No runtime behavior that depends on a specific module system

## Public API Policy

- `src/lib.ts` is the single public entry point.
- Only user-facing types and values must be exported from `src/lib.ts`.
- All other modules are internal by default.

## Design Principles

- Prefer small, composable primitives.
- Keep runtime representations minimal and stable.
- Optimize for strong type inference.
- Avoid top-level side effects (must be tree-shakeable).
- Do not use exceptions for control flow.
- Model failures explicitly via Result/Either/Validation.
- Keep function-first APIs as canonical; method-chain style is an optional thin wrapper.

## ADT and Error Semantics

- Option: represents absence only (no error detail).
- Either / Result: preserves error values.
- Validation: accumulates errors (no short-circuit unless explicitly defined).
- Effect: represents deferred computation; never executes implicitly.

ADT discriminators (e.g., `_tag`) must be consistent and stable.

## Pattern Matching

- Provide ergonomic `match` helpers without relying on language-level pattern matching.
- Encourage exhaustiveness through TypeScript’s type system where possible.

## No Global Mutation

- Do not modify `globalThis`.
- Do not modify built-in prototypes.
- Do not introduce hidden global state.
- Do not rely on execution order side effects.
- Avoid singleton-style implicit shared state.

## Bundle Size Policy

- Minimize runtime overhead.
- Avoid unnecessary object allocations.
- Do not rely on exceptions as part of normal control flow.
- Ensure all modules are tree-shakeable.
- Evaluate bundle size and runtime cost when introducing new APIs.

## Method-Chain Wrapper Policy

- Method-chain style APIs are allowed only as thin wrappers over canonical function APIs.
- Do not duplicate core logic in wrapper methods; delegate to exported functions (`map`, `flatMap`, `fold`, etc.).
- Keep runtime representation minimal (plain tagged objects first; wrappers must not require classes).
- Wrapper introduction must preserve existing function API behavior and types.
- Avoid global mutation and avoid modifying built-in prototypes.
- Prefer shared method implementations (e.g., shared prototype) over per-instance closures to limit allocations.
- If a wrapper is used, ensure both functional style and method style are covered by tests.

## Structure

- `src/core/` contains internal foundational ADTs and primitives (e.g., `Either`, `Option`, `Result`).
- `src/lib.ts` is the package entrypoint and re-export surface for user-facing APIs.
- Place tests under `test/` mirroring source structure (e.g., `test/core/either.test.ts`).
- In tests, import source modules via root alias (`@/`) instead of deep relative paths.

## Documentation

- Public exports must include concise JSDoc.
- Provide minimal usage examples.
- Follow functional programming naming conventions:
  `map`, `flatMap`, `fold`, `match`, `tap`, `zip`, etc.

## Definition of Done

- Final verification before reporting completion must use `bun run sanity`.
