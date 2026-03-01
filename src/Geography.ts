/**
 * Geography related schemas and filters
 *
 * @since 1.0.0
 */

import { Chunk, Effect, Option, Schema, SchemaGetter, SchemaIssue, type SchemaAST } from "effect";

declare module "effect/Schema" {
    namespace Annotations {
        interface MetaDefinitions {
            readonly isUsPostalCode: {
                readonly _tag: "isPostalCode";
                readonly regExp: globalThis.RegExp;
            };
            readonly isAlphanumericGeocode: {
                readonly _tag: "isAlphanumericGeocode";
                readonly regExp: globalThis.RegExp;
            };
        }
    }
}

/**
 * @since 1.0.0
 * @category Geography checks
 */
export function isLatitude(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<number> {
    return Schema.isBetween(
        {
            minimum: -90,
            maximum: 90,
            exclusiveMinimum: false,
            exclusiveMaximum: false,
        },
        {
            title: "Latitude",
            expected: "a latitude between -90 and 90 (inclusive)",
            description: "A number between -90 and 90 (inclusive)",
            ...annotations,
        },
    );
}

/** @since 1.0.0 */
export interface Latitude extends Schema.brand<Schema.Number, "Latitude"> {}

/** @since 1.0.0 */
export const Latitude: Latitude = Schema.Number.pipe(Schema.check(isLatitude()), Schema.brand("Latitude"));

/**
 * @since 1.0.0
 * @category Geography checks
 */
export function isLongitude(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<number> {
    return Schema.isBetween(
        {
            minimum: -180,
            maximum: 180,
            exclusiveMinimum: false,
            exclusiveMaximum: false,
        },
        {
            title: "Longitude",
            expected: "a longitude between -180 and 180 (inclusive)",
            description: "A number between -180 and 180 (inclusive)",
            ...annotations,
        },
    );
}

/** @since 1.0.0 */
export interface Longitude extends Schema.brand<Schema.Number, "Longitude"> {}

/** @since 1.0.0 */
export const Longitude: Longitude = Schema.Number.pipe(Schema.check(isLongitude()), Schema.brand("Longitude"));

/** @since 1.0.0 */
export class LatLon extends Schema.Opaque<LatLon>()(
    Schema.Struct({
        latitude: Latitude,
        longitude: Longitude,
    }),
) {
    /**
     * @since 1.0.0
     * @category Calculations
     */
    public static DistanceBetween = (self: LatLon, other: LatLon): number => {
        const lat1 = self.latitude;
        const lon1 = self.longitude;
        const lat2 = other.latitude;
        const lon2 = other.longitude;

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

/**
 * @since 1.0.0
 * @category Geography checks
 */
export function isPostalCode(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    const regExp = /^\d{5}(-\d{4})?$/;
    return Schema.isPattern(regExp, {
        title: "PostalCode",
        expected: "a postal code in the format 12345 or 12345-6789",
        description: "A US postal code in the format 12345 or 12345-6789",
        meta: { _tag: "isPostalCode", regExp },
        ...annotations,
    });
}

/** @since 1.0.0 */
export interface PostalCode extends Schema.brand<Schema.String, "PostalCode"> {}

/** @since 1.0.0 */
export const PostalCode: PostalCode = Schema.String.pipe(Schema.check(isPostalCode()), Schema.brand("PostalCode"));

/** @since 1.0.0 */
export const AlphaNumericGeocode = Schema.suspend(() => {
    const Alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const AlphabetBase = BigInt(Alphabet.length);

    function isAlphanumericGeocode(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
        const regExp = /^[A-Z0-9]{1,10}$/i;
        return Schema.isPattern(regExp, {
            title: "AlphanumericGeocode",
            expected: "an alphanumeric geocode containing only letters and numbers",
            description: "An alphanumeric geocode containing only letters and numbers",
            meta: { _tag: "isAlphanumericGeocode", regExp },
            ...annotations,
        });
    }

    const decode = SchemaGetter.forbidden<(typeof LatLon)["Encoded"], string>(
        (_geocode) => "Decoding from alphanumeric geocode is not implemented yet",
    );

    const encode = SchemaGetter.transformOrFail<string, (typeof LatLon)["Encoded"], never>(
        ({ latitude, longitude }) => {
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
                quotient = dividend / AlphabetBase;
                remainder = dividend % AlphabetBase;
                dividend = (dividend - remainder) / AlphabetBase;
                chars = Chunk.prepend(chars, Alphabet[Number(remainder)]);
                if (chars.length > 10) {
                    const data = Option.some(`${latitude},${longitude}`);
                    const message = "Exceeded maximum iterations for alphanumeric geocode";
                    return Effect.fail(new SchemaIssue.Forbidden(data, { message }));
                }
            } while (quotient > 0n);

            const str = Chunk.join(chars, "");
            return Effect.succeed(str);
        },
    );

    return Schema.String.pipe(
        Schema.check(isAlphanumericGeocode()),
        Schema.decodeTo(LatLon, {
            decode,
            encode,
        }),
    );
});
