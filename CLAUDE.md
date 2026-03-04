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

## ADT and Error Semantics

- Option: represents absence only (no error detail).
- Either / Result: preserves error values.
- Validation: accumulates errors (no short-circuit unless explicitly defined).
- Effect: represents deferred computation; never executes implicitly.

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

## Documentation

- Public exports must include concise JSDoc.
- Provide minimal usage examples.
- Follow functional programming naming conventions:
  `map`, `flatMap`, `fold`, `match`, `tap`, `zip`, etc.
