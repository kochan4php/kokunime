// @vitest-environment node
import { describe, expect, it } from "vitest";
import { decryptBackup, encryptBackup } from "@/utils/backup-crypto";

describe("backup-crypto", () => {
  it("round-trips a backup and rejects the wrong passphrase", async () => {
    const plain = JSON.stringify({ app: "Kokunime", bookmarks: [{ slug: "naruto" }] });
    const envelope = await encryptBackup(plain, "correct horse battery");

    expect(envelope).not.toContain("naruto");
    expect(JSON.parse(envelope)).toMatchObject({
      format: "kokunime-encrypted-backup",
      kdf: "PBKDF2-SHA256",
      iterations: 310_000,
    });
    await expect(decryptBackup(envelope, "wrong passphrase")).rejects.toThrow();
    await expect(decryptBackup(envelope, "correct horse battery")).resolves.toBe(plain);
  });
});
