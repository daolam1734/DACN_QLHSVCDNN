-- CreateTable
CREATE TABLE "loai_ho_so" (
    "ma_loai_ho_so" SERIAL NOT NULL,
    "ten_loai_ho_so" VARCHAR(100) NOT NULL,
    "mo_ta" VARCHAR(500),

    CONSTRAINT "loai_ho_so_pkey" PRIMARY KEY ("ma_loai_ho_so")
);

-- CreateTable
CREATE TABLE "trang_thai_ho_so" (
    "ma_trang_thai" SERIAL NOT NULL,
    "ten_trang_thai" VARCHAR(100) NOT NULL,
    "mo_ta" VARCHAR(500),

    CONSTRAINT "trang_thai_ho_so_pkey" PRIMARY KEY ("ma_trang_thai")
);

-- CreateTable
CREATE TABLE "buoc_xu_ly_type" (
    "ma_buoc" SERIAL NOT NULL,
    "ma_buoc_key" VARCHAR(50) NOT NULL,
    "ten_buoc" VARCHAR(100) NOT NULL,

    CONSTRAINT "buoc_xu_ly_type_pkey" PRIMARY KEY ("ma_buoc")
);

-- CreateTable
CREATE TABLE "nguoi_dung" (
    "ma_nguoi_dung" SERIAL NOT NULL,
    "ten_dang_nhap" VARCHAR(50) NOT NULL,
    "mat_khau_hash" TEXT NOT NULL,
    "ho_ten" VARCHAR(120) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phai_doi_mat_khau" BOOLEAN NOT NULL DEFAULT true,
    "ma_trang_thai" INTEGER,
    "thoi_diem_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thoi_diem_cap_nhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nguoi_dung_pkey" PRIMARY KEY ("ma_nguoi_dung")
);

-- CreateTable
CREATE TABLE "don_vi" (
    "ma_don_vi" SERIAL NOT NULL,
    "ten_don_vi" VARCHAR(150) NOT NULL,
    "ma_loai_don_vi" INTEGER,
    "ma_don_vi_cha" INTEGER,
    "ma_truong_don_vi" INTEGER,
    "thoi_diem_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thoi_diem_cap_nhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "don_vi_pkey" PRIMARY KEY ("ma_don_vi")
);

-- CreateTable
CREATE TABLE "vien_chuc" (
    "ma_vien_chuc" SERIAL NOT NULL,
    "ma_nguoi_dung" INTEGER NOT NULL,
    "ma_don_vi" INTEGER NOT NULL,
    "ma_chuc_vu" INTEGER,
    "la_dang_vien" BOOLEAN NOT NULL DEFAULT false,
    "ngay_vao_dang" DATE,
    "ngay_sinh" DATE,

    CONSTRAINT "vien_chuc_pkey" PRIMARY KEY ("ma_vien_chuc")
);

-- CreateTable
CREATE TABLE "ho_so_di_nuoc_ngoai" (
    "ma_ho_so" SERIAL NOT NULL,
    "ma_vien_chuc" INTEGER NOT NULL,
    "ma_loai_ho_so" INTEGER NOT NULL,
    "tieu_de" VARCHAR(250),
    "muc_dich" VARCHAR(1000),
    "quoc_gia" VARCHAR(120),
    "thoi_gian_bat_dau" DATE,
    "thoi_gian_ket_thuc" DATE,
    "ma_trang_thai_hien_tai" INTEGER NOT NULL DEFAULT 1,
    "nguoi_tao" INTEGER,
    "nguoi_cap_nhat" INTEGER,
    "thoi_diem_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thoi_diem_cap_nhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ho_so_di_nuoc_ngoai_pkey" PRIMARY KEY ("ma_ho_so")
);

-- CreateTable
CREATE TABLE "giay_to_dinh_kem" (
    "ma_file" SERIAL NOT NULL,
    "ma_ho_so" INTEGER NOT NULL,
    "ten_file" VARCHAR(255) NOT NULL,
    "duong_dan" VARCHAR(500) NOT NULL,
    "loai_file" VARCHAR(100),
    "ngay_tai_len" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nguoi_tai" INTEGER,

    CONSTRAINT "giay_to_dinh_kem_pkey" PRIMARY KEY ("ma_file")
);

