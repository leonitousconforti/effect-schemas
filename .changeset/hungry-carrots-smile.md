---
"effect-schemas": patch
---

Tighten a few public type signatures

`cidrBlockForRange` no longer takes an `Input` type parameter. It was used once, in the
parameter position, and never referenced by the return type, so the union it was constrained to
is now spelled directly on `inputs`. Calls are unaffected.

The `annotations` parameter of `isBic`, `isEthereumAddress`, `isBitcoinAddress`, `isLatitude`,
`isLongitude`, `isPostalCode`, `isAscii`, `isAlphanumeric`, `isHexadecimal` and `isOctal` is
declared `annotations?: Schema.Annotations.Filter` rather than
`annotations?: Schema.Annotations.Filter | undefined`. Passing `undefined` explicitly still
works; under `exactOptionalPropertyTypes` the two spellings already meant the same thing here.

No runtime behaviour changed.
