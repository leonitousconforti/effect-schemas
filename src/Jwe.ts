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

import { Effect, Encoding, Function, Schema, type Brand, type ParseResult } from "effect";

import { JweContentEncryptionAlgorithm, JweKeyManagementAlgorithm } from "./Jwa.ts";
import { Jwk } from "./Jwk.ts";

/**
 * JWE "zip" (Compression Algorithm) values. RFC 7516 defines "DEF" (DEFLATE)
 * as the only registered value.
 *
 * @since 1.0.0
 * @category Compression
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.3
 */
export class CompressionAlgorithm extends Schema.Literal(
    "DEF", // DEFLATE (RFC 1951)
).annotations({
    identifier: "CompressionAlgorithm",
    title: "JWE Compression Algorithm",
    description:
        "Compression algorithm applied to the plaintext before encryption as defined in RFC 7516 Section 4.1.3",
}) {}

/**
 * JOSE Header for JWE as defined in RFC 7516 Section 4. The JOSE Header
 * describes the encryption applied to the plaintext and optionally additional
 * properties of the JWE.
 *
 * JWE shares a common Header Parameter space with JWS. The header contains
 * the required "alg" and "enc" parameters plus optional shared JOSE
 * parameters and JWE-specific parameters like "zip".
 *
 * This schema is extensible — additional public and private header parameters
 * are permitted per RFC 7516 Sections 4.2 and 4.3.
 *
 * @since 1.0.0
 * @category JOSE Header
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-4
 */
