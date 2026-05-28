---
title: Math.ts
nav_order: 5
parent: Modules
---

## Math.ts overview

Math related schemas and filters

Since v1.0.0

---

## Exports Grouped by Category

- [Math schemas](#math-schemas)
  - [Operation](#operation)
  - [Operator](#operator)

---

# Math schemas

## Operation

**Signature**

```ts
declare const Operation: Schema.Literals<readonly ["addition", "subtraction", "multiplication", "division"]>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Math.ts#L13)

Since v1.0.0

## Operator

**Signature**

```ts
declare const Operator: Schema.Union<
  readonly [
    Schema.decodeTo<Schema.Literal<"+">, Schema.Literal<"addition">, never, never>,
    Schema.decodeTo<Schema.Literal<"-">, Schema.Literal<"subtraction">, never, never>,
    Schema.decodeTo<Schema.Literal<"*">, Schema.Literal<"multiplication">, never, never>,
    Schema.decodeTo<Schema.Literal<"/">, Schema.Literal<"division">, never, never>
  ]
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Math.ts#L23)

Since v1.0.0
