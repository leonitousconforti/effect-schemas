/**
 * Geography related schemas and filters
 *
 * @since 1.0.0
 */

import { Chunk, Function, ParseResult, Schema, type Brand } from "effect";

/**
 * @since 1.0.0
 * @category Geography filters
 */
export const latitude = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
): (<A extends number>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>) =>
    Schema.between(-90, 90, {
        title: "latitude",
        description: "A number between -90 and 90 (inclusive)",
        message: () => `a latitude between -90 and 90 (inclusive)`,
        ...annotations,
    });

/**
 * @since 1.0.0
 * @category Geography schemas
 */
export class Latitude extends Function.pipe(
    Schema.Number,
    latitude({
        arbitrary: () => (fc) =>
            fc.double({
                min: -90,
                max: 90,
                minExcluded: false,
                maxExcluded: false,
            }),
    }),
    Schema.brand("Latitude")
) {}

/**
 * @since 1.0.0
 * @category Geography filters
 */
export const longitude = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
): (<A extends number>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>) =>
    Schema.between(-180, 180, {
        title: "longitude",
        description: "A number between -180 and 180 (inclusive)",
        message: () => `a longitude between -180 and 180 (inclusive)`,
        ...annotations,
    });

/**
 * @since 1.0.0
 * @category Geography schemas
 */
export class Longitude extends Function.pipe(
    Schema.Number,
    longitude({
        arbitrary: () => (fc) =>
            fc.double({
                min: -180,
                max: 180,
                minExcluded: false,
                maxExcluded: false,
            }),
    }),
    Schema.brand("Longitude")
) {}

/**
 * @since 1.0.0
 * @category Geography schemas
 */
export class LatLon extends Schema.Tuple(Latitude, Longitude) {}

/**
 * @since 1.0.0
 * @category Geography schemas
 */
export class PostalCode extends Function.pipe(
    Schema.String,
    Schema.pattern(/^\d{5}(-\d{4})?$/, {
        title: "postalCode",
        description: "A US postal code in the format 12345 or 12345-6789",
        message: () => `a postal code in the format 12345 or 12345-6789`,
        arbitrary: () => (fc) =>
            fc.oneof(
                fc.string({
                    minLength: 5,
                    maxLength: 5,
                    unit: fc
                        .integer({
                            min: 0,
                            max: 9,
                        })
                        .map((x) => `${x}`),
                }),
                fc
                    .tuple(
                        fc.string({
                            minLength: 5,
                            maxLength: 5,
                            unit: fc
                                .integer({
                                    min: 0,
                                    max: 9,
                                })
                                .map((x) => `${x}`),
                        }),
                        fc.string({
                            minLength: 4,
                            maxLength: 4,
                            unit: fc
                                .integer({
                                    min: 0,
                                    max: 9,
                                })
                                .map((x) => `${x}`),
                        })
                    )
                    .map(([part1, part2]) => `${part1}-${part2}`)
            ),
    }),
    Schema.brand("PostalCode")
) {}

/**
 * @since 1.0.0
 * @category Geography schemas
 */
export class AlphanumericGeocode extends Schema.transformOrFail(
    Schema.String.pipe(Schema.maxLength(10), Schema.brand("AlphanumericGeocode")),
    LatLon,
    {
        decode: (geocode, _options, ast) => {
            return ParseResult.fail(new ParseResult.Forbidden(ast, geocode, "Not implemented yet"));
        },
        encode: ([latitude, longitude], _options, ast) => {
            const x = BigInt(Math.round(latitude * 100_000));
            const y = BigInt(Math.round(longitude * 100_000));

            const xy = x + y;
            const yx = -y + x;
            const coefficient = 27_000_000n;
            const xyBits = (xy + coefficient).toString(2).split("");
            const yxBits = (yx + coefficient).toString(2).split("");

            let combinedBitString = "";
            while (xyBits.length > 0 || yxBits.length > 0) {
                const bit1 = xyBits.pop() ?? "0";
                const bit2 = yxBits.pop() ?? "0";
                combinedBitString = bit1 + bit2 + combinedBitString;
            }

            const PAD = 282_699_884_614_999n;
            let quotient,
                remainder,
                dividend = BigInt(`0b${combinedBitString}`) - PAD,
                chars = Chunk.empty<string>();

            do {
                quotient = dividend / AlphanumericGeocode.AlphabetBase;
                remainder = dividend % AlphanumericGeocode.AlphabetBase;
                dividend = (dividend - remainder) / AlphanumericGeocode.AlphabetBase;
                chars = Chunk.prepend(chars, AlphanumericGeocode.Alphabet[Number(remainder)]);
                if (chars.length > 10) {
                    const errorMessage = "Exceeded maximum iterations for alphanumeric geocode";
                    return ParseResult.fail(new ParseResult.Type(ast, [latitude, longitude], errorMessage));
                }
            } while (quotient > 0n);

            const str = Chunk.join(chars, "");
            return ParseResult.succeed(str as string & Brand.Brand<"AlphanumericGeocode">);
        },
    }
) {
    public static readonly Alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public static readonly AlphabetBase = BigInt(AlphanumericGeocode.Alphabet.length);

    /**
     * @since 1.0.0
     * @category Calculations
     */
    public static DistanceBetween = (
        self: Schema.Schema.Type<AlphanumericGeocode>,
        other: Schema.Schema.Type<AlphanumericGeocode>
    ): number => {
        const [lat1, lon1] = self;
        const [lat2, lon2] = other;

        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180; // latitude in radians
        const φ2 = (lat2 * Math.PI) / 180; // latitude in radians
        const Δφ = ((lat2 - lat1) * Math.PI) / 180; // difference in latitude in radians
        const Δλ = ((lon2 - lon1) * Math.PI) / 180; // difference in longitude in radians

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    };
}
