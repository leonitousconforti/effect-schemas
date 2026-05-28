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

- [Geography checks](#geography-checks)
  - [isLatitude](#islatitude)
  - [isLongitude](#islongitude)
  - [isPostalCode](#ispostalcode)
- [utils](#utils)
  - [AlphaNumericGeocode](#alphanumericgeocode)
  - [LatLon (class)](#latlon-class)
  - [Latitude](#latitude)
  - [Latitude (interface)](#latitude-interface)
  - [Longitude](#longitude)
  - [Longitude (interface)](#longitude-interface)
  - [PostalCode](#postalcode)
  - [PostalCode (interface)](#postalcode-interface)

---

# Geography checks

## isLatitude

**Signature**

```ts
declare const isLatitude: (annotations?: Schema.Annotations.Filter | undefined) => SchemaAST.Filter<number>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L28)

Since v1.0.0

## isLongitude

**Signature**

```ts
declare const isLongitude: (annotations?: Schema.Annotations.Filter | undefined) => SchemaAST.Filter<number>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L55)

Since v1.0.0

## isPostalCode

**Signature**

```ts
declare const isPostalCode: (annotations?: Schema.Annotations.Filter | undefined) => SchemaAST.Filter<string>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L114)

Since v1.0.0

# utils

## AlphaNumericGeocode

**Signature**

```ts
declare const AlphaNumericGeocode: Schema.suspend<Schema.decodeTo<typeof LatLon, Schema.String, never, never>>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L132)

Since v1.0.0

## LatLon (class)

**Signature**

```ts
declare class LatLon
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L79)

Since v1.0.0

## Latitude

**Signature**

```ts
declare const Latitude: Latitude
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L49)

Since v1.0.0

## Latitude (interface)

**Signature**

```ts
export interface Latitude extends Schema.brand<Schema.Number, "Latitude"> {}
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L46)

Since v1.0.0

## Longitude

**Signature**

```ts
declare const Longitude: Longitude
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L76)

Since v1.0.0

## Longitude (interface)

**Signature**

```ts
export interface Longitude extends Schema.brand<Schema.Number, "Longitude"> {}
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L73)

Since v1.0.0

## PostalCode

**Signature**

```ts
declare const PostalCode: PostalCode
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L129)

Since v1.0.0

## PostalCode (interface)

**Signature**

```ts
export interface PostalCode extends Schema.brand<Schema.String, "PostalCode"> {}
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Geography.ts#L126)

Since v1.0.0
