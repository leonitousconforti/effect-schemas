/**
 * Finance related schemas and filters
 *
 * @since 1.0.0
 */

import { Schema, type SchemaAST } from "effect";

declare module "effect/Schema" {
    namespace Annotations {
        interface MetaDefinitions {
            readonly isBIC: {
                readonly _tag: "isBIC";
                readonly regExp: globalThis.RegExp;
            };
            readonly isEthereumAddress: {
                readonly _tag: "isEthereumAddress";
                readonly regExp: globalThis.RegExp;
            };
            readonly isBitcoinAddress: {
                readonly _tag: "isBitcoinAddress";
                readonly regExp: globalThis.RegExp;
            };
        }
    }
}

/**
 * A Business Identifier Code (BIC)
 *
 * @since 1.0.0
 * @category Finance checks
 * @see https://en.wikipedia.org/wiki/ISO_9362
 */
export function isBic(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    const regExp = /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;
    return Schema.isPattern(regExp, {
        title: "BIC",
        expected: "a BIC",
        description: "A Business Identifier Code (BIC)",
        meta: { _tag: "isBIC", regExp },
        ...annotations,
    });
}

/** @since 1.0.0 */
export interface Bic extends Schema.brand<Schema.String, "Bic"> {}

/** @since 1.0.0 */
export const Bic: Bic = Schema.String.pipe(Schema.check(isBic()), Schema.brand("Bic"));

/**
 * @since 1.0.0
 * @category Finance checks
 */
export function isEthereumAddress(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    const regExp = /^(0x)[0-9a-f]{40}$/i;
    return Schema.isPattern(regExp, {
        title: "EthereumAddress",
        expected: "an Ethereum address",
        description: "An Ethereum address",
        meta: { _tag: "isEthereumAddress", regExp },
        ...annotations,
    });
}

/** @since 1.0.0 */
export interface EthereumAddress extends Schema.brand<Schema.String, "EthereumAddress"> {}

/** @since 1.0.0 */
export const EthereumAddress: EthereumAddress = Schema.String.pipe(
    Schema.check(isEthereumAddress()),
    Schema.brand("EthereumAddress"),
);

/**
 * @since 1.0.0
 * @category Finance checks
 */
export function isBitcoinAddress(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    const regExp = /^(bc1)[a-z0-9]{25,39}$|^(1|3)[A-HJ-NP-Za-km-z1-9]{25,39}$/;
    return Schema.isPattern(regExp, {
        title: "BitcoinAddress",
        expected: "a Bitcoin address",
        description: "A Bitcoin address",
        meta: { _tag: "isBitcoinAddress", regExp },
        ...annotations,
    });
}

/** @since 1.0.0 */
export interface BitcoinAddress extends Schema.brand<Schema.String, "BitcoinAddress"> {}

/** @since 1.0.0 */
export const BitcoinAddress: BitcoinAddress = Schema.String.pipe(
    Schema.check(isBitcoinAddress()),
    Schema.brand("BitcoinAddress"),
);
