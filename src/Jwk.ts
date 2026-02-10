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

import { Schema } from "effect";

import { JweContentEncryptionAlgorithm, JweKeyManagementAlgorithm, JwsAlgorithm } from "./Jwa.ts";

/**
 * JWK "kty" (Key Type) parameter values as defined in RFC 7518 Section 6.1.
 *
 * @since 1.0.0
 * @category Key Type
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.1
 */
export class KeyType extends Schema.Literal(
    "EC", // Elliptic Curve [DSS] - Recommended+
    "RSA", // RSA [RFC3447] - Required
    "oct", // Octet sequence (symmetric keys) - Required
).annotations({
    identifier: "KeyType",
    title: "JWK Key Type",
    description: "Cryptographic algorithm family used with the key as defined in RFC 7518 Section 6.1",
}) {}

/**
 * JWK Public Key Use parameter values as defined in RFC 7517 Section 4.2.
 *
 * @since 1.0.0
 * @category Key Use
 * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.2
 */
export class KeyUse extends Schema.Literal(
    "sig", // Digital Signature or MAC
    "enc", // Encryption
).annotations({
    identifier: "KeyUse",
    title: "Public Key Use",
    description: "Intended use of the public key: signature or encryption",
}) {}

/**
 * JWK Key Operations parameter values as defined in RFC 7517 Section 4.3. These
 * values intentionally match the Web Cryptography API KeyUsage values.
 *
 * @since 1.0.0
 * @category Key Operations
 * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.3
 */
export class KeyOperation extends Schema.Literal(
    "sign", // Compute digital signature or MAC
    "verify", // Verify digital signature or MAC
    "encrypt", // Encrypt content
    "decrypt", // Decrypt content and validate decryption, if applicable
    "wrapKey", // Encrypt key
    "unwrapKey", // Decrypt key and validate decryption, if applicable
    "deriveKey", // Derive key
    "deriveBits", // Derive bits not to be used as a key
).annotations({
    identifier: "KeyOperation",
    title: "Key Operation",
    description: "Operation for which the key is intended to be used as defined in RFC 7517 Section 4.3",
}) {}

/**
 * JWK Curve parameter values for Elliptic Curve keys as defined in RFC 7518
 * Section 6.2.1.1.
 *
 * @since 1.0.0
 * @category Elliptic Curve
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.1
 */
export class EllipticCurve extends Schema.Literal(
    "P-256", // NIST P-256 Curve - Recommended+
    "P-384", // NIST P-384 Curve - Optional
    "P-521", // NIST P-521 Curve - Optional
).annotations({
    identifier: "EllipticCurve",
    title: "Elliptic Curve",
    description: "Cryptographic curve used with the key as defined in RFC 7518 Section 6.2.1.1",
}) {}

/**
 * The algorithm parameter on a JWK identifies the algorithm intended for use
 * with the key. It may be any registered JWS, JWE key management, or JWE
 * content encryption algorithm.
 *
 * @internal
 */
const JwkAlgorithm = Schema.Union(JwsAlgorithm, JweKeyManagementAlgorithm, JweContentEncryptionAlgorithm);

/**
 * Common JWK parameters shared across all key types as defined in RFC 7517
 * Section 4.
 *
 * @internal
 */
const JwkCommonFields = Schema.Struct({
    /**
     * "use" (Public Key Use) Parameter
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.2
     */
    use: Schema.optional(KeyUse),

    /**
     * "key_ops" (Key Operations) Parameter
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.3
     */
    key_ops: Schema.optional(Schema.Array(KeyOperation)),

    /**
     * "alg" (Algorithm) Parameter
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.4
     */
    alg: Schema.optional(JwkAlgorithm),

    /**
     * "kid" (Key ID) Parameter
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.5
     */
    kid: Schema.optional(Schema.String),

    /**
     * "x5u" (X.509 URL) Parameter
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.6
     */
    x5u: Schema.optional(Schema.String),

    /**
     * "x5c" (X.509 Certificate Chain) Parameter. Array of base64-encoded (NOT
     * base64url) DER PKIX certificate values.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.7
     */
    x5c: Schema.optional(Schema.Array(Schema.String)),

    /**
     * "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.8
     */
    x5t: Schema.optional(Schema.String),

    /**
     * "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter
     *
     * @see https://www.rfc-editor.org/rfc/rfc7517#section-4.9
     */
    "x5t#S256": Schema.optional(Schema.String),
});

