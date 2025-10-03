---
title: String.ts
nav_order: 8
parent: Modules
---

## String.ts overview

---

## Exports Grouped by Category

- [String filters](#string-filters)
  - [ascii](#ascii)
  - [hexadecimal](#hexadecimal)
  - [octal](#octal)
- [Strings](#strings)
  - [Ascii (class)](#ascii-class)
  - [Hexadecimal (class)](#hexadecimal-class)
  - [Octal (class)](#octal-class)

---

# String filters

## ascii

**Signature**

```ts
declare const ascii: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends string>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/String.ts#L7)

Since v1.0.0

## hexadecimal

**Signature**

```ts
declare const hexadecimal: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends string>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/String.ts#L39)

Since v1.0.0

## octal

**Signature**

```ts
declare const octal: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends string>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/String.ts#L70)

Since v1.0.0

# Strings

## Ascii (class)

**Signature**

```ts
declare class Ascii
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/String.ts#L24)

Since v1.0.0

## Hexadecimal (class)

**Signature**

```ts
declare class Hexadecimal
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/String.ts#L55)

Since v1.0.0

## Octal (class)

**Signature**

```ts
declare class Octal
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/String.ts#L86)

Since v1.0.0
