import { describe, expect, it } from "@effect/vitest";

import { Effect, Schema } from "effect";
import { Jwk } from "effect-schemas";

/** Generate an HMAC CryptoKey for the given JWA algorithm identifier. */
const generateHmacKey = (alg: "HS256" | "HS384" | "HS512"): Effect.Effect<CryptoKey, never, never> => {
    const hashBits = { HS256: 256, HS384: 384, HS512: 512 }[alg];
    return Effect.promise(() =>
        crypto.subtle.generateKey(
            {
                name: "HMAC",
                hash: `SHA-${hashBits}`,
                length: hashBits,
            },
            true,
            ["sign", "verify"],
        ),
    );
};

/** Generate an ECDSA CryptoKeyPair for the given JWA algorithm identifier. */
const generateEcdsaKeyPair = (alg: "ES256" | "ES384" | "ES512"): Effect.Effect<CryptoKeyPair, never, never> => {
    const curve = { ES256: "P-256", ES384: "P-384", ES512: "P-521" }[alg];
    return Effect.promise(() =>
        crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: curve,
            },
            true,
            ["sign", "verify"],
        ),
    );
};

/** Generate an RSASSA-PKCS1-v1_5 CryptoKeyPair for the given JWA algorithm identifier. */
const generateRsaSsaKeyPair = (alg: "RS256" | "RS384" | "RS512"): Effect.Effect<CryptoKeyPair, never, never> => {
    const hashBits = { RS256: "SHA-256", RS384: "SHA-384", RS512: "SHA-512" }[alg];
    return Effect.promise(() =>
        crypto.subtle.generateKey(
            {
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: hashBits,
            },
            true,
            ["sign", "verify"],
        ),
    );
};

/** Generate an RSA-PSS CryptoKeyPair for the given JWA algorithm identifier. */
const generateRsaPssKeyPair = (alg: "PS256" | "PS384" | "PS512"): Effect.Effect<CryptoKeyPair, never, never> => {
    const hashBits = { PS256: "SHA-256", PS384: "SHA-384", PS512: "SHA-512" }[alg];
    return Effect.promise(() =>
        crypto.subtle.generateKey(
            {
                name: "RSA-PSS",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: hashBits,
            },
            true,
            ["sign", "verify"],
        ),
    );
};

/** Generate an RSA-OAEP CryptoKeyPair for JWE key encryption. */
const generateRsaOaepKeyPair = (hash: "SHA-1" | "SHA-256" = "SHA-256"): Effect.Effect<CryptoKeyPair, never, never> =>
    Effect.promise(() =>
        crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash,
            },
            true,
            ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
        ),
    );

/** Generate an AES key for key wrapping or direct encryption. */
const generateAesKey = (
    bits: 128 | 192 | 256,
    usage: "kw" | "gcm" | "gcmkw" = "kw",
): Effect.Effect<CryptoKey, never, never> => {
    const name = usage === "kw" ? "AES-KW" : "AES-GCM";
    const usages: Array<KeyUsage> =
        usage === "kw" || usage === "gcmkw" ? ["wrapKey", "unwrapKey"] : ["encrypt", "decrypt"];
    return Effect.promise(() =>
        crypto.subtle.generateKey(
            {
                name,
                length: bits,
            },
            true,
            usages,
        ),
    );
};

/** Export a CryptoKey (or one half of a CryptoKeyPair) to JWK format. */
const exportJwk = (key: CryptoKey): Effect.Effect<JsonWebKey, never, never> =>
    Effect.promise(() => crypto.subtle.exportKey("jwk", key));

/** Export a CryptoKeyPair to a { publicJwk, privateJwk } pair. */
const exportKeyPair = (pair: CryptoKeyPair) =>
    Effect.gen(function* () {
        const publicJwk = yield* exportJwk(pair.publicKey);
        const privateJwk = yield* exportJwk(pair.privateKey);
        return { publicJwk, privateJwk };
    });