/**
 * An Elliptic Curve public key represented as a JWK.
 *
 * Members "kty", "crv", "x", and "y" are REQUIRED for EC public keys.
 *
 * @since 1.0.0
 * @category Elliptic Curve
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1
 */
export class EcPublicKey extends Schema.Struct({
    /** Key Type — MUST be "EC" */
    kty: Schema.Literal("EC"),

    /**
     * Curve
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.1
     */
    crv: EllipticCurve,

    /**
     * "x" (X Coordinate) Base64urlUInt-encoded x coordinate.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.2
     */
    x: Schema.String,

    /**
     * "y" (Y Coordinate) Base64urlUInt-encoded y coordinate.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.3
     */
    y: Schema.String,

    ...JwkCommonFields.fields,
}).annotations({
    identifier: "EcPublicKey",
    title: "EC Public Key",
    description: "An Elliptic Curve public key as defined in RFC 7518 Section 6.2.1",
}) {}

/**
 * An Elliptic Curve private key represented as a JWK. Extends the public key
 * with the private key parameter "d".
 *
 * @since 1.0.0
 * @category Elliptic Curve
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.2
 */
export class EcPrivateKey extends Schema.Struct({
    /** Key Type — MUST be "EC" */
    kty: Schema.Literal("EC"),

    /**
     * Curve
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.1
     */
    crv: EllipticCurve,

    /**
     * "x" (X Coordinate)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.2
     */
    x: Schema.String,

    /**
     * "y" (Y Coordinate)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.3
     */
    y: Schema.String,

    /**
     * "d" (ECC Private Key) — REQUIRED for private keys Base64urlUInt-encoded
     * private key value.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.2.2.1
     */
    d: Schema.String,

    ...JwkCommonFields.fields,
}).annotations({
    identifier: "EcPrivateKey",
    title: "EC Private Key",
    description: "An Elliptic Curve private key as defined in RFC 7518 Section 6.2.2",
}) {}

/**
 * Represents information about additional primes (beyond the first two) in a
 * multi-prime RSA key.
 *
 * @internal
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.7
 */
const OtherPrimeInfo = Schema.Struct({
    /** "r" (Prime Factor) */
    r: Schema.String,

    /** "d" (Factor CRT Exponent) */
    d: Schema.String,

    /** "t" (Factor CRT Coefficient) */
    t: Schema.String,
});

/**
 * An RSA public key represented as a JWK.
 *
 * Members "kty", "n", and "e" are REQUIRED for RSA public keys.
 *
 * @since 1.0.0
 * @category RSA
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.1
 */
export class RsaPublicKey extends Schema.Struct({
    /** Key Type — MUST be "RSA" */
    kty: Schema.Literal("RSA"),

    /**
     * "n" (Modulus) Base64urlUInt-encoded modulus value.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.1.1
     */
    n: Schema.String,

    /**
     * "e" (Exponent) Base64urlUInt-encoded exponent value.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.1.2
     */
    e: Schema.String,

    ...JwkCommonFields.fields,
}).annotations({
    identifier: "RsaPublicKey",
    title: "RSA Public Key",
    description: "An RSA public key as defined in RFC 7518 Section 6.3.1",
}) {}

/**
 * An RSA private key represented as a JWK. Extends the public key with private
 * key parameters. The "d" parameter is REQUIRED; the remaining CRT parameters
 * ("p", "q", "dp", "dq", "qi") SHOULD be included and if any one of them is
 * present then ALL of them MUST be present.
 *
 * @since 1.0.0
 * @category RSA
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2
 */
