/*
  Warnings:

  - You are about to drop the column `ma_vai_tro` on the `nguoi_dung` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nguoi_dung" DROP COLUMN "ma_vai_tro";

-- CreateTable
CREATE TABLE "vai_tro" (
    "ma_vai_tro" SERIAL NOT NULL,
    "ten_vai_tro" VARCHAR(100) NOT NULL,
    "ma_vai_tro_key" VARCHAR(50) NOT NULL,
    "mo_ta" VARCHAR(500),
    "thoi_diem_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thoi_diem_cap_nhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vai_tro_pkey" PRIMARY KEY ("ma_vai_tro")
);

-- CreateTable
CREATE TABLE "quyen" (
    "ma_quyen" SERIAL NOT NULL,
    "ten_quyen" VARCHAR(100) NOT NULL,
    "ma_quyen_key" VARCHAR(50) NOT NULL,
    "nhom_quyen" VARCHAR(50),
    "mo_ta" VARCHAR(500),
    "thoi_diem_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quyen_pkey" PRIMARY KEY ("ma_quyen")
);

-- CreateTable
CREATE TABLE "vai_tro_quyen" (
    "ma_vai_tro_quyen" SERIAL NOT NULL,
    "ma_vai_tro" INTEGER NOT NULL,
    "ma_quyen" INTEGER NOT NULL,
    "thoi_diem_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vai_tro_quyen_pkey" PRIMARY KEY ("ma_vai_tro_quyen")
);

-- CreateTable
CREATE TABLE "nguoi_dung_vai_tro" (
    "ma_nguoi_dung_vai_tro" SERIAL NOT NULL,
    "ma_nguoi_dung" INTEGER NOT NULL,
    "ma_vai_tro" INTEGER NOT NULL,
    "thoi_diem_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nguoi_dung_vai_tro_pkey" PRIMARY KEY ("ma_nguoi_dung_vai_tro")
);

-- CreateIndex
CREATE UNIQUE INDEX "vai_tro_ten_vai_tro_key" ON "vai_tro"("ten_vai_tro");

-- CreateIndex
CREATE UNIQUE INDEX "vai_tro_ma_vai_tro_key_key" ON "vai_tro"("ma_vai_tro_key");

-- CreateIndex
CREATE UNIQUE INDEX "quyen_ten_quyen_key" ON "quyen"("ten_quyen");

-- CreateIndex
CREATE UNIQUE INDEX "quyen_ma_quyen_key_key" ON "quyen"("ma_quyen_key");

-- CreateIndex
CREATE INDEX "vai_tro_quyen_ma_vai_tro_idx" ON "vai_tro_quyen"("ma_vai_tro");

-- CreateIndex
CREATE INDEX "vai_tro_quyen_ma_quyen_idx" ON "vai_tro_quyen"("ma_quyen");

-- CreateIndex
CREATE UNIQUE INDEX "vai_tro_quyen_ma_vai_tro_ma_quyen_key" ON "vai_tro_quyen"("ma_vai_tro", "ma_quyen");

-- CreateIndex
CREATE INDEX "nguoi_dung_vai_tro_ma_nguoi_dung_idx" ON "nguoi_dung_vai_tro"("ma_nguoi_dung");

-- CreateIndex
CREATE INDEX "nguoi_dung_vai_tro_ma_vai_tro_idx" ON "nguoi_dung_vai_tro"("ma_vai_tro");

-- CreateIndex
CREATE UNIQUE INDEX "nguoi_dung_vai_tro_ma_nguoi_dung_ma_vai_tro_key" ON "nguoi_dung_vai_tro"("ma_nguoi_dung", "ma_vai_tro");

-- AddForeignKey
ALTER TABLE "vai_tro_quyen" ADD CONSTRAINT "vai_tro_quyen_ma_vai_tro_fkey" FOREIGN KEY ("ma_vai_tro") REFERENCES "vai_tro"("ma_vai_tro") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vai_tro_quyen" ADD CONSTRAINT "vai_tro_quyen_ma_quyen_fkey" FOREIGN KEY ("ma_quyen") REFERENCES "quyen"("ma_quyen") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nguoi_dung_vai_tro" ADD CONSTRAINT "nguoi_dung_vai_tro_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nguoi_dung_vai_tro" ADD CONSTRAINT "nguoi_dung_vai_tro_ma_vai_tro_fkey" FOREIGN KEY ("ma_vai_tro") REFERENCES "vai_tro"("ma_vai_tro") ON DELETE CASCADE ON UPDATE CASCADE;
