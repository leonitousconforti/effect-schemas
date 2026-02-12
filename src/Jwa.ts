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

import { Effect, Schema } from "effect";

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
) {
    private static readonly makeAesGcm = (keyBits: 128 | 192 | 256) => {
        const cekByteLength = keyBits / 8;
        const ivByteLength = 12; // 96 bits for AES-GCM
        const tagByteLength = 16; // 128-bit authentication tag

        return {
            cekByteLength,
            ivByteLength,
            tagByteLength,

            generateIv: () => crypto.getRandomValues(new Uint8Array(ivByteLength)),
            generateCek: () => crypto.getRandomValues(new Uint8Array(cekByteLength)),

            encrypt: Effect.fnUntraced(function* (
                cek: ArrayBuffer,
                iv: ArrayBuffer,
                plaintext: ArrayBuffer,
                aad: ArrayBuffer,
            ): Effect.fn.Return<
                {
                    ciphertext: ArrayBuffer;
                    tag: ArrayBuffer;
                    iv: ArrayBuffer;
                },
                never,
                never
            > {
                const key = yield* Effect.promise(() =>
                    crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt", "decrypt"]),
                );
                const encrypted = yield* Effect.promise(() =>
                    crypto.subtle.encrypt(
                        {
                            iv,
                            name: "AES-GCM",
                            additionalData: aad,
                            tagLength: tagByteLength * 8,
                        },
                        key,
                        plaintext,
                    ),
                );
                const ciphertext = encrypted.slice(0, -tagByteLength);
                const tag = encrypted.slice(-tagByteLength);
                return { ciphertext, tag, iv };
            }),
            decrypt: Effect.fnUntraced(function* (
                cek: ArrayBuffer,
                iv: ArrayBuffer,
                ciphertext: ArrayBuffer,
                tag: ArrayBuffer,
                aad: ArrayBuffer,
            ): Effect.fn.Return<ArrayBuffer, never, never> {
                const key = yield* Effect.promise(() =>
                    crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt", "decrypt"]),
                );
                const input = new Uint8Array(ciphertext.byteLength + tag.byteLength);
                input.set(new Uint8Array(ciphertext), 0);
                input.set(new Uint8Array(tag), ciphertext.byteLength);
                const decrypted = yield* Effect.promise(() =>
                    crypto.subtle.decrypt(
                        {
                            iv,
                            name: "AES-GCM",
                            additionalData: aad,
                            tagLength: tagByteLength * 8,
                        },
                        key,
                        input,
                    ),
                );
                return decrypted;
            }),
        };
    };

    private static readonly makeAesCbcHmac = (
        encKeyBits: 128 | 192 | 256,
        hmacHash: "SHA-256" | "SHA-384" | "SHA-512",
        tagByteLength: number,
    ) => {
        const encKeyByteLength = encKeyBits / 8;
        const macKeyByteLength = tagByteLength; // MAC key length = tag length per RFC 7518
        const cekByteLength = encKeyByteLength + macKeyByteLength;
        const ivByteLength = 16; // 128 bits for AES-CBC

        /**
         * Compute the AL (Associated Data Length) value per RFC 7518 Section 5.2.2.1:
         * AAD length in bits as a 64-bit unsigned big-endian integer.
         */
        const computeAl = (aad: ArrayBuffer): Uint8Array => {
            const al = new Uint8Array(8);
            const alView = new DataView(al.buffer);
            const aadBitLength = aad.byteLength * 8;
            alView.setUint32(0, Math.floor(aadBitLength / 0x100000000), false);
            alView.setUint32(4, aadBitLength >>> 0, false);
            return al;
        };

        /** Constant-time comparison to prevent timing attacks. */
        const constantTimeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
            if (a.byteLength !== b.byteLength) return false;
            let result = 0;
            for (let i = 0; i < a.byteLength; i++) {
                result |= a[i] ^ b[i];
            }
            return result === 0;
        };

        const importCbcKey = (encKey: ArrayBuffer, usages: Array<KeyUsage>) =>
            Effect.promise(() => crypto.subtle.importKey("raw", encKey, "AES-CBC", false, usages));

        const importHmacKey = (macKey: ArrayBuffer) =>
            Effect.promise(() =>
                crypto.subtle.importKey(
                    "raw",
                    macKey,
                    {
                        name: "HMAC",
                        hash: hmacHash,
                    },
                    false,
                    ["sign"],
                ),
            );

        return {
            cekByteLength,
            ivByteLength,
            tagByteLength,

            generateIv: () => crypto.getRandomValues(new Uint8Array(ivByteLength)),
            generateCek: () => crypto.getRandomValues(new Uint8Array(cekByteLength)),

            encrypt: Effect.fnUntraced(function* (
                cek: ArrayBuffer,
                iv: ArrayBuffer,
                plaintext: ArrayBuffer,
                aad: ArrayBuffer,
            ): Effect.fn.Return<
                {
                    ciphertext: ArrayBuffer;
                    tag: ArrayBuffer;
                    iv: ArrayBuffer;
                },
                never,
                never
            > {
                // Split CEK into MAC key and encryption key
                const macKey = cek.slice(0, macKeyByteLength);
                const encKey = cek.slice(macKeyByteLength);

                // AES-CBC encrypt with PKCS#7 padding (Web Crypto default)
                const cbcKey = yield* importCbcKey(encKey, ["encrypt"]);
                const ciphertext = yield* Effect.promise(() =>
                    crypto.subtle.encrypt(
                        {
                            iv,
                            name: "AES-CBC",
                        },
                        cbcKey,
                        plaintext,
                    ),
                );

                // HMAC over AAD || IV || ciphertext || AL
                const al = computeAl(aad);
                const hmacKey = yield* importHmacKey(macKey);
                const hmacInput = new Uint8Array([
                    ...new Uint8Array(aad),
                    ...new Uint8Array(iv),
                    ...new Uint8Array(ciphertext),
                    ...al,
                ]);
                const fullMac = yield* Effect.promise(() => crypto.subtle.sign("HMAC", hmacKey, hmacInput));

                // Tag = first T_LEN bytes of HMAC output
                const tag = fullMac.slice(0, tagByteLength);
                return { ciphertext, tag, iv };
            }),
            decrypt: Effect.fnUntraced(function* (
                cek: ArrayBuffer,
                iv: ArrayBuffer,
                ciphertext: ArrayBuffer,
                tag: ArrayBuffer,
                aad: ArrayBuffer,
            ): Effect.fn.Return<ArrayBuffer, never, never> {
                // Split CEK into MAC key and encryption key
                const macKey = cek.slice(0, macKeyByteLength);
                const encKey = cek.slice(macKeyByteLength);

                // Recompute HMAC over AAD || IV || ciphertext || AL
                const al = computeAl(aad);
                const hmacKey = yield* importHmacKey(macKey);
                const hmacInput = new Uint8Array([
                    ...new Uint8Array(aad),
                    ...new Uint8Array(iv),
                    ...new Uint8Array(ciphertext),
                    ...al,
                ]);
                const fullMac = yield* Effect.promise(() => crypto.subtle.sign("HMAC", hmacKey, hmacInput));
                const computedTag = new Uint8Array(fullMac.slice(0, tagByteLength));

                // Constant-time comparison to prevent timing attacks
                if (!constantTimeEqual(new Uint8Array(tag), computedTag)) {
                    throw new Error("Authentication tag verification failed");
                }

                // AES-CBC decrypt (automatically removes PKCS#7 padding)
                const cbcKey = yield* importCbcKey(encKey, ["decrypt"]);
                const decrypted = yield* Effect.promise(() =>
                    crypto.subtle.decrypt(
                        {
                            iv,
                            name: "AES-CBC",
                        },
                        cbcKey,
                        ciphertext,
                    ),
                );
                return decrypted;
            }),
        };
    };

    private static readonly aesGcm128 = JweContentEncryptionAlgorithm.makeAesGcm(128);
    private static readonly aesGcm192 = JweContentEncryptionAlgorithm.makeAesGcm(192);
    private static readonly aesGcm256 = JweContentEncryptionAlgorithm.makeAesGcm(256);
    private static readonly aesCbcHmac256 = JweContentEncryptionAlgorithm.makeAesCbcHmac(128, "SHA-256", 16);
    private static readonly aesCbcHmac384 = JweContentEncryptionAlgorithm.makeAesCbcHmac(192, "SHA-384", 24);
    private static readonly aesCbcHmac512 = JweContentEncryptionAlgorithm.makeAesCbcHmac(256, "SHA-512", 32);

    public static readonly fromAlgorithm = (
        algorithm: Schema.Schema.Type<JweContentEncryptionAlgorithm>,
    ): {
        cekByteLength: number;
        ivByteLength: number;
        tagByteLength: number;
        generateIv: () => Uint8Array<ArrayBuffer>;
        generateCek: () => Uint8Array<ArrayBuffer>;
        encrypt: (
            cek: ArrayBuffer,
            iv: ArrayBuffer,
            plaintext: ArrayBuffer,
            aad: ArrayBuffer,
        ) => Effect.Effect<
            {
                ciphertext: ArrayBuffer;
                tag: ArrayBuffer;
                iv: ArrayBuffer;
            },
            never,
            never
        >;
        decrypt: (
            cek: ArrayBuffer,
            iv: ArrayBuffer,
            ciphertext: ArrayBuffer,
            tag: ArrayBuffer,
            aad: ArrayBuffer,
        ) => Effect.Effect<ArrayBuffer, never, never>;
    } => {
        switch (algorithm) {
            case "A128GCM":
                return JweContentEncryptionAlgorithm.aesGcm128;
            case "A192GCM":
                return JweContentEncryptionAlgorithm.aesGcm192;
            case "A256GCM":
                return JweContentEncryptionAlgorithm.aesGcm256;
            case "A128CBC-HS256":
                return JweContentEncryptionAlgorithm.aesCbcHmac256;
            case "A192CBC-HS384":
                return JweContentEncryptionAlgorithm.aesCbcHmac384;
            case "A256CBC-HS512":
                return JweContentEncryptionAlgorithm.aesCbcHmac512;
        }
    };
}