export class RsaPrivateKey extends Schema.Struct({
    /** Key Type — MUST be "RSA" */
    kty: Schema.Literal("RSA"),

    /**
     * "n" (Modulus)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.1.1
     */
    n: Schema.String,

    /**
     * "e" (Exponent)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.1.2
     */
    e: Schema.String,

    /**
     * "d" (Private Exponent)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.1
     */
    d: Schema.String,

    /**
     * "p" (First Prime Factor) — optional but should be present
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.2
     */
    p: Schema.optional(Schema.String),

    /**
     * "q" (Second Prime Factor) — optional but should be present
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.3
     */
    q: Schema.optional(Schema.String),

    /**
     * "dp" (First Factor CRT Exponent) — optional but should be present
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.4
     */
    dp: Schema.optional(Schema.String),

    /**
     * "dq" (Second Factor CRT Exponent) — optional but should be present
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.5
     */
    dq: Schema.optional(Schema.String),

    /**
     * "qi" (First CRT Coefficient) — optional but should be present
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.6
     */
    qi: Schema.optional(Schema.String),

    /**
     * "oth" (Other Primes Info) — optional, must only be present when more than
     * two prime factors were used.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.3.2.7
     */
    oth: Schema.optional(Schema.Array(OtherPrimeInfo)),

    ...JwkCommonFields.fields,
}).annotations({
    identifier: "RsaPrivateKey",
    title: "RSA Private Key",
    description: "An RSA private key as defined in RFC 7518 Section 6.3.2",
}) {}

/**
 * A symmetric key (octet sequence) represented as a JWK.
 *
 * Members "kty" and "k" are REQUIRED for symmetric keys.
 *
 * @since 1.0.0
 * @category Symmetric
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.4
 */
export class OctKey extends Schema.Struct({
    /** Key Type — MUST be "oct" */
    kty: Schema.Literal("oct"),

    /**
     * "k" (Key Value) Base64url-encoded octet sequence containing the key
     * value.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-6.4.1
     */
    k: Schema.String,

    ...JwkCommonFields.fields,
}).annotations({
    identifier: "OctKey",
    title: "Symmetric Key",
    description: "A symmetric (octet sequence) key as defined in RFC 7518 Section 6.4",
}) {}

/**
 * A JSON Web Key (JWK) as defined in RFC 7517. This is a discriminated union
 * over the "kty" field, supporting EC, RSA, and symmetric (oct) key types.
 *
 * The union includes both public and private key representations — consumers
 * can narrow using the individual schemas (e.g. `EcPublicKey`, `RsaPrivateKey`)
 * when a specific key form is expected.
 *
 * @since 1.0.0
 * @category JWK
 * @see https://www.rfc-editor.org/rfc/rfc7517#section-4
 */
export const Jwk = Schema.Union(EcPublicKey, EcPrivateKey, RsaPublicKey, RsaPrivateKey, OctKey).annotations({
    identifier: "Jwk",
    title: "JSON Web Key",
    description: "A JSON Web Key as defined in RFC 7517, discriminated by the 'kty' parameter",
});

/**
 * A JWK Set as defined in RFC 7517 Section 5. A JSON object that represents a
 * set of JWKs. The "keys" member is required and must be an array of JWKs.
 *
 * @since 1.0.0
 * @category JWK Set
 * @see https://www.rfc-editor.org/rfc/rfc7517#section-5
 */
export class JwkSet extends Schema.Struct({
    /** @see https://www.rfc-editor.org/rfc/rfc7517#section-5.1 */
    keys: Schema.Array(Jwk),
}).annotations({
    identifier: "JwkSet",
    title: "JWK Set",
    description: "A set of JSON Web Keys as defined in RFC 7517 Section 5",
}) {}
