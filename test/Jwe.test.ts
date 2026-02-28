import { describe, expect, it } from "@effect/vitest";

import { Effect, Exit, Schema } from "effect";
import { Jwe } from "effect-schemas";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate an RSA-OAEP CryptoKeyPair. */
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
            ["wrapKey", "unwrapKey"],
        ),
    );

const textDecoder = new TextDecoder();

// ---------------------------------------------------------------------------
// Round-trip: encrypt → decrypt
// ---------------------------------------------------------------------------

describe("JWE Compact Serialization – encrypt / decrypt", () => {
    const algorithms = [
        { alg: "RSA-OAEP" as const, hash: "SHA-1" as const },
        { alg: "RSA-OAEP-256" as const, hash: "SHA-256" as const },
    ];

    const encAlgorithms = [
        "A128GCM" as const,
        "A192GCM" as const,
        "A256GCM" as const,
        "A128CBC-HS256" as const,
        "A192CBC-HS384" as const,
        "A256CBC-HS512" as const,
    ];

    for (const { alg, hash } of algorithms) {
        for (const enc of encAlgorithms) {
            it.effect.only(`round-trip: ${alg} + ${enc}`, () =>
                Effect.gen(function* () {
                    const keyPair = yield* generateRsaOaepKeyPair(hash);
                    const plaintext = "Hello, JWE world!";

                    const token = yield* Jwe.encrypt(plaintext, keyPair.publicKey, { alg, enc });
                    const result = yield* Jwe.decrypt(token, keyPair.privateKey);

                    expect(result).toBe(plaintext);
                }),
            );
        }
    }

    it.effect("round-trip with binary plaintext", () =>
        Effect.gen(function* () {
            const keyPair = yield* generateRsaOaepKeyPair("SHA-256");
            const plaintext = new Uint8Array([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);

            const token = yield* Jwe.encrypt(plaintext, keyPair.publicKey, {
                alg: "RSA-OAEP-256",
                enc: "A256GCM",
            });
            const result = yield* Jwe.decrypt(token, keyPair.privateKey);

            expect(result.plaintext).toEqual(plaintext);
        }),
    );

    it.effect("includes extra headers in protected header", () =>
        Effect.gen(function* () {
            const keyPair = yield* generateRsaOaepKeyPair("SHA-256");

            const token = yield* Jwe.encrypt("test", keyPair.publicKey, {
                alg: "RSA-OAEP-256",
                enc: "A128GCM",
                extraHeaders: { kid: "my-key-id", typ: "JWT", cty: "JWT" },
            });
            const result = yield* Jwe.decrypt(token, keyPair.privateKey);

            expect(result.header.kid).toBe("my-key-id");
            expect(result.header.typ).toBe("JWT");
            expect(result.header.cty).toBe("JWT");
        }),
    );

    it.effect("produces valid compact serialization (5 dot-separated parts)", () =>
        Effect.gen(function* () {
            const keyPair = yield* generateRsaOaepKeyPair("SHA-256");
            const token = yield* Jwe.encrypt("payload", keyPair.publicKey, {
                alg: "RSA-OAEP-256",
                enc: "A256GCM",
            });
            const parts = token.split(".");
            expect(parts.length).toBe(5);
            // Each part should be non-empty
            for (const part of parts) {
                expect(part.length).toBeGreaterThan(0);
            }
        }),
    );

    it.effect("schema can parse the encrypted token", () =>
        Effect.gen(function* () {
            const keyPair = yield* generateRsaOaepKeyPair("SHA-256");
            const token = yield* Jwe.encrypt("schema test", keyPair.publicKey, {
                alg: "RSA-OAEP-256",
                enc: "A256GCM",
            });

            // The token should be parseable by the JweCompactSerialization schema
            const decoded = Schema.decodeUnknownSync(Jwe.JweCompactSerialization)(token);
            expect(decoded.protected.alg).toBe("RSA-OAEP-256");
            expect(decoded.protected.enc).toBe("A256GCM");
        }),
    );
});

// ---------------------------------------------------------------------------
// Error cases
// ---------------------------------------------------------------------------

describe("JWE Compact Serialization – error cases", () => {
    it.effect("decrypt fails with wrong private key", () =>
        Effect.gen(function* () {
            const keyPair1 = yield* generateRsaOaepKeyPair("SHA-256");
            const keyPair2 = yield* generateRsaOaepKeyPair("SHA-256");

            const token = yield* Jwe.encrypt("secret", keyPair1.publicKey, {
                alg: "RSA-OAEP-256",
                enc: "A256GCM",
            });

            const result = yield* Jwe.decrypt(token, keyPair2.privateKey).pipe(Effect.exit);

            expect(Exit.isFailure(result)).toBe(true);
        }),
    );

    it.effect("decrypt fails with tampered ciphertext", () =>
        Effect.gen(function* () {
            const keyPair = yield* generateRsaOaepKeyPair("SHA-256");

            const token = yield* Jwe.encrypt("secret", keyPair.publicKey, {
                alg: "RSA-OAEP-256",
                enc: "A256GCM",
            });

            // Tamper with the ciphertext (4th part)
            const parts = token.split(".");
            const ciphertextBytes = Uint8Array.from(atob(parts[3].replace(/-/g, "+").replace(/_/g, "/")), (c) =>
                c.charCodeAt(0),
            );
            ciphertextBytes[0] ^= 0xff; // flip bits
            const tamperedB64 = btoa(String.fromCharCode(...ciphertextBytes))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");
            parts[3] = tamperedB64;
            const tamperedToken = parts.join(".");

            const result = yield* Jwe.decrypt(tamperedToken, keyPair.privateKey).pipe(Effect.exit);

            expect(Exit.isFailure(result)).toBe(true);
        }),
    );

    it("decrypt rejects invalid compact serialization (wrong number of parts)", () => {
        expect(() => Effect.runSync(Jwe.decrypt("a.b.c", {} as CryptoKey))).toThrow(/expected 5 parts/);
    });
});

// ---------------------------------------------------------------------------
// Existing schema parsing (regression)
// ---------------------------------------------------------------------------

describe("JWE Compact Serialization – schema parsing", () => {
    it("parses the playground token", () => {
        const token =
            "eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZDQkMtSFM1MTIiLCJraWQiOiIxOGIxY2Y3NThjMWQ0ZWM2YmRhNjU4OTM1N2FiZGQ4NSIsInR5cCI6IkpXVCIsImN0eSI6IkpXVCJ9.gCbxP78o3DgpDTUQbuHniuGgYpATqgGkRGy7paC6hRrz7N7eIa6sAOWDO9Fhnj-c8ocMl4cF4Jb_mv5qRPCh9r57PBqx7jOhMIMPTwJGpjcyBaqtHlZlu1vupY5tQ3Y2jGz1Ti4BnywaeEHPyIPQJtN7F7hIAORzj7IY4sIKkVXtQJZgaKW8pEHq_GCqj8i5aaiM0uJnRG3GOh3livp9Npjv9doqp3gyPa1zjrg2H1RsOGn0j2QMGvtuVfkuNwF-SoPKFECyHOq0ZK1oH2sTO8-JwvHflbIZQr5xWTpS8q7MbUXEuqURtrg0Tj-2z6tdaOLT4b3UeDufK2ar3bBfRD4-nRALtoY0ekcMyGFOS7o1Mxl3hy5sIG-EySyWeuBVy68aDWDpi9qZoQuY1TbxxakjncCOGu_Gh1l1m_mK2l_IdyXCT_GCfzFq4ZTkPZ5eydNBAPZuxBLUb4BrMb5iDdZjT7AgGOlRre_wIRHmmKm8W9nDeQQRmbIXO23JuOw9.BDCarfq2r_Uk8DHNfsNwSQ.4DuQx1cfJXadHnudrVaBss45zxyd6iouuSzZUyOeM4ikF_7hDOgwmaCma-Z97_QZBJ5DzVn9SJhKUTAqpVR3BRGAxJ_HAXU5jaTjXqbvUaxsh7Z5TgZ9eck0FIoe1lkwv51xEvYqqQ_Xojr4MAEmLuME_9ArCK9mNaMADIzOj4VoQtaDP1l26ytocc-oENifBRYGu28LbJLkyQKzyQy6FuAOtWjLM0WCXV7-o_dvj6qfeYHNBD7YBSxyqdgD8dcxMBNd2sK73YsZPHEa0V1-8zz7hm3bH3tZelpwPWScqLLW_SUH586c0FVeI6ggvqzjfLZ_Y6eQibVSdXfOtJBk22QrLsuCXbRK8G1w9t23Pwu8ukUAw4v0l7HeaW_0SJyKSPQANRP83MyFbK7fmzTYaW9TYN2JrKN-PLpd2dIFSm2Ga_EfaCwNJBm4RDMzDNrf-O0AissvYyHb0WaALiCiFCogliYqLzRB6xDb-b4964M.J7WDOFLRRPJ7lLpTfN2mOiXLDg5xtaF-sLQ4mOeN5oc";
        const decoded = Schema.decodeUnknownSync(Jwe.JweCompactSerialization)(token);
        expect(decoded.protected.alg).toBe("RSA-OAEP");
        expect(decoded.protected.enc).toBe("A256CBC-HS512");
        expect(decoded.protected.kid).toBe("18b1cf758c1d4ec6bda6589357abdd85");
        expect(decoded.protected.typ).toBe("JWT");
        expect(decoded.protected.cty).toBe("JWT");
    });
});
