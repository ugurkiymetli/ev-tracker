import { describe, it, expect } from "vitest";
import { prisma } from "../../../lib/db/prisma";

describe("Settings Database Model", () => {
  it("allows updating language and settings parameters in Prisma", async () => {
    const updated = await prisma.settings.upsert({
      where: { id: "default" },
      update: {
        currencySymbol: "₺",
        language: "tr",
        defaultFuelPricePerL: 2.1,
      },
      create: {
        id: "default",
        currencySymbol: "₺",
        language: "tr",
        defaultFuelPricePerL: 2.1,
        defaultFuelConsumptionPer100km: 7.5,
      },
    });

    expect(updated.language).toBe("tr");
    expect(updated.currencySymbol).toBe("₺");

    // Reset back to default
    await prisma.settings.update({
      where: { id: "default" },
      data: {
        currencySymbol: "$",
        language: "en",
      },
    });
  });
});
