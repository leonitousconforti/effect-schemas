/**
 * Internet related schemas and filters
 *
 * @since 1.0.0
 */

import {
    Array,
    Effect,
    String,
    Function,
    Option,
    Order,
    Schema,
    SchemaIssue,
    SchemaTransformation,
    Stream,
} from "effect";

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
export const Port = Function.pipe(
    Schema.Int.check(
        Schema.isBetween({
            minimum: 0,
            maximum: 2 ** 16 - 1,
        })
    ),
    Schema.brand("Port"),
    Schema.annotate({
        title: "An OS port number",
        description: "An operating system's port number between 0 and 65535 (inclusive)",
    })
);

/**
 * An operating system port number with an optional protocol.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const PortWithMaybeProtocol = Schema.Union([
    Schema.TemplateLiteral([Schema.Number]),
    Schema.TemplateLiteral([Schema.Number, "/", Schema.Literal("tcp")]),
    Schema.TemplateLiteral([Schema.Number, "/", Schema.Literal("udp")]),
]).pipe(
    Schema.decodeTo(
        Schema.Struct({
            port: Port,
            protocol: Schema.optional(Schema.Union([Schema.Literal("tcp"), Schema.Literal("udp")])),
        }),
        SchemaTransformation.transformOrFail({
            decode: (str, options) => {
                const [portStr, protocol] = splitLiteral(str as string, "/");
                const portNum = parseInt(portStr, 10);
                return Schema.decodeEffect(Port)(portNum, options).pipe(
                    Effect.map((port) => ({ port, protocol: protocol as "tcp" | "udp" | undefined })),
                    Effect.mapError((e) => e.issue)
                );
            },
            encode: ({ port, protocol }: { port: number; protocol?: "tcp" | "udp" | undefined }) =>
                Effect.succeed(
                    (protocol ? `${port}/${protocol}` : `${port}`) as `${number}` | `${number}/tcp` | `${number}/udp`
                ),
        })
    )
);

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://stackoverflow.com/questions/4260467/what-is-a-regular-expression-for-a-mac-address
 */
const MacAddressRegex = new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");

/**
 * A Mac Address.
 *
 * @since 1.0.0
 * @category Schemas
 */
export interface MacAddress extends Schema.brand<Schema.String, "MacAddress"> {}

/** @since 1.0.0 */
export const MacAddress: MacAddress = Schema.String.pipe(
    Schema.check(
        Schema.isPattern(MacAddressRegex, {
            title: "MacAddress",
            expected: "a MAC address in the format XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX",
            description: "A network interface's MacAddress",
        })
    ),
    Schema.brand("MacAddress")
);

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L16-L18
 */
const IPv4Segment = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";

/**
 * @since 1.0.0
 * @category Regular expressions
 */
const IPv4StringRegex = `(?:${IPv4Segment}\\.){3}${IPv4Segment}`;

/**
 * @since 1.0.0
 * @category Regular expressions
 */
const IPv4Regex = new RegExp(`^${IPv4StringRegex}$`);

/**
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4Family = Schema.Literal("ipv4").pipe(
    Schema.annotate({
        description: "An ipv4 family",
    })
);

/**
 * An IPv4 address in dot-decimal notation with no leading zeros.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4String = Schema.String.pipe(
    Schema.check(
        Schema.isPattern(IPv4Regex, {
            title: "IPv4String",
            expected: "an IPv4 address in dot-decimal notation",
            description: "An IPv4 address string",
        })
    )
);

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
export const IPv4 = IPv4String.pipe(
    Schema.decodeTo(
        Schema.Struct({
            family: IPv4Family,
            ip: Schema.String.pipe(Schema.brand("IPv4")),
        }),
        SchemaTransformation.transform({
            decode: (ip) => ({ ip, family: "ipv4" as const }),
            encode: ({ ip }) => ip,
        })
    ),
    Schema.annotate({
        title: "An ipv4 address",
        description: "An ipv4 address in dot-decimal notation with no leading zeros",
    })
);

/**
 * An IPv4 address as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4Bigint = IPv4.pipe(
    Schema.decodeTo(
        Schema.Struct({
            family: IPv4Family,
            value: Schema.BigInt.pipe(Schema.brand("IPv4Bigint")),
        }),
        SchemaTransformation.transformOrFail({
            encode: ({ value }) => {
                const padded = value.toString(16).padStart(8, "0");
                const groups: Array<number> = [];
                for (let i = 0; i < 8; i += 2) {
                    const h = padded.slice(i, i + 2);
                    groups.push(parseInt(h, 16));
                }

                return Effect.mapError(Schema.decodeEffect(IPv4)(groups.join(".")), ({ issue }) => issue);
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
        })
    ),
    Schema.annotate({
        description: "An ipv4 address as a bigint",
    })
);

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L21-L31
 */
