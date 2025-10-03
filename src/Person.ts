import { Function, Schema } from "effect";

/**
 * @since 1.0.0
 * @category Person
 */
export class Sex extends Function.pipe(
    Schema.Literal("male", "female"),
    Schema.annotations({
        title: "Sex",
        arbitrary: () => (fc) => fc.constantFrom("male" as const, "female" as const),
    }),
    Schema.brand("Sex")
) {}

/**
 * @since 1.0.0
 * @category Person
 */
export class FirstName extends Function.pipe(
    Schema.String,
    Schema.annotations({
        title: "FirstName",
        description: "A person's first name",
    }),
    Schema.brand("FirstName")
) {}

/**
 * @since 1.0.0
 * @category Person
 */
export class MiddleName extends Function.pipe(
    Schema.String,
    Schema.annotations({
        title: "MiddleName",
        description: "A person's middle name",
    }),
    Schema.brand("MiddleName")
) {}

/**
 * @since 1.0.0
 * @category Person
 */
export class LastName extends Function.pipe(
    Schema.String,
    Schema.annotations({
        title: "LastName",
        description: "A person's last name",
    }),
    Schema.brand("LastName")
) {}

/**
 * @since 1.0.0
 * @category Person
 */
export class Name extends Function.pipe(
    Schema.String,
    Schema.annotations({
        title: "Name",
        description: "A person's full name",
    }),
    Schema.brand("Name")
) {}