-- CreateTable
CREATE TABLE "tien_trinh_xu_ly" (
    "ma_tien_trinh" SERIAL NOT NULL,
    "ma_ho_so" INTEGER NOT NULL,
    "ma_buoc_xu_ly" INTEGER NOT NULL,
    "ma_nguoi_xu_ly" INTEGER,
    "hanh_dong" VARCHAR(100),
    "noi_dung" TEXT,
    "thoi_diem" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tien_trinh_xu_ly_pkey" PRIMARY KEY ("ma_tien_trinh")
);

-- CreateTable
CREATE TABLE "lich_su_trang_thai_ho_so" (
    "ma_lich_su" SERIAL NOT NULL,
    "ma_ho_so" INTEGER NOT NULL,
    "ma_trang_thai" INTEGER NOT NULL,
    "nguoi_thuc_hien" INTEGER,
    "thoi_diem" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ghi_chu" TEXT,

    CONSTRAINT "lich_su_trang_thai_ho_so_pkey" PRIMARY KEY ("ma_lich_su")
);

-- CreateTable
CREATE TABLE "y_kien_xu_ly" (
    "ma_y_kien" SERIAL NOT NULL,
    "ma_ho_so" INTEGER NOT NULL,
    "ma_nguoi_gui" INTEGER NOT NULL,
    "vai_tro_gui" VARCHAR(50) NOT NULL,
    "noi_dung" TEXT NOT NULL,
    "thoi_diem" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "y_kien_xu_ly_pkey" PRIMARY KEY ("ma_y_kien")
);

-- CreateTable
CREATE TABLE "bao_cao_sau_chuyen_di" (
    "ma_bao_cao" SERIAL NOT NULL,
    "ma_ho_so" INTEGER NOT NULL,
    "noi_dung_bao_cao" TEXT,
    "file_dinh_kem" VARCHAR(500),
    "ngay_nop" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ma_don_vi_xac_nhan" INTEGER,
    "ngay_xac_nhan" TIMESTAMP(3),

    CONSTRAINT "bao_cao_sau_chuyen_di_pkey" PRIMARY KEY ("ma_bao_cao")
);

-- CreateIndex
CREATE UNIQUE INDEX "loai_ho_so_ten_loai_ho_so_key" ON "loai_ho_so"("ten_loai_ho_so");

-- CreateIndex
CREATE UNIQUE INDEX "trang_thai_ho_so_ten_trang_thai_key" ON "trang_thai_ho_so"("ten_trang_thai");

-- CreateIndex
CREATE UNIQUE INDEX "buoc_xu_ly_type_ma_buoc_key_key" ON "buoc_xu_ly_type"("ma_buoc_key");

-- CreateIndex
CREATE UNIQUE INDEX "nguoi_dung_ten_dang_nhap_key" ON "nguoi_dung"("ten_dang_nhap");

-- CreateIndex
CREATE UNIQUE INDEX "nguoi_dung_email_key" ON "nguoi_dung"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vien_chuc_ma_nguoi_dung_key" ON "vien_chuc"("ma_nguoi_dung");

-- CreateIndex
CREATE INDEX "ho_so_di_nuoc_ngoai_ma_vien_chuc_idx" ON "ho_so_di_nuoc_ngoai"("ma_vien_chuc");

-- CreateIndex
CREATE INDEX "ho_so_di_nuoc_ngoai_ma_trang_thai_hien_tai_idx" ON "ho_so_di_nuoc_ngoai"("ma_trang_thai_hien_tai");

-- CreateIndex
CREATE INDEX "giay_to_dinh_kem_ma_ho_so_idx" ON "giay_to_dinh_kem"("ma_ho_so");

-- CreateIndex
CREATE INDEX "tien_trinh_xu_ly_ma_ho_so_idx" ON "tien_trinh_xu_ly"("ma_ho_so");

-- CreateIndex
CREATE INDEX "tien_trinh_xu_ly_thoi_diem_idx" ON "tien_trinh_xu_ly"("thoi_diem");

-- CreateIndex
CREATE INDEX "lich_su_trang_thai_ho_so_ma_ho_so_idx" ON "lich_su_trang_thai_ho_so"("ma_ho_so");

-- CreateIndex
CREATE INDEX "y_kien_xu_ly_ma_ho_so_idx" ON "y_kien_xu_ly"("ma_ho_so");

-- CreateIndex
CREATE INDEX "y_kien_xu_ly_thoi_diem_idx" ON "y_kien_xu_ly"("thoi_diem");

-- CreateIndex
CREATE INDEX "bao_cao_sau_chuyen_di_ma_ho_so_idx" ON "bao_cao_sau_chuyen_di"("ma_ho_so");

