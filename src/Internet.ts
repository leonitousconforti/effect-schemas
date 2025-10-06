/**
 * Internet related schemas and filters
 *
 * @since 1.0.0
 */

import { Array, Effect, Function, Order, Schema, Stream, String, type ParseResult } from "effect";

/** @internal */
type Split<Str extends string, Delimiter extends string> = string extends Str | ""
    ? Array<string>
    : Str extends `${infer Head}${Delimiter}${infer Rest}`
      ? [Head, ...Split<Rest, Delimiter>]
      : [Str];

/** @internal */
const splitLiteral = <const Str extends string, const Delimiter extends string>(
    str: Str,
    delimiter: Delimiter
): Split<Str, Delimiter> => str.split(delimiter) as Split<Str, Delimiter>;

/**
 * An operating system port number.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     ```ts
 *
 *     import * as assert from "node:assert"
 *     import * as Schema from "effect/Schema";
 *
 *     import { Port } from "@leonitousconforti/effect-schemas/Internet";
 *     const decodePort = Schema.decodeSync(Port);
 *
 *     assert.strictEqual(decodePort(8080), 8080);
 *     assert.throws(() => decodePort(65536));
 *     ```;
 */
export class Port extends Function.pipe(
    Schema.Int,
    Schema.between(0, 2 ** 16 - 1),
    Schema.brand("Port"),
    Schema.annotations({
        title: "An OS port number",
        description: "An operating system's port number between 0 and 65535 (inclusive)",
    })
) {}

/**
 * An operating system port number with an optional protocol.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     ```ts
 *
 *     import * as assert from "node:assert"
 *     import * as Schema from "effect/Schema";
 *
 *     import { PortWithMaybeProtocol } from "@leonitousconforti/effect-schemas/Internet";
 *     const decodePortWithMaybeProtocol = Schema.decodeUnknownSync(PortWithMaybeProtocol);
 *
 *     assert.strictEqual(decodePortWithMaybeProtocol("8080"), "8080");
 *     assert.strictEqual(decodePortWithMaybeProtocol("8080/tcp"), "8080/tcp");
 *     assert.strictEqual(decodePortWithMaybeProtocol("8080/udp"), "8080/udp");
 *     assert.throws(() => decodePortWithMaybeProtocol("8080/icmp"));
 *     assert.throws(() => decodePortWithMaybeProtocol("70000"));
 *     ```;
 */
export class PortWithMaybeProtocol extends Schema.transform(
    Schema.Union(
        Schema.TemplateLiteral(Port),
        Schema.TemplateLiteral(Port, "/", Schema.Literal("tcp")),
        Schema.TemplateLiteral(Port, "/", Schema.Literal("udp"))
    ),
    Schema.Struct({
        port: Schema.compose(Schema.NumberFromString, Port),
        protocol: Schema.optional(Schema.Union(Schema.Literal("tcp"), Schema.Literal("udp"))),
    }),
    {
        encode: ({ protocol }, { port }) => (protocol ? (`${port}/${protocol}` as const) : (`${port}` as const)),
        decode: (str) => {
            const split = splitLiteral(str, "/");
            return { port: split[0], protocol: split[1] };
        },
    }
) {}

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://stackoverflow.com/questions/4260467/what-is-a-regular-expression-for-a-mac-address
 */
export const MacAddressRegex = new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");

/**
 * A Mac Address.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class MacAddress extends Function.pipe(
    Schema.String,
    Schema.pattern(MacAddressRegex),
    Schema.brand("MacAddress"),
    Schema.annotations({
        title: "A MacAddress",
        description: "A network interface's MacAddress",
    })
) {}

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L16-L18
 */
export const IPv4Segment = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";

/**
 * @since 1.0.0
 * @category Regular expressions
 */
export const IPv4StringRegex = `(?:${IPv4Segment}\\.){3}${IPv4Segment}`;

/**
 * @since 1.0.0
 * @category Regular expressions
 */
export const IPv4Regex = new RegExp(`^${IPv4StringRegex}$`);

