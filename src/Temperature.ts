/**
 * Temperature schemas to decode and encode different units.
 *
 * @since 1.0.0
 */

import { Function, ParseResult, Schema } from "effect";

/** @internal */
type Split<Str extends string, Delimiter extends string> = string extends Str | ""
    ? Array<string>
    : Str extends `${infer Head}${Delimiter}${infer Rest}`
      ? [Head, ...Split<Rest, Delimiter>]
      : [Str];

/** @internal */
const splitLiteral = <Str extends string, Delimiter extends string>(
    str: Str,
    delimiter: Delimiter
): Split<Str, Delimiter> => str.split(delimiter) as Split<Str, Delimiter>;

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class Kelvin extends Schema.Number.pipe(Schema.greaterThanOrEqualTo(0), Schema.brand("Kelvin")) {}

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class Celsius extends Schema.Number.pipe(Schema.greaterThanOrEqualTo(-273.15), Schema.brand("Celsius")) {}

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class Fahrenheit extends Schema.Number.pipe(Schema.greaterThanOrEqualTo(-459.67), Schema.brand("Fahrenheit")) {}

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class Temperature extends Schema.Union(Kelvin, Celsius, Fahrenheit) {
    /**
     * @since 1.0.0
     * @category Temperature Conversions
     */
    public static readonly kelvinToCelsius = (k: Schema.Schema.Type<Kelvin>): Schema.Schema.Type<Celsius> =>
        Celsius.make(k - 273.15);

    /**
     * @since 1.0.0
     * @category Temperature Conversions
     */
    public static readonly celsiusToKelvin = (c: Schema.Schema.Type<Celsius>): Schema.Schema.Type<Kelvin> =>
        Kelvin.make(c + 273.15);

    /**
     * @since 1.0.0
     * @category Temperature Conversions
     */
    public static readonly kelvinToFahrenheit = (k: Schema.Schema.Type<Kelvin>): Schema.Schema.Type<Fahrenheit> =>
        Fahrenheit.make(((k - 273.15) * 9) / 5 + 32);

    /**
     * @since 1.0.0
     * @category Temperature Conversions
     */
    public static readonly fahrenheitToKelvin = (f: Schema.Schema.Type<Fahrenheit>): Schema.Schema.Type<Kelvin> =>
        Kelvin.make(((f - 32) * 5) / 9 + 273.15);

    /**
     * @since 1.0.0
     * @category Temperature Conversions
     */
    public static readonly CelsiusToFahrenheit: (c: Schema.Schema.Type<Celsius>) => Schema.Schema.Type<Fahrenheit> =
        Function.compose(Temperature.celsiusToKelvin, Temperature.kelvinToFahrenheit);

    /**
     * @since 1.0.0
     * @category Temperature Conversions
     */
    public static readonly FahrenheitToCelsius: (k: Schema.Schema.Type<Fahrenheit>) => Schema.Schema.Type<Celsius> =
        Function.compose(Temperature.fahrenheitToKelvin, Temperature.kelvinToCelsius);
}

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class KelvinFromString extends Schema.transform(
    Schema.TemplateLiteral(Schema.Number, Schema.Literal("k")),
    Kelvin,
    {
        encode: (value: number) => `${value}k` as const,
        decode: (valueStr: `${number}k`) => {
            const [value] = splitLiteral(valueStr, "k");
            return Number(value);
        },
    }
) {}

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class CelsiusFromString extends Schema.transform(
    Schema.TemplateLiteral(Schema.Number, Schema.Literal("c")),
    Celsius,
    {
        encode: (value: number) => `${value}c` as const,
        decode: (valueStr: `${number}c`) => {
            const [value] = splitLiteral(valueStr, "c");
            return Number(value);
        },
    }
) {}

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class FahrenheitFromString extends Schema.transform(
    Schema.TemplateLiteral(Schema.Number, Schema.Literal("f")),
    Fahrenheit,
    {
        encode: (value: number) => `${value}f` as const,
        decode: (valueStr: `${number}f`) => {
            const [value] = splitLiteral(valueStr, "f");
            return Number(value);
        },
    }
) {}

/**
 * @since 1.0.0
 * @category Temperature Schemas
 */
export class TemperatureFromString extends Schema.transformOrFail(
    Schema.Union(KelvinFromString.from, CelsiusFromString.from, FahrenheitFromString.from),
    Kelvin,
    {
        encode: (value) => ParseResult.succeed(`${value}k` as const),
        decode: (valueStr: `${number}c` | `${number}f` | `${number}k`) => {
            const unit = valueStr.slice(-1) as "c" | "f" | "k";
            const [value] = splitLiteral(valueStr, unit);
            const num = Number(value);
            switch (unit) {
                case "k":
                    return ParseResult.succeed(num);
                case "c":
                    return ParseResult.succeed(Temperature.celsiusToKelvin(Celsius.make(num)));
                case "f":
                    return ParseResult.succeed(Temperature.fahrenheitToKelvin(Fahrenheit.make(num)));
            }
        },
    }
) {}
