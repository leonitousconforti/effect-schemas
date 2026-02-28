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

import { Option, ParseResult, Schema } from "effect";

import { JoseHeader } from "./Jws.ts";

/**
 * A JSON string value, with the additional requirement that while arbitrary
 * string values MAY be used, any value containing a ":" character MUST be a URI
 * [RFC3986]. StringOrURI values are compared as case-sensitive strings with no
 * transformations or canonicalizations applied.
 *
 * @internal
 * @see https://www.rfc-editor.org/rfc/rfc7519#section-2
 */
const StringOrURI = Schema.String.pipe(
    Schema.filter((str) => {
        if (str.includes(":")) {
            const maybeUri = Schema.decodeOption(Schema.URL)(str);
            return Option.isSome(maybeUri);
        } else {
            return true;
        }
    }),
);

/**
 * A JSON numeric value representing the number of seconds from
 * 1970-01-01T00:00:00Z UTC until the specified UTC date/time, ignoring leap
 * seconds. This is equivalent to the IEEE Std 1003.1, 2013 Edition definition
 * "Seconds Since the Epoch".
 *
 * @internal
 * @see https://www.rfc-editor.org/rfc/rfc7519#section-2
 */
const NumericDate = Schema.transform(Schema.NonNegativeInt, Schema.DateTimeUtcFromNumber, {
    encode: (seconds) => seconds / 1000,
    decode: (seconds) => seconds * 1000,
});

/**
 * JOSE Header for JWS — re-exported from the Jws module for convenience.
 *
 * @since 1.0.0
 * @category JOSE Header
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-4
 */
export { JoseHeader } from "./Jws.ts";

/**
 * Registered Claim Names as defined in RFC 7519 Section 4.1. All claims are
 * optional per the specification.
 *
 * @since 1.0.0
 * @category JWT Claims
 * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1
 */
export const JwtRegisteredClaims = Schema.Struct({
    /**
     * Issuer claim, identifies the principal that issued the JWT.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1
     */
    issuer: StringOrURI.pipe(Schema.optional, Schema.fromKey("iss")),

    /**
     * Subject claim, identifies the principal that is the subject of the JWT.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2
     */
    subject: StringOrURI.pipe(Schema.optional, Schema.fromKey("sub")),

    /**
     * Audience claim, identifies the recipients that the JWT is intended for.
     * Can be a single StringOrURI or an array of StringOrURI values.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3
     */
    audience: Schema.Union(StringOrURI, Schema.Array(StringOrURI)).pipe(Schema.optional, Schema.fromKey("aud")),

    /**
     * Expiration time claim, identifies the expiration time on or after which
     * the JWT MUST NOT be accepted for processing.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4
     */
    expiration: NumericDate.pipe(Schema.optional, Schema.fromKey("exp")),

    /**
     * Not before claim, identifies the time before which the JWT MUST NOT be
     * accepted for processing.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5
     */
    notBefore: NumericDate.pipe(Schema.optional, Schema.fromKey("nbf")),

    /**
     * Issued at claim, identifies the time at which the JWT was issued.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6
     */
    issuedAt: NumericDate.pipe(Schema.optional, Schema.fromKey("iat")),

    /**
     * JWT id claim, provides a unique identifier for the JWT.
     *
     * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7
     */
    jwtId: Schema.String.pipe(Schema.optional, Schema.fromKey("jti")),
}).pipe(
    Schema.annotations({
        identifier: "JwtRegisteredClaims",
        title: "JWT Registered Claims",
        description: "Registered claim names as defined in RFC 7519 Section 4.1. All claims are OPTIONAL.",
    }),
);

/**
 * JWS Compact Serialization parser
 *
 * @since 1.0.0
 * @category JWT
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-3.1
 * @see https://www.rfc-editor.org/rfc/rfc7515#section-7.1
 */
