/**
 * Math related schemas and filters
 *
 * @since 1.0.0
 */

import { Schema } from "effect";

/**
 * @since 1.0.0
 * @category Math schemas
 */
export const Operation = Schema.Literals(["addition", "subtraction", "multiplication", "division"]).annotate({
    title: "Operation",
    expected: "a mathematical operation",
    description: "A mathematical operation",
});

/**
 * @since 1.0.0
 * @category Math schemas
 */
export const Operator = Operation.transform(["+", "-", "*", "/"]).annotate({
    title: "Operator",
    expected: "a mathematical operator",
    description: "A mathematical operator",
});
