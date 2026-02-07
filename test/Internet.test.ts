import { describe, expect, it } from "@effect/vitest";

import { Array, Chunk, Effect, Schema, Stream } from "effect";
import { Internet } from "effect-schemas";

describe("Internet tests", () => {
    describe("Port", () => {
        it("accepts valid port numbers", () => {
            expect(Schema.decodeSync(Internet.Port)(0)).toBe(0);
            expect(Schema.decodeSync(Internet.Port)(80)).toBe(80);
            expect(Schema.decodeSync(Internet.Port)(443)).toBe(443);
            expect(Schema.decodeSync(Internet.Port)(8080)).toBe(8080);
            expect(Schema.decodeSync(Internet.Port)(65535)).toBe(65535);
        });

        it("rejects invalid port numbers", () => {
            expect(() => Schema.decodeSync(Internet.Port)(-1)).toThrow();
            expect(() => Schema.decodeSync(Internet.Port)(65536)).toThrow();
            expect(() => Schema.decodeSync(Internet.Port)(100000)).toThrow();
        });

        it("rejects non-integer values", () => {
            expect(() => Schema.decodeSync(Internet.Port)(80.5)).toThrow();
        });
    });

    describe("PortWithMaybeProtocol", () => {
        it("accepts port without protocol", () => {
            const { port, protocol } = Schema.decodeSync(Internet.PortWithMaybeProtocol)("8080");
            expect(port).toBe(8080);
            expect(protocol).toBeUndefined();
        });

        it("accepts port with tcp protocol", () => {
            const { port, protocol } = Schema.decodeSync(Internet.PortWithMaybeProtocol)("8080/tcp");
            expect(port).toBe(8080);
            expect(protocol).toBe("tcp");
        });

        it("accepts port with udp protocol", () => {
            const { port, protocol } = Schema.decodeSync(Internet.PortWithMaybeProtocol)("53/udp");
            expect(port).toBe(53);
            expect(protocol).toBe("udp");
        });

        it("rejects invalid protocols", () => {
            expect(() => Schema.decodeUnknownSync(Internet.PortWithMaybeProtocol)("8080/icmp")).toThrow();
        });

        it("rejects invalid port numbers", () => {
            expect(() => Schema.decodeSync(Internet.PortWithMaybeProtocol)("70000")).toThrow();
            expect(() => Schema.decodeSync(Internet.PortWithMaybeProtocol)("70000/tcp")).toThrow();
        });

        it("encodes back to string", () => {
            const decoded = Schema.decodeSync(Internet.PortWithMaybeProtocol)("8080/tcp");
            const encoded = Schema.encodeSync(Internet.PortWithMaybeProtocol)(decoded);
            expect(encoded).toBe("8080/tcp");
        });
    });

    describe("MacAddress", () => {
        it("accepts valid MAC addresses with colons", () => {
            expect(Schema.decodeSync(Internet.MacAddress)("00:1A:2B:3C:4D:5E")).toBe("00:1A:2B:3C:4D:5E");
            expect(Schema.decodeSync(Internet.MacAddress)("aa:bb:cc:dd:ee:ff")).toBe("aa:bb:cc:dd:ee:ff");
        });

        it("accepts valid MAC addresses with hyphens", () => {
            expect(Schema.decodeSync(Internet.MacAddress)("00-1A-2B-3C-4D-5E")).toBe("00-1A-2B-3C-4D-5E");
        });

        it("rejects invalid MAC addresses", () => {
            expect(() => Schema.decodeSync(Internet.MacAddress)("00:1A:2B:3C:4D")).toThrow();
            expect(() => Schema.decodeSync(Internet.MacAddress)("00:1A:2B:3C:4D:5E:FF")).toThrow();
            expect(() => Schema.decodeSync(Internet.MacAddress)("GG:1A:2B:3C:4D:5E")).toThrow();
            expect(() => Schema.decodeSync(Internet.MacAddress)("not-a-mac")).toThrow();
        });
    });

    describe("IPv4", () => {
        it("accepts valid IPv4 addresses", () => {
            expect(Schema.decodeSync(Internet.IPv4)("192.168.1.1")).toEqual({ family: "ipv4", ip: "192.168.1.1" });
            expect(Schema.decodeSync(Internet.IPv4)("0.0.0.0")).toEqual({ family: "ipv4", ip: "0.0.0.0" });
            expect(Schema.decodeSync(Internet.IPv4)("1.1.1.1")).toEqual({ family: "ipv4", ip: "1.1.1.1" });
            expect(Schema.decodeSync(Internet.IPv4)("255.255.255.255")).toEqual({
                family: "ipv4",
                ip: "255.255.255.255",
            });
        });

        it("rejects invalid IPv4 addresses", () => {
            expect(() => Schema.decodeSync(Internet.IPv4)("256.1.1.1")).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv4)("1.1.1")).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv4)("1.1.1.1.1")).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv4)("1.1.a.1")).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv4)("not-an-ip")).toThrow();
        });

        it("encodes back to string", () => {
            const decoded = Schema.decodeSync(Internet.IPv4)("192.168.1.1");
            const encoded = Schema.encodeSync(Internet.IPv4)(decoded);
            expect(encoded).toBe("192.168.1.1");
        });
    });

    describe("IPv4Bigint", () => {
        it("converts IPv4 to bigint", () => {
            const result = Schema.decodeSync(Internet.IPv4Bigint)("0.0.0.1");
            expect(result.family).toBe("ipv4");
            expect(result.value).toBe(1n);
        });

        it("converts IPv4 to bigint for 255.255.255.255", () => {
            const result = Schema.decodeSync(Internet.IPv4Bigint)("255.255.255.255");
            expect(result.family).toBe("ipv4");
            expect(result.value).toBe(4294967295n);
        });

        it("encodes bigint back to IPv4", () => {
            const decoded = Schema.decodeSync(Internet.IPv4Bigint)("192.168.1.1");
            const encoded = Schema.encodeSync(Internet.IPv4Bigint)(decoded);
            expect(encoded).toBe("192.168.1.1");
        });
    });

    describe("IPv6", () => {
        it("accepts valid IPv6 addresses", () => {
            expect(Schema.decodeSync(Internet.IPv6)("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toEqual({
                family: "ipv6",
                ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
            });
            expect(Schema.decodeSync(Internet.IPv6)("::1")).toEqual({
                family: "ipv6",
                ip: "::1",
            });
            expect(Schema.decodeSync(Internet.IPv6)("::")).toEqual({
                family: "ipv6",
                ip: "::",
            });
            expect(Schema.decodeSync(Internet.IPv6)("fe80::1")).toEqual({
                family: "ipv6",
                ip: "fe80::1",
            });
        });

        it("rejects invalid IPv6 addresses", () => {
            expect(() => Schema.decodeSync(Internet.IPv6)("2001:0db8:85a3:0000:0000:8a2e:0370:7334:")).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv6)("2001::85a3::0000::0370:7334")).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv6)("not-an-ip")).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv6)("192.168.1.1")).toThrow();
        });

        it("encodes back to string", () => {
            const decoded = Schema.decodeSync(Internet.IPv6)("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
            const encoded = Schema.encodeSync(Internet.IPv6)(decoded);
            expect(encoded).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        });
    });

    describe("IPv6Bigint", () => {
        it("converts IPv6 to bigint", () => {
            const result = Schema.decodeSync(Internet.IPv6Bigint)("::1");
            expect(result.family).toBe("ipv6");
            expect(result.value).toBe(1n);
        });

        it("encodes bigint back to IPv6", () => {
            const decoded = Schema.decodeSync(Internet.IPv6Bigint)("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
            const encoded = Schema.encodeSync(Internet.IPv6Bigint)(decoded);
            expect(encoded).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        });
    });

    describe("Address", () => {
        it("accepts both IPv4 and IPv6", () => {
            expect(Schema.decodeSync(Internet.Address)("192.168.1.1")).toEqual({
                family: "ipv4",
                ip: "192.168.1.1",
            });
            expect(Schema.decodeSync(Internet.Address)("::1")).toEqual({
                family: "ipv6",
                ip: "::1",
            });
        });

        it("rejects invalid addresses", () => {
            expect(() => Schema.decodeSync(Internet.Address)("not-an-ip")).toThrow();
            expect(() => Schema.decodeSync(Internet.Address)("1.1.b.1")).toThrow();
        });
    });

    describe("IPv4CidrMask", () => {
        it("accepts valid IPv4 CIDR masks", () => {
            expect(Schema.decodeSync(Internet.IPv4CidrMask)(0)).toBe(0);
            expect(Schema.decodeSync(Internet.IPv4CidrMask)(24)).toBe(24);
            expect(Schema.decodeSync(Internet.IPv4CidrMask)(32)).toBe(32);
        });

        it("rejects invalid IPv4 CIDR masks", () => {
            expect(() => Schema.decodeSync(Internet.IPv4CidrMask)(-1)).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv4CidrMask)(33)).toThrow();
        });
    });

    describe("IPv6CidrMask", () => {
        it("accepts valid IPv6 CIDR masks", () => {
            expect(Schema.decodeSync(Internet.IPv6CidrMask)(0)).toBe(0);
            expect(Schema.decodeSync(Internet.IPv6CidrMask)(64)).toBe(64);
            expect(Schema.decodeSync(Internet.IPv6CidrMask)(128)).toBe(128);
        });

        it("rejects invalid IPv6 CIDR masks", () => {
            expect(() => Schema.decodeSync(Internet.IPv6CidrMask)(-1)).toThrow();
            expect(() => Schema.decodeSync(Internet.IPv6CidrMask)(129)).toThrow();
        });
    });

    describe("IPv4CidrBlock", () => {
        it("creates valid IPv4 CIDR block", () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlock)({
                address: "192.168.1.0",
                mask: 24,
            });
            expect(block.address).toEqual({ family: "ipv4", ip: "192.168.1.0" });
            expect(block.mask).toBe(24);
        });

        it("calculates network address", () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlock)({
                address: "192.168.1.100",
                mask: 24,
            });
            expect(block.networkAddress).toEqual({ family: "ipv4", ip: "192.168.1.0" });
        });

        it("calculates broadcast address", () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlock)({
                address: "192.168.1.100",
                mask: 24,
            });
            expect(block.broadcastAddress).toEqual({ family: "ipv4", ip: "192.168.1.255" });
        });

        it("calculates total addresses", () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlock)({
                address: "192.168.1.0",
                mask: 24,
            });
            expect(block.total).toBe(256n);
        });

        it("calculates total addresses for /32", () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlock)({
                address: "192.168.1.1",
                mask: 32,
            });
            expect(block.total).toBe(1n);
        });
    });

    describe("IPv4CidrBlockFromString", () => {
        it("parses IPv4 CIDR block from string", () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlockFromString)("192.168.1.0/24");
            expect(block.address).toEqual({ family: "ipv4", ip: "192.168.1.0" });
            expect(block.mask).toBe(24);
        });

        it("encodes back to string", () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlockFromString)("192.168.1.0/24");
            const encoded = Schema.encodeSync(Internet.IPv4CidrBlockFromString)(block);
            expect(encoded).toBe("192.168.1.0/24");
        });
    });

    describe("IPv6CidrBlock", () => {
        it("creates valid IPv6 CIDR block", () => {
            const block = Schema.decodeSync(Internet.IPv6CidrBlock)({
                address: "2001:db8::",
                mask: 32,
            });
            expect(block.address).toEqual({ family: "ipv6", ip: "2001:db8::" });
            expect(block.mask).toBe(32);
        });

        it("calculates network address", () => {
            const block = Schema.decodeSync(Internet.IPv6CidrBlock)({
                address: "2001:db8::1",
                mask: 64,
            });
            expect(block.networkAddress).toEqual({ family: "ipv6", ip: "2001:0db8:0000:0000:0000:0000:0000:0000" });
        });

        it("calculates total addresses", () => {
            const block = Schema.decodeSync(Internet.IPv6CidrBlock)({
                address: "2001:db8::",
                mask: 126,
            });
            expect(block.total).toBe(4n);
        });
    });

    describe("IPv6CidrBlockFromString", () => {
        it("parses IPv6 CIDR block from string", () => {
            const block = Schema.decodeSync(Internet.IPv6CidrBlockFromString)("2001:db8::/32");
            expect(block.address).toEqual({ family: "ipv6", ip: "2001:db8::" });
            expect(block.mask).toBe(32);
        });

        it("encodes back to string", () => {
            const block = Schema.decodeSync(Internet.IPv6CidrBlockFromString)("2001:db8::/32");
            const encoded = Schema.encodeSync(Internet.IPv6CidrBlockFromString)(block);
            expect(encoded).toBe("2001:db8::/32");
        });
    });

    describe("CidrBlock", () => {
        it("accepts both IPv4 and IPv6 CIDR blocks", () => {
            const ipv4Block = Schema.decodeSync(Internet.CidrBlock)({
                address: "192.168.1.0",
                mask: 24,
            });
            expect(ipv4Block.address.family).toBe("ipv4");

            const ipv6Block = Schema.decodeSync(Internet.CidrBlock)({
                address: "2001:db8::",
                mask: 32,
            });
            expect(ipv6Block.address.family).toBe("ipv6");
        });
    });

    describe("CidrBlockFromString", () => {
        it("parses both IPv4 and IPv6 CIDR blocks from string", () => {
            const ipv4Block = Schema.decodeSync(Internet.CidrBlockFromString)("192.168.1.0/24");
            expect(ipv4Block.address.family).toBe("ipv4");

            const ipv6Block = Schema.decodeSync(Internet.CidrBlockFromString)("2001:db8::/32");
            expect(ipv6Block.address.family).toBe("ipv6");
        });
    });

    describe("range function", () => {
        it("generates all addresses in IPv4 /30 block", async () => {
            const block = Schema.decodeSync(Internet.IPv4CidrBlock)({
                address: "192.168.1.0",
                mask: 30,
            });

            const addresses = await Effect.runPromise(Stream.runCollect(block.range));
            const ips = Chunk.toArray(addresses).map((a) => a.ip);
            expect(ips).toEqual(["192.168.1.0", "192.168.1.1", "192.168.1.2", "192.168.1.3"]);
        });
    });

    describe("cidrBlockForRange", () => {
        it("finds smallest CIDR block for IPv4 range", () => {
            const addresses = Array.make(
                Schema.decodeSync(Internet.IPv4)("192.168.1.0"),
                Schema.decodeSync(Internet.IPv4)("192.168.1.3"),
            );
            const block = Internet.cidrBlockForRange(addresses);
            expect(block.mask).toBe(0);
        });
    });

    describe("Family", () => {
        it("accepts ipv4 family", () => {
            expect(Schema.decodeSync(Internet.Family)("ipv4")).toBe("ipv4");
        });

        it("accepts ipv6 family", () => {
            expect(Schema.decodeSync(Internet.Family)("ipv6")).toBe("ipv6");
        });

        it("rejects invalid family", () => {
            expect(() => Schema.decodeUnknownSync(Internet.Family)("invalid")).toThrow();
        });
    });

    describe("AddressString", () => {
        it("accepts valid IPv4 string", () => {
            expect(Schema.decodeSync(Internet.AddressString)("192.168.1.1")).toBe("192.168.1.1");
        });

        it("accepts valid IPv6 string", () => {
            expect(Schema.decodeSync(Internet.AddressString)("::1")).toBe("::1");
        });

        it("rejects invalid address string", () => {
            expect(() => Schema.decodeSync(Internet.AddressString)("not-an-ip")).toThrow();
        });
    });
});
