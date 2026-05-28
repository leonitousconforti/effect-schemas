---
title: Finance.ts
nav_order: 1
parent: Modules
---

## Finance.ts overview

Finance related schemas and filters

Since v1.0.0

---

## Exports Grouped by Category

- [Finance checks](#finance-checks)
  - [isBic](#isbic)
  - [isBitcoinAddress](#isbitcoinaddress)
  - [isEthereumAddress](#isethereumaddress)
- [utils](#utils)
  - [Bic](#bic)
  - [Bic (interface)](#bic-interface)
  - [BitcoinAddress](#bitcoinaddress)
  - [BitcoinAddress (interface)](#bitcoinaddress-interface)
  - [EthereumAddress](#ethereumaddress)
  - [EthereumAddress (interface)](#ethereumaddress-interface)

---

# Finance checks

## isBic

A Business Identifier Code (BIC)

**See**

- https://en.wikipedia.org/wiki/ISO_9362

**Signature**

```ts
declare const isBic: (annotations?: Schema.Annotations.Filter | undefined) => SchemaAST.Filter<string>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L35)

Since v1.0.0

## isBitcoinAddress

**Signature**

```ts
declare const isBitcoinAddress: (annotations?: Schema.Annotations.Filter | undefined) => SchemaAST.Filter<string>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L80)

Since v1.0.0

## isEthereumAddress

**Signature**

```ts
declare const isEthereumAddress: (annotations?: Schema.Annotations.Filter | undefined) => SchemaAST.Filter<string>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L56)

Since v1.0.0

# utils

## Bic

**Signature**

```ts
declare const Bic: Bic
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L50)

Since v1.0.0

## Bic (interface)

**Signature**

```ts
export interface Bic extends Schema.brand<Schema.String, "Bic"> {}
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L47)

Since v1.0.0

## BitcoinAddress

**Signature**

```ts
declare const BitcoinAddress: BitcoinAddress
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L95)

Since v1.0.0

## BitcoinAddress (interface)

**Signature**

```ts
export interface BitcoinAddress extends Schema.brand<Schema.String, "BitcoinAddress"> {}
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L92)

Since v1.0.0

## EthereumAddress

**Signature**

```ts
declare const EthereumAddress: EthereumAddress
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L71)

Since v1.0.0

## EthereumAddress (interface)

**Signature**

```ts
export interface EthereumAddress extends Schema.brand<Schema.String, "EthereumAddress"> {}
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Finance.ts#L68)

Since v1.0.0
