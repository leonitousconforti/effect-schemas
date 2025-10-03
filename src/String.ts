import { Function, Schema } from "effect";

/**
 * @since 1.0.0
 * @category String filters
 */
export const ascii = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
): (<A extends string>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>) =>
    // eslint-disable-next-line no-control-regex
    Schema.pattern(/^[\x00-\x7F]+$/, {
        title: "ascii",
        description: "A string containing only ascii characters",
        message: () => `an ascii string`,
        ...annotations,
    });

/**
 * @since 1.0.0
 * @category Strings
 */
export class Ascii extends Function.pipe(
    Schema.String,
    ascii({
        arbitrary: () => (fc) =>
            fc.string({
                unit: "binary-ascii",
            }),
    }),
    Schema.brand("Ascii")
) {}

/**
 * @since 1.0.0
 * @category String filters
 */
export const hexadecimal = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
): (<A extends string>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>) =>
    Schema.pattern(/^(0x|0h)?[0-9A-F]+$/i, {
        title: "hexadecimal",
        description: "A string containing only hexadecimal characters",
        message: () => `a hexadecimal string`,
        ...annotations,
    });

/**
 * @since 1.0.0
 * @category Strings
 */
export class Hexadecimal extends Function.pipe(
    Schema.String,
    hexadecimal({
        arbitrary: () => (fc) =>
            fc.string({
                unit: fc.constantFrom(..."0123456789abcdef"),
            }),
    }),
    Schema.brand("Hexadecimal")
) {}

/**
 * @since 1.0.0
 * @category String filters
 */
export const octal = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined
): (<A extends string>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>
) => Schema.filter<S>) =>
    Schema.pattern(/^(0o)?[0-7]+$/i, {
        title: "octal",
        description: "A string containing only octal characters",
        message: () => `an octal string`,
        ...annotations,
    });

/**
 * @since 1.0.0
 * @category Strings
 */
export class Octal extends Function.pipe(
    Schema.String,
    octal({
        arbitrary: () => (fc) =>
            fc.string({
                unit: fc.constantFrom(..."01234567"),
            }),
    }),
    Schema.brand("Octal")
) {}
