import { PrismaClient } from "@prisma/client";

// Объявляем глобальную переменную для хранения инстанса клиента в дев-режиме
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Экспортируем единственный инстанс клиента, повторно используя его при горячей перезагрузке
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