export const SignedJwt = Schema.transformOrFail(
    Schema.TemplateLiteralParser(
        Schema.compose(Schema.StringFromBase64Url, Schema.parseJson(JoseHeader)),
        Schema.Literal("."),
        Schema.compose(Schema.StringFromBase64Url, Schema.parseJson(JwtRegisteredClaims)),
        Schema.Literal("."),
        Schema.String, // Signature is kept as base64url-encoded string
    ),
    Schema.Struct({
        /** The JOSE Header describing the cryptographic operations applied */
        header: Schema.typeSchema(JoseHeader),

        /** The JWT Claims Set (payload) */
        payload: Schema.typeSchema(JwtRegisteredClaims),

        /**
         * The raw base64url-encoded signature string Empty string for unsecured
         * JWTs (alg: "none")
         */
        signature: Schema.String,
    }),
    {
        strict: true,
        decode: ([header, _dot1, payload, _dot2, signature], _options, ast) => {
            // RFC 7515 Section 5.2: Message Signature or MAC Validation

            // Step 5: Verify that the implementation understands and can process
            // all fields that it is required to support
            if (header.crit !== undefined) {
                // Check if all critical headers are understood
                // Currently we don't support any critical extensions
                const unsupportedCritical = header.crit.filter(
                    (name) =>
                        !["alg", "jku", "jwk", "kid", "x5u", "x5c", "x5t", "x5t#S256", "typ", "cty"].includes(name),
                );

                if (unsupportedCritical.length > 0) {
                    return ParseResult.fail(
                        new ParseResult.Type(
                            ast,
                            { header, payload, signature },
                            `Critical header parameter(s) not understood: ${unsupportedCritical.join(", ")}`,
                        ),
                    );
                }
            }

            // For unsecured JWTs (alg: "none"), signature MUST be empty string
            // RFC 7515 Section 3.6 and RFC 7519 Section 6.1
            // if (header.alg === "none" && signature !== "") {
            //     return ParseResult.fail(
            //         new ParseResult.Type(
            //             ast,
            //             { header, payload, signature },
            //             "Unsecured JWTs (alg: 'none') MUST have an empty signature",
            //         ),
            //     );
            // }

            // TODO: Actual signature verification should be implemented here
            // This would require cryptographic keys and operations

            return ParseResult.succeed({
                header,
                payload,
                signature,
            });
        },
        encode: (input, _options, _ast) => {
            // Only unsecured JWTs (alg: "none") can be encoded without a key
            // if (input.header.alg !== "none") {
            //     return ParseResult.fail(
            //         new ParseResult.Forbidden(
            //             ast,
            //             input,
            //             "Encoding signed JWTs requires cryptographic operations. Use Jwt.sign() instead.",
            //         ),
            //     );
            // }
            return ParseResult.succeed([input.header, ".", input.payload, ".", ""] as const);
        },
    },
).pipe(
    Schema.annotations({
        identifier: "Jwt",
        title: "JSON Web Token",
        description:
            "A JSON Web Token in JWS Compact Serialization format: BASE64URL(Header).BASE64URL(Payload).BASE64URL(Signature)",
    }),
);

/**
 * OAuth 2.0 Token Response schema. Often used in conjunction with JWTs for
 * OpenID Connect flows
 *
 * @since 1.0.0
 * @category OAuth
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.1
 */
export const OAuthTokenResponse = Schema.Struct({
    /** The access token issued by the authorization server. */
    accessToken: Schema.Redacted(Schema.String).pipe(
        Schema.annotations({ description: "The access token issued by the authorization server" }),
        Schema.propertySignature,
        Schema.fromKey("access_token"),
    ),

    /** The type of the token issued (e.g., "Bearer"). */
    tokenType: Schema.String.pipe(
        Schema.annotations({ description: "The type of the token issued" }),
        Schema.propertySignature,
        Schema.fromKey("token_type"),
    ),

    /** The lifetime in seconds of the access token. */
    expiresIn: Schema.Int.pipe(
        Schema.annotations({ description: "The lifetime in seconds of the access token" }),
        Schema.optional,
        Schema.fromKey("expires_in"),
    ),

    /** The refresh token, which can be used to obtain new access tokens. */
    refreshToken: Schema.Redacted(Schema.String).pipe(
        Schema.annotations({ description: "The refresh token, which can be used to obtain new access tokens" }),
        Schema.optional,
        Schema.fromKey("refresh_token"),
    ),

    /** The scope of the access token. */
    scope: Schema.String.pipe(
        Schema.annotations({ description: "The scope of the access token" }),
        Schema.optional,
        Schema.fromKey("scope"),
    ),

    /**
     * ID Token value for OpenID Connect flows. This is a JWT containing claims
     * about the authentication.
     */
    idToken: SignedJwt.pipe(
        Schema.annotations({ description: "ID Token value (JWT) for OpenID Connect flows" }),
        Schema.optional,
        Schema.fromKey("id_token"),
    ),
}).pipe(
    Schema.annotations({
        identifier: "OAuthTokenResponse",
        title: "OAuth 2.0 Token Response",
        description: "Response from an OAuth 2.0 token endpoint",
    }),
);