/**
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4Family extends Schema.Literal("ipv4").annotations({
    description: "An ipv4 family",
}) {}

/**
 * An IPv4 address in dot-decimal notation with no leading zeros.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4String = Schema.String.pipe(Schema.pattern(IPv4Regex));

/**
 * An IPv4 address.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     ```ts
 *
 *     import * as assert from "node:assert"
 *     import * as Schema from "effect/Schema";
 *
 *     import { IPv4 } from "@leonitousconforti/effect-schemas/Internet";
 *     const decodeIPv4 = Schema.decodeSync(IPv4);
 *
 *     assert.deepEqual(decodeIPv4("1.1.1.1"), {
 *         family: "ipv4",
 *         ip: "1.1.1.1",
 *     });
 *     assert.throws(() => decodeIPv4("1.1.a.1"));
 *     assert.doesNotThrow(() => decodeIPv4("1.1.1.2"));
 *     ```;
 */
export class IPv4 extends Schema.transform(
    IPv4String,
    Schema.Struct({
        family: IPv4Family,
        ip: Schema.String.pipe(Schema.brand("IPv4")),
    }),
    {
        encode: ({ ip }) => ip,
        decode: (ip) => ({ ip, family: "ipv4" }) as const,
    }
).annotations({
    title: "An ipv4 address",
    description: "An ipv4 address in dot-decimal notation with no leading zeros",
}) {}

/**
 * An IPv4 as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4Bigint extends Schema.transformOrFail(
    IPv4,
    Schema.Struct({
        family: IPv4Family,
        value: Schema.BigIntFromSelf.pipe(Schema.brand("IPv4Bigint")),
    }),
    {
        encode: ({ value }) => {
            const padded = value.toString(16).replace(/:/g, "").padStart(8, "0");
            const groups: Array<number> = [];
            for (let i = 0; i < 8; i += 2) {
                const h = padded.slice(i, i + 2);
                groups.push(parseInt(h, 16));
            }
            return Effect.mapError(Schema.decode(IPv4)(groups.join(".")), ({ issue }) => issue);
        },
        decode: ({ ip }) =>
            Function.pipe(
                ip,
                String.split("."),
                Array.map((s) => Number.parseInt(s, 10)),
                Array.map((n) => n.toString(16)),
                Array.map(String.padStart(2, "0")),
                Array.join(""),
                (hex) => BigInt(`0x${hex}`),
                (value) => ({ value, family: "ipv4" }) as const,
                Effect.succeed
            ),
    }
).annotations({
    description: "An ipv4 address as a bigint",
}) {}

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L21-L31
 */
export const IPv6Segment = "(?:[0-9a-fA-F]{1,4})";

/**
 * @since 1.0.0
 * @category Regular expressions
 */
export const IPv6Regex = new RegExp(
    "^(?:" +
        `(?:${IPv6Segment}:){7}(?:${IPv6Segment}|:)|` +
        `(?:${IPv6Segment}:){6}(?:${IPv4StringRegex}|:${IPv6Segment}|:)|` +
        `(?:${IPv6Segment}:){5}(?::${IPv4StringRegex}|(?::${IPv6Segment}){1,2}|:)|` +
        `(?:${IPv6Segment}:){4}(?:(?::${IPv6Segment}){0,1}:${IPv4StringRegex}|(?::${IPv6Segment}){1,3}|:)|` +
        `(?:${IPv6Segment}:){3}(?:(?::${IPv6Segment}){0,2}:${IPv4StringRegex}|(?::${IPv6Segment}){1,4}|:)|` +
        `(?:${IPv6Segment}:){2}(?:(?::${IPv6Segment}){0,3}:${IPv4StringRegex}|(?::${IPv6Segment}){1,5}|:)|` +
        `(?:${IPv6Segment}:){1}(?:(?::${IPv6Segment}){0,4}:${IPv4StringRegex}|(?::${IPv6Segment}){1,6}|:)|` +
        `(?::(?:(?::${IPv6Segment}){0,5}:${IPv4StringRegex}|(?::${IPv6Segment}){1,7}|:))` +
        ")(?:%[0-9a-zA-Z-.:]{1,})?$"
);

/**
 * @since 1.0.0
 * @category Schemas
 */
export class IPv6Family extends Schema.Literal("ipv6").annotations({
    description: "An ipv6 family",
}) {}

