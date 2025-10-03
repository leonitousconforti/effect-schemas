---
title: Geography.ts
nav_order: 2
parent: Modules
---

## Geography.ts overview

Geography related schemas and filters

Since v1.0.0

---

## Exports Grouped by Category

- [Geography filters](#geography-filters)
  - [latitude](#latitude)
  - [longitude](#longitude)
- [Geography schemas](#geography-schemas)
  - [LatLong (class)](#latlong-class)
  - [Latitude (class)](#latitude-class)
  - [Longitude (class)](#longitude-class)
  - [PostalCode (class)](#postalcode-class)

---

# Geography filters

## latitude

**Signature**

```ts
declare const latitude: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends number>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L13)

Since v1.0.0

## longitude

**Signature**

```ts
declare const longitude: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends number>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L47)

Since v1.0.0

# Geography schemas

## LatLong (class)

**Signature**

```ts
declare class LatLong
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L81)

Since v1.0.0

## Latitude (class)

**Signature**

```ts
declare class Latitude
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L29)

Since v1.0.0

## Longitude (class)

**Signature**

```ts
declare class Longitude
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L63)

Since v1.0.0

## PostalCode (class)

**Signature**

```ts
declare class PostalCode
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L87)

Since v1.0.0