export class JweHeader extends Schema.Struct({
    /**
     * "alg" (Algorithm) Header Parameter - REQUIRED. Identifies the
     * cryptographic algorithm used to encrypt or determine the value of the
     * Content Encryption Key (CEK).
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.1
     */
    alg: JweKeyManagementAlgorithm,

    /**
     * "enc" (Encryption Algorithm) Header Parameter - REQUIRED. Identifies the
     * content encryption algorithm used to perform authenticated encryption on
     * the plaintext to produce the ciphertext and the Authentication Tag.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.2
     */
    enc: JweContentEncryptionAlgorithm,

    /**
     * "zip" (Compression Algorithm) Header Parameter - OPTIONAL. The
     * compression algorithm applied to the plaintext before encryption, if any.
     * When used, this MUST be integrity protected and therefore MUST occur only
     * within the JWE Protected Header.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.3
     */
    zip: CompressionAlgorithm.pipe(
        Schema.annotations({
            description: "Compression algorithm applied to the plaintext before encryption",
        }),
        Schema.optional,
    ),

    /**
     * "jku" (JWK Set URL) Header Parameter - OPTIONAL. A URI that refers to a
     * resource for a set of JSON-encoded public keys, one of which corresponds
     * to the key used to encrypt the JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.4
     */
    jku: Schema.String.pipe(
        Schema.annotations({
            description: "URI that refers to a resource for a set of JSON-encoded public keys",
        }),
        Schema.optional,
    ),

    /**
     * "jwk" (JSON Web Key) Header Parameter - OPTIONAL. The public key that
     * corresponds to the key used to encrypt the JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.5
     */
    jwk: Jwk.pipe(
        Schema.annotations({
            description: "The public key that corresponds to the key used to encrypt the JWE",
        }),
        Schema.optional,
    ),

    /**
     * "kid" (Key ID) Header Parameter - OPTIONAL. A hint indicating which key
     * was used to encrypt the JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.6
     */
    kid: Schema.String.pipe(
        Schema.annotations({
            description: "A hint indicating which key was used to encrypt the JWE",
        }),
        Schema.optional,
    ),

    /**
     * "x5u" (X.509 URL) Header Parameter - OPTIONAL. A URI that refers to a
     * resource for the X.509 public key certificate or certificate chain
     * corresponding to the key used to encrypt the JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.7
     */
    x5u: Schema.String.pipe(
        Schema.annotations({
            description: "URI that refers to a resource for the X.509 public key certificate or certificate chain",
        }),
        Schema.optional,
    ),

    /**
     * "x5c" (X.509 Certificate Chain) Header Parameter - OPTIONAL. Contains
     * the X.509 public key certificate or certificate chain corresponding to
     * the key used to encrypt the JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.8
     */
    x5c: Schema.Array(Schema.String).pipe(
        Schema.annotations({
            description: "X.509 public key certificate or certificate chain",
        }),
        Schema.optional,
    ),

    /**
     * "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter - OPTIONAL.
     * A base64url-encoded SHA-1 thumbprint of the DER encoding of the X.509
     * certificate corresponding to the key used to encrypt the JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.9
     */
    x5t: Schema.String.pipe(
        Schema.annotations({
            description: "Base64url-encoded SHA-1 thumbprint of the X.509 certificate",
        }),
        Schema.optional,
    ),

    /**
     * "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Header Parameter -
     * OPTIONAL. A base64url-encoded SHA-256 thumbprint of the DER encoding of
     * the X.509 certificate corresponding to the key used to encrypt the JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.10
     */
    "x5t#S256": Schema.String.pipe(
        Schema.annotations({
            description: "Base64url-encoded SHA-256 thumbprint of the X.509 certificate",
        }),
        Schema.optional,
    ),

    /**
     * "typ" (Type) Header Parameter - OPTIONAL. Used to declare the media type
     * of this complete JWE.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.11
     */
    typ: Schema.String.pipe(
        Schema.annotations({
            description: "Media type of this complete JWE",
        }),
        Schema.optional,
    ),

    /**
     * "cty" (Content Type) Header Parameter - OPTIONAL. Used to declare the
     * media type of the secured content (the plaintext). For nested JWTs, this
     * MUST be "JWT".
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.12
     */
    cty: Schema.String.pipe(
        Schema.annotations({
            description: "Media type of the secured content. For nested JWTs, this MUST be 'JWT'",
        }),
        Schema.optional,
    ),

    /**
     * "crit" (Critical) Header Parameter - OPTIONAL. Indicates that extensions
     * are being used that MUST be understood and processed.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-4.1.13
     */
    crit: Schema.Array(Schema.String).pipe(
        Schema.annotations({
            description: "Array listing Header Parameter names that use extensions that MUST be understood",
        }),
        Schema.optional,
    ),

    // ----- Algorithm-specific Header Parameters (RFC 7518) -----

    /**
     * "epk" (Ephemeral Public Key) Header Parameter - REQUIRED for ECDH-ES
     * algorithms. The ephemeral public key created by the originator for key
     * agreement.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-4.6.1.1
     */
    epk: Jwk.pipe(
        Schema.annotations({
            description: "Ephemeral public key for ECDH-ES key agreement",
        }),
        Schema.optional,
    ),

    /**
     * "apu" (Agreement PartyUInfo) Header Parameter - OPTIONAL for ECDH-ES
     * algorithms. Information about the producer, base64url-encoded.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-4.6.1.2
     */
    apu: Schema.String.pipe(
        Schema.annotations({
            description: "Agreement PartyUInfo for ECDH-ES key agreement (base64url-encoded)",
        }),
        Schema.optional,
    ),

    /**
     * "apv" (Agreement PartyVInfo) Header Parameter - OPTIONAL for ECDH-ES
     * algorithms. Information about the recipient, base64url-encoded.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-4.6.1.3
     */
    apv: Schema.String.pipe(
        Schema.annotations({
            description: "Agreement PartyVInfo for ECDH-ES key agreement (base64url-encoded)",
        }),
        Schema.optional,
    ),

    /**
     * "p2s" (PBES2 Salt Input) Header Parameter - REQUIRED for PBES2
     * algorithms. Base64url-encoded salt value.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-4.8.1.1
     */
    p2s: Schema.String.pipe(
        Schema.annotations({
            description: "PBES2 salt input (base64url-encoded)",
        }),
        Schema.optional,
    ),

    /**
     * "p2c" (PBES2 Count) Header Parameter - REQUIRED for PBES2 algorithms.
     * PBKDF2 iteration count.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7518#section-4.8.1.2
     */
    p2c: Schema.Number.pipe(
        Schema.annotations({
            description: "PBES2 iteration count for PBKDF2",
        }),
        Schema.optional,
    ),
}).pipe(
    Schema.extend(
        Schema.Record({
            key: Schema.String,
            value: Schema.UndefinedOr(Schema.Unknown),
        }),
    ),
    Schema.annotations({
        identifier: "JweHeader",
        title: "JWE JOSE Header",
        description: "JSON Object Signing and Encryption Header describing the encryption applied to the JWE plaintext",
    }),
) {}

