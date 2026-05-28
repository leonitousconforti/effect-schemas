---
title: Person.ts
nav_order: 6
parent: Modules
---

## Person.ts overview

Person related schemas and filters

Since v1.0.0

---

## Exports Grouped by Category

- [Person Schemas](#person-schemas)
  - [FirstName](#firstname)
  - [LastName](#lastname)
  - [MiddleName](#middlename)
  - [Name](#name)
  - [Sex](#sex)

---

# Person Schemas

## FirstName

**Signature**

```ts
declare const FirstName: Schema.brand<Schema.String, "FirstName">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Person.ts#L19)

Since v1.0.0

## LastName

**Signature**

```ts
declare const LastName: Schema.brand<Schema.String, "LastName">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Person.ts#L43)

Since v1.0.0

## MiddleName

**Signature**

```ts
declare const MiddleName: Schema.brand<Schema.String, "MiddleName">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Person.ts#L31)

Since v1.0.0

## Name

**Signature**

```ts
declare const Name: Schema.brand<Schema.String, "Name">
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Person.ts#L55)

Since v1.0.0

## Sex

**Signature**

```ts
declare const Sex: Schema.Literals<readonly ["male", "female"]>
```

[Source](https://github.com/leonitousconforti/effect-schemas/tree/main/src/Person.ts#L13)

Since v1.0.0
