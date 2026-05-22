/**
 * Temperature schemas to decode and encode different units.
 *
 * @since 1.0.0
 */

import { Schema, SchemaGetter, SchemaTransformation } from "effect";

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const Kelvin = Schema.Finite.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(0)), Schema.brand("Kelvin"));

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const Celsius = Schema.Finite.pipe(
    Schema.check(Schema.isGreaterThanOrEqualTo(-273.15)),
    Schema.brand("Celsius"),
);

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const Fahrenheit = Schema.Finite.pipe(
    Schema.check(Schema.isGreaterThanOrEqualTo(-459.67)),
    Schema.brand("Fahrenheit"),
);

export const test = SchemaGetter.toLowerCase

// export const CelsiusFromKelvin = SchemaTransformation.transform()

// /**
//  * @since 1.0.0
//  * @category Temperature Schemas
//  */
// export class Temperature extends Schema.Union(Kelvin, Celsius, Fahrenheit) {
//     /**
//      * @since 1.0.0
//      * @category Temperature Conversions
//      */
//     public static readonly kelvinToCelsius = (k: Schema.Schema.Type<Kelvin>): Schema.Schema.Type<Celsius> =>
//         Celsius.make(k - 273.15);

//     /**
//      * @since 1.0.0
//      * @category Temperature Conversions
//      */
//     public static readonly celsiusToKelvin = (c: Schema.Schema.Type<Celsius>): Schema.Schema.Type<Kelvin> =>
//         Kelvin.make(c + 273.15);

//     /**
//      * @since 1.0.0
//      * @category Temperature Conversions
//      */
//     public static readonly kelvinToFahrenheit = (k: Schema.Schema.Type<Kelvin>): Schema.Schema.Type<Fahrenheit> =>
//         Fahrenheit.make(((k - 273.15) * 9) / 5 + 32);

//     /**
//      * @since 1.0.0
//      * @category Temperature Conversions
//      */
//     public static readonly fahrenheitToKelvin = (f: Schema.Schema.Type<Fahrenheit>): Schema.Schema.Type<Kelvin> =>
//         Kelvin.make(((f - 32) * 5) / 9 + 273.15);

//     /**
//      * @since 1.0.0
//      * @category Temperature Conversions
//      */
//     public static readonly CelsiusToFahrenheit: (c: Schema.Schema.Type<Celsius>) => Schema.Schema.Type<Fahrenheit> =
//         Function.compose(Temperature.celsiusToKelvin, Temperature.kelvinToFahrenheit);

//     /**
//      * @since 1.0.0
//      * @category Temperature Conversions
//      */
//     public static readonly FahrenheitToCelsius: (k: Schema.Schema.Type<Fahrenheit>) => Schema.Schema.Type<Celsius> =
//         Function.compose(Temperature.fahrenheitToKelvin, Temperature.kelvinToCelsius);
// }

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
        }),
    ),
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
        }),
    ),
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
        }),
    ),
);

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export const TemperatureFromString = Schema.Union([KelvinFromString.from, CelsiusFromString.from, FahrenheitFromString.from]).pipe(
    Schema.decodeTo(
        Kelvin,
        SchemaTransformation.transform({
            // encode: (value) => [value, "k"],
            decode: ([value, unit]) => {
                // switch (unit) {
                //     case "k":
                //         return value;
                //     case "c":
                //         return Temperature.celsiusToKelvin(Celsius.make(value));
                //     case "f":
                //         return Temperature.fahrenheitToKelvin(Fahrenheit.make(value));
                // }
            },
        }),
    ),
);

// export class TemperatureFromString extends Schema.transformOrFail(
//     Schema.Union(KelvinFromString.from, CelsiusFromString.from, FahrenheitFromString.from),
//     Kelvin,
//     {
//         encode: (value) => ParseResult.succeed(`${value}k` as const),
//         decode: (valueStr: `${number}c` | `${number}f` | `${number}k`) => {
//             const unit = valueStr.slice(-1) as "c" | "f" | "k";
//             const [value] = splitLiteral(valueStr, unit);
//             const num = Number(value);
//             switch (unit) {
//                 case "k":
//                     return ParseResult.succeed(num);
//                 case "c":
//                     return ParseResult.succeed(Temperature.celsiusToKelvin(Celsius.make(num)));
//                 case "f":
//                     return ParseResult.succeed(Temperature.fahrenheitToKelvin(Fahrenheit.make(num)));
//             }
//         },
//     },
// ) {}
