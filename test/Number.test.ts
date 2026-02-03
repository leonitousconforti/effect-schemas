import { describe, expect, it } from "@effect/vitest";

import { Schema } from "effect";
import { Number } from "effect-schemas";

describe("Number tests", () => {
    it("u8 bounds", () => {
        const schema = Number.U8;
        expect(Schema.decodeSync(schema)(0)).toBe(0);
        expect(Schema.decodeSync(schema)(255)).toBe(255);
        expect(() => Schema.decodeSync(schema)(-1)).toThrow();
        expect(() => Schema.decodeSync(schema)(256)).toThrow();
    });

    it("i8 bounds", () => {
        const schema = Number.I8;
        expect(Schema.decodeSync(schema)(-128)).toBe(-128);
        expect(Schema.decodeSync(schema)(127)).toBe(127);
        expect(() => Schema.decodeSync(schema)(-129)).toThrow();
        expect(() => Schema.decodeSync(schema)(128)).toThrow();
    });

    it("u16 bounds", () => {
        const schema = Number.U16;
        expect(Schema.decodeSync(schema)(0)).toBe(0);
        expect(Schema.decodeSync(schema)(65535)).toBe(65535);
        expect(() => Schema.decodeSync(schema)(-1)).toThrow();
        expect(() => Schema.decodeSync(schema)(65536)).toThrow();
    });

    it("i16 bounds", () => {
        const schema = Number.I16;
        expect(Schema.decodeSync(schema)(-32768)).toBe(-32768);
        expect(Schema.decodeSync(schema)(32767)).toBe(32767);
        expect(() => Schema.decodeSync(schema)(-32769)).toThrow();
        expect(() => Schema.decodeSync(schema)(32768)).toThrow();
    });

    it("u32 bounds", () => {
        const schema = Number.U32;
        expect(Schema.decodeSync(schema)(0)).toBe(0);
        expect(Schema.decodeSync(schema)(4294967295)).toBe(4294967295);
        expect(() => Schema.decodeSync(schema)(-1)).toThrow();
        expect(() => Schema.decodeSync(schema)(4294967296)).toThrow();
    });

    it("i32 bounds", () => {
        const schema = Number.I32;
        expect(Schema.decodeSync(schema)(-2147483648)).toBe(-2147483648);
        expect(Schema.decodeSync(schema)(2147483647)).toBe(2147483647);
        expect(() => Schema.decodeSync(schema)(-2147483649)).toThrow();
        expect(() => Schema.decodeSync(schema)(2147483648)).toThrow();
    });

    it("u64 bounds", () => {
        const schema = Number.U64;
        expect(Schema.decodeSync(schema)("0")).toBe(0n);
        expect(Schema.decodeSync(schema)("18446744073709551615")).toBe(18446744073709551615n);
        expect(() => Schema.decodeSync(schema)("-1")).toThrow();
        expect(() => Schema.decodeSync(schema)("18446744073709551616")).toThrow();
    });

    it("i64 bounds", () => {
        const schema = Number.I64;
        expect(Schema.decodeSync(schema)("-9223372036854775808")).toBe(-9223372036854775808n);
        expect(Schema.decodeSync(schema)("9223372036854775807")).toBe(9223372036854775807n);
        expect(() => Schema.decodeSync(schema)("-9223372036854775809")).toThrow();
        expect(() => Schema.decodeSync(schema)("9223372036854775808")).toThrow();
    });
});
