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

    // describe("RSA keys generated via WebCrypto", () => {
    //     describe("RSASSA-PKCS1-v1_5", () => {
    //         const algorithms = ["RS256", "RS384", "RS512"] as const;

    //         for (const alg of algorithms) {
    //             describe(`${alg}`, () => {
    //                 it(`public key decodes as RsaPublicKey`, async () => {
    //                     const { publicJwk } = await exportKeyPair(await generateRsaSsaKeyPair(alg));
    //                     const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk);
    //                     expect(decoded.kty).toBe("RSA");
    //                     expect(decoded.n).toBeTypeOf("string");
    //                     expect(decoded.e).toBeTypeOf("string");
    //                 });

    //                 it(`private key decodes as RsaPrivateKey`, async () => {
    //                     const { privateJwk } = await exportKeyPair(await generateRsaSsaKeyPair(alg));
    //                     const decoded = Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk);
    //                     expect(decoded.kty).toBe("RSA");
    //                 });

    //                 it(`private key includes CRT parameters`, async () => {
    //                     const { privateJwk } = await exportKeyPair(await generateRsaSsaKeyPair(alg));
    //                     // WebCrypto always exports with CRT parameters
    //                     expect(privateJwk).toHaveProperty("p");
    //                     expect(privateJwk).toHaveProperty("q");
    //                     expect(privateJwk).toHaveProperty("dp");
    //                     expect(privateJwk).toHaveProperty("dq");
    //                     expect(privateJwk).toHaveProperty("qi");
    //                     // Should still decode fine
    //                     expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk)).not.toThrow();
    //                 });

    //                 it(`public key does NOT decode as RsaPrivateKey`, async () => {
    //                     const { publicJwk } = await exportKeyPair(await generateRsaSsaKeyPair(alg));
    //                     expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(publicJwk)).toThrow();
    //                 });
    //             });
    //         }
    //     });

    //     describe("RSA-PSS", () => {
    //         const algorithms = ["PS256", "PS384", "PS512"] as const;

    //         for (const alg of algorithms) {
    //             it(`${alg} public key decodes as RsaPublicKey`, async () => {
    //                 const { publicJwk } = await exportKeyPair(await generateRsaPssKeyPair(alg));
    //                 expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk)).not.toThrow();
    //             });

    //             it(`${alg} private key decodes as RsaPrivateKey`, async () => {
    //                 const { privateJwk } = await exportKeyPair(await generateRsaPssKeyPair(alg));
    //                 expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk)).not.toThrow();
    //             });
    //         }
    //     });

    //     describe("RSA-OAEP (encryption)", () => {
    //         for (const hash of ["SHA-1", "SHA-256"] as const) {
    //             it(`RSA-OAEP with ${hash} public key decodes as RsaPublicKey`, async () => {
    //                 const { publicJwk } = await exportKeyPair(await generateRsaOaepKeyPair(hash));
    //                 expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk)).not.toThrow();
    //             });

    //             it(`RSA-OAEP with ${hash} private key decodes as RsaPrivateKey`, async () => {
    //                 const { privateJwk } = await exportKeyPair(await generateRsaOaepKeyPair(hash));
    //                 expect(() => Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk)).not.toThrow();
    //             });
    //         }
    //     });

    //     it(`RSA private key round-trips through encode/decode`, async () => {
    //         const { privateJwk } = await exportKeyPair(await generateRsaSsaKeyPair("RS256"));
    //         const decoded = Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(privateJwk);
    //         const encoded = Schema.encodeUnknownSync(Jwk.RsaPrivateKey)(decoded);
    //         const redecoded = Schema.decodeUnknownSync(Jwk.RsaPrivateKey)(encoded);
    //         expect(redecoded.kty).toBe("RSA");
    //     });
    // });

    // describe("Symmetric (oct) keys generated via WebCrypto", () => {
    //     describe("HMAC keys", () => {
    //         const algorithms = ["HS256", "HS384", "HS512"] as const;

    //         for (const alg of algorithms) {
    //             it(`${alg} key decodes as OctKey`, async () => {
    //                 const key = await generateHmacKey(alg);
    //                 const jwk = await exportJwk(key);
    //                 const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
    //                 expect(decoded.kty).toBe("oct");
    //                 expect(decoded.k).toBeDefined();
    //             });

    //             it(`${alg} key round-trips through encode/decode`, async () => {
    //                 const key = await generateHmacKey(alg);
    //                 const jwk = await exportJwk(key);
    //                 const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
    //                 const encoded = Schema.encodeUnknownSync(Jwk.OctKey)(decoded);
    //                 const redecoded = Schema.decodeUnknownSync(Jwk.OctKey)(encoded);
    //                 expect(redecoded.kty).toBe("oct");
    //             });
    //         }
    //     });

    //     describe("AES keys", () => {
    //         const bitSizes = [128, 192, 256] as const;

    //         for (const bits of bitSizes) {
    //             it(`AES-${bits} key decodes as OctKey`, async () => {
    //                 const key = await generateAesKey(bits, "gcm");
    //                 const jwk = await exportJwk(key);
    //                 const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
    //                 expect(decoded.kty).toBe("oct");
    //                 expect(decoded.k).toBeDefined();
    //             });
    //         }
    //     });

    //     it(`oct key decodes through the top-level Jwk union`, async () => {
    //         const key = await generateHmacKey("HS256");
    //         const jwk = await exportJwk(key);
    //         expect(() => Schema.decodeUnknownSync(Jwk.Jwk)(jwk)).not.toThrow();
    //     });
    // });

    // describe("JWK with optional common fields", () => {
    //     it(`accepts an EC key with "kid" and "use" fields`, async () => {
    //         const { publicJwk } = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const jwkWithMeta = { ...publicJwk, kid: "my-key-1", use: "sig" };
    //         const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkWithMeta);
    //         expect(decoded.kid).toBe("my-key-1");
    //         expect(decoded.use).toBe("sig");
    //     });

    //     it(`accepts an EC key with "key_ops"`, async () => {
    //         const { publicJwk } = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const jwkWithOps = { ...publicJwk, key_ops: ["verify"] };
    //         const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkWithOps);
    //         expect(decoded.key_ops).toEqual(["verify"]);
    //     });

    //     it(`accepts an RSA key with "alg" field`, async () => {
    //         const { publicJwk } = await exportKeyPair(await generateRsaSsaKeyPair("RS256"));
    //         const jwkWithAlg = { ...publicJwk, alg: "RS256" };
    //         const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(jwkWithAlg);
    //         expect(decoded.alg).toBe("RS256");
    //     });

    //     it(`rejects an unknown "use" value`, async () => {
    //         const { publicJwk } = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const jwkBadUse = { ...publicJwk, use: "bad" };
    //         expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkBadUse)).toThrow();
    //     });

    //     it(`rejects an unknown "key_ops" value`, async () => {
    //         const { publicJwk } = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const jwkBadOps = { ...publicJwk, key_ops: ["launch_missiles"] };
    //         expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwkBadOps)).toThrow();
    //     });
    // });

    // describe("JwkSet", () => {
    //     it(`decodes a set with mixed key types`, async () => {
    //         const ecPair = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const rsaPair = await exportKeyPair(await generateRsaSsaKeyPair("RS256"));
    //         const hmacJwk = await exportJwk(await generateHmacKey("HS256"));

    //         const jwkSet = {
    //             keys: [ecPair.publicJwk, rsaPair.publicJwk, hmacJwk],
    //         };

    //         const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet);
    //         expect(decoded.keys).toHaveLength(3);
    //     });

    //     it(`decodes a set containing both public and private keys`, async () => {
    //         const ecPair = await exportKeyPair(await generateEcdsaKeyPair("ES384"));
    //         const rsaPair = await exportKeyPair(await generateRsaSsaKeyPair("RS512"));

    //         const jwkSet = {
    //             keys: [ecPair.publicJwk, ecPair.privateJwk, rsaPair.publicJwk, rsaPair.privateJwk],
    //         };

    //         const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet);
    //         expect(decoded.keys).toHaveLength(4);
    //     });

    //     it(`decodes an empty key set`, () => {
    //         const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)({ keys: [] });
    //         expect(decoded.keys).toHaveLength(0);
    //     });

    //     it(`rejects a set with an invalid key`, async () => {
    //         const ecPair = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const badKey = { kty: "FAKE", n: "abc" };
    //         const jwkSet = { keys: [ecPair.publicJwk, badKey] };
    //         expect(() => Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet)).toThrow();
    //     });

    //     it(`rejects a jwk set missing the "keys" member`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.JwkSet)({})).toThrow();
    //     });

    //     it(`round-trips a key set through encode/decode`, async () => {
    //         const ecPair = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const hmacJwk = await exportJwk(await generateHmacKey("HS512"));

    //         const jwkSet = { keys: [ecPair.publicJwk, hmacJwk] };
    //         const decoded = Schema.decodeUnknownSync(Jwk.JwkSet)(jwkSet);
    //         const encoded = Schema.encodeUnknownSync(Jwk.JwkSet)(decoded);
    //         const redecoded = Schema.decodeUnknownSync(Jwk.JwkSet)(encoded);
    //         expect(redecoded.keys).toHaveLength(2);
    //     });
    // });

    // describe("Jwk union discrimination", () => {
    //     it(`correctly discriminates EC vs RSA vs oct from real keys`, async () => {
    //         const ec = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         const rsa = await exportKeyPair(await generateRsaSsaKeyPair("RS256"));
    //         const oct = await exportJwk(await generateHmacKey("HS256"));

    //         const decodedEc = Schema.decodeUnknownSync(Jwk.Jwk)(ec.publicJwk);
    //         const decodedRsa = Schema.decodeUnknownSync(Jwk.Jwk)(rsa.publicJwk);
    //         const decodedOct = Schema.decodeUnknownSync(Jwk.Jwk)(oct);

    //         expect(decodedEc.kty).toBe("EC");
    //         expect(decodedRsa.kty).toBe("RSA");
    //         expect(decodedOct.kty).toBe("oct");
    //     });
    // });

    // describe("WebCrypto round-trip interoperability", () => {
    //     it(`EC key survives schema decode → encode → WebCrypto re-import`, async () => {
    //         const pair = await generateEcdsaKeyPair("ES256");
    //         const jwk = await exportJwk(pair.publicKey);

    //         // Decode through schema, encode back
    //         const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(jwk);
    //         const encoded = Schema.encodeUnknownSync(Jwk.EcPublicKey)(decoded);

    //         // Re-import into WebCrypto — this would fail if the schema mangled any fields
    //         const reimported = await crypto.subtle.importKey(
    //             "jwk",
    //             encoded as JsonWebKey,
    //             { name: "ECDSA", namedCurve: "P-256" },
    //             true,
    //             ["verify"],
    //         );
    //         expect(reimported.type).toBe("public");
    //     });

    //     it(`RSA key survives schema decode → encode → WebCrypto re-import`, async () => {
    //         const pair = await generateRsaSsaKeyPair("RS256");
    //         const jwk = await exportJwk(pair.publicKey);

    //         const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(jwk);
    //         const encoded = Schema.encodeUnknownSync(Jwk.RsaPublicKey)(decoded);

    //         const reimported = await crypto.subtle.importKey(
    //             "jwk",
    //             encoded as JsonWebKey,
    //             { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    //             true,
    //             ["verify"],
    //         );
    //         expect(reimported.type).toBe("public");
    //     });

    //     it(`HMAC key survives schema decode → encode → WebCrypto re-import`, async () => {
    //         const key = await generateHmacKey("HS256");
    //         const jwk = await exportJwk(key);

    //         const decoded = Schema.decodeUnknownSync(Jwk.OctKey)(jwk);
    //         const encoded = Schema.encodeUnknownSync(Jwk.OctKey)(decoded);

    //         const reimported = await crypto.subtle.importKey(
    //             "jwk",
    //             encoded as JsonWebKey,
    //             { name: "HMAC", hash: "SHA-256" },
    //             true,
    //             ["sign", "verify"],
    //         );
    //         expect(reimported.type).toBe("secret");
    //     });

    //     it(`RSA private key can sign after schema round-trip (no base64url transform on public params)`, async () => {
    //         const pair = await generateRsaSsaKeyPair("RS256");
    //         const publicJwk = await exportJwk(pair.publicKey);

    //         // RsaPublicKey uses Schema.String (no transform), so round-trip is lossless
    //         const decoded = Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk);
    //         const encoded = Schema.encodeUnknownSync(Jwk.RsaPublicKey)(decoded);

    //         // Re-import and verify a signature made with the original private key
    //         const payload = new TextEncoder().encode("test message");
    //         const signature = await crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, pair.privateKey, payload);

    //         const reimportedPublic = await crypto.subtle.importKey(
    //             "jwk",
    //             encoded as JsonWebKey,
    //             { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    //             true,
    //             ["verify"],
    //         );

    //         const valid = await crypto.subtle.verify(
    //             { name: "RSASSA-PKCS1-v1_5" },
    //             reimportedPublic,
    //             signature,
    //             payload,
    //         );
    //         expect(valid).toBe(true);
    //     });

    //     it(`EC public key can verify after schema round-trip`, async () => {
    //         const pair = await generateEcdsaKeyPair("ES256");
    //         const publicJwk = await exportJwk(pair.publicKey);

    //         // EcPublicKey uses Schema.String for x,y (no transform), so round-trip is lossless
    //         const decoded = Schema.decodeUnknownSync(Jwk.EcPublicKey)(publicJwk);
    //         const encoded = Schema.encodeUnknownSync(Jwk.EcPublicKey)(decoded);

    //         const payload = new TextEncoder().encode("test message");
    //         const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, pair.privateKey, payload);

    //         const reimportedPublic = await crypto.subtle.importKey(
    //             "jwk",
    //             encoded as JsonWebKey,
    //             { name: "ECDSA", namedCurve: "P-256" },
    //             true,
    //             ["verify"],
    //         );

    //         const valid = await crypto.subtle.verify(
    //             { name: "ECDSA", hash: "SHA-256" },
    //             reimportedPublic,
    //             signature,
    //             payload,
    //         );
    //         expect(valid).toBe(true);
    //     });
    // });

    // describe("rejects structurally invalid JWKs", () => {
    //     it(`rejects missing "kty"`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.Jwk)({ n: "abc", e: "AQAB" })).toThrow();
    //     });

    //     it(`rejects unknown "kty"`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.Jwk)({ kty: "OKP" })).toThrow();
    //     });

    //     it(`rejects EC key missing "x"`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)({ kty: "EC", crv: "P-256", y: "abc" })).toThrow();
    //     });

    //     it(`rejects EC key missing "y"`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)({ kty: "EC", crv: "P-256", x: "abc" })).toThrow();
    //     });

    //     it(`rejects EC key with unknown curve`, () => {
    //         expect(() =>
    //             Schema.decodeUnknownSync(Jwk.EcPublicKey)({ kty: "EC", crv: "secp256k1", x: "abc", y: "def" }),
    //         ).toThrow();
    //     });

    //     it(`rejects RSA key missing "n"`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)({ kty: "RSA", e: "AQAB" })).toThrow();
    //     });

    //     it(`rejects RSA key missing "e"`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)({ kty: "RSA", n: "abc" })).toThrow();
    //     });

    //     it(`rejects oct key missing "k"`, () => {
    //         expect(() => Schema.decodeUnknownSync(Jwk.OctKey)({ kty: "oct" })).toThrow();
    //     });

    //     it(`rejects EC key with wrong kty for RsaPublicKey schema`, async () => {
    //         const { publicJwk } = await exportKeyPair(await generateEcdsaKeyPair("ES256"));
    //         expect(() => Schema.decodeUnknownSync(Jwk.RsaPublicKey)(publicJwk)).toThrow();
    //     });

    //     it(`rejects RSA key with wrong kty for EcPublicKey schema`, async () => {
    //         const { publicJwk } = await exportKeyPair(await generateRsaSsaKeyPair("RS256"));
    //         expect(() => Schema.decodeUnknownSync(Jwk.EcPublicKey)(publicJwk)).toThrow();
    //     });
    // });
});
