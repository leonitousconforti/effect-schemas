/**
 * Temperature schemas to decode and encode different units.
 *
 * @since 1.0.0
 */

import { Schema, SchemaTransformation } from "effect";

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const Kelvin = Schema.Finite.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(0.0)), Schema.brand("Kelvin"));

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const Celsius = Schema.Finite.pipe(
    Schema.check(Schema.isGreaterThanOrEqualTo(-273.15)),
    Schema.brand("Celsius")
);

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const Fahrenheit = Schema.Finite.pipe(
    Schema.check(Schema.isGreaterThanOrEqualTo(-459.67)),
    Schema.brand("Fahrenheit")
);

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const KelvinFromString = Schema.TemplateLiteralParser([Schema.Finite, Schema.Literal("k")]).pipe(
    Schema.decodeTo(
        Kelvin,
        SchemaTransformation.transform({
            encode: (value) => [value, "k"] as const,
            decode: ([value]) => value,
        })
    )
);

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const CelsiusFromString = Schema.TemplateLiteralParser([Schema.Finite, Schema.Literal("c")]).pipe(
    Schema.decodeTo(
        Celsius,
        SchemaTransformation.transform({
            encode: (value) => [value, "c"] as const,
            decode: ([value]) => value,
        })
    )
);

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const FahrenheitFromString = Schema.TemplateLiteralParser([Schema.Finite, Schema.Literal("f")]).pipe(
    Schema.decodeTo(
        Fahrenheit,
        SchemaTransformation.transform({
            encode: (value) => [value, "f"] as const,
            decode: ([value]) => value,
        })
    )
);