describe("Jwk", () => {
    describe.each(["ES256", "ES384", "ES512"] as const)("EC %s keys generated via WebCrypto", (algorithm) => {
        it.effect("public key decodes as EcPublicKey", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair(algorithm));
                expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)(publicJwk)).not.toThrow();
            }),
        );

        it.effect("private key decodes as EcPrivateKey", () =>
            Effect.gen(function* () {
                const { privateJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair(algorithm));
                expect(() => Schema.decodeUnknownSync(Jwk.EcPrivateKey)(privateJwk)).not.toThrow();
            }),
        );

        it.effect("public key has expected kty and crv", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair(algorithm));
                const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(publicJwk);
                expect(decoded.kty).toBe("EC");
                expect(decoded.x).toBeTypeOf("string");
                expect(decoded.y).toBeTypeOf("string");
            }),
        );

        it.effect('private key includes "d" parameter', () =>
            Effect.gen(function* () {
                const { privateJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair(algorithm));
                const decoded = Schema.decodeUnknownSync(Jwk.EcPrivateKey)(privateJwk);
                expect(decoded.kty).toBe("EC");
                expect(decoded.d).toBeDefined();
            }),
        );

        it.effect("public key does NOT decode as EcPrivateKey", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair(algorithm));
                expect(() => Schema.decodeUnknownSync(Jwk.EcPrivateKey)(publicJwk)).toThrow();
            }),
        );

        it.effect("private key round-trips through encode/decode", () =>
            Effect.gen(function* () {
                const { privateJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair(algorithm));
                const decoded = Schema.decodeUnknownSync(Jwk.EcPrivateKey)(privateJwk);
                const encoded = Schema.encodeUnknownSync(Jwk.EcPrivateKey)(decoded);
                const redecoded = Schema.decodeUnknownSync(Jwk.EcPrivateKey)(encoded);
                expect(redecoded.kty).toBe(decoded.kty);
                expect(redecoded.crv).toBe(decoded.crv);
            }),
        );

        it.effect("decodes through the top-level Jwk union", () =>
            Effect.gen(function* () {
                const { publicJwk, privateJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair(algorithm));
                expect(() => Schema.decodeUnknownSync(Jwk.Jwk)(publicJwk)).not.toThrow();
                expect(() => Schema.decodeUnknownSync(Jwk.Jwk)(privateJwk)).not.toThrow();
            }),
        );
    });

    describe.each(["RS256", "RS384", "RS512"] as const)("RSASSA-PKCS1-v1_5 %s keys generated via WebCrypto", (alg) => {
        it.effect("public key decodes as RsaPublicKey", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateRsaSsaKeyPair(alg));
                const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk);
                expect(decoded.kty).toBe("RSA");
                expect(decoded.n).toBeTypeOf("string");
                expect(decoded.e).toBeTypeOf("string");
            }),
        );

        it.effect("private key decodes as RsaPrivateKey", () =>
            Effect.gen(function* () {
                const { privateJwk } = yield* exportKeyPair(yield* generateRsaSsaKeyPair(alg));
                const decoded = Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk);
                expect(decoded.kty).toBe("RSA");
            }),
        );

        it.effect("private key includes CRT parameters", () =>
            Effect.gen(function* () {
                const { privateJwk } = yield* exportKeyPair(yield* generateRsaSsaKeyPair(alg));
                // WebCrypto always exports with CRT parameters
                expect(privateJwk).toHaveProperty("p");
                expect(privateJwk).toHaveProperty("q");
                expect(privateJwk).toHaveProperty("dp");
                expect(privateJwk).toHaveProperty("dq");
                expect(privateJwk).toHaveProperty("qi");
                // Should still decode fine
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk)).not.toThrow();
            }),
        );

        it.effect("public key does NOT decode as RsaPrivateKey", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateRsaSsaKeyPair(alg));
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(publicJwk)).toThrow();
            }),
        );
    });

    describe.each(["PS256", "PS384", "PS512"] as const)("RSA-PSS %s keys generated via WebCrypto", (alg) => {
        it.effect("public key decodes as RsaPublicKey", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateRsaPssKeyPair(alg));
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk)).not.toThrow();
            }),
        );

        it.effect("private key decodes as RsaPrivateKey", () =>
            Effect.gen(function* () {
                const { privateJwk } = yield* exportKeyPair(yield* generateRsaPssKeyPair(alg));
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk)).not.toThrow();
            }),
        );
    });

    describe.each(["SHA-1", "SHA-256"] as const)("RSA-OAEP with %s generated via WebCrypto", (hash) => {
        it.effect("public key decodes as RsaPublicKey", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateRsaOaepKeyPair(hash));
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk)).not.toThrow();
            }),
        );

        it.effect("private key decodes as RsaPrivateKey", () =>
            Effect.gen(function* () {
                const { privateJwk } = yield* exportKeyPair(yield* generateRsaOaepKeyPair(hash));
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk)).not.toThrow();
            }),
        );
    });

    it.effect("RSA private key round-trips through encode/decode", () =>
        Effect.gen(function* () {
            const { privateJwk } = yield* exportKeyPair(yield* generateRsaSsaKeyPair("RS256"));
            const decoded = Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk);
            const encoded = Schema.encodeUnknownSync(Jwk.RsaPrivateKey)(decoded);
            const redecoded = Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(encoded);
            expect(redecoded.kty).toBe("RSA");
        }),
    );

    describe.each(["HS256", "HS384", "HS512"] as const)("HMAC %s keys generated via WebCrypto", (alg) => {
        it.effect("key decodes as OctKey", () =>
            Effect.gen(function* () {
                const key = yield* generateHmacKey(alg);
                const jwk = yield* exportJwk(key);
                const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
                expect(decoded.kty).toBe("oct");
                expect(decoded.k).toBeDefined();
            }),
        );

        it.effect("key round-trips through encode/decode", () =>
            Effect.gen(function* () {
                const key = yield* generateHmacKey(alg);
                const jwk = yield* exportJwk(key);
                const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
                const encoded = Schema.encodeUnknownSync(Jwk.OctKey)(decoded);
                const redecoded = Schema.decodeUnknownSync(Jwk.OctKey)(encoded);
                expect(redecoded.kty).toBe("oct");
            }),
        );
    });

    describe.each([128, 192, 256] as const)("AES-%i keys generated via WebCrypto", (bits) => {
        it.effect("key decodes as OctKey", () =>
            Effect.gen(function* () {
                const key = yield* generateAesKey(bits, "gcm");
                const jwk = yield* exportJwk(key);
                const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
                expect(decoded.kty).toBe("oct");
                expect(decoded.k).toBeDefined();
            }),
        );
    });

    it.effect("oct key decodes through the top-level Jwk union", () =>
        Effect.gen(function* () {
            const key = yield* generateHmacKey("HS256");
            const jwk = yield* exportJwk(key);
            expect(() => Schema.decodeUnknownSync(Jwk.Jwk)(jwk)).not.toThrow();
        }),
    );

    describe("JWK with optional common fields", () => {
        it.effect('accepts an EC key with "kid" and "use" fields', () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const jwkWithMeta = { ...publicJwk, kid: "my-key-1", use: "sig" };
                const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkWithMeta);
                expect(decoded.kid).toBe("my-key-1");
                expect(decoded.use).toBe("sig");
            }),
        );

        it.effect('accepts an EC key with "key_ops"', () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const jwkWithOps = { ...publicJwk, key_ops: ["verify"] };
                const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkWithOps);
                expect(decoded.key_ops).toEqual(["verify"]);
            }),
        );

        it.effect('accepts an RSA key with "alg" field', () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateRsaSsaKeyPair("RS256"));
                const jwkWithAlg = { ...publicJwk, alg: "RS256" };
                const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(jwkWithAlg);
                expect(decoded.alg).toBe("RS256");
            }),
        );

        it.effect('rejects an unknown "use" value', () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const jwkBadUse = { ...publicJwk, use: "bad" };
                expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkBadUse)).toThrow();
            }),
        );

        it.effect('rejects an unknown "key_ops" value', () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const jwkBadOps = { ...publicJwk, key_ops: ["launch_missiles"] };
                expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkBadOps)).toThrow();
            }),
        );
    });

    describe("JwkSet", () => {
        it.effect("decodes a set with mixed key types", () =>
            Effect.gen(function* () {
                const ecPair = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const rsaPair = yield* exportKeyPair(yield* generateRsaSsaKeyPair("RS256"));
                const hmacJwk = yield* exportJwk(yield* generateHmacKey("HS256"));

                const jwkSet = {
                    keys: [ecPair.publicJwk, rsaPair.publicJwk, hmacJwk],
                };

                const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet);
                expect(decoded.keys).toHaveLength(3);
            }),
        );

        it.effect("decodes a set containing both public and private keys", () =>
            Effect.gen(function* () {
                const ecPair = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES384"));
                const rsaPair = yield* exportKeyPair(yield* generateRsaSsaKeyPair("RS512"));

                const jwkSet = {
                    keys: [ecPair.publicJwk, ecPair.privateJwk, rsaPair.publicJwk, rsaPair.privateJwk],
                };

                const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet);
                expect(decoded.keys).toHaveLength(4);
            }),
        );

        it.effect("decodes an empty key set", () =>
            Effect.gen(function* () {
                const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)({ keys: [] });
                expect(decoded.keys).toHaveLength(0);
            }),
        );

        it.effect("rejects a set with an invalid key", () =>
            Effect.gen(function* () {
                const ecPair = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const badKey = { kty: "FAKE", n: "abc" };
                const jwkSet = { keys: [ecPair.publicJwk, badKey] };
                expect(() => Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet)).toThrow();
            }),
        );

        it.effect('rejects a jwk set missing the "keys" member', () =>
            Effect.gen(function* () {
                expect(() => Schema.decodeUnknownSync(Jwk.JwkSet)({})).toThrow();
            }),
        );

        it.effect("round-trips a key set through encode/decode", () =>
            Effect.gen(function* () {
                const ecPair = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const hmacJwk = yield* exportJwk(yield* generateHmacKey("HS512"));

                const jwkSet = { keys: [ecPair.publicJwk, hmacJwk] };
                const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet);
                const encoded = Schema.encodeUnknownSync(Jwk.JwkSet)(decoded);
                const redecoded = Schema.decodeUnknownSync(Jwk.JwkSet)(encoded);
                expect(redecoded.keys).toHaveLength(2);
            }),
        );
    });

    describe("Jwk union discrimination", () => {
        it.effect("correctly discriminates EC vs RSA vs oct from real keys", () =>
            Effect.gen(function* () {
                const ec = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                const rsa = yield* exportKeyPair(yield* generateRsaSsaKeyPair("RS256"));
                const oct = yield* exportJwk(yield* generateHmacKey("HS256"));

                const decodedEc = Schema.decodeUnknownSync(Jwk.Jwk)(ec.publicJwk);
                const decodedRsa = Schema.decodeUnknownSync(Jwk.Jwk)(rsa.publicJwk);
                const decodedOct = Schema.decodeUnknownSync(Jwk.Jwk)(oct);

                expect(decodedEc.kty).toBe("EC");
                expect(decodedRsa.kty).toBe("RSA");
                expect(decodedOct.kty).toBe("oct");
            }),
        );
    });

    describe("WebCrypto round-trip interoperability", () => {
        it.effect("EC key survives schema decode → encode → WebCrypto re-import", () =>
            Effect.gen(function* () {
                const pair = yield* generateEcdsaKeyPair("ES256");
                const jwk = yield* exportJwk(pair.publicKey);

                // Decode through schema, encode back
                const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwk);
                const encoded = Schema.encodeUnknownSync(Jwk.EcPublicKey)(decoded);

                // Re-import into WebCrypto — this would fail if the schema mangled any fields
                const reimported = yield* Effect.promise(() =>
                    crypto.subtle.importKey(
                        "jwk",
                        encoded as JsonWebKey,
                        { name: "ECDSA", namedCurve: "P-256" },
                        true,
                        ["verify"],
                    ),
                );
                expect(reimported.type).toBe("public");
            }),
        );

        it.effect("RSA key survives schema decode → encode → WebCrypto re-import", () =>
            Effect.gen(function* () {
                const pair = yield* generateRsaSsaKeyPair("RS256");
                const jwk = yield* exportJwk(pair.publicKey);

                const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(jwk);
                const encoded = Schema.encodeUnknownSync(Jwk.RsaPublicKey)(decoded);

                const reimported = yield* Effect.promise(() =>
                    crypto.subtle.importKey(
                        "jwk",
                        encoded as JsonWebKey,
                        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
                        true,
                        ["verify"],
                    ),
                );
                expect(reimported.type).toBe("public");
            }),
        );

        it.effect("HMAC key survives schema decode → encode → WebCrypto re-import", () =>
            Effect.gen(function* () {
                const key = yield* generateHmacKey("HS256");
                const jwk = yield* exportJwk(key);

                const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
                const encoded = Schema.encodeUnknownSync(Jwk.OctKey)(decoded);

                const reimported = yield* Effect.promise(() =>
                    crypto.subtle.importKey(
                        "jwk",
                        encoded as JsonWebKey,
                        {
                            name: "HMAC",
                            hash: "SHA-256",
                        },
                        true,
                        ["sign", "verify"],
                    ),
                );
                expect(reimported.type).toBe("secret");
            }),
        );

        it.effect("RSA public key can verify after schema round-trip", () =>
            Effect.gen(function* () {
                const pair = yield* generateRsaSsaKeyPair("RS256");
                const publicJwk = yield* exportJwk(pair.publicKey);

                // RsaPublicKey uses Schema.String (no transform), so round-trip is lossless
                const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk);
                const encoded = Schema.encodeUnknownSync(Jwk.RsaPublicKey)(decoded);

                // Re-import and verify a signature made with the original private key
                const payload = new TextEncoder().encode("test message");
                const signature = yield* Effect.promise(() =>
                    crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, pair.privateKey, payload),
                );

                const reimportedPublic = yield* Effect.promise(() =>
                    crypto.subtle.importKey(
                        "jwk",
                        encoded as JsonWebKey,
                        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
                        true,
                        ["verify"],
                    ),
                );

                const valid = yield* Effect.promise(() =>
                    crypto.subtle.verify(
                        {
                            name: "RSASSA-PKCS1-v1_5",
                        },
                        reimportedPublic,
                        signature,
                        payload,
                    ),
                );
                expect(valid).toBe(true);
            }),
        );

        it.effect("EC public key can verify after schema round-trip", () =>
            Effect.gen(function* () {
                const pair = yield* generateEcdsaKeyPair("ES256");
                const publicJwk = yield* exportJwk(pair.publicKey);

                // EcPublicKey uses Schema.String for x,y (no transform), so round-trip is lossless
                const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(publicJwk);
                const encoded = Schema.encodeUnknownSync(Jwk.EcPublicKey)(decoded);

                const payload = new TextEncoder().encode("test message");
                const signature = yield* Effect.promise(() =>
                    crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, pair.privateKey, payload),
                );

                const reimportedPublic = yield* Effect.promise(() =>
                    crypto.subtle.importKey(
                        "jwk",
                        encoded as JsonWebKey,
                        { name: "ECDSA", namedCurve: "P-256" },
                        true,
                        ["verify"],
                    ),
                );

                const valid = yield* Effect.promise(() =>
                    crypto.subtle.verify(
                        {
                            name: "ECDSA",
                            hash: "SHA-256",
                        },
                        reimportedPublic,
                        signature,
                        payload,
                    ),
                );
                expect(valid).toBe(true);
            }),
        );
    });

    describe("rejects structurally invalid JWKs", () => {
        it.effect('rejects missing "kty"', () =>
            Effect.gen(function* () {
                expect(() => Schema.decodeUnknownSync(Jwk.Jwk)({ n: "abc", e: "AQAB" })).toThrow();
            }),
        );

        it.effect('rejects unknown "kty"', () =>
            Effect.gen(function* () {
                expect(() => Schema.decodeUnknownSync(Jwk.Jwk)({ kty: "OKP" })).toThrow();
            }),
        );

        it.effect('rejects EC key missing "x"', () =>
            Effect.gen(function* () {
                expect(() =>
                    Schema.decodeUnknownSync(Jwk.EcPublicKey)({ kty: "EC", crv: "P-256", y: "abc" }),
                ).toThrow();
            }),
        );

        it.effect('rejects EC key missing "y"', () =>
            Effect.gen(function* () {
                expect(() =>
                    Schema.decodeUnknownSync(Jwk.EcPublicKey)({ kty: "EC", crv: "P-256", x: "abc" }),
                ).toThrow();
            }),
        );

        it.effect("rejects EC key with unknown curve", () =>
            Effect.gen(function* () {
                expect(() =>
                    Schema.decodeUnknownSync(Jwk.EcPublicKey)({
                        kty: "EC",
                        crv: "secp256k1",
                        x: "abc",
                        y: "def",
                    }),
                ).toThrow();
            }),
        );

        it.effect('rejects RSA key missing "n"', () =>
            Effect.gen(function* () {
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)({ kty: "RSA", e: "AQAB" })).toThrow();
            }),
        );

        it.effect('rejects RSA key missing "e"', () =>
            Effect.gen(function* () {
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)({ kty: "RSA", n: "abc" })).toThrow();
            }),
        );

        it.effect('rejects oct key missing "k"', () =>
            Effect.gen(function* () {
                expect(() => Schema.decodeUnknownSync(Jwk.OctKey)({ kty: "oct" })).toThrow();
            }),
        );

        it.effect("rejects EC key with wrong kty for RsaPublicKey schema", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateEcdsaKeyPair("ES256"));
                expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk)).toThrow();
            }),
        );

        it.effect("rejects RSA key with wrong kty for EcPublicKey schema", () =>
            Effect.gen(function* () {
                const { publicJwk } = yield* exportKeyPair(yield* generateRsaSsaKeyPair("RS256"));
                expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)(publicJwk)).toThrow();
            }),
        );
    });
});
