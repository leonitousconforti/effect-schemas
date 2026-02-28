/**
 * @since 1.0.0
 */

/**
 * Finance related schemas and filters
 *
 * @since 1.0.0
 */
export * as Finance from "./Finance.ts"

/**
 * Geography related schemas and filters
 *
 * @since 1.0.0
 */
export * as Geography from "./Geography.ts"

/**
 * Internet related schemas and filters
 *
 * @since 1.0.0
 */
export * as Internet from "./Internet.ts"

/**
 * JSON Web Algorithms (JWA) schemas based on RFC 7518.
 *
 * This module defines the cryptographic algorithm identifiers used across the
 * JOSE family of specifications, including algorithms for JWS digital
 * signatures/MACs (Section 3), JWE key management (Section 4), and JWE content
 * encryption (Section 5).
 *
 * @since 1.0.0
 * @see https://www.rfc-editor.org/rfc/rfc7518 - JSON Web Algorithms (JWA)
 */
export * as Jwa from "./Jwa.ts"

/**
 * JSON Web Encryption (JWE) schemas based on RFC 7516.
 *
 * This module provides Effect Schema definitions for JWE structures, which
 * represent encrypted content using JSON-based data structures with
 * authenticated encryption.
 *
 * @since 1.0.0
 * @see https://www.rfc-editor.org/rfc/rfc7516 - JSON Web Encryption (JWE)
 * @see https://www.rfc-editor.org/rfc/rfc7518 - JSON Web Algorithms (JWA)
 */
export * as Jwe from "./Jwe.ts"

/**
 * JSON Web Key (JWK) schemas based on RFC 7517 and RFC 7518 Section 6.
 *
 * This module provides Effect Schema definitions for representing cryptographic
 * keys as JSON objects, including key-type-specific parameters for EC, RSA, and
 * symmetric (oct) keys, as well as the JWK Set format.
 *
 * @since 1.0.0
 * @see https://www.rfc-editor.org/rfc/rfc7517 - JSON Web Key (JWK)
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6 - Cryptographic Algorithms for Keys
 */
export * as Jwk from "./Jwk.ts"

/**
 * JSON Web Signature (JWS) schemas based on RFC 7515.
 *
 * This module provides Effect Schema definitions for JWS structures, which
 * represent content secured with digital signatures or Message Authentication
 * Codes (MACs) using JSON-based data structures.
 *
 * @since 1.0.0
 * @see https://www.rfc-editor.org/rfc/rfc7515 - JSON Web Signature (JWS)
 * @see https://www.rfc-editor.org/rfc/rfc7518 - JSON Web Algorithms (JWA)
 */
export * as Jws from "./Jws.ts"

/**
 * JSON Web Token (JWT) schemas based on RFC 7519.
 *
 * This module provides Effect Schema definitions for JWT structures, including
 * the JOSE header, registered claims, compact serialization parsing, and OAuth
 * token responses.
 *
 * @since 1.0.0
 * @see https://www.rfc-editor.org/rfc/rfc7519 - JSON Web Token (JWT)
 * @see https://www.rfc-editor.org/rfc/rfc7515 - JSON Web Signature (JWS)
 * @see https://www.rfc-editor.org/rfc/rfc7518 - JSON Web Algorithms (JWA)
 */
export * as Jwt from "./Jwt.ts"

/**
 * Math related schemas and filters
 *
 * @since 1.0.0
 */
export * as Math from "./Math.ts"

/**
 * Number related schemas and filters
 *
 * @since 1.0.0
 */
export * as Number from "./Number.ts"

/**
 * Person related schemas and filters
 *
 * @since 1.0.0
 */
export * as Person from "./Person.ts"

/**
 * String related schemas and filters
 *
 * @since 1.0.0
 */
export * as String from "./String.ts"

/**
 * Temperature schemas to decode and encode different units.
 *
 * @since 1.0.0
 */
export * as Temperature from "./Temperature.ts"
