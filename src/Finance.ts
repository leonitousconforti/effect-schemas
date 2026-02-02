/**
 * Finance related schemas and filters
 *
 * @since 1.0.0
 */

import { Function, Schema } from "effect";

/**
 * A Business Identifier Code (BIC)
 *
 * @since 1.0.0
 * @category Finance filters
 * @see https://en.wikipedia.org/wiki/ISO_9362
 */
export const bic = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined,
): (<A extends string>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>,
) => Schema.filter<S>) =>
    Schema.pattern(/^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/, {
        title: "BIC",
        description: "A Business Identifier Code (BIC)",
        message: () => `a BIC`,
        ...annotations,
    });

/**
 * A Business Identifier Code (BIC).
 *
 * @since 1.0.0
 * @category Finance schemas
 * @see https://en.wikipedia.org/wiki/ISO_9362
 */
export class BIC extends Function.pipe(Schema.String, bic(), Schema.brand("BIC")) {}

/**
 * @since 1.0.0
 * @category Finance filters
 */
export const ethereumAddress = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined,
): (<A extends string>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>,
) => Schema.filter<S>) =>
    Schema.pattern(/^(0x)[0-9a-f]{40}$/i, {
        title: `EthereumAddress`,
        description: "An Ethereum address",
        message: () => `an Ethereum address`,
        ...annotations,
    });

/**
 * @since 1.0.0
 * @category Finance schemas
 */
export class EthereumAddress extends Function.pipe(Schema.String, ethereumAddress(), Schema.brand("EthereumAddress")) {}

/**
 * @since 1.0.0
 * @category Finance filters
 */
export const bitcoinAddress = <S extends Schema.Schema.Any>(
    annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>> | undefined,
): (<A extends string>(
    self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>,
) => Schema.filter<S>) =>
    Schema.pattern(/^(bc1)[a-z0-9]{25,39}$|^(1|3)[A-HJ-NP-Za-km-z1-9]{25,39}$/, {
        title: `BitcoinAddress`,
        description: "A Bitcoin address",
        message: () => `a Bitcoin address`,
        ...annotations,
    });

/**
 * @since 1.0.0
 * @category Finance schemas
 */
export class BitcoinAddress extends Function.pipe(Schema.String, bitcoinAddress(), Schema.brand("BitcoinAddress")) {}
