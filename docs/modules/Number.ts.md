---
title: Number.ts
nav_order: 6
parent: Modules
---

## Number.ts overview

Number related schemas and filters

Since v1.0.0

---

## Exports Grouped by Category

- [Number filters](#number-filters)
  - [i16](#i16)
  - [i32](#i32)
  - [i64](#i64)
  - [i8](#i8)
  - [u16](#u16)
  - [u32](#u32)
  - [u64](#u64)
  - [u8](#u8)
- [Number schemas](#number-schemas)
  - [I16 (class)](#i16-class)
  - [I32 (class)](#i32-class)
  - [I64 (class)](#i64-class)
  - [I8 (class)](#i8-class)
  - [U16 (class)](#u16-class)
  - [U32 (class)](#u32-class)
  - [U64 (class)](#u64-class)
  - [U8 (class)](#u8-class)

---

# Number filters

## i16

A signed 16 bit integer

**Signature**

```ts
declare const i16: (
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
) => Schema.filter<typeof Schema.Int>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L171)

Since v1.0.0

## i32

A signed 32 bit integer

**Signature**

```ts
declare const i32: (
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
) => Schema.filter<typeof Schema.Int>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L187)

Since v1.0.0

## i64

A signed 64 bit integer

**Signature**

```ts
declare const i64: (
  annotations?:
    | Schema.Annotations.Filter<
        Schema.Schema.Type<Schema.Union<[typeof Schema.BigIntFromNumber, typeof Schema.BigInt]>>
      >
    | undefined
) => Schema.filter<Schema.Union<[typeof Schema.BigIntFromNumber, typeof Schema.BigInt]>>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L203)

Since v1.0.0

## i8

A signed 8 bit integer

**Signature**

```ts
declare const i8: (
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
) => Schema.filter<typeof Schema.Int>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L155)

Since v1.0.0

## u16

An unsigned 16 bit integer

**Signature**

```ts
declare const u16: (
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
) => Schema.filter<typeof Schema.Int>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L107)

Since v1.0.0

## u32

An unsigned 32 bit integer

**Signature**

```ts
declare const u32: (
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
) => Schema.filter<typeof Schema.Int>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L123)

Since v1.0.0

## u64

An unsigned 64 bit integer

**Signature**

```ts
declare const u64: (
  annotations?:
    | Schema.Annotations.Filter<
        Schema.Schema.Type<Schema.Union<[typeof Schema.BigIntFromNumber, typeof Schema.BigInt]>>
      >
    | undefined
) => Schema.filter<Schema.Union<[typeof Schema.BigIntFromNumber, typeof Schema.BigInt]>>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L139)

Since v1.0.0

## u8

An unsigned 8 bit integer

**Signature**

```ts
declare const u8: (
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
) => Schema.filter<typeof Schema.Int>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L91)

Since v1.0.0

# Number schemas

## I16 (class)

A signed 16 bit integer

**Signature**

```ts
declare class I16
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L179)

Since v1.0.0

## I32 (class)

A signed 32 bit integer

**Signature**

```ts
declare class I32
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L195)

Since v1.0.0

## I64 (class)

A signed 64 bit integer

**Signature**

```ts
declare class I64
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L211)

Since v1.0.0

## I8 (class)

A signed 8 bit integer

**Signature**

```ts
declare class I8
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L163)

Since v1.0.0

## U16 (class)

An unsigned 16 bit integer

**Signature**

```ts
declare class U16
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L115)

Since v1.0.0

## U32 (class)

An unsigned 32 bit integer

**Signature**

```ts
declare class U32
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L131)

Since v1.0.0

## U64 (class)

An unsigned 64 bit integer

**Signature**

```ts
declare class U64
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L147)

Since v1.0.0

## U8 (class)

An unsigned 8 bit integer

**Signature**

```ts
declare class U8
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Number.ts#L99)

Since v1.0.0
