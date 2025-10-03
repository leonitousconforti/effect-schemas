---
title: Finance.ts
nav_order: 1
parent: Modules
---

## Finance.ts overview

---

## Exports Grouped by Category

- [Finance filters](#finance-filters)
  - [bic](#bic)
  - [bitcoinAddress](#bitcoinaddress)
  - [ethereumAddress](#ethereumaddress)
- [Finance schemas](#finance-schemas)
  - [BIC (class)](#bic-class)
  - [BitcoinAddress (class)](#bitcoinaddress-class)
  - [EthereumAddress (class)](#ethereumaddress-class)

---

# Finance filters

## bic

A Business Identifier Code (BIC)

**See**

- https://en.wikipedia.org/wiki/ISO_9362

**Signature**

```ts
declare const bic: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends string>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L10)

Since v1.0.0

## bitcoinAddress

**Signature**

```ts
declare const bitcoinAddress: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends string>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L57)

Since v1.0.0

## ethereumAddress

**Signature**

```ts
declare const ethereumAddress: <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
) => <A extends string>(
  self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L35)

Since v1.0.0

# Finance schemas

## BIC (class)

A Business Identifier Code (BIC)

**See**

- https://en.wikipedia.org/wiki/ISO_9362

**Signature**

```ts
declare class BIC
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L29)

Since v1.0.0

## BitcoinAddress (class)

**Signature**

```ts
declare class BitcoinAddress
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L73)

Since v1.0.0

## EthereumAddress (class)

**Signature**

```ts
declare class EthereumAddress
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L51)

Since v1.0.0
