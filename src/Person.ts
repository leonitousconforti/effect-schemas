/**
 * Person related schemas and filters
 *
 * @since 1.0.0
 */

import { Schema } from "effect";

/**
 * @since 1.0.0
 * @category Person Schemas
 */
export const Sex = Schema.Literals(["male", "female"]);

/**
 * @since 1.0.0
 * @category Person Schemas
 */
export const FirstName = Schema.String.pipe(
    Schema.annotate({
        title: "FirstName",
        description: "A person's first name",
    }),
    Schema.brand("FirstName"),
);

/**
 * @since 1.0.0
 * @category Person Schemas
 */
export const MiddleName = Schema.String.pipe(
    Schema.annotate({
        title: "MiddleName",
        description: "A person's middle name",
    }),
    Schema.brand("MiddleName"),
);

/**
 * @since 1.0.0
 * @category Person Schemas
 */
export const LastName = Schema.String.pipe(
    Schema.annotate({
        title: "LastName",
        description: "A person's last name",
    }),
    Schema.brand("LastName"),
);

/**
 * @since 1.0.0
 * @category Person Schemas
 */
export const Name = Schema.String.pipe(
    Schema.annotate({
        title: "Name",
        description: "A person's full name",
    }),
    Schema.brand("Name"),
);