/**
 * JWE Compact Serialization as defined in RFC 7516 Section 7.1. Represents
 * encrypted content as a compact, URL-safe string of the form:
 *
 *     BASE64URL(UTF8(JWE Protected Header)) || '.' ||
 *     BASE64URL(JWE Encrypted Key) || '.' ||
 *     BASE64URL(JWE Initialization Vector) || '.' ||
 *     BASE64URL(JWE Ciphertext) || '.' ||
 *     BASE64URL(JWE Authentication Tag)
 *
 * Only one recipient is supported by the JWE Compact Serialization and it
 * provides no syntax to represent a JWE Shared Unprotected Header, JWE
 * Per-Recipient Unprotected Header, or JWE AAD values.
 *
 * @since 1.0.0
 * @category JWE Compact Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.1
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-3.1
 */
export class JweCompactSerialization extends Schema.String.pipe(
    Schema.brand("CompactJwe"),
    Schema.typeSchema,
    Schema.transform(
        Schema.TemplateLiteralParser(
            Schema.String,
            ".",
            Schema.String,
            ".",
            Schema.String,
            ".",
            Schema.String,
            ".",
            Schema.String,
        ),
        {
            strict: true,
            encode: (str) => str as Brand.Branded<string, "CompactJwe">,
            decode: (str) => str as `${string}.${string}.${string}.${string}.${string}`,
        },
    ),
    Schema.transform(
        Schema.Struct({
            /**
             * The JWE Protected Header. In the compact serialization, the entire JOSE
             * Header is integrity protected.
             */
            protected: Schema.compose(Schema.StringFromBase64Url, Schema.parseJson(JweHeader)),

            /**
             * The JWE Encrypted Key — a base64url-encoded encrypted Content Encryption
             * Key (CEK). Empty string when Direct Key Agreement or Direct Encryption is
             * used.
             */
            encrypted_key: Schema.Uint8ArrayFromBase64Url,

            /**
             * The JWE Initialization Vector — a base64url-encoded initialization
             * vector. Empty string when the content encryption algorithm does not
             * require an IV.
             */
            iv: Schema.Uint8ArrayFromBase64Url,

            /** The JWE Ciphertext — base64url-encoded ciphertext. */
            ciphertext: Schema.Uint8ArrayFromBase64Url,

            /**
             * The JWE Authentication Tag — a base64url-encoded authentication tag.
             * Empty string when the algorithm does not produce a tag.
             */
            tag: Schema.Uint8ArrayFromBase64Url,
        }),
        {
            strict: true,
            encode: ({ protected: protectedHeader, encrypted_key, iv, ciphertext, tag }) =>
                [protectedHeader, ".", encrypted_key, ".", iv, ".", ciphertext, ".", tag] as const,
            decode: ([protectedHeader, _dot1, encrypted_key, _dot2, iv, _dot3, ciphertext, _dot4, tag]) =>
                ({
                    protected: protectedHeader,
                    encrypted_key,
                    iv,
                    ciphertext,
                    tag,
                }) as const,
        },
    ),
).annotations({
    identifier: "JweCompactSerialization",
    title: "JWE Compact Serialization",
    description:
        "A JWE in Compact Serialization format: BASE64URL(Header).BASE64URL(EncryptedKey).BASE64URL(IV).BASE64URL(Ciphertext).BASE64URL(Tag)",
}) {}

/**
 * A single recipient entry within the "recipients" array of a General JWE
 * JSON Serialization. Each entry contains a per-recipient unprotected header
 * and the per-recipient encrypted key.
 *
 * @since 1.0.0
 * @category JWE JSON Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
 */
