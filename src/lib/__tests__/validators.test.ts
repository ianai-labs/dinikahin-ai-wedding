import { describe, it, expect } from "vitest";
import { validateName, validatePhone, validateEmail, validateLeadForm } from "@/lib/utils/validators";

describe("validateName", () => {
  it("accepts valid names", () => {
    expect(validateName("Imam").valid).toBe(true);
    expect(validateName("Budi Santoso").valid).toBe(true);
  });
  it("rejects short names", () => {
    expect(validateName("Ab").valid).toBe(false);
    expect(validateName("Ab").error).toContain("minimal");
  });
  it("rejects empty", () => {
    expect(validateName("").valid).toBe(false);
  });
});

describe("validatePhone", () => {
  it("accepts 08xx format", () => {
    expect(validatePhone("081234567890").valid).toBe(true);
  });
  it("accepts +62 format", () => {
    expect(validatePhone("+6281234567890").valid).toBe(true);
  });
  it("rejects non-Indonesian numbers", () => {
    expect(validatePhone("+1234567890").valid).toBe(false);
  });
  it("rejects too short", () => {
    expect(validatePhone("0812").valid).toBe(false);
  });
  it("rejects empty", () => {
    expect(validatePhone("").valid).toBe(false);
  });
});

describe("validateEmail", () => {
  it("accepts valid email", () => {
    expect(validateEmail("test@example.com").valid).toBe(true);
  });
  it("accepts empty (optional)", () => {
    expect(validateEmail("").valid).toBe(true);
  });
  it("accepts null (optional)", () => {
    expect(validateEmail(null).valid).toBe(true);
  });
  it("rejects invalid email", () => {
    expect(validateEmail("not-an-email").valid).toBe(false);
  });
});

describe("validateLeadForm", () => {
  it("validates complete form", () => {
    const result = validateLeadForm({ name: "Imam", phone: "081234567890", email: "" });
    expect(result.valid).toBe(true);
  });
  it("returns errors for invalid form", () => {
    const result = validateLeadForm({ name: "A", phone: "123", email: "bad" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.phone).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
  });
});