-- AddForeignKey
ALTER TABLE "vien_chuc" ADD CONSTRAINT "vien_chuc_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vien_chuc" ADD CONSTRAINT "vien_chuc_ma_don_vi_fkey" FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi"("ma_don_vi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ho_so_di_nuoc_ngoai" ADD CONSTRAINT "ho_so_di_nuoc_ngoai_ma_vien_chuc_fkey" FOREIGN KEY ("ma_vien_chuc") REFERENCES "vien_chuc"("ma_vien_chuc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ho_so_di_nuoc_ngoai" ADD CONSTRAINT "ho_so_di_nuoc_ngoai_ma_loai_ho_so_fkey" FOREIGN KEY ("ma_loai_ho_so") REFERENCES "loai_ho_so"("ma_loai_ho_so") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ho_so_di_nuoc_ngoai" ADD CONSTRAINT "ho_so_di_nuoc_ngoai_ma_trang_thai_hien_tai_fkey" FOREIGN KEY ("ma_trang_thai_hien_tai") REFERENCES "trang_thai_ho_so"("ma_trang_thai") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ho_so_di_nuoc_ngoai" ADD CONSTRAINT "ho_so_di_nuoc_ngoai_nguoi_tao_fkey" FOREIGN KEY ("nguoi_tao") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ho_so_di_nuoc_ngoai" ADD CONSTRAINT "ho_so_di_nuoc_ngoai_nguoi_cap_nhat_fkey" FOREIGN KEY ("nguoi_cap_nhat") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "giay_to_dinh_kem" ADD CONSTRAINT "giay_to_dinh_kem_ma_ho_so_fkey" FOREIGN KEY ("ma_ho_so") REFERENCES "ho_so_di_nuoc_ngoai"("ma_ho_so") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "giay_to_dinh_kem" ADD CONSTRAINT "giay_to_dinh_kem_nguoi_tai_fkey" FOREIGN KEY ("nguoi_tai") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tien_trinh_xu_ly" ADD CONSTRAINT "tien_trinh_xu_ly_ma_ho_so_fkey" FOREIGN KEY ("ma_ho_so") REFERENCES "ho_so_di_nuoc_ngoai"("ma_ho_so") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tien_trinh_xu_ly" ADD CONSTRAINT "tien_trinh_xu_ly_ma_buoc_xu_ly_fkey" FOREIGN KEY ("ma_buoc_xu_ly") REFERENCES "buoc_xu_ly_type"("ma_buoc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tien_trinh_xu_ly" ADD CONSTRAINT "tien_trinh_xu_ly_ma_nguoi_xu_ly_fkey" FOREIGN KEY ("ma_nguoi_xu_ly") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lich_su_trang_thai_ho_so" ADD CONSTRAINT "lich_su_trang_thai_ho_so_ma_ho_so_fkey" FOREIGN KEY ("ma_ho_so") REFERENCES "ho_so_di_nuoc_ngoai"("ma_ho_so") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lich_su_trang_thai_ho_so" ADD CONSTRAINT "lich_su_trang_thai_ho_so_ma_trang_thai_fkey" FOREIGN KEY ("ma_trang_thai") REFERENCES "trang_thai_ho_so"("ma_trang_thai") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lich_su_trang_thai_ho_so" ADD CONSTRAINT "lich_su_trang_thai_ho_so_nguoi_thuc_hien_fkey" FOREIGN KEY ("nguoi_thuc_hien") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "y_kien_xu_ly" ADD CONSTRAINT "y_kien_xu_ly_ma_ho_so_fkey" FOREIGN KEY ("ma_ho_so") REFERENCES "ho_so_di_nuoc_ngoai"("ma_ho_so") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "y_kien_xu_ly" ADD CONSTRAINT "y_kien_xu_ly_ma_nguoi_gui_fkey" FOREIGN KEY ("ma_nguoi_gui") REFERENCES "nguoi_dung"("ma_nguoi_dung") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bao_cao_sau_chuyen_di" ADD CONSTRAINT "bao_cao_sau_chuyen_di_ma_ho_so_fkey" FOREIGN KEY ("ma_ho_so") REFERENCES "ho_so_di_nuoc_ngoai"("ma_ho_so") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bao_cao_sau_chuyen_di" ADD CONSTRAINT "bao_cao_sau_chuyen_di_ma_don_vi_xac_nhan_fkey" FOREIGN KEY ("ma_don_vi_xac_nhan") REFERENCES "don_vi"("ma_don_vi") ON DELETE SET NULL ON UPDATE CASCADE;
