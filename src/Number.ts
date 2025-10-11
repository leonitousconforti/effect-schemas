/**
 * Number related schemas and filters
 *
 * @since 1.0.0
 */

import { Function, Schema } from "effect";

const unsignedMax = (n: number) => 2 ** n - 1;
const signedMin = (n: number) => -(2 ** (n - 1));
const signedMax = (n: number) => 2 ** (n - 1) - 1;

const u =
    (n: number) =>
    (
        annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
    ): Schema.filter<typeof Schema.Int> =>
        Function.pipe(
            Schema.Int,
            Schema.between(0, unsignedMax(n), {
                message: () => `an unsigned ${n} bit integer`,
                identifier: `U${n}`,
                description: `An unsigned ${n} bit integer`,
                ...annotations,
            })
        );

const i =
    (n: number) =>
    (
        annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.Int>> | undefined
    ): Schema.filter<typeof Schema.Int> =>
        Function.pipe(
            Schema.Int,
            Schema.between(signedMin(n), signedMax(n), {
                message: () => `a signed ${n} bit integer`,
                identifier: `I${n}`,
                description: `A signed ${n} bit integer`,
                ...annotations,
            })
        );

const unsignedMaxBigint = (n: number) => 2n ** BigInt(n) - 1n;
const signedMinBigint = (n: number) => -(2n ** BigInt(n - 1));
const signedMaxBigint = (n: number) => 2n ** BigInt(n - 1) - 1n;

const ub =
    (n: number) =>
    (
        annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.BigInt>> | undefined
    ): Schema.filter<typeof Schema.BigInt> =>
        Function.pipe(
            Schema.BigInt,
            Schema.betweenBigInt(0n, BigInt(unsignedMaxBigint(n)), {
                message: () => `an unsigned ${n} bit integer`,
                identifier: `U${n}`,
                description: `An unsigned ${n} bit integer`,
                ...annotations,
            })
        );

const ib =
    (n: number) =>
    (
        annotations?: Schema.Annotations.Filter<Schema.Schema.Type<Schema.BigInt>> | undefined
    ): Schema.filter<typeof Schema.BigInt> =>
        Function.pipe(
            Schema.BigInt,
            Schema.betweenBigInt(BigInt(signedMinBigint(n)), BigInt(signedMaxBigint(n)), {
                message: () => `a signed ${n} bit integer`,
                identifier: `I${n}`,
                description: `A signed ${n} bit integer`,
                ...annotations,
            })
        );

/**
 * An unsigned 8 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const u8 = u(8);

/**
 * An unsigned 8 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class U8 extends Function.pipe(u8(), Schema.brand("U8")) {}

/**
 * An unsigned 16 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const u16 = u(16);

/**
 * An unsigned 16 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class U16 extends Function.pipe(u16(), Schema.brand("U16")) {}

/**
 * An unsigned 32 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const u32 = u(32);

/**
 * An unsigned 32 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class U32 extends Function.pipe(u32(), Schema.brand("U32")) {}

/**
 * An unsigned 64 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const u64 = ub(64);

/**
 * An unsigned 64 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class U64 extends Function.pipe(u64(), Schema.brand("U64")) {}

/**
 * A signed 8 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const i8 = i(8);

/**
 * A signed 8 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class I8 extends Function.pipe(i8(), Schema.brand("I8")) {}

/**
 * A signed 16 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const i16 = i(16);

/**
 * A signed 16 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class I16 extends Function.pipe(i16(), Schema.brand("I16")) {}

/**
 * A signed 32 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const i32 = i(32);

/**
 * A signed 32 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class I32 extends Function.pipe(i32(), Schema.brand("I32")) {}

/**
 * A signed 64 bit integer
 *
 * @since 1.0.0
 * @category Number filters
 */
export const i64 = ib(64);

/**
 * A signed 64 bit integer
 *
 * @since 1.0.0
 * @category Number schemas
 */
export class I64 extends Function.pipe(i64(), Schema.brand("I64")) {}
