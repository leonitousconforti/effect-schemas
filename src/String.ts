/**
 * String related schemas and filters
 *
 * @since 1.0.0
 */

import { Schema, type SchemaAST } from "effect";

declare module "effect/Schema" {
    namespace Annotations {
        interface MetaDefinitions {
            readonly isAscii: {
                readonly _tag: "isAscii";
                readonly regExp: globalThis.RegExp;
            };
            readonly isAlphanumeric: {
                readonly _tag: "isAlphanumeric";
                readonly regExp: globalThis.RegExp;
            };
            readonly isHexadecimal: {
                readonly _tag: "isHexadecimal";
                readonly regExp: globalThis.RegExp;
            };
            readonly isOctal: {
                readonly _tag: "isOctal";
                readonly regExp: globalThis.RegExp;
            };
        }
    }
}

/**
 * @since 1.0.0
 * @category String checks
 */
export function isAscii(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    // eslint-disable-next-line no-control-regex
    const regExp = /^[\x00-\x7F]+$/;
    return Schema.isPattern(regExp, {
        title: "ascii",
        expected: "a string containing only ascii characters",
        description: "A string containing only ascii characters",
        meta: { _tag: "isAscii", regExp },
        ...annotations,
    });
}

/**
 * @since 1.0.0
 * @category String checks
 */
export function isAlphanumeric(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    const regExp = /^[a-z0-9]+$/i;
    return Schema.isPattern(regExp, {
        title: "alphanumeric",
        expected: "a string containing only alphanumeric characters",
        description: "A string containing only alphanumeric characters",
        meta: { _tag: "isAlphanumeric", regExp },
        ...annotations,
    });
}

/**
 * @since 1.0.0
 * @category String checks
 */
export function isHexadecimal(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    const regExp = /^(0x|0h)?[0-9A-F]+$/i;
    return Schema.isPattern(regExp, {
        title: "hexadecimal",
        expected: "a string containing only hexadecimal characters",
        description: "A string containing only hexadecimal characters",
        meta: { _tag: "isHexadecimal", regExp },
        ...annotations,
    });
}

/**
 * @since 1.0.0
 * @category String checks
 */
export function isOctal(annotations?: Schema.Annotations.Filter | undefined): SchemaAST.Filter<string> {
    const regExp = /^(0o)?[0-7]+$/i;
    return Schema.isPattern(regExp, {
        title: "octal",
        expected: "a string containing only octal characters",
        description: "A string containing only octal characters",
        meta: { _tag: "isOctal", regExp },
        ...annotations,
    });
}