/**
 * An IPv6 address in string format.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6String = Schema.String.pipe(Schema.pattern(IPv6Regex));

/**
 * An IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     ```ts
 *
 *     import * as assert from "node:assert"
 *     import * as Schema from "effect/Schema";
 *
 *     import { IPv6 } from "@leonitousconforti/effect-schemas/Internet";
 *     const decodeIPv6 = Schema.decodeSync(IPv6);
 *
 *     assert.deepEqual(decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), {
 *         family: "ipv6",
 *         ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
 *     });
 *     assert.throws(() =>
 *         decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334:")
 *     );
 *     assert.throws(() => decodeIPv6("2001::85a3::0000::0370:7334"));
 *     assert.doesNotThrow(() =>
 *         decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")
 *     );
 *     ```;
 */
export class IPv6 extends Schema.transform(
    IPv6String,
    Schema.Struct({
        family: IPv6Family,
        ip: Schema.String.pipe(Schema.brand("IPv6")),
    }),
    {
        encode: ({ ip }) => ip,
        decode: (ip) => ({ ip, family: "ipv6" }) as const,
    }
).annotations({
    description: "An ipv6 address",
}) {}

/**
 * An IPv6 as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv6Bigint extends Schema.transformOrFail(
    IPv6,
    Schema.Struct({
        family: IPv6Family,
        value: Schema.BigIntFromSelf.pipe(Schema.brand("IPv6Bigint")),
    }),
    {
        encode: ({ value }) => {
            const hex = value.toString(16).padStart(32, "0");
            const groups = [];
            for (let i = 0; i < 8; i++) {
                groups.push(hex.slice(i * 4, (i + 1) * 4));
            }
            return Effect.mapError(Schema.decode(IPv6)(groups.join(":")), ({ issue }) => issue);
        },
        decode: ({ ip }) => {
            function paddedHex(octet: string): string {
                return parseInt(octet, 16).toString(16).padStart(4, "0");
            }

            let groups: Array<string> = [];
            const halves = ip.split("::");

            if (halves.length === 2) {
                let first = halves[0]!.split(":");
                let last = halves[1]!.split(":");

                if (first.length === 1 && first[0] === "") {
                    first = [];
                }
                if (last.length === 1 && last[0] === "") {
                    last = [];
                }

                const remaining = 8 - (first.length + last.length);
                if (!remaining) {
                    throw new Error("Error parsing groups");
                }

                groups = groups.concat(first);
                for (let i = 0; i < remaining; i++) {
                    groups.push("0");
                }
                groups = groups.concat(last);
            } else if (halves.length === 1) {
                groups = ip.split(":");
            } else {
                throw new Error("Too many :: groups found");
            }

            groups = groups.map((group: string) => parseInt(group, 16).toString(16));
            if (groups.length !== 8) {
                throw new Error("Invalid number of groups");
            }

            return Effect.succeed({ value: BigInt(`0x${groups.map(paddedHex).join("")}`), family: "ipv6" } as const);
        },
    }
).annotations({
    description: "An ipv6 address as a bigint",
}) {}

/**
 * @since 1.0.0
 * @category Schemas
 * @see {@link IPv4Family}
 * @see {@link IPv6Family}
 */
export class Family extends Schema.Union(IPv4Family, IPv6Family).annotations({
    description: "An ipv4 or ipv6 family",
}) {}

/**
 * An IP address in string format, which is either an IPv4 or IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class AddressString extends Schema.Union(IPv4String, IPv6String).annotations({
    description: "An ipv4 or ipv6 address in string format",
}) {}

/**
 * An IP address, which is either an IPv4 or IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     ```ts
 *
 *     import * as assert from "node:assert"
 *     import * as Schema from "effect/Schema";
 *
 *     import { Address } from "@leonitousconforti/effect-schemas/Internet";
 *     const decodeAddress = Schema.decodeSync(Address);
 *
 *     assert.throws(() => decodeAddress("1.1.b.1"));
 *     assert.throws(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334:"));
 *
 *     assert.doesNotThrow(() => decodeAddress("1.1.1.2"));
 *     assert.doesNotThrow(() => decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334"));
 *     ```;
 *
 * @see {@link IPv4}
 * @see {@link IPv6}
 */