const IPv6Segment = "(?:[0-9a-fA-F]{1,4})";

/**
 * @since 1.0.0
 * @category Regular expressions
 */
const IPv6Regex = new RegExp(
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
export const IPv6Family = Schema.Literal("ipv6").pipe(
    Schema.annotate({
        description: "An ipv6 family",
    })
);

/**
 * An IPv6 address in string format.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6String = Schema.String.pipe(
    Schema.check(
        Schema.isPattern(IPv6Regex, {
            title: "IPv6String",
            expected: "an IPv6 address string",
            description: "An IPv6 address string",
        })
    )
);

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
export const IPv6 = IPv6String.pipe(
    Schema.decodeTo(
        Schema.Struct({
            family: IPv6Family,
            ip: Schema.String.pipe(Schema.brand("IPv6")),
        }),
        SchemaTransformation.transform({
            decode: (ip) => ({ ip, family: "ipv6" as const }),
            encode: ({ ip }) => ip,
        })
    ),
    Schema.annotate({
        description: "An ipv6 address",
    })
);

/**
 * An IPv6 address as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6Bigint = IPv6.pipe(
    Schema.decodeTo(
        Schema.Struct({
            family: IPv6Family,
            value: Schema.BigInt.pipe(Schema.brand("IPv6Bigint")),
        }),
        SchemaTransformation.transformOrFail({
            encode: ({ value }) => {
                const hex = value.toString(16).padStart(32, "0");
                const groups: Array<string> = [];
                for (let i = 0; i < 8; i++) {
                    groups.push(hex.slice(i * 4, (i + 1) * 4));
                }
                return Effect.mapError(Schema.decodeEffect(IPv6)(groups.join(":")), ({ issue }) => issue);
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

                    if (first.length === 1 && first[0] === "") first = [];
                    if (last.length === 1 && last[0] === "") last = [];

                    const remaining = 8 - (first.length + last.length);
                    if (!remaining && first.length + last.length !== 8) {
                        return Effect.fail(
                            new SchemaIssue.Forbidden(Option.some(ip), {
                                message: "Error parsing IPv6 groups",
                            })
                        );
                    }

                    groups = groups.concat(first);
                    for (let i = 0; i < remaining; i++) {
                        groups.push("0");
                    }
                    groups = groups.concat(last);
                } else if (halves.length === 1) {
                    groups = ip.split(":");
                } else {
                    return Effect.fail(
                        new SchemaIssue.Forbidden(Option.some(ip), {
                            message: "Too many :: groups found",
                        })
                    );
                }

                groups = groups.map((group) => parseInt(group, 16).toString(16));
                if (groups.length !== 8) {
                    return Effect.fail(
                        new SchemaIssue.Forbidden(Option.some(ip), { message: "Invalid number of IPv6 groups" })
                    );
                }

                return Effect.succeed({
                    value: BigInt(`0x${groups.map(paddedHex).join("")}`),
                    family: "ipv6" as const,
                });
            },
        })
    ),
    Schema.annotate({
        description: "An ipv6 address as a bigint",
    })
);

/**
 * @since 1.0.0
 * @category Schemas
 * @see {@link IPv4Family}
 * @see {@link IPv6Family}
 */
export const Family = Schema.Union([IPv4Family, IPv6Family]).pipe(
    Schema.annotate({
        description: "An ipv4 or ipv6 family",
    })
);

/**
 * An IP address in string format, which is either an IPv4 or IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const AddressString = Schema.Union([IPv4String, IPv6String]).pipe(
    Schema.annotate({
        description: "An ipv4 or ipv6 address in string format",
    })
);

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
export const Address = Schema.Union([IPv4, IPv6]).pipe(
    Schema.annotate({
        description: "An ipv4 or ipv6 address",
    })
);

/**
 * An IP address as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const AddressBigint = Schema.Union([IPv4Bigint, IPv6Bigint]).pipe(
    Schema.annotate({
        description: "An ipv4 or ipv6 address as a bigint",
    })
);

/**
 * An ipv4 cidr mask, which is a number between 0 and 32.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4CidrMask = Schema.Int.pipe(
    Schema.check(Schema.isBetween({ minimum: 0, maximum: 32 })),
    Schema.brand("IPv4CidrMask"),
    Schema.annotate({
        description: "An ipv4 cidr mask",
    })
);

/**
 * An ipv6 cidr mask, which is a number between 0 and 128.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6CidrMask = Schema.Int.pipe(
    Schema.check(Schema.isBetween({ minimum: 0, maximum: 128 })),
    Schema.brand("IPv6CidrMask"),
    Schema.annotate({
        description: "An ipv6 cidr mask",
    })
);

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
    ? Schema.Schema.Type<typeof IPv4Bigint>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<typeof IPv6Bigint>
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
    ? Schema.Schema.Type<typeof IPv4>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<typeof IPv6>
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
    ? Schema.Schema.Type<typeof IPv4Bigint>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<typeof IPv6Bigint>
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
    ? Schema.Schema.Type<typeof IPv4>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<typeof IPv6>
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
    ? Stream.Stream<Schema.Schema.Type<typeof IPv4>, Schema.SchemaError, never>
    : Input extends IPv6CidrBlock
      ? Stream.Stream<Schema.Schema.Type<typeof IPv6>, Schema.SchemaError, never>
      : never = onFamily({
    onIPv4: (self) => {
        const { value: minValue } = networkAddressAsBigint(self);
        const { value: maxValue } = broadcastAddressAsBigint(self);
        return Function.pipe(
            Stream.iterate(minValue, (x) => IPv4Bigint.to["fields"]["value"].make(x + 1n)),
            Stream.takeWhile((n) => n <= maxValue),
            Stream.mapEffect((value) => Schema.encodeEffect(IPv4Bigint)({ value, family: "ipv4" })),
            Stream.mapEffect((value) => Schema.decodeEffect(IPv4)(value))
        );
    },
    onIPv6: (self) => {
        const { value: minValue } = networkAddressAsBigint(self);
        const { value: maxValue } = broadcastAddressAsBigint(self);
        return Function.pipe(
            Stream.iterate(minValue, (x) => IPv6Bigint.to["fields"]["value"].make(x + 1n)),
            Stream.takeWhile((n) => n <= maxValue),
            Stream.mapEffect((value) => Schema.encodeEffect(IPv6Bigint)({ value, family: "ipv6" })),
            Stream.mapEffect((value) => Schema.decodeEffect(IPv6)(value))
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
        | Array.NonEmptyReadonlyArray<Schema.Schema.Type<typeof IPv4>>
        | Array.NonEmptyReadonlyArray<Schema.Schema.Type<typeof IPv6>>,
>(
    inputs: Input
) => {
    const AddressBigintOrder = Order.make(
        (a: Schema.Schema.Type<typeof AddressBigint>, b: Schema.Schema.Type<typeof AddressBigint>) => {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
            } else {
                return 0;
            }
        }
    );

    const heterogenousInputs = inputs as Array.NonEmptyReadonlyArray<Schema.Schema.Type<typeof Address>>;
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
    public networkAddressAsBigint: Schema.Schema.Type<typeof IPv4Bigint> = networkAddressAsBigint(this);

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
 * A schema that transforms a `string` into an `IPv4CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4CidrBlockFromString = Schema.TemplateLiteral([Schema.String, "/", Schema.Number]).pipe(
    Schema.decodeTo(
        IPv4CidrBlock,
        SchemaTransformation.transform({
            decode: (str) => {
                const [address, mask] = splitLiteral(str, "/");
                return { address, mask: Number.parseInt(mask, 10) } as const;
            },
            encode: ({ address, mask }) => `${address}/${mask}` as const,
        })
    ),
    Schema.annotate({
        description: "An ipv4 cidr block from string",
    })
);

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
    public networkAddressAsBigint: Schema.Schema.Type<typeof IPv6Bigint> = networkAddressAsBigint(this);

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
 * A schema that transforms a `string` into an `IPv6CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6CidrBlockFromString = Schema.TemplateLiteral([Schema.String, "/", Schema.Number]).pipe(
    Schema.decodeTo(
        IPv6CidrBlock,
        SchemaTransformation.transform({
            decode: (str) => {
                const [address, mask] = splitLiteral(str, "/");
                return { address, mask: Number.parseInt(mask, 10) } as const;
            },
            encode: ({ address, mask }) => `${address}/${mask}` as const,
        })
    ),
    Schema.annotate({
        description: "An ipv6 cidr block from string",
    })
);

/**
 * @since 1.0.0
 * @category Schemas
 */
export const CidrBlock = Schema.Union([IPv4CidrBlock, IPv6CidrBlock]);

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const CidrBlockFromString = Schema.TemplateLiteral([Schema.String, "/", Schema.Number]).pipe(
    Schema.decodeTo(
        CidrBlock,
        SchemaTransformation.transform({
            decode: (str) => {
                const [address, mask] = splitLiteral(str, "/");
                return { address, mask: Number.parseInt(mask, 10) } as const;
            },
            encode: ({ address, mask }) => `${address}/${mask}` as const,
        })
    ),
    Schema.annotate({
        description: "A cidr block",
    })
);
