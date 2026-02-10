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

import { Schema } from "effect";

/**
 * JWS algorithm values as defined in RFC 7518 Section 3.1. These algorithms are
 * used for digital signatures and MACs to secure the JWS.
 *
 * @since 1.0.0
 * @category JWS
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-3.1
 */
export class JwsAlgorithm extends Schema.Literal(
    // HMAC with SHA-2 Functions
    "HS256", // HMAC using SHA-256 - Required
    "HS384", // HMAC using SHA-384 - Optional
    "HS512", // HMAC using SHA-512 - Optional

    // Digital Signature with RSASSA-PKCS1-v1_5
    "RS256", // RSASSA-PKCS1-v1_5 using SHA-256 - Recommended
    "RS384", // RSASSA-PKCS1-v1_5 using SHA-384 - Optional
    "RS512", // RSASSA-PKCS1-v1_5 using SHA-512 - Optional

    // Digital Signature with ECDSA
    "ES256", // ECDSA using P-256 and SHA-256 - Recommended+
    "ES384", // ECDSA using P-384 and SHA-384 - Optional
    "ES512", // ECDSA using P-521 and SHA-512 - Optional

    // Digital Signature with RSASSA-PSS
    "PS256", // RSASSA-PSS using SHA-256 and MGF1 with SHA-256 - Optional
    "PS384", // RSASSA-PSS using SHA-384 and MGF1 with SHA-384 - Optional
    "PS512", // RSASSA-PSS using SHA-512 and MGF1 with SHA-512 - Optional

    // No digital signature or MAC performed
    "none", // Unsecured JWS - Optional
).annotations({
    identifier: "JwsAlgorithm",
    title: "JWS Algorithm",
    description: "Cryptographic algorithm used to secure the JWS as defined in RFC 7518 Section 3.1",
}) {}

/**
 * JWE algorithm values as defined in RFC 7518 Section 4.1. These algorithms are
 * used to encrypt or determine the Content Encryption Key (CEK).
 *
 * @since 1.0.0
 * @category JWE
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-4.1
 */
export class JweKeyManagementAlgorithm extends Schema.Literal(
    // Key Encryption with RSAES-PKCS1-v1_5
    "RSA1_5", // RSAES-PKCS1-v1_5 - Recommended-

    // Key Encryption with RSAES OAEP
    "RSA-OAEP", // RSAES OAEP using default parameters - Recommended+
    "RSA-OAEP-256", // RSAES OAEP using SHA-256 and MGF1 with SHA-256 - Optional

    // Key Wrapping with AES Key Wrap
    "A128KW", // AES Key Wrap using 128-bit key - Recommended
    "A192KW", // AES Key Wrap using 192-bit key - Optional
    "A256KW", // AES Key Wrap using 256-bit key - Recommended

    // Direct Encryption with a Shared Symmetric Key
    "dir", // Direct use of a shared symmetric key - Recommended

    // Key Agreement with ECDH-ES
    "ECDH-ES", // ECDH-ES using Concat KDF - Recommended+
    "ECDH-ES+A128KW", // ECDH-ES using Concat KDF and CEK wrapped with "A128KW" - Recommended
    "ECDH-ES+A192KW", // ECDH-ES using Concat KDF and CEK wrapped with "A192KW" - Optional
    "ECDH-ES+A256KW", // ECDH-ES using Concat KDF and CEK wrapped with "A256KW" - Recommended

    // Key Encryption with AES GCM
    "A128GCMKW", // Key wrapping with AES GCM using 128-bit key - Optional
    "A192GCMKW", // Key wrapping with AES GCM using 192-bit key - Optional
    "A256GCMKW", // Key wrapping with AES GCM using 256-bit key - Optional

    // Key Encryption with PBES2
    "PBES2-HS256+A128KW", // PBES2 with HMAC SHA-256 and "A128KW" wrapping - Optional
    "PBES2-HS384+A192KW", // PBES2 with HMAC SHA-384 and "A192KW" wrapping - Optional
    "PBES2-HS512+A256KW", // PBES2 with HMAC SHA-512 and "A256KW" wrapping - Optional
).annotations({
    identifier: "JweKeyManagementAlgorithm",
    title: "JWE Key Management Algorithm",
    description:
        "Algorithm used to encrypt or determine the Content Encryption Key (CEK) as defined in RFC 7518 Section 4.1",
}) {}

/**
 * JWE encryption algorithm values as defined in RFC 7518 Section 5.1. These
 * algorithms are used to perform authenticated encryption on the plaintext to
 * produce the ciphertext and Authentication Tag.
 *
 * @since 1.0.0
 * @category JWE
 * @see https://www.rfc-editor.org/rfc/rfc7518#section-5.1
 */
export class JweContentEncryptionAlgorithm extends Schema.Literal(
    // AES_CBC_HMAC_SHA2
    "A128CBC-HS256", // AES_128_CBC_HMAC_SHA_256 - Required
    "A192CBC-HS384", // AES_192_CBC_HMAC_SHA_384 - Optional
    "A256CBC-HS512", // AES_256_CBC_HMAC_SHA_512 - Required

    // AES GCM
    "A128GCM", // AES GCM using 128-bit key - Recommended
    "A192GCM", // AES GCM using 192-bit key - Optional
    "A256GCM", // AES GCM using 256-bit key - Recommended
).annotations({
    identifier: "JweContentEncryptionAlgorithm",
    title: "JWE Content Encryption Algorithm",
    description:
        "Authenticated encryption algorithm used to encrypt the plaintext and produce the ciphertext and Authentication Tag as defined in RFC 7518 Section 5.1",
}) {}
