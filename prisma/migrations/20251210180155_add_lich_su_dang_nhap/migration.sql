/*
  Warnings:

  - You are about to drop the column `ma_trang_thai` on the `nguoi_dung` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nguoi_dung" DROP COLUMN "ma_trang_thai",
ADD COLUMN     "ma_vai_tro" INTEGER,
ADD COLUMN     "trang_thai" VARCHAR(20) NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "lich_su_dang_nhap" (
    "ma_lich_su" SERIAL NOT NULL,
    "ma_nguoi_dung" INTEGER NOT NULL,
    "thoi_gian" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(45),
    "thiet_bi" VARCHAR(500),
    "ket_qua" VARCHAR(20) NOT NULL,

    CONSTRAINT "lich_su_dang_nhap_pkey" PRIMARY KEY ("ma_lich_su")
);

-- CreateIndex
CREATE INDEX "lich_su_dang_nhap_ma_nguoi_dung_idx" ON "lich_su_dang_nhap"("ma_nguoi_dung");

-- CreateIndex
CREATE INDEX "lich_su_dang_nhap_thoi_gian_idx" ON "lich_su_dang_nhap"("thoi_gian");

-- AddForeignKey
ALTER TABLE "lich_su_dang_nhap" ADD CONSTRAINT "lich_su_dang_nhap_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE RESTRICT ON UPDATE CASCADE;
