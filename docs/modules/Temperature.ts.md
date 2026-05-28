---
title: Temperature.ts
nav_order: 8
parent: Modules
---

## Temperature.ts overview

Temperature schemas to decode and encode different units.

Since v1.0.0

---

## Exports Grouped by Category

- [Temperature Schemas](#temperature-schemas)
  - [Celsius](#celsius)
  - [CelsiusFromString](#celsiusfromstring)
  - [Fahrenheit](#fahrenheit)
  - [FahrenheitFromString](#fahrenheitfromstring)
  - [Kelvin](#kelvin)
  - [KelvinFromString](#kelvinfromstring)

---

# Temperature Schemas

## Celsius

**Signature**

```ts
declare const Celsius: Schema.brand<Schema.Finite, "Celsius">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Temperature.ts#L19)

Since v1.0.0

## CelsiusFromString

**Signature**

```ts
declare const CelsiusFromString: Schema.decodeTo<
  Schema.brand<Schema.Finite, "Celsius">,
  Schema.TemplateLiteralParser<readonly [Schema.Finite, Schema.Literal<"c">]>,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Temperature.ts#L51)

Since v1.0.0

## Fahrenheit

**Signature**

```ts
declare const Fahrenheit: Schema.brand<Schema.Finite, "Fahrenheit">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Temperature.ts#L28)

Since v1.0.0

## FahrenheitFromString

**Signature**

```ts
declare const FahrenheitFromString: Schema.decodeTo<
  Schema.brand<Schema.Finite, "Fahrenheit">,
  Schema.TemplateLiteralParser<readonly [Schema.Finite, Schema.Literal<"f">]>,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Temperature.ts#L65)

Since v1.0.0

## Kelvin

**Signature**

```ts
declare const Kelvin: Schema.brand<Schema.Finite, "Kelvin">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Temperature.ts#L13)

Since v1.0.0

## KelvinFromString

**Signature**

```ts
declare const KelvinFromString: Schema.decodeTo<
  Schema.brand<Schema.Finite, "Kelvin">,
  Schema.TemplateLiteralParser<readonly [Schema.Finite, Schema.Literal<"k">]>,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Temperature.ts#L37)

Since v1.0.0
