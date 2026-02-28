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

import { Schema } from "effect";

import { JwsAlgorithm } from "./Jwa.ts";
import { Jwk } from "./Jwk.ts";

/**
 * JOSE Header for JWS as defined in RFC 7515 Section 4. The JOSE Header
 * describes the cryptographic operations applied to the JWS Protected Header
 * and the JWS Payload.
 *
 * This schema is extensible — additional public and private header parameters
 * are permitted per RFC 7515 Sections 4.2 and 4.3.
 *
 * @since 1.0.0
 * @category JOSE Header
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-4
 */
export const JoseHeader = Schema.Struct({
    /**
     * "alg" (Algorithm) Header Parameter - REQUIRED Identifies the
     * cryptographic algorithm used to secure the JWS.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.1
     */
    alg: JwsAlgorithm,

    /**
     * "jku" (JWK Set URL) Header Parameter - OPTIONAL A URI that refers to a
     * resource for a set of JSON-encoded public keys.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.2
     */
    jku: Schema.String.pipe(
        Schema.annotations({
            description: "URI that refers to a resource for a set of JSON-encoded public keys",
        }),
        Schema.optional,
    ),

    /**
     * "jwk" (JSON Web Key) Header Parameter - OPTIONAL The public key that
     * corresponds to the key used to digitally sign the JWS.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.3
     */
    jwk: Jwk.pipe(
        Schema.annotations({
            description: "The public key that corresponds to the key used to digitally sign the JWS",
        }),
        Schema.optional,
    ),

    /**
     * "kid" (Key ID) Header Parameter - OPTIONAL A hint indicating which key
     * was used to secure the JWS.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.4
     */
    kid: Schema.String.pipe(
        Schema.annotations({
            description: "A hint indicating which key was used to secure the JWS",
        }),
        Schema.optional,
    ),

    /**
     * "x5u" (X.509 URL) Header Parameter - OPTIONAL A URI that refers to a
     * resource for the X.509 public key certificate or certificate chain.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.5
     */
    x5u: Schema.String.pipe(
        Schema.annotations({
            description: "URI that refers to a resource for the X.509 public key certificate or certificate chain",
        }),
        Schema.optional,
    ),

    /**
     * "x5c" (X.509 Certificate Chain) Header Parameter - OPTIONAL Contains the
     * X.509 public key certificate or certificate chain as a JSON array of
     * certificate value strings.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.6
     */
    x5c: Schema.Array(Schema.String).pipe(
        Schema.annotations({
            description: "X.509 public key certificate or certificate chain",
        }),
        Schema.optional,
    ),

    /**
     * "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter - OPTIONAL A
     * base64url-encoded SHA-1 thumbprint of the DER encoding of the X.509
     * certificate.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.7
     */
    x5t: Schema.String.pipe(
        Schema.annotations({
            description: "Base64url-encoded SHA-1 thumbprint of the X.509 certificate",
        }),
        Schema.optional,
    ),

    /**
     * "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Header Parameter -
     * OPTIONAL A base64url-encoded SHA-256 thumbprint of the DER encoding of
     * the X.509 certificate.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.8
     */
    "x5t#S256": Schema.String.pipe(
        Schema.annotations({
            description: "Base64url-encoded SHA-256 thumbprint of the X.509 certificate",
        }),
        Schema.optional,
    ),

    /**
     * "typ" (Type) Header Parameter - OPTIONAL (RECOMMENDED to be "JWT" for
     * JWTs) Used to declare the media type of this complete JWS.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-5.1
     */
    typ: Schema.String.pipe(
        Schema.annotations({
            description: "Media type of this complete JWS. For JWTs, it is RECOMMENDED to use 'JWT' (case-sensitive)",
        }),
        Schema.optional,
    ),

    /**
     * "cty" (Content Type) Header Parameter - OPTIONAL Used to declare the
     * media type of the secured content (the payload). For nested JWTs, this
     * MUST be "JWT".
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.10
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-5.2
     */
    cty: Schema.String.pipe(
        Schema.annotations({
            description: "Media type of the secured content. For nested JWTs, this MUST be 'JWT'",
        }),
        Schema.optional,
    ),

    /**
     * "crit" (Critical) Header Parameter - OPTIONAL Indicates that extensions
     * are being used that MUST be understood and processed.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-4.1.11
     */
    crit: Schema.Array(Schema.String).pipe(
        Schema.annotations({
            description: "Array listing Header Parameter names that use extensions that MUST be understood",
        }),
        Schema.optional,
    ),
}).pipe(
    // Allow additional private/public header parameters
    Schema.extend(
        Schema.Record({
            key: Schema.String,
            value: Schema.UndefinedOr(Schema.Unknown),
        }),
    ),
    Schema.annotations({
        identifier: "JoseHeader",
        title: "JOSE Header",
        description:
            "JSON Object Signing and Encryption Header describing the cryptographic operations applied to the JWS",
    }),
);

