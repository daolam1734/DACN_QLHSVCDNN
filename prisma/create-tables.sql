-- ============================
-- Lookup Tables
-- ============================

CREATE TABLE ChucVu (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE LoaiDonVi (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE QuocGia (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE,
    ma_iso CHAR(3) NOT NULL UNIQUE
);

CREATE TABLE HinhThucDi (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE NguonKinhPhi (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE LoaiHoSo (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE TrangThai (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE BuocXuLy (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE,
    thu_tu INT NOT NULL
);

CREATE TABLE VaiTroDangVien (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE
);

-- ============================
-- Core Tables
-- ============================

-- Đơn vị hành chính
CREATE TABLE DonVi (
    id SERIAL PRIMARY KEY,
    ma VARCHAR(50) NOT NULL UNIQUE,
    ten VARCHAR(255) NOT NULL,
    loai_don_vi_id INT NOT NULL REFERENCES LoaiDonVi(id),
    parent_id INT NULL REFERENCES DonVi(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL
);

-- Chi bộ Đảng
CREATE TABLE ChiBo (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(255) NOT NULL UNIQUE,
    don_vi_id INT NOT NULL REFERENCES DonVi(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Đảng ủy
CREATE TABLE DangUy (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(255) NOT NULL UNIQUE,
    don_vi_id INT NOT NULL REFERENCES DonVi(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Viên chức
CREATE TABLE VienChuc (
    id SERIAL PRIMARY KEY,
    ma_vien_chuc VARCHAR(50) NOT NULL UNIQUE,
    ho_ten VARCHAR(255) NOT NULL,
    don_vi_id INT NOT NULL REFERENCES DonVi(id),
    chuc_vu_id INT NOT NULL REFERENCES ChucVu(id),
    is_dang_vien BOOLEAN NOT NULL DEFAULT FALSE,
    gioi_tinh VARCHAR(10),
    ngay_sinh DATE,
    so_cmnd_ho_chieu VARCHAR(50),
    email VARCHAR(100),
    dien_thoai VARCHAR(20),
    dia_chi_thuong_tru TEXT,
    dia_chi_lien_lac TEXT,
    ngay_vao_truong DATE,
    avatar VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL
);

-- Vai trò người dùng hệ thống
CREATE TABLE UserRole (
    id SERIAL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL UNIQUE,
    mo_ta TEXT NULL
);

-- Người dùng hệ thống
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mat_khau_hash VARCHAR(255) NULL,       -- mật khẩu hiện tại (hashed)
    must_change_password BOOLEAN NOT NULL DEFAULT TRUE, -- bắt đổi mật khẩu lần đầu
    vien_chuc_id INT NULL REFERENCES VienChuc(id),
    don_vi_id INT NULL REFERENCES DonVi(id),
    vai_tro_id INT NOT NULL REFERENCES UserRole(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL
);

-- Hồ sơ đi nước ngoài
CREATE TABLE HoSo (
    id SERIAL PRIMARY KEY,
    ma_ho_so VARCHAR(50) NOT NULL UNIQUE,
    vien_chuc_id INT NOT NULL REFERENCES VienChuc(id),
    loai_ho_so_id INT NOT NULL REFERENCES LoaiHoSo(id),
    quoc_gia_id INT NOT NULL REFERENCES QuocGia(id),
    hinh_thuc_di_id INT NOT NULL REFERENCES HinhThucDi(id),
    nguon_kinh_phi_id INT NOT NULL REFERENCES NguonKinhPhi(id),
    noi_dung TEXT NOT NULL,
    ngay_di DATE NOT NULL,
    ngay_ve DATE NOT NULL,
    trang_thai_id INT NOT NULL REFERENCES TrangThai(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL
);

-- File tài liệu đính kèm hồ sơ
CREATE TABLE FileTaiLieu (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL REFERENCES HoSo(id) ON DELETE CASCADE,
    ten_file VARCHAR(255) NOT NULL,
    duong_dan VARCHAR(500) NOT NULL,
    file_hash CHAR(64) NULL,
    mo_ta TEXT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    uploaded_by INT NOT NULL,
    CONSTRAINT uq_file_tai_lieu UNIQUE(ho_so_id, ten_file)
);

-- Người đi cùng
CREATE TABLE NguoiDiCung (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL REFERENCES HoSo(id) ON DELETE CASCADE,
    ho_ten VARCHAR(255) NOT NULL,
    quan_he VARCHAR(100),
    ghi_chu TEXT NULL
);

-- Lịch sử trạng thái hồ sơ
CREATE TABLE LichSuTrangThai (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL REFERENCES HoSo(id) ON DELETE CASCADE,
    trang_thai_id INT NOT NULL REFERENCES TrangThai(id),
    buoc_xu_ly_id INT NOT NULL REFERENCES BuocXuLy(id),
    ghi_chu TEXT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    changed_by INT NOT NULL
);

-- Ý kiến của người dùng
CREATE TABLE YKien (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL REFERENCES HoSo(id) ON DELETE CASCADE,
    nguoi_dung_id INT NOT NULL REFERENCES Users(id),
    vai_tro_id INT NOT NULL REFERENCES UserRole(id),
    noi_dung TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Thông báo
CREATE TABLE ThongBao (
    id SERIAL PRIMARY KEY,
    nguoi_dung_id INT NOT NULL REFERENCES Users(id),
    noi_dung TEXT NOT NULL,
    loai_thong_bao VARCHAR(100),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Quyết định liên quan hồ sơ
CREATE TABLE QuyetDinh (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL REFERENCES HoSo(id) ON DELETE CASCADE,
    so_quyet_dinh VARCHAR(50) NOT NULL UNIQUE,
    noi_dung TEXT NOT NULL,
    ngay_ban_hanh DATE NOT NULL,
    ban_hanh_boi INT NOT NULL REFERENCES Users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================
-- Vai trò Đảng viên của viên chức
-- ============================

CREATE TABLE VienChucDangVien (
    id SERIAL PRIMARY KEY,
    vien_chuc_id INT NOT NULL REFERENCES VienChuc(id),
    chi_bo_id INT NULL REFERENCES ChiBo(id),
    dang_uy_id INT NULL REFERENCES DangUy(id),
    vai_tro_dang_vien_id INT NOT NULL REFERENCES VaiTroDangVien(id),
    ngay_nhan_vai_tro DATE,
    ngay_ket_thuc_vai_tro DATE NULL,
    ghi_chu TEXT NULL
);

-- ============================
-- Indexes
-- ============================

CREATE INDEX idx_ho_so_vien_chuc ON HoSo(vien_chuc_id);
CREATE INDEX idx_ho_so_trang_thai ON HoSo(trang_thai_id);
CREATE INDEX idx_y_kien_ho_so ON YKien(ho_so_id);
CREATE INDEX idx_lich_su_trang_thai_ho_so ON LichSuTrangThai(ho_so_id);
CREATE INDEX idx_file_tai_lieu_ho_so ON FileTaiLieu(ho_so_id);
CREATE INDEX idx_ho_so_vien_chuc_trang_thai ON HoSo(vien_chuc_id, trang_thai_id);

-- ============================
-- Trigger: auto-update updated_at
-- ============================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename IN ('DonVi', 'ChiBo', 'DangUy', 'VienChuc', 'Users', 'HoSo')
    LOOP
        EXECUTE format('
            CREATE TRIGGER trg_%1$s_updated_at
            BEFORE UPDATE ON %1$s
            FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        ', t.tablename);
    END LOOP;
END$$;

-- ============================
-- Audit log: generic
-- ============================

CREATE TABLE AuditLog (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action_type VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    changed_by INT NOT NULL REFERENCES Users(id),
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    old_data JSONB,
    new_data JSONB
);

CREATE OR REPLACE FUNCTION audit_log_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO AuditLog(table_name, record_id, action_type, changed_by, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, COALESCE(NEW.created_by, 0), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO AuditLog(table_name, record_id, action_type, changed_by, old_data, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, COALESCE(NEW.updated_by, 0), row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO AuditLog(table_name, record_id, action_type, changed_by, old_data)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, COALESCE(OLD.updated_by, 0), row_to_json(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Attach audit trigger to core tables
DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename IN ('DonVi', 'ChiBo', 'DangUy', 'VienChuc', 'Users', 'HoSo', 'FileTaiLieu')
    LOOP
        EXECUTE format('
            CREATE TRIGGER trg_%1$s_audit
            AFTER INSERT OR UPDATE OR DELETE ON %1$s
            FOR EACH ROW EXECUTE PROCEDURE audit_log_trigger();
        ', t.tablename);
    END LOOP;
END$$;