export class Address extends Schema.Union(IPv4, IPv6).annotations({
    description: "An ipv4 or ipv6 address",
}) {}

/**
 * An IP address as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class AddressBigint extends Schema.Union(IPv4Bigint, IPv6Bigint).annotations({
    description: "An ipv4 or ipv6 address as a bigint",
}) {}

/**
 * An ipv4 cidr mask, which is a number between 0 and 32.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4CidrMask extends Schema.Int.pipe(Schema.between(0, 32))
    .pipe(Schema.brand("IPv4CidrMask"))
    .annotations({
        description: "An ipv4 cidr mask",
    }) {}

/**
 * An ipv6 cidr mask, which is a number between 0 and 128.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv6CidrMask extends Schema.Int.pipe(Schema.between(0, 128))
    .pipe(Schema.brand("IPv6CidrMask"))
    .annotations({
        description: "An ipv6 cidr mask",
    }) {}

/** @internal */
const onFamily = Function.dual<
    <OnIPv4, OnIPv6>({
        onIPv4,
        onIPv6,
    }: {
        onIPv4: (self: IPv4CidrBlock) => OnIPv4;
        onIPv6: (self: IPv6CidrBlock) => OnIPv6;
    }) => <Input extends IPv4CidrBlock | IPv6CidrBlock>(
        input: Input
    ) => Input extends IPv4CidrBlock ? OnIPv4 : Input extends IPv6CidrBlock ? OnIPv6 : never,
    <Input extends IPv4CidrBlock | IPv6CidrBlock, OnIPv4, OnIPv6>(
        input: Input,
        {
            onIPv4,
            onIPv6,
        }: {
            onIPv4: (self: IPv4CidrBlock) => OnIPv4;
            onIPv6: (self: IPv6CidrBlock) => OnIPv6;
        }
    ) => Input extends IPv4CidrBlock ? OnIPv4 : Input extends IPv6CidrBlock ? OnIPv6 : never
>(
    2,
    <Input extends IPv4CidrBlock | IPv6CidrBlock, OnIPv4, OnIPv6>(
        input: Input,
        {
            onIPv4,
            onIPv6,
        }: {
            onIPv4: (self: IPv4CidrBlock) => OnIPv4;
            onIPv6: (self: IPv6CidrBlock) => OnIPv6;
        }
    ): Input extends IPv4CidrBlock ? OnIPv4 : Input extends IPv6CidrBlock ? OnIPv6 : never => {
        switch (input.address.family) {
            case "ipv4":
                return onIPv4(input as any) as any;
            case "ipv6":
                return onIPv6(input as any) as any;
            default:
                return Function.absurd<any>(input.address);
        }
    }
);

/**
 * The first address in the range given by this address' subnet, often referred
 * to as the Network Address.
 *
 * @since 1.0.0
 */
export const networkAddressAsBigint = <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
): Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4Bigint>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6Bigint>
      : never => {
    const bits = input.address.family === "ipv4" ? 32 : 128;
    const { value: bigIntegerAddress } = onFamily(input, {
        onIPv4: (self) => Schema.decodeSync(IPv4Bigint)(self.address.ip),
        onIPv6: (self) => Schema.decodeSync(IPv6Bigint)(self.address.ip),
    });
    const intermediate = bigIntegerAddress.toString(2).padStart(bits, "0").slice(0, input.mask);
    const networkAddressString = intermediate + "0".repeat(bits - input.mask);
    const networkAddressBigint = BigInt(`0b${networkAddressString}`);
    return onFamily(input, {
        onIPv4: (self) => ({
            family: self.address.family,
            value: IPv4Bigint.to["fields"]["value"].make(networkAddressBigint),
        }),
        onIPv6: (self) => ({
            family: self.address.family,
            value: IPv6Bigint.to["fields"]["value"].make(networkAddressBigint),
        }),
    });
};

/**
 * The first address in the range given by this address' subnet, often referred
 * to as the Network Address.
 *
 * @since 1.0.0
 */
