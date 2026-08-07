---
"effect-schemas": patch
---

Reject non-finite numbers in Geography and Internet schemas

`Latitude` and `Longitude` are now branded off `Schema.Finite` instead of `Schema.Number`, and
the template literal schemas `PortWithMaybeProtocol`, `IPv4CidrBlockFromString`,
`IPv6CidrBlockFromString` and `CidrBlockFromString` interpolate `Schema.Finite` in their number
positions. This resolves the `effect(schemaNumber)` diagnostics from `pnpm check`.

`NaN`, `Infinity` and `-Infinity` were already rejected by the range checks on `Latitude` and
`Longitude`, so no valid inputs are affected; the finiteness is now just explicit in the types.