/**
 * JWS Compact Serialization as defined in RFC 7515 Section 7.1. Represents a
 * compact, URL-safe string of the form:
 *
 *     BASE64URL(UTF8(JWS Protected Header)) || '.' ||
 *     BASE64URL(JWS Payload) || '.' ||
 *     BASE64URL(JWS Signature)
 *
 * Only one signature/MAC is supported by the JWS Compact Serialization and it
 * provides no syntax to represent a JWS Unprotected Header value.
 *
 * @since 1.0.0
 * @category JWS Compact Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.1
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-3.1
 */
export class JwsCompactSerialization extends Schema.Struct({
    /**
     * The JWS Protected Header. In the compact serialization, the entire JOSE
     * Header is integrity protected.
     */
    protected: Schema.typeSchema(JoseHeader),

    /** The JWS Payload — an arbitrary base64url-encoded octet sequence. */
    payload: Schema.String,

    /**
     * The JWS Signature — a base64url-encoded digital signature or MAC. Empty
     * string for unsecured JWSs (alg: "none").
     */
    signature: Schema.String,
}).annotations({
    identifier: "JwsCompactSerialization",
    title: "JWS Compact Serialization",
    description: "A JWS in Compact Serialization format: BASE64URL(Header).BASE64URL(Payload).BASE64URL(Signature)",
}) {}

/**
 * A single signature entry within the "signatures" array of a General JWS JSON
 * Serialization. Each entry contains its own protected header, unprotected
 * header, and signature value.
 *
 * @since 1.0.0
 * @category JWS JSON Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.1
 */
export class JwsSignatureEntry extends Schema.Struct({
    /**
     * BASE64URL(UTF8(JWS Protected Header)) — MUST be present when the JWS
     * Protected Header value is non-empty; otherwise, it MUST be absent. These
     * Header Parameter values are integrity protected.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.1
     */
    protected: Schema.optional(Schema.String),

    /**
     * JWS Unprotected Header — MUST be present when the JWS Unprotected Header
     * value is non-empty; otherwise, it MUST be absent. These Header Parameter
     * values are NOT integrity protected.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.1
     */
    header: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),

    /**
     * BASE64URL(JWS Signature)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.1
     */
    signature: Schema.String,
}).annotations({
    identifier: "JwsSignatureEntry",
    title: "JWS Signature Entry",
    description: "A single signature or MAC entry within a General JWS JSON Serialization",
}) {}

/**
 * General JWS JSON Serialization as defined in RFC 7515 Section 7.2.1. Supports
 * multiple digital signatures and/or MACs for the same payload.
 *
 * ```json
 * {
 *   "payload": "<payload contents>",
 *   "signatures": [
 *     { "protected": "<header 1>", "header": { ... }, "signature": "<sig 1>" },
 *     { "protected": "<header N>", "header": { ... }, "signature": "<sig N>" }
 *   ]
 * }
 * ```
 *
 * @since 1.0.0
 * @category JWS JSON Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.1
 */
export class JwsGeneralJsonSerialization extends Schema.Struct({
    /**
     * BASE64URL(JWS Payload)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.1
     */
    payload: Schema.String,

    /**
     * Array of signature entries. Each entry represents a signature or MAC over
     * the JWS Payload and its corresponding JWS Protected Header.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.1
     */
    signatures: Schema.NonEmptyArray(JwsSignatureEntry),
}).annotations({
    identifier: "JwsGeneralJsonSerialization",
    title: "General JWS JSON Serialization",
    description:
        "A JWS in General JSON Serialization format supporting multiple signatures or MACs for the same payload",
}) {}

/**
 * Flattened JWS JSON Serialization as defined in RFC 7515 Section 7.2.2.
 * Optimized for the single digital signature or MAC case — the "signatures"
 * member is flattened into top-level "protected", "header", and "signature"
 * members alongside "payload".
 *
 * ```json
 * {
 *   "payload": "<payload contents>",
 *   "protected": "<integrity-protected header contents>",
 *   "header": { ... },
 *   "signature": "<signature contents>"
 * }
 * ```
 *
 * @since 1.0.0
 * @category JWS JSON Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.2
 */
export class JwsFlattenedJsonSerialization extends Schema.Struct({
    /**
     * BASE64URL(JWS Payload)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.2
     */
    payload: Schema.String,

    /**
     * BASE64URL(UTF8(JWS Protected Header)) — MUST be present when the JWS
     * Protected Header value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.2
     */
    protected: Schema.optional(Schema.String),

    /**
     * JWS Unprotected Header — MUST be present when the JWS Unprotected Header
     * value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.2
     */
    header: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),

    /**
     * BASE64URL(JWS Signature)
     *
     * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.2.2
     */
    signature: Schema.String,
}).annotations({
    identifier: "JwsFlattenedJsonSerialization",
    title: "Flattened JWS JSON Serialization",
    description: "A JWS in Flattened JSON Serialization format optimized for a single signature or MAC",
}) {}