export const networkAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
) => Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6>
      : never = onFamily({
    onIPv4: (self) => Schema.decodeSync(IPv4)(Schema.encodeSync(IPv4Bigint)(networkAddressAsBigint(self))),
    onIPv6: (self) => Schema.decodeSync(IPv6)(Schema.encodeSync(IPv6Bigint)(networkAddressAsBigint(self))),
});

/**
 * The last address in the range given by this address' subnet, often referred
 * to as the Broadcast Address.
 *
 * @since 1.0.0
 */
export const broadcastAddressAsBigint = <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
): Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4Bigint>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6Bigint>
      : never => {
    const bits = input.address.family === "ipv4" ? 32 : 128;
    const { value: bigIntegerAddress } = onFamily(input, {
        onIPv4: (self) => Schema.decodeSync(IPv4Bigint)(self.address.ip),
        onIPv6: (self) => Schema.decodeSync(IPv6Bigint)(self.address.ip),
    });
    const intermediate = bigIntegerAddress.toString(2).padStart(bits, "0").slice(0, input.mask);
    const broadcastAddressString = intermediate + "1".repeat(bits - input.mask);
    const broadcastAddressBigInt = BigInt(`0b${broadcastAddressString}`);
    return onFamily(input, {
        onIPv4: (self) => ({
            family: self.address.family,
            value: IPv4Bigint.to["fields"]["value"].make(broadcastAddressBigInt),
        }),
        onIPv6: (self) => ({
            family: self.address.family,
            value: IPv6Bigint.to["fields"]["value"].make(broadcastAddressBigInt),
        }),
    });
};

/**
 * The last address in the range given by this address' subnet, often referred
 * to as the Broadcast Address.
 *
 * @since 1.0.0
 */
export const broadcastAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
) => Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6>
      : never = onFamily({
    onIPv4: (self) => Schema.decodeSync(IPv4)(Schema.encodeSync(IPv4Bigint)(broadcastAddressAsBigint(self))),
    onIPv6: (self) => Schema.decodeSync(IPv6)(Schema.encodeSync(IPv6Bigint)(broadcastAddressAsBigint(self))),
});

/**
 * A stream of all addresses in the range given by this address' subnet.
 *
 * @since 1.0.0
 */
export const range: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
) => Input extends IPv4CidrBlock
    ? Stream.Stream<Schema.Schema.Type<IPv4>, ParseResult.ParseError, never>
    : Input extends IPv6CidrBlock
      ? Stream.Stream<Schema.Schema.Type<IPv6>, ParseResult.ParseError, never>
      : never = onFamily({
    onIPv4: (self) => {
        const { value: minValue } = networkAddressAsBigint(self);
        const { value: maxValue } = broadcastAddressAsBigint(self);
        return Function.pipe(
            Stream.iterate(minValue, (x) => IPv4Bigint.to["fields"]["value"].make(x + 1n)),
            Stream.takeWhile((n) => n <= maxValue),
            Stream.flatMap((value) => Schema.encode(IPv4Bigint)({ value, family: "ipv4" })),
            Stream.mapEffect(Schema.decode(IPv4))
        );
    },
    onIPv6: (self) => {
        const { value: minValue } = networkAddressAsBigint(self);
        const { value: maxValue } = broadcastAddressAsBigint(self);
        return Function.pipe(
            Stream.iterate(minValue, (x) => IPv6Bigint.to["fields"]["value"].make(x + 1n)),
            Stream.takeWhile((n) => n <= maxValue),
            Stream.flatMap((value) => Schema.encode(IPv6Bigint)({ value, family: "ipv6" })),
            Stream.mapEffect(Schema.decode(IPv6))
        );
    },
});

/**
 * The total number of addresses in the range given by this address' subnet.
 *
 * @since 1.0.0
 */
export const total = (input: IPv4CidrBlock | IPv6CidrBlock): bigint => {
    const minValue: bigint = networkAddressAsBigint(input).value;
    const maxValue: bigint = broadcastAddressAsBigint(input).value;
    return maxValue - minValue + 1n;
};

/**
 * Finds the smallest CIDR block that contains all the given IP addresses.
 *
 * @since 1.0.0
 */
export const cidrBlockForRange = <
    Input extends
        | Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv4>>
        | Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv6>>,
