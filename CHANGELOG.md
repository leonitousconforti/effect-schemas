# Changelog

## 0.0.24

### Patch Changes

- debc8ee: Update Effect-TS packages to v4.0.0-beta.105

## 0.0.23

### Patch Changes

- b1f5dd2: Reject non-finite numbers in Geography and Internet schemas

  `Latitude` and `Longitude` are now branded off `Schema.Finite` instead of `Schema.Number`, and
  the template literal schemas `PortWithMaybeProtocol`, `IPv4CidrBlockFromString`,
  `IPv6CidrBlockFromString` and `CidrBlockFromString` interpolate `Schema.Finite` in their number
  positions. This resolves the `effect(schemaNumber)` diagnostics from `pnpm check`.

  `NaN`, `Infinity` and `-Infinity` were already rejected by the range checks on `Latitude` and
  `Longitude`, so no valid inputs are affected; the finiteness is now just explicit in the types.

## 0.0.22

### Patch Changes

- fc0e0a8: Tighten a few public type signatures

  `cidrBlockForRange` no longer takes an `Input` type parameter. It was used once, in the
  parameter position, and never referenced by the return type, so the union it was constrained to
  is now spelled directly on `inputs`. Calls are unaffected.

  The `annotations` parameter of `isBic`, `isEthereumAddress`, `isBitcoinAddress`, `isLatitude`,
  `isLongitude`, `isPostalCode`, `isAscii`, `isAlphanumeric`, `isHexadecimal` and `isOctal` is
  declared `annotations?: Schema.Annotations.Filter` rather than
  `annotations?: Schema.Annotations.Filter | undefined`. Passing `undefined` explicitly still
  works; under `exactOptionalPropertyTypes` the two spellings already meant the same thing here.

  No runtime behaviour changed.

## 0.0.21

### Patch Changes

- a3fcb41: Update Effect-TS packages to v4.0.0-beta.104

## 0.0.20

### Patch Changes

- d867e03: Update Effect-TS packages to v4.0.0-beta.103

## 0.0.19

### Patch Changes

- a5b5550: Update effect deps

## 0.0.18

### Patch Changes

- 52af81d: update deps

## 0.0.17

### Patch Changes

- 144e50c: Update dependency effect to v4.0.0-beta.100

## 0.0.16

### Patch Changes

- dac3880: Update dependency effect to v4.0.0-beta.99

## 0.0.15

### Patch Changes

- a3d7308: Update dependency effect to v4.0.0-beta.98

## 0.0.14

### Patch Changes

- 86ee706: Bump dependencies
