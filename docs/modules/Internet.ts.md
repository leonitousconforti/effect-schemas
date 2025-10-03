---
title: Internet.ts
nav_order: 4
parent: Modules
---

## Internet.ts overview

Internet related schemas and filters

Since v1.0.0

---

## Exports Grouped by Category

- [Regular expressions](#regular-expressions)
  - [IPv4Regex](#ipv4regex)
  - [IPv4Segment](#ipv4segment)
  - [IPv4StringRegex](#ipv4stringregex)
  - [IPv6Regex](#ipv6regex)
  - [IPv6Segment](#ipv6segment)
  - [MacAddressRegex](#macaddressregex)
- [Schemas](#schemas)
  - [Address (class)](#address-class)
  - [AddressBigint (class)](#addressbigint-class)
  - [AddressString (class)](#addressstring-class)
  - [CidrBlock (class)](#cidrblock-class)
  - [CidrBlockFromString (class)](#cidrblockfromstring-class)
  - [Family (class)](#family-class)
  - [IPv4 (class)](#ipv4-class)
  - [IPv4Bigint (class)](#ipv4bigint-class)
  - [IPv4CidrBlock (class)](#ipv4cidrblock-class)
    - [networkAddressAsBigint (property)](#networkaddressasbigint-property)
    - [networkAddress (property)](#networkaddress-property)
    - [broadcastAddressAsBigint (property)](#broadcastaddressasbigint-property)
    - [broadcastAddress (property)](#broadcastaddress-property)
    - [range (property)](#range-property)
    - [total (property)](#total-property)
  - [IPv4CidrBlockFromString (class)](#ipv4cidrblockfromstring-class)
  - [IPv4CidrMask (class)](#ipv4cidrmask-class)
  - [IPv4Family (class)](#ipv4family-class)
  - [IPv4String](#ipv4string)
  - [IPv6 (class)](#ipv6-class)
  - [IPv6Bigint (class)](#ipv6bigint-class)
  - [IPv6CidrBlock (class)](#ipv6cidrblock-class)
    - [networkAddressAsBigint (property)](#networkaddressasbigint-property-1)
    - [networkAddress (property)](#networkaddress-property-1)
    - [broadcastAddressAsBigint (property)](#broadcastaddressasbigint-property-1)
    - [broadcastAddress (property)](#broadcastaddress-property-1)
    - [range (property)](#range-property-1)
    - [total (property)](#total-property-1)
  - [IPv6CidrBlockFromString (class)](#ipv6cidrblockfromstring-class)
  - [IPv6CidrMask (class)](#ipv6cidrmask-class)
  - [IPv6Family (class)](#ipv6family-class)
  - [IPv6String](#ipv6string)
  - [MacAddress (class)](#macaddress-class)
  - [Port (class)](#port-class)
  - [PortWithMaybeProtocol (class)](#portwithmaybeprotocol-class)
- [utils](#utils)
  - [broadcastAddress](#broadcastaddress)
  - [broadcastAddressAsBigint](#broadcastaddressasbigint)
  - [cidrBlockForRange](#cidrblockforrange)
  - [networkAddress](#networkaddress)
  - [networkAddressAsBigint](#networkaddressasbigint)
  - [range](#range)
  - [total](#total)

---

# Regular expressions

## IPv4Regex

**Signature**

```ts
declare const IPv4Regex: RegExp
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L105)

Since v1.0.0

## IPv4Segment

**See**

- https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L16-L18

**Signature**

```ts
declare const IPv4Segment: "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])"
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L93)

Since v1.0.0

## IPv4StringRegex

**Signature**

```ts
declare const IPv4StringRegex: "(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])"
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L99)

Since v1.0.0

## IPv6Regex

**Signature**

```ts
declare const IPv6Regex: RegExp
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L242)

Since v1.0.0

## IPv6Segment

**See**

- https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L21-L31

**Signature**

```ts
declare const IPv6Segment: "(?:[0-9a-fA-F]{1,4})"
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L236)

Since v1.0.0

## MacAddressRegex

**See**

- https://stackoverflow.com/questions/4260467/what-is-a-regular-expression-for-a-mac-address

**Signature**

```ts
declare const MacAddressRegex: RegExp
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L69)

Since v1.0.0

# Schemas

## Address (class)

An IP address, which is either an IPv4 or IPv6 address.

**Example**

```ts
import * as Schema from "effect/Schema"
import { Address } from "the-moby-effect/schemas/index.js"

const decodeAddress = Schema.decodeSync(Address)

assert.throws(() => decodeAddress("1.1.b.1"))
assert.throws(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334:"))

assert.doesNotThrow(() => decodeAddress("1.1.1.2"))
assert.doesNotThrow(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334"))
```

**See**

- `IPv4`
- `IPv6`

**Signature**

```ts
declare class Address
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L458)

Since v1.0.0

## AddressBigint (class)

An IP address as a bigint.

**Signature**

```ts
declare class AddressBigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L469)

Since v1.0.0

## AddressString (class)

An IP address in string format, which is either an IPv4 or IPv6 address.

**Signature**

```ts
declare class AddressString
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L429)

Since v1.0.0

## CidrBlock (class)

**Signature**

```ts
declare class CidrBlock
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L934)

Since v1.0.0

## CidrBlockFromString (class)

A schema that transforms a `string` into a `CidrBlock`.

**Signature**

```ts
declare class CidrBlockFromString
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L942)

Since v1.0.0

## Family (class)

**See**

- `IPv4Family`
- `IPv6Family`

**Signature**

```ts
declare class Family
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L418)

Since v1.0.0

## IPv4 (class)

An IPv4 address.

**Example**

```ts
import * as Schema from "effect/Schema"
import { IPv4 } from "the-moby-effect/schemas/index.js"

const decodeIPv4 = Schema.decodeSync(IPv4)
assert.deepEqual(decodeIPv4("1.1.1.1"), {
  family: "ipv4",
  ip: "1.1.1.1"
})

assert.throws(() => decodeIPv4("1.1.a.1"))
assert.doesNotThrow(() => decodeIPv4("1.1.1.2"))
```

**Signature**

```ts
declare class IPv4
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L142)

Since v1.0.0

## IPv4Bigint (class)

An IPv4 as a bigint.

**Example**

```ts
import * as Schema from "effect/Schema"
import { IPv4Bigint, IPv4BigintBrand } from "the-moby-effect/schemas/js"

const x: IPv4BigintBrand = IPv4BigintBrand(748392749382n)
assert.strictEqual(x, 748392749382n)

const decodeIPv4Bigint = Schema.decodeSync(IPv4Bigint)
const encodeIPv4Bigint = Schema.encodeSync(IPv4Bigint)

assert.deepEqual(decodeIPv4Bigint("1.1.1.1"), {
  family: "ipv4",
  value: 16843009n
})
assert.deepEqual(decodeIPv4Bigint("254.254.254.254"), {
  family: "ipv4",
  value: 4278124286n
})

assert.strictEqual(
  encodeIPv4Bigint({
    value: IPv4BigintBrand(16843009n),
    family: "ipv4"
  }),
  "1.1.1.1"
)
assert.strictEqual(
  encodeIPv4Bigint({
    value: IPv4BigintBrand(4278124286n),
    family: "ipv4"
  }),
  "254.254.254.254"
)
```

**Signature**

```ts
declare class IPv4Bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L197)

Since v1.0.0

## IPv4CidrBlock (class)

**Signature**

```ts
declare class IPv4CidrBlock
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L770)

Since v1.0.0

### networkAddressAsBigint (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddressAsBigint: this extends IPv4CidrBlock ? { readonly value: bigint & Brand<"IPv4Bigint">; readonly family: "ipv4"; } : this extends IPv6CidrBlock ? { readonly value: bigint & Brand<"IPv6Bigint">; readonly family: "ipv6"; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L786)

Since v1.0.0

### networkAddress (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L794)

Since v1.0.0

### broadcastAddressAsBigint (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddressAsBigint: this extends IPv4CidrBlock ? { readonly value: bigint & Brand<"IPv4Bigint">; readonly family: "ipv4"; } : this extends IPv6CidrBlock ? { readonly value: bigint & Brand<"IPv6Bigint">; readonly family: "ipv6"; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L802)

Since v1.0.0

### broadcastAddress (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L810)

Since v1.0.0

### range (property)

A stream of all addresses in the range given by this address' subnet.

**Signature**

```ts
range: this extends IPv4CidrBlock ? Stream.Stream<{ readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; }, ParseResult.ParseError, never> : this extends IPv6CidrBlock ? Stream.Stream<{ readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; }, ParseResult.ParseError, never> : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L817)

Since v1.0.0

### total (property)

The total number of addresses in the range given by this address' subnet.

**Signature**

```ts
total: bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L824)

Since v1.0.0

## IPv4CidrBlockFromString (class)

A schema that transforms a `string` into a `CidrBlock`.

**Signature**

```ts
declare class IPv4CidrBlockFromString
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L833)

Since v1.0.0

## IPv4CidrMask (class)

An ipv4 cidr mask, which is a number between 0 and 32.

**Example**

```ts
import * as Schema from "effect/Schema"
import { IPv4CidrMask, IPv4CidrMaskBrand } from "the-moby-effect/schemas/CidrBlockMask.js"

const mask: IPv4CidrMaskBrand = IPv4CidrMaskBrand(24)
assert.strictEqual(mask, 24)

const decodeMask = Schema.decodeSync(IPv4CidrMask)
assert.strictEqual(decodeMask(24), 24)

assert.throws(() => decodeMask(33))
assert.doesNotThrow(() => decodeMask(0))
assert.doesNotThrow(() => decodeMask(32))
```

**Signature**

```ts
declare class IPv4CidrMask
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L496)

Since v1.0.0

## IPv4Family (class)

**Signature**

```ts
declare class IPv4Family
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L111)

Since v1.0.0

## IPv4String

An IPv4 address in dot-decimal notation with no leading zeros.

**Signature**

```ts
declare const IPv4String: Schema.filter<typeof Schema.String>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L122)

Since v1.0.0

## IPv6 (class)

An IPv6 address.

**Example**

```ts
import * as Schema from "effect/Schema"
import { IPv6 } from "the-moby-effect/schemas/index.js"

const decodeIPv6 = Schema.decodeSync(IPv6)
assert.deepEqual(decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), {
  family: "ipv6",
  ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
})

assert.throws(() => decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334:"))
assert.throws(() => decodeIPv6("2001::85a3::0000::0370:7334"))
assert.doesNotThrow(() => decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334"))
```

**Signature**

```ts
declare class IPv6
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L295)

Since v1.0.0

## IPv6Bigint (class)

An IPv6 as a bigint.

**Example**

```ts
import * as Schema from "effect/Schema"
import { IPv6Bigint, IPv6BigintBrand } from "the-moby-effect/schemas/js"

const y: IPv6BigintBrand = IPv6BigintBrand(748392749382n)
assert.strictEqual(y, 748392749382n)

const decodeIPv6Bigint = Schema.decodeSync(IPv6Bigint)
const encodeIPv6Bigint = Schema.encodeSync(IPv6Bigint)

assert.deepEqual(decodeIPv6Bigint("4cbd:ff70:e62b:a048:686c:4e7e:a68a:c377"), {
  value: 102007852745154114519525620108359287671n,
  family: "ipv6"
})
assert.deepEqual(decodeIPv6Bigint("d8c6:3feb:46e6:b80c:5a07:6227:ac19:caf6"), {
  value: 288142618299897818094313964584331496182n,
  family: "ipv6"
})

assert.deepEqual(
  encodeIPv6Bigint({
    value: IPv6BigintBrand(102007852745154114519525620108359287671n),
    family: "ipv6"
  }),
  "4cbd:ff70:e62b:a048:686c:4e7e:a68a:c377"
)
assert.deepEqual(
  encodeIPv6Bigint({
    value: IPv6BigintBrand(288142618299897818094313964584331496182n),
    family: "ipv6"
  }),
  "d8c6:3feb:46e6:b80c:5a07:6227:ac19:caf6"
)
```

**Signature**

```ts
declare class IPv6Bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L349)

Since v1.0.0

## IPv6CidrBlock (class)

**Signature**

```ts
declare class IPv6CidrBlock
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L852)

Since v1.0.0

### networkAddressAsBigint (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddressAsBigint: { readonly value: bigint & Brand<"IPv6Bigint">; readonly family: "ipv6"; }
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L868)

Since v1.0.0

### networkAddress (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L876)

Since v1.0.0

### broadcastAddressAsBigint (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddressAsBigint: this extends IPv4CidrBlock ? { readonly value: bigint & Brand<"IPv4Bigint">; readonly family: "ipv4"; } : this extends IPv6CidrBlock ? { readonly value: bigint & Brand<"IPv6Bigint">; readonly family: "ipv6"; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L884)

Since v1.0.0

### broadcastAddress (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L892)

Since v1.0.0

### range (property)

A stream of all addresses in the range given by this address' subnet.

**Signature**

```ts
range: this extends IPv4CidrBlock ? Stream.Stream<{ readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; }, ParseResult.ParseError, never> : this extends IPv6CidrBlock ? Stream.Stream<{ readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; }, ParseResult.ParseError, never> : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L899)

Since v1.0.0

### total (property)

The total number of addresses in the range given by this address' subnet.

**Signature**

```ts
total: bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L906)

Since v1.0.0

## IPv6CidrBlockFromString (class)

A schema that transforms a `string` into a `CidrBlock`.

**Signature**

```ts
declare class IPv6CidrBlockFromString
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L915)

Since v1.0.0

## IPv6CidrMask (class)

An ipv6 cidr mask, which is a number between 0 and 128.

**Example**

```ts
import * as Schema from "effect/Schema"
import { IPv6CidrMask, IPv6CidrMaskBrand } from "the-moby-effect/schemas/CidrBlockMask.js"

const mask: IPv6CidrMaskBrand = IPv6CidrMaskBrand(64)
assert.strictEqual(mask, 64)

const decodeMask = Schema.decodeSync(IPv6CidrMask)
assert.strictEqual(decodeMask(64), 64)

assert.throws(() => decodeMask(129))
assert.doesNotThrow(() => decodeMask(0))
assert.doesNotThrow(() => decodeMask(128))
```

**Signature**

```ts
declare class IPv6CidrMask
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L525)

Since v1.0.0

## IPv6Family (class)

**Signature**

```ts
declare class IPv6Family
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L259)

Since v1.0.0

## IPv6String

An IPv6 address in string format.

**Signature**

```ts
declare const IPv6String: Schema.filter<typeof Schema.String>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L270)

Since v1.0.0

## MacAddress (class)

A Mac Address.

**Signature**

```ts
declare class MacAddress
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L77)

Since v1.0.0

## Port (class)

An operating system port number.

**Example**

```ts
import * as Schema from "effect/Schema"
import { Port } from "the-moby-effect/schemas/index.js"

const decodePort = Schema.decodeSync(Port)
assert.strictEqual(decodePort(8080), 8080)

assert.throws(() => decodePort(65536))
assert.doesNotThrow(() => decodePort(8080))
```

**Signature**

```ts
declare class Port
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L37)

Since v1.0.0

## PortWithMaybeProtocol (class)

An operating system port number with an optional protocol.

**Signature**

```ts
declare class PortWithMaybeProtocol
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L54)

Since v1.0.0

# utils

## broadcastAddress

The last address in the range given by this address' subnet, often referred
to as the Broadcast Address.

**Signature**

```ts
declare const broadcastAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<IPv4>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<IPv6>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L665)

Since v1.0.0

## broadcastAddressAsBigint

The last address in the range given by this address' subnet, often referred
to as the Broadcast Address.

**Signature**

```ts
declare const broadcastAddressAsBigint: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<IPv4Bigint>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<IPv6Bigint>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L632)

Since v1.0.0

## cidrBlockForRange

Finds the smallest CIDR block that contains all the given IP addresses.

**Signature**

```ts
declare const cidrBlockForRange: <
  Input extends
    | Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv4>>
    | Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv6>>
>(
  inputs: Input
) => IPv4CidrBlock | IPv6CidrBlock
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L726)

Since v1.0.0

## networkAddress

The first address in the range given by this address' subnet, often referred
to as the Network Address.

**Signature**

```ts
declare const networkAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<IPv4>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<IPv6>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L615)

Since v1.0.0

## networkAddressAsBigint

The first address in the range given by this address' subnet, often referred
to as the Network Address.

**Signature**

```ts
declare const networkAddressAsBigint: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<IPv4Bigint>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<IPv6Bigint>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L582)

Since v1.0.0

## range

A stream of all addresses in the range given by this address' subnet.

**Signature**

```ts
declare const range: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Stream.Stream<Schema.Schema.Type<IPv4>, ParseResult.ParseError, never>
  : Input extends IPv6CidrBlock
    ? Stream.Stream<Schema.Schema.Type<IPv6>, ParseResult.ParseError, never>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L681)

Since v1.0.0

## total

The total number of addresses in the range given by this address' subnet.

**Signature**

```ts
declare const total: (input: IPv4CidrBlock | IPv6CidrBlock) => bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L715)

Since v1.0.0
