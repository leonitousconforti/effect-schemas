import { Function, Schema } from "effect";

/**
 * @since 1.0.0
 * @category Math schemas
 */
export class Operation extends Function.pipe(
    Schema.Literal("addition", "subtraction", "multiplication", "division"),
    Schema.annotations({
        title: "Operation",
        description: "A mathematical operation",
        arbitrary: () => (fc) =>
            fc.constantFrom(
                "addition" as const,
                "subtraction" as const,
                "multiplication" as const,
                "division" as const
            ),
    })
) {}

/**
 * @since 1.0.0
 * @category Math schemas
 */
export class Operator extends Schema.transformLiterals(
    ["addition", "+"],
    ["subtraction", "-"],
    ["multiplication", "*"],
    ["division", "/"]
).annotations({
    title: "Operator",
    description: "A mathematical operator",
    arbitrary: () => (fc) => fc.constantFrom("+" as const, "-" as const, "*" as const, "/" as const),
}) {}