export class JweRecipientEntry extends Schema.Struct({
    /**
     * JWE Per-Recipient Unprotected Header — MUST be present when the JWE
     * Per-Recipient Unprotected Header value is non-empty; otherwise, it MUST
     * be absent. These Header Parameter values are NOT integrity protected.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    header: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),

    /**
     * BASE64URL(JWE Encrypted Key) — MUST be present when the JWE Encrypted
     * Key value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    encrypted_key: Schema.optional(Schema.String),
}).annotations({
    identifier: "JweRecipientEntry",
    title: "JWE Recipient Entry",
    description: "A single recipient entry within a General JWE JSON Serialization",
}) {}

/**
 * General JWE JSON Serialization as defined in RFC 7516 Section 7.2.1. Supports
 * encrypting the same content to multiple recipients.
 *
 * ```json
 * {
 *   "protected": "<integrity-protected shared header contents>",
 *   "unprotected": { ... },
 *   "recipients": [
 *     { "header": { ... }, "encrypted_key": "<encrypted key 1>" },
 *     { "header": { ... }, "encrypted_key": "<encrypted key N>" }
 *   ],
 *   "aad": "<additional authenticated data contents>",
 *   "iv": "<initialization vector contents>",
 *   "ciphertext": "<ciphertext contents>",
 *   "tag": "<authentication tag contents>"
 * }
 * ```
 *
 * @since 1.0.0
 * @category JWE JSON Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
 */
export class JweGeneralJsonSerialization extends Schema.Struct({
    /**
     * BASE64URL(UTF8(JWE Protected Header)) — MUST be present when the JWE
     * Protected Header value is non-empty; otherwise, it MUST be absent. These
     * Header Parameter values are integrity protected.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    protected: Schema.optional(Schema.String),

    /**
     * JWE Shared Unprotected Header — MUST be present when the JWE Shared
     * Unprotected Header value is non-empty; otherwise, it MUST be absent.
     * These Header Parameter values are NOT integrity protected.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    unprotected: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),

    /**
     * Array of per-recipient entries. Each entry contains a per-recipient
     * unprotected header and the corresponding encrypted key. MUST contain
     * exactly one element per recipient.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    recipients: Schema.NonEmptyArray(JweRecipientEntry),

    /**
     * BASE64URL(JWE Initialization Vector) — MUST be present when the JWE
     * Initialization Vector value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    iv: Schema.optional(Schema.String),

    /**
     * BASE64URL(JWE AAD) — MUST be present when the JWE AAD value is non-empty;
     * otherwise, it MUST be absent. Provides additional authenticated data that
     * is integrity protected but not encrypted.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    aad: Schema.optional(Schema.String),

    /**
     * BASE64URL(JWE Ciphertext) — MUST be present.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    ciphertext: Schema.String,

    /**
     * BASE64URL(JWE Authentication Tag) — MUST be present when the JWE
     * Authentication Tag value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1
     */
    tag: Schema.optional(Schema.String),
}).annotations({
    identifier: "JweGeneralJsonSerialization",
    title: "General JWE JSON Serialization",
    description:
        "A JWE in General JSON Serialization format supporting encryption of the same content to multiple recipients",
}) {}

/**
 * Flattened JWE JSON Serialization as defined in RFC 7516 Section 7.2.2.
 * Optimized for the single-recipient case — the "recipients" member is
 * flattened into top-level "header" and "encrypted_key" members alongside the
 * shared JWE members.
 *
 * ```json
 * {
 *   "protected": "<integrity-protected header contents>",
 *   "unprotected": { ... },
 *   "header": { ... },
 *   "encrypted_key": "<encrypted key contents>",
 *   "aad": "<additional authenticated data contents>",
 *   "iv": "<initialization vector contents>",
 *   "ciphertext": "<ciphertext contents>",
 *   "tag": "<authentication tag contents>"
 * }
 * ```
 *
 * @since 1.0.0
 * @category JWE JSON Serialization
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
 */
export class JweFlattenedJsonSerialization extends Schema.Struct({
    /**
     * BASE64URL(UTF8(JWE Protected Header)) — MUST be present when the JWE
     * Protected Header value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    protected: Schema.optional(Schema.String),

    /**
     * JWE Shared Unprotected Header — MUST be present when the JWE Shared
     * Unprotected Header value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    unprotected: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),

    /**
     * JWE Per-Recipient Unprotected Header — MUST be present when the JWE
     * Per-Recipient Unprotected Header value is non-empty; otherwise, it MUST
     * be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    header: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),

    /**
     * BASE64URL(JWE Encrypted Key) — MUST be present when the JWE Encrypted
     * Key value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    encrypted_key: Schema.optional(Schema.String),

    /**
     * BASE64URL(JWE Initialization Vector) — MUST be present when the JWE
     * Initialization Vector value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    iv: Schema.optional(Schema.String),

    /**
     * BASE64URL(JWE AAD) — MUST be present when the JWE AAD value is non-empty;
     * otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    aad: Schema.optional(Schema.String),

    /**
     * BASE64URL(JWE Ciphertext) — MUST be present.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    ciphertext: Schema.String,

    /**
     * BASE64URL(JWE Authentication Tag) — MUST be present when the JWE
     * Authentication Tag value is non-empty; otherwise, it MUST be absent.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7516#section-7.2.2
     */
    tag: Schema.optional(Schema.String),
}).annotations({
    identifier: "JweFlattenedJsonSerialization",
    title: "Flattened JWE JSON Serialization",
    description: "A JWE in Flattened JSON Serialization format optimized for the single-recipient case",
}) {}

/**
 * Encrypt plaintext and produce a JWE Compact Serialization string.
 *
 * Implements the JWE Compact Serialization encryption process described in
 * RFC 7516 Section 5.1 using RSA-OAEP key management.
 *
 * @since 1.0.0
 * @category Encrypt / Decrypt
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-5.1
 */
export const encrypt = Effect.fnUntraced(function* (
    plaintext: string | Uint8Array,
    publicKey: CryptoKey,
    header: Schema.Schema.Type<typeof JweHeader>,
): Effect.fn.Return<Schema.Schema.Encoded<typeof JweCompactSerialization>, ParseResult.ParseError, never> {
    const keyManagement = JweKeyManagementAlgorithm.fromAlgorithm(header.alg);
    const contentEncoding = JweContentEncryptionAlgorithm.fromAlgorithm(header.enc);

    const iv = contentEncoding.generateIv();
    const cek = contentEncoding.generateCek();
    const encryptedCek = yield* keyManagement.encryptCek(publicKey, cek.buffer);
    const plaintextBytes = typeof plaintext === "string" ? new TextEncoder().encode(plaintext) : plaintext;

    const aad = yield* Function.pipe(
        header,
        Schema.encode(JweCompactSerialization.to.fields["protected"]),
        Effect.flatMap(Schema.decode(Schema.Uint8ArrayFromBase64Url)),
    );

    const { ciphertext, tag } = yield* contentEncoding.encrypt(
        cek.buffer,
        iv.buffer,
        plaintextBytes.buffer as ArrayBuffer,
        aad.buffer as ArrayBuffer,
    );

    return yield* Schema.encode(JweCompactSerialization)({
        encrypted_key: new Uint8Array(encryptedCek),
        ciphertext: new Uint8Array(ciphertext),
        tag: new Uint8Array(tag),
        iv: new Uint8Array(iv),
        protected: header,
    });
});

/**
 * Decrypt a JWE Compact Serialization string and return the header and
 * plaintext.
 *
 * Implements the JWE Compact Serialization decryption process described in
 * RFC 7516 Section 5.2 using RSA-OAEP key management.
 *
 * @since 1.0.0
 * @category Encrypt / Decrypt
 * @see https://www.rfc-editor.org/rfc/rfc7516#section-5.2
 */
export const decrypt = Effect.fnUntraced(function* (
    token: Schema.Schema.Encoded<typeof JweCompactSerialization>,
    privateKey: CryptoKey,
): Effect.fn.Return<string, never, never> {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();

    const tokenDecoded = yield* Schema.decode(JweCompactSerialization)(token).pipe(Effect.orDie);
    const keyManagement = JweKeyManagementAlgorithm.fromAlgorithm(tokenDecoded.protected.alg);
    const contentEncoding = JweContentEncryptionAlgorithm.fromAlgorithm(tokenDecoded.protected.enc);

    const aad = yield* Function.pipe(
        tokenDecoded.protected,
        Schema.encode(Schema.parseJson(JweHeader)),
        Effect.orDie,
        Effect.map((str) => Encoding.encodeBase64Url(str)),
        Effect.map((base64Url) => textEncoder.encode(base64Url)),
    );

    const cek = yield* keyManagement.decryptCek(
        privateKey,
        tokenDecoded.encrypted_key.buffer as ArrayBuffer,
        contentEncoding.cekByteLength,
    );

    const plaintext = yield* contentEncoding.decrypt(
        cek,
        tokenDecoded.iv.buffer as ArrayBuffer,
        tokenDecoded.ciphertext.buffer as ArrayBuffer,
        tokenDecoded.tag.buffer as ArrayBuffer,
        aad.buffer as ArrayBuffer,
    );

    return textDecoder.decode(plaintext);
});
