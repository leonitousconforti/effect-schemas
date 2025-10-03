/**
 * Geography related schemas and filters
 *
 * @since 1.0.0
 */

import { Function, Schema } from "effect";

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
export class LatLong extends Schema.Tuple(Latitude, Longitude) {}
