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

- [Schemas](#schemas)
  - [Address](#address)
  - [AddressBigint](#addressbigint)
  - [AddressString](#addressstring)
  - [CidrBlock](#cidrblock)
  - [CidrBlockFromString](#cidrblockfromstring)
  - [Family](#family)
  - [IPv4](#ipv4)
  - [IPv4Bigint](#ipv4bigint)
  - [IPv4CidrBlock (class)](#ipv4cidrblock-class)
    - [networkAddressAsBigint (property)](#networkaddressasbigint-property)
    - [networkAddress (property)](#networkaddress-property)
    - [broadcastAddressAsBigint (property)](#broadcastaddressasbigint-property)
    - [broadcastAddress (property)](#broadcastaddress-property)
    - [range (property)](#range-property)
    - [total (property)](#total-property)
  - [IPv4CidrBlockFromString](#ipv4cidrblockfromstring)
  - [IPv4CidrMask](#ipv4cidrmask)
  - [IPv4Family](#ipv4family)
  - [IPv4String](#ipv4string)
  - [IPv6](#ipv6)
  - [IPv6Bigint](#ipv6bigint)
  - [IPv6CidrBlock (class)](#ipv6cidrblock-class)
    - [networkAddressAsBigint (property)](#networkaddressasbigint-property-1)
    - [networkAddress (property)](#networkaddress-property-1)
    - [broadcastAddressAsBigint (property)](#broadcastaddressasbigint-property-1)
    - [broadcastAddress (property)](#broadcastaddress-property-1)
    - [range (property)](#range-property-1)
    - [total (property)](#total-property-1)
  - [IPv6CidrBlockFromString](#ipv6cidrblockfromstring)
  - [IPv6CidrMask](#ipv6cidrmask)
  - [IPv6Family](#ipv6family)
  - [IPv6String](#ipv6string)
  - [MacAddress (interface)](#macaddress-interface)
  - [Port](#port)
  - [PortWithMaybeProtocol](#portwithmaybeprotocol)
- [utils](#utils)
  - [MacAddress](#macaddress)
  - [broadcastAddress](#broadcastaddress)
  - [broadcastAddressAsBigint](#broadcastaddressasbigint)
  - [cidrBlockForRange](#cidrblockforrange)
  - [networkAddress](#networkaddress)
  - [networkAddressAsBigint](#networkaddressasbigint)
  - [range](#range)
  - [total](#total)

---

# Schemas

## Address

An IP address, which is either an IPv4 or IPv6 address.

**Example**

````ts

    import * as assert from "node:assert"
    import * as Schema from "effect/Schema";

    import { Address } from "@leonitousconforti/effect-schemas/Internet";
    const decodeAddress = Schema.decodeSync(Address);

    assert.throws(() => decodeAddress("1.1.b.1"));
    assert.throws(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334:"));

    assert.doesNotThrow(() => decodeAddress("1.1.1.2"));
    assert.doesNotThrow(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334"));
    ```;

**See**

- `IPv4`
- `IPv6`

**Signature**

```ts
declare const Address: Schema.Union<readonly [Schema.decodeTo<Schema.Struct<{ readonly family: Schema.Literal<"ipv4">; readonly ip: Schema.brand<Schema.String, "IPv4">; }>, Schema.String, never, never>, Schema.decodeTo<Schema.Struct<{ readonly family: Schema.Literal<"ipv6">; readonly ip: Schema.brand<Schema.String, "IPv6">; }>, Schema.String, never, never>]>
````

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L471)

Since v1.0.0

## AddressBigint

An IP address as a bigint.

**Signature**

```ts
declare const AddressBigint: Schema.Union<
  readonly [
    Schema.decodeTo<
      Schema.Struct<{
        readonly family: Schema.Literal<"ipv4">
        readonly value: Schema.brand<Schema.BigInt, "IPv4Bigint">
      }>,
      Schema.decodeTo<
        Schema.Struct<{ readonly family: Schema.Literal<"ipv4">; readonly ip: Schema.brand<Schema.String, "IPv4"> }>,
        Schema.String,
        never,
        never
      >,
      never,
      never
    >,
    Schema.decodeTo<
      Schema.Struct<{
        readonly family: Schema.Literal<"ipv6">
        readonly value: Schema.brand<Schema.BigInt, "IPv6Bigint">
      }>,
      Schema.decodeTo<
        Schema.Struct<{ readonly family: Schema.Literal<"ipv6">; readonly ip: Schema.brand<Schema.String, "IPv6"> }>,
        Schema.String,
        never,
        never
      >,
      never,
      never
    >
  ]
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L483)

Since v1.0.0

## AddressString

An IP address in string format, which is either an IPv4 or IPv6 address.

**Signature**

```ts
declare const AddressString: Schema.Union<readonly [Schema.String, Schema.String]>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L441)

Since v1.0.0

## CidrBlock

**Signature**

```ts
declare const CidrBlock: Schema.Union<readonly [typeof IPv4CidrBlock, typeof IPv6CidrBlock]>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L919)

Since v1.0.0

## CidrBlockFromString

A schema that transforms a `string` into a `CidrBlock`.

**Signature**

```ts
declare const CidrBlockFromString: Schema.decodeTo<
  Schema.Union<readonly [typeof IPv4CidrBlock, typeof IPv6CidrBlock]>,
  Schema.TemplateLiteral<readonly [Schema.String, "/", Schema.Number]>,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L927)

Since v1.0.0

## Family

**See**

- `IPv4Family`
- `IPv6Family`

**Signature**

```ts
declare const Family: Schema.Union<readonly [Schema.Literal<"ipv4">, Schema.Literal<"ipv6">]>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L429)

Since v1.0.0

## IPv4

An IPv4 address.

**Example**

````ts

    import * as assert from "node:assert"
    import * as Schema from "effect/Schema";

    import { IPv4 } from "@leonitousconforti/effect-schemas/Internet";
    const decodeIPv4 = Schema.decodeSync(IPv4);

    assert.deepEqual(decodeIPv4("1.1.1.1"), {
        family: "ipv4",
        ip: "1.1.1.1",
    });
    assert.throws(() => decodeIPv4("1.1.a.1"));
    assert.doesNotThrow(() => decodeIPv4("1.1.1.2"));
    ```;

**Signature**

```ts
declare const IPv4: Schema.decodeTo<Schema.Struct<{ readonly family: Schema.Literal<"ipv4">; readonly ip: Schema.brand<Schema.String, "IPv4">; }>, Schema.String, never, never>
````

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L192)

Since v1.0.0

## IPv4Bigint

An IPv4 address as a bigint.

**Signature**

```ts
declare const IPv4Bigint: Schema.decodeTo<
  Schema.Struct<{ readonly family: Schema.Literal<"ipv4">; readonly value: Schema.brand<Schema.BigInt, "IPv4Bigint"> }>,
  Schema.decodeTo<
    Schema.Struct<{ readonly family: Schema.Literal<"ipv4">; readonly ip: Schema.brand<Schema.String, "IPv4"> }>,
    Schema.String,
    never,
    never
  >,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L215)

Since v1.0.0

## IPv4CidrBlock (class)

**Signature**

```ts
declare class IPv4CidrBlock
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L755)

Since v1.0.0

### networkAddressAsBigint (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddressAsBigint: { readonly family: "ipv4"; readonly value: bigint & Brand<"IPv4Bigint">; }
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L770)

Since v1.0.0

### networkAddress (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L778)

Since v1.0.0

### broadcastAddressAsBigint (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddressAsBigint: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly value: bigint & Brand<"IPv4Bigint">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly value: bigint & Brand<"IPv6Bigint">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L786)

Since v1.0.0

### broadcastAddress (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L794)

Since v1.0.0

### range (property)

A stream of all addresses in the range given by this address' subnet.

**Signature**

```ts
range: this extends IPv4CidrBlock ? Stream.Stream<{ readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; }, Schema.SchemaError, never> : this extends IPv6CidrBlock ? Stream.Stream<{ readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; }, Schema.SchemaError, never> : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L801)

Since v1.0.0

### total (property)

The total number of addresses in the range given by this address' subnet.

**Signature**

```ts
total: bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L808)

Since v1.0.0

## IPv4CidrBlockFromString

A schema that transforms a `string` into an `IPv4CidrBlock`.

**Signature**

```ts
declare const IPv4CidrBlockFromString: Schema.decodeTo<
  typeof IPv4CidrBlock,
  Schema.TemplateLiteral<readonly [Schema.String, "/", Schema.Number]>,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L817)

Since v1.0.0

## IPv4CidrMask

An ipv4 cidr mask, which is a number between 0 and 32.

**Signature**

```ts
declare const IPv4CidrMask: Schema.brand<Schema.Int, "IPv4CidrMask">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L495)

Since v1.0.0

## IPv4Family

**Signature**

```ts
declare const IPv4Family: Schema.Literal<"ipv4">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L148)

Since v1.0.0

## IPv4String

An IPv4 address in dot-decimal notation with no leading zeros.

**Signature**

```ts
declare const IPv4String: Schema.String
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L160)

Since v1.0.0

## IPv6

An IPv6 address.

**Example**

````ts

    import * as assert from "node:assert"
    import * as Schema from "effect/Schema";

    import { IPv6 } from "@leonitousconforti/effect-schemas/Internet";
    const decodeIPv6 = Schema.decodeSync(IPv6);

    assert.deepEqual(decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), {
        family: "ipv6",
        ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
    });
    assert.throws(() =>
        decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334:")
    );
    assert.throws(() => decodeIPv6("2001::85a3::0000::0370:7334"));
    assert.doesNotThrow(() =>
        decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")
    );
    ```;

**Signature**

```ts
declare const IPv6: Schema.decodeTo<Schema.Struct<{ readonly family: Schema.Literal<"ipv6">; readonly ip: Schema.brand<Schema.String, "IPv6">; }>, Schema.String, never, never>
````

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L328)

Since v1.0.0

## IPv6Bigint

An IPv6 address as a bigint.

**Signature**

```ts
declare const IPv6Bigint: Schema.decodeTo<
  Schema.Struct<{ readonly family: Schema.Literal<"ipv6">; readonly value: Schema.brand<Schema.BigInt, "IPv6Bigint"> }>,
  Schema.decodeTo<
    Schema.Struct<{ readonly family: Schema.Literal<"ipv6">; readonly ip: Schema.brand<Schema.String, "IPv6"> }>,
    Schema.String,
    never,
    never
  >,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L350)

Since v1.0.0

## IPv6CidrBlock (class)

**Signature**

```ts
declare class IPv6CidrBlock
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L837)

Since v1.0.0

### networkAddressAsBigint (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddressAsBigint: { readonly family: "ipv6"; readonly value: bigint & Brand<"IPv6Bigint">; }
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L852)

Since v1.0.0

### networkAddress (property)

The first address in the range given by this address' subnet, often
referred to as the Network Address.

**Signature**

```ts
networkAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L860)

Since v1.0.0

### broadcastAddressAsBigint (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddressAsBigint: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly value: bigint & Brand<"IPv4Bigint">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly value: bigint & Brand<"IPv6Bigint">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L868)

Since v1.0.0

### broadcastAddress (property)

The last address in the range given by this address' subnet, often
referred to as the Broadcast Address.

**Signature**

```ts
broadcastAddress: this extends IPv4CidrBlock ? { readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; } : this extends IPv6CidrBlock ? { readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; } : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L876)

Since v1.0.0

### range (property)

A stream of all addresses in the range given by this address' subnet.

**Signature**

```ts
range: this extends IPv4CidrBlock ? Stream.Stream<{ readonly family: "ipv4"; readonly ip: string & Brand<"IPv4">; }, Schema.SchemaError, never> : this extends IPv6CidrBlock ? Stream.Stream<{ readonly family: "ipv6"; readonly ip: string & Brand<"IPv6">; }, Schema.SchemaError, never> : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L883)

Since v1.0.0

### total (property)

The total number of addresses in the range given by this address' subnet.

**Signature**

```ts
total: bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L890)

Since v1.0.0

## IPv6CidrBlockFromString

A schema that transforms a `string` into an `IPv6CidrBlock`.

**Signature**

```ts
declare const IPv6CidrBlockFromString: Schema.decodeTo<
  typeof IPv6CidrBlock,
  Schema.TemplateLiteral<readonly [Schema.String, "/", Schema.Number]>,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L899)

Since v1.0.0

## IPv6CidrMask

An ipv6 cidr mask, which is a number between 0 and 128.

**Signature**

```ts
declare const IPv6CidrMask: Schema.brand<Schema.Int, "IPv6CidrMask">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L509)

Since v1.0.0

## IPv6Family

**Signature**

```ts
declare const IPv6Family: Schema.Literal<"ipv6">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L279)

Since v1.0.0

## IPv6String

An IPv6 address in string format.

**Signature**

```ts
declare const IPv6String: Schema.String
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L291)

Since v1.0.0

## MacAddress (interface)

A Mac Address.

**Signature**

```ts
export interface MacAddress extends Schema.brand<Schema.String, "MacAddress"> {}
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L111)

Since v1.0.0

## Port

An operating system port number.

**Example**

````ts

    import * as assert from "node:assert"
    import * as Schema from "effect/Schema";

    import { Port } from "@leonitousconforti/effect-schemas/Internet";
    const decodePort = Schema.decodeSync(Port);

    assert.strictEqual(decodePort(8080), 8080);
    assert.throws(() => decodePort(65536));
    ```;

**Signature**

```ts
declare const Port: Schema.brand<Schema.Int, "Port">
````

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L51)

Since v1.0.0

## PortWithMaybeProtocol

An operating system port number with an optional protocol.

**Signature**

```ts
declare const PortWithMaybeProtocol: Schema.decodeTo<
  Schema.Struct<{
    readonly port: Schema.brand<Schema.Int, "Port">
    readonly protocol: Schema.optional<Schema.Union<readonly [Schema.Literal<"tcp">, Schema.Literal<"udp">]>>
  }>,
  Schema.Union<
    readonly [
      Schema.TemplateLiteral<readonly [Schema.Number]>,
      Schema.TemplateLiteral<readonly [Schema.Number, "/", Schema.Literal<"tcp">]>,
      Schema.TemplateLiteral<readonly [Schema.Number, "/", Schema.Literal<"udp">]>
    ]
  >,
  never,
  never
>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L71)

Since v1.0.0

# utils

## MacAddress

**Signature**

```ts
declare const MacAddress: MacAddress
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L114)

Since v1.0.0

## broadcastAddress

The last address in the range given by this address' subnet, often referred
to as the Broadcast Address.

**Signature**

```ts
declare const broadcastAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<typeof IPv4>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<typeof IPv6>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L650)

Since v1.0.0

## broadcastAddressAsBigint

The last address in the range given by this address' subnet, often referred
to as the Broadcast Address.

**Signature**

```ts
declare const broadcastAddressAsBigint: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<typeof IPv4Bigint>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<typeof IPv6Bigint>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L617)

Since v1.0.0

## cidrBlockForRange

Finds the smallest CIDR block that contains all the given IP addresses.

**Signature**

```ts
declare const cidrBlockForRange: <
  Input extends
    | Array.NonEmptyReadonlyArray<Schema.Schema.Type<typeof IPv4>>
    | Array.NonEmptyReadonlyArray<Schema.Schema.Type<typeof IPv6>>
>(
  inputs: Input
) => IPv4CidrBlock | IPv6CidrBlock
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L711)

Since v1.0.0

## networkAddress

The first address in the range given by this address' subnet, often referred
to as the Network Address.

**Signature**

```ts
declare const networkAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<typeof IPv4>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<typeof IPv6>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L600)

Since v1.0.0

## networkAddressAsBigint

The first address in the range given by this address' subnet, often referred
to as the Network Address.

**Signature**

```ts
declare const networkAddressAsBigint: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Schema.Schema.Type<typeof IPv4Bigint>
  : Input extends IPv6CidrBlock
    ? Schema.Schema.Type<typeof IPv6Bigint>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L567)

Since v1.0.0

## range

A stream of all addresses in the range given by this address' subnet.

**Signature**

```ts
declare const range: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
  input: Input
) => Input extends IPv4CidrBlock
  ? Stream.Stream<Schema.Schema.Type<typeof IPv4>, Schema.SchemaError, never>
  : Input extends IPv6CidrBlock
    ? Stream.Stream<Schema.Schema.Type<typeof IPv6>, Schema.SchemaError, never>
    : never
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L666)

Since v1.0.0

## total

The total number of addresses in the range given by this address' subnet.

**Signature**

```ts
declare const total: (input: IPv4CidrBlock | IPv6CidrBlock) => bigint
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Internet.ts#L700)

Since v1.0.0