>(
    inputs: Input
) => {
    const AddressBigintOrder = Order.make(
        (a: Schema.Schema.Type<AddressBigint>, b: Schema.Schema.Type<AddressBigint>) => {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
            } else {
                return 0;
            }
        }
    );

    const heterogenousInputs = inputs as Array.NonEmptyReadonlyArray<Schema.Schema.Type<Address>>;
    const bigints = Array.map(heterogenousInputs, (address) =>
        address.family === "ipv4"
            ? Schema.decodeSync(IPv4Bigint)(address.ip)
            : Schema.decodeSync(IPv6Bigint)(address.ip)
    );

    const bits = heterogenousInputs[0].family === "ipv4" ? 32 : 128;
    const min = Array.min(AddressBigintOrder)(bigints);
    const max = Array.max(AddressBigintOrder)(bigints);
    const leadingZerosInMin = bits - min.value.toString(2).length;
    const leadingZerosInMax = bits - max.value.toString(2).length;
    const leadingMin = Math.min(leadingZerosInMin, leadingZerosInMax);
    const address = min.family === "ipv4" ? Schema.encodeSync(IPv4Bigint)(min) : Schema.encodeSync(IPv6Bigint)(min);

    return Schema.decodeSync(CidrBlock)({
        address,
        mask: leadingMin,
    });
};

/**
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4CidrBlock extends Schema.Class<IPv4CidrBlock>("IPv4CidrBlock")(
    {
        address: IPv4,
        mask: IPv4CidrMask,
    },
    {
        description: "An ipv4 cidr block",
    }
) {
    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddressAsBigint = networkAddressAsBigint(this);

    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddress = networkAddress(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddressAsBigint = broadcastAddressAsBigint(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddress = broadcastAddress(this);

    /**
     * A stream of all addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public range = range(this);

    /**
     * The total number of addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public total = total(this);
}

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4CidrBlockFromString extends Schema.transform(
    Schema.TemplateLiteral(Schema.String, Schema.Literal("/"), Schema.Number),
    IPv4CidrBlock,
    {
        decode: (str) => {
            const [address, mask] = splitLiteral(str, "/");
            return { address, mask: Number.parseInt(mask, 10) } as const;
        },
        encode: ({ address, mask }) => `${address}/${mask}` as const,
    }
).annotations({
    description: "An ipv4 cidr block from string",
}) {}

/**
 * @since 1.0.0
 * @category Schemas
 */
export class IPv6CidrBlock extends Schema.Class<IPv6CidrBlock>("IPv6CidrBlock")(
    {
        address: IPv6,
        mask: IPv6CidrMask,
    },
    {
        description: "An ipv6 cidr block",
    }
) {
    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddressAsBigint: Schema.Schema.Type<IPv6Bigint> = networkAddressAsBigint(this);

    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddress = networkAddress(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddressAsBigint = broadcastAddressAsBigint(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddress = broadcastAddress(this);

    /**
     * A stream of all addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public range = range(this);

    /**
     * The total number of addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public total = total(this);
}

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv6CidrBlockFromString extends Schema.transform(
    Schema.TemplateLiteral(Schema.String, Schema.Literal("/"), Schema.Number),
    IPv6CidrBlock,
    {
        decode: (str) => {
            const [address, mask] = splitLiteral(str, "/");
            return { address, mask: Number.parseInt(mask, 10) } as const;
        },
        encode: ({ address, mask }) => `${address}/${mask}` as const,
    }
).annotations({
    description: "An ipv6 cidr block from string",
}) {}

/**
 * @since 1.0.0
 * @category Schemas
 */
export class CidrBlock extends Schema.Union(IPv4CidrBlock, IPv6CidrBlock) {}

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class CidrBlockFromString extends Schema.transform(
    Schema.TemplateLiteral(Schema.String, Schema.Literal("/"), Schema.Number),
    CidrBlock,
    {
        decode: (str) => {
            const [address, mask] = splitLiteral(str, "/");
            return { address, mask: Number.parseInt(mask, 10) } as const;
        },
        encode: ({ address, mask }) => `${address}/${mask}` as const,
    }
).annotations({
    description: "A cidr block",
}) {}
