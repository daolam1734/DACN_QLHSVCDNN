-- ===================================================================
-- PostgreSQL: Schema & Functions cho Quản lý Hồ sơ Viên chức TVU
-- ===================================================================

-- Tạo database (chạy riêng nếu cần)
-- CREATE DATABASE da_qlhsvc;
-- \c da_qlhsvc

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

-- =========================
-- SEED DATA cho Lookup Tables
-- =========================

-- Insert LoaiHoSo
INSERT INTO loai_ho_so (ten_loai_ho_so, mo_ta) VALUES
  ('cong_tac', 'Đi công tác'),
  ('hoi_thao', 'Hội thảo/khoa học'),
  ('viec_rieng', 'Việc riêng có liên quan')
ON CONFLICT (ten_loai_ho_so) DO NOTHING;

-- Insert TrangThaiHoSo
INSERT INTO trang_thai_ho_so (ten_trang_thai, mo_ta) VALUES
  ('tao_moi', 'Hồ sơ mới được tạo'),
  ('don_vi_tiep_nhan', 'Đơn vị đã tiếp nhận và kiểm tra'),
  ('don_vi_cho_y_kien', 'Đơn vị đã xác nhận và cho ý kiến'),
  ('chi_bo_xac_nhan', 'Chi bộ (nếu áp dụng) đã xem xét'),
  ('dang_uy_xac_nhan', 'Đảng ủy đã xem xét'),
  ('tcns_tham_dinh', 'TCNS thẩm định nghiệp vụ'),
  ('cho_bgh_phe_duyet', 'Đợi BGH phê duyệt'),
  ('da_phe_duyet', 'Đã được BGH phê duyệt'),
  ('bi_tu_choi', 'Bị từ chối'),
  ('cho_bao_cao_sau_chuyen_di', 'Chờ nộp báo cáo sau chuyến đi'),
  ('da_nop_bao_cao', 'Đã nộp báo cáo sau chuyến đi'),
  ('hoan_thanh', 'Quy trình hoàn thành')
ON CONFLICT (ten_trang_thai) DO NOTHING;

-- Insert BuocXuLyType
INSERT INTO buoc_xu_ly_type (ma_buoc_key, ten_buoc) VALUES
  ('DON_VI', 'Đơn vị quản lý (Khoa/Phòng/TT)'),
  ('CHI_BO', 'Chi bộ'),
  ('DANG_UY', 'Đảng ủy'),
  ('TCNS', 'Phòng Tổ chức - Nhân sự'),
  ('BGH', 'Ban Giám hiệu')
ON CONFLICT (ma_buoc_key) DO NOTHING;

COMMIT;

-- =========================
-- FUNCTIONS (Stored Procedures)
-- =========================

-- 1) Tạo hồ sơ
CREATE OR REPLACE FUNCTION sp_tao_ho_so(
    p_ma_vien_chuc INT,
    p_ma_loai_ho_so INT,
    p_tieu_de VARCHAR(250) DEFAULT NULL,
    p_muc_dich VARCHAR(1000) DEFAULT NULL,
    p_quoc_gia VARCHAR(120) DEFAULT NULL,
    p_thoi_gian_bat_dau DATE DEFAULT NULL,
    p_thoi_gian_ket_thuc DATE DEFAULT NULL,
    p_nguoi_thuc_hien INT
)
RETURNS INT AS $$
DECLARE
    v_new_id INT;
    v_trang_thai_id INT;
    v_buoc_don_vi INT;
BEGIN
    -- Lấy trạng thái 'tao_moi'
    SELECT ma_trang_thai INTO v_trang_thai_id 
    FROM trang_thai_ho_so 
    WHERE ten_trang_thai = 'tao_moi';

    -- Tạo hồ sơ
    INSERT INTO ho_so_di_nuoc_ngoai (
        ma_vien_chuc, ma_loai_ho_so, tieu_de, muc_dich, quoc_gia,
        thoi_gian_bat_dau, thoi_gian_ket_thuc, ma_trang_thai_hien_tai,
        nguoi_tao, nguoi_cap_nhat
    ) VALUES (
        p_ma_vien_chuc, p_ma_loai_ho_so, p_tieu_de, p_muc_dich, p_quoc_gia,
        p_thoi_gian_bat_dau, p_thoi_gian_ket_thuc, v_trang_thai_id,
        p_nguoi_thuc_hien, p_nguoi_thuc_hien
    ) RETURNING ma_ho_so INTO v_new_id;

    -- Lấy bước DON_VI
    SELECT ma_buoc INTO v_buoc_don_vi 
    FROM buoc_xu_ly_type 
    WHERE ma_buoc_key = 'DON_VI';

    -- Ghi tiến trình
    INSERT INTO tien_trinh_xu_ly (ma_ho_so, ma_buoc_xu_ly, ma_nguoi_xu_ly, hanh_dong, noi_dung)
    VALUES (v_new_id, v_buoc_don_vi, p_nguoi_thuc_hien, 'tao_ho_so', 'Viên chức tạo hồ sơ');

    -- Lưu lịch sử trạng thái
    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (v_new_id, v_trang_thai_id, p_nguoi_thuc_hien, 'Tạo hồ sơ mới');

    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;

-- 2) Đính kèm file
CREATE OR REPLACE FUNCTION sp_dinh_kem_file(
    p_ma_ho_so INT,
    p_ten_file VARCHAR(255),
    p_duong_dan VARCHAR(500),
    p_loai_file VARCHAR(100),
    p_nguoi_tai INT
)
RETURNS INT AS $$
DECLARE
    v_file_id INT;
BEGIN
    INSERT INTO giay_to_dinh_kem (ma_ho_so, ten_file, duong_dan, loai_file, nguoi_tai)
    VALUES (p_ma_ho_so, p_ten_file, p_duong_dan, p_loai_file, p_nguoi_tai)
    RETURNING ma_file INTO v_file_id;

    RETURN v_file_id;
END;
$$ LANGUAGE plpgsql;

-- 3) Submit hồ sơ
CREATE OR REPLACE FUNCTION sp_submit_ho_so(
    p_ma_ho_so INT,
    p_nguoi_thuc_hien INT
)
RETURNS VOID AS $$
DECLARE
    v_trang_thai_id INT;
    v_buoc_don_vi INT;
BEGIN
    -- Lấy trạng thái 'don_vi_tiep_nhan'
    SELECT ma_trang_thai INTO v_trang_thai_id 
    FROM trang_thai_ho_so 
    WHERE ten_trang_thai = 'don_vi_tiep_nhan';

    -- Cập nhật trạng thái
    UPDATE ho_so_di_nuoc_ngoai
    SET ma_trang_thai_hien_tai = v_trang_thai_id,
        nguoi_cap_nhat = p_nguoi_thuc_hien,
        thoi_diem_cap_nhat = CURRENT_TIMESTAMP
    WHERE ma_ho_so = p_ma_ho_so;

    -- Ghi lịch sử
    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (p_ma_ho_so, v_trang_thai_id, p_nguoi_thuc_hien, 'Viên chức nộp hồ sơ - gửi đơn vị tiếp nhận');

    -- Ghi tiến trình
    SELECT ma_buoc INTO v_buoc_don_vi FROM buoc_xu_ly_type WHERE ma_buoc_key = 'DON_VI';
    INSERT INTO tien_trinh_xu_ly (ma_ho_so, ma_buoc_xu_ly, ma_nguoi_xu_ly, hanh_dong, noi_dung)
    VALUES (p_ma_ho_so, v_buoc_don_vi, p_nguoi_thuc_hien, 'nop_ho_so', 'Viên chức nộp hồ sơ lên đơn vị quản lý');
END;
$$ LANGUAGE plpgsql;

-- 4) Đơn vị tiếp nhận
CREATE OR REPLACE FUNCTION sp_tiep_nhan_don_vi(
    p_ma_ho_so INT,
    p_ma_don_vi INT,
    p_nguoi_xu_ly INT,
    p_hanh_dong VARCHAR(50),
    p_noi_dung TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_trang_thai_id INT;
    v_buoc_don_vi INT;
BEGIN
    -- Xác định trạng thái
    IF p_hanh_dong = 'tiep_nhan' THEN
        SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = 'don_vi_tiep_nhan';
    ELSIF p_hanh_dong = 'xac_nhan' THEN
        SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = 'don_vi_cho_y_kien';
    ELSIF p_hanh_dong = 'yeu_cau_bo_sung' THEN
        SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = 'tao_moi';
    ELSE
        SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = 'don_vi_cho_y_kien';
    END IF;

    -- Cập nhật trạng thái
    UPDATE ho_so_di_nuoc_ngoai
    SET ma_trang_thai_hien_tai = v_trang_thai_id,
        nguoi_cap_nhat = p_nguoi_xu_ly,
        thoi_diem_cap_nhat = CURRENT_TIMESTAMP
    WHERE ma_ho_so = p_ma_ho_so;

    -- Ghi tiến trình
    SELECT ma_buoc INTO v_buoc_don_vi FROM buoc_xu_ly_type WHERE ma_buoc_key = 'DON_VI';
    INSERT INTO tien_trinh_xu_ly (ma_ho_so, ma_buoc_xu_ly, ma_nguoi_xu_ly, hanh_dong, noi_dung)
    VALUES (p_ma_ho_so, v_buoc_don_vi, p_nguoi_xu_ly, p_hanh_dong, p_noi_dung);

    -- Lịch sử trạng thái
    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (p_ma_ho_so, v_trang_thai_id, p_nguoi_xu_ly, 'Đơn vị xử lý: ' || COALESCE(p_noi_dung, ''));
END;
$$ LANGUAGE plpgsql;

-- 5) Thêm ý kiến
CREATE OR REPLACE FUNCTION sp_them_y_kien(
    p_ma_ho_so INT,
    p_ma_nguoi_gui INT,
    p_vai_tro_gui VARCHAR(50),
    p_noi_dung TEXT
)
RETURNS VOID AS $$
DECLARE
    v_buoc_id INT;
    v_buoc_key VARCHAR(50);
BEGIN
    -- Insert ý kiến
    INSERT INTO y_kien_xu_ly (ma_ho_so, ma_nguoi_gui, vai_tro_gui, noi_dung)
    VALUES (p_ma_ho_so, p_ma_nguoi_gui, p_vai_tro_gui, p_noi_dung);

    -- Xác định bước
    v_buoc_key := CASE 
        WHEN p_vai_tro_gui = 'DON_VI' THEN 'DON_VI'
        WHEN p_vai_tro_gui = 'CHI_BO' THEN 'CHI_BO'
        WHEN p_vai_tro_gui = 'DANG_UY' THEN 'DANG_UY'
        WHEN p_vai_tro_gui = 'TCNS' THEN 'TCNS'
        WHEN p_vai_tro_gui = 'BGH' THEN 'BGH'
        ELSE 'DON_VI'
    END;

    SELECT ma_buoc INTO v_buoc_id FROM buoc_xu_ly_type WHERE ma_buoc_key = v_buoc_key;

    -- Ghi tiến trình
    INSERT INTO tien_trinh_xu_ly (ma_ho_so, ma_buoc_xu_ly, ma_nguoi_xu_ly, hanh_dong, noi_dung)
    VALUES (p_ma_ho_so, v_buoc_id, p_ma_nguoi_gui, 'ghi_y_kien', p_noi_dung);
END;
$$ LANGUAGE plpgsql;

-- 6) Chuyển hồ sơ
CREATE OR REPLACE FUNCTION sp_chuyen_ho_so(
    p_ma_ho_so INT,
    p_tu_buoc_key VARCHAR(50),
    p_den_buoc_key VARCHAR(50),
    p_nguoi_thuc_hien INT,
    p_noi_dung TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_den_buoc_id INT;
    v_trang_thai_id INT;
    v_ten_trang_thai VARCHAR(100);
BEGIN
    -- Lấy bước đến
    SELECT ma_buoc INTO v_den_buoc_id FROM buoc_xu_ly_type WHERE ma_buoc_key = p_den_buoc_key;

    -- Map bước -> trạng thái
    v_ten_trang_thai := CASE
        WHEN p_den_buoc_key = 'CHI_BO' THEN 'chi_bo_xac_nhan'
        WHEN p_den_buoc_key = 'DANG_UY' THEN 'dang_uy_xac_nhan'
        WHEN p_den_buoc_key = 'TCNS' THEN 'tcns_tham_dinh'
        WHEN p_den_buoc_key = 'BGH' THEN 'cho_bgh_phe_duyet'
        ELSE 'don_vi_cho_y_kien'
    END;

    SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = v_ten_trang_thai;

    -- Cập nhật trạng thái
    UPDATE ho_so_di_nuoc_ngoai
    SET ma_trang_thai_hien_tai = v_trang_thai_id,
        nguoi_cap_nhat = p_nguoi_thuc_hien,
        thoi_diem_cap_nhat = CURRENT_TIMESTAMP
    WHERE ma_ho_so = p_ma_ho_so;

    -- Ghi tiến trình
    INSERT INTO tien_trinh_xu_ly (ma_ho_so, ma_buoc_xu_ly, ma_nguoi_xu_ly, hanh_dong, noi_dung)
    VALUES (p_ma_ho_so, v_den_buoc_id, p_nguoi_thuc_hien, 'chuyen_tiep', 
            COALESCE(p_noi_dung, 'Chuyển hồ sơ sang ' || p_den_buoc_key));

    -- Lịch sử
    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (p_ma_ho_so, v_trang_thai_id, p_nguoi_thuc_hien, 
            'Chuyển hồ sơ sang ' || p_den_buoc_key || ': ' || COALESCE(p_noi_dung, ''));
END;
$$ LANGUAGE plpgsql;

-- 7) TCNS soạn tờ trình
CREATE OR REPLACE FUNCTION sp_tcns_soan_to_trinh(
    p_ma_ho_so INT,
    p_ma_nguoi_thuc_hien INT,
    p_noi_dung TEXT
)
RETURNS VOID AS $$
DECLARE
    v_trang_thai_id INT;
BEGIN
    -- Ghi ý kiến
    PERFORM sp_them_y_kien(p_ma_ho_so, p_ma_nguoi_thuc_hien, 'TCNS', p_noi_dung);

    -- Cập nhật trạng thái: chờ BGH
    SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = 'cho_bgh_phe_duyet';
    
    UPDATE ho_so_di_nuoc_ngoai
    SET ma_trang_thai_hien_tai = v_trang_thai_id,
        nguoi_cap_nhat = p_ma_nguoi_thuc_hien,
        thoi_diem_cap_nhat = CURRENT_TIMESTAMP
    WHERE ma_ho_so = p_ma_ho_so;

    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (p_ma_ho_so, v_trang_thai_id, p_ma_nguoi_thuc_hien, 'TCNS soạn tờ trình, gửi BGH');
END;
$$ LANGUAGE plpgsql;

-- 8) BGH phê duyệt
CREATE OR REPLACE FUNCTION sp_phe_duyet_bgh(
    p_ma_ho_so INT,
    p_ma_nguoi_thuc_hien INT,
    p_ket_qua VARCHAR(50),
    p_ghi_chu TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_trang_thai_id INT;
    v_buoc_bgh INT;
    v_ten_trang_thai VARCHAR(100);
BEGIN
    -- Xác định trạng thái
    IF p_ket_qua = 'phe_duyet' THEN
        v_ten_trang_thai := 'da_phe_duyet';
    ELSE
        v_ten_trang_thai := 'bi_tu_choi';
    END IF;

    SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = v_ten_trang_thai;

    -- Cập nhật
    UPDATE ho_so_di_nuoc_ngoai
    SET ma_trang_thai_hien_tai = v_trang_thai_id,
        nguoi_cap_nhat = p_ma_nguoi_thuc_hien,
        thoi_diem_cap_nhat = CURRENT_TIMESTAMP
    WHERE ma_ho_so = p_ma_ho_so;

    -- Ghi tiến trình
    SELECT ma_buoc INTO v_buoc_bgh FROM buoc_xu_ly_type WHERE ma_buoc_key = 'BGH';
    INSERT INTO tien_trinh_xu_ly (ma_ho_so, ma_buoc_xu_ly, ma_nguoi_xu_ly, hanh_dong, noi_dung)
    VALUES (p_ma_ho_so, v_buoc_bgh, p_ma_nguoi_thuc_hien, p_ket_qua, p_ghi_chu);

    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (p_ma_ho_so, v_trang_thai_id, p_ma_nguoi_thuc_hien, COALESCE(p_ghi_chu, 'BGH xử lý'));
END;
$$ LANGUAGE plpgsql;

-- 9) Nộp báo cáo
CREATE OR REPLACE FUNCTION sp_nop_bao_cao(
    p_ma_ho_so INT,
    p_noi_dung_bao_cao TEXT,
    p_file_dinh_kem VARCHAR(500),
    p_nguoi_nop INT
)
RETURNS INT AS $$
DECLARE
    v_bao_cao_id INT;
    v_trang_thai_id INT;
BEGIN
    -- Insert báo cáo
    INSERT INTO bao_cao_sau_chuyen_di (ma_ho_so, noi_dung_bao_cao, file_dinh_kem)
    VALUES (p_ma_ho_so, p_noi_dung_bao_cao, p_file_dinh_kem)
    RETURNING ma_bao_cao INTO v_bao_cao_id;

    -- Cập nhật trạng thái
    SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = 'da_nop_bao_cao';
    
    UPDATE ho_so_di_nuoc_ngoai
    SET ma_trang_thai_hien_tai = v_trang_thai_id,
        nguoi_cap_nhat = p_nguoi_nop,
        thoi_diem_cap_nhat = CURRENT_TIMESTAMP
    WHERE ma_ho_so = p_ma_ho_so;

    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (p_ma_ho_so, v_trang_thai_id, p_nguoi_nop, 'Viên chức nộp báo cáo sau chuyến đi');

    RETURN v_bao_cao_id;
END;
$$ LANGUAGE plpgsql;

-- 10) Xác nhận báo cáo
CREATE OR REPLACE FUNCTION sp_xac_nhan_bao_cao(
    p_ma_bao_cao INT,
    p_ma_don_vi INT,
    p_nguoi_xac_nhan INT
)
RETURNS VOID AS $$
DECLARE
    v_ma_ho_so INT;
    v_trang_thai_id INT;
    v_buoc_don_vi INT;
BEGIN
    -- Cập nhật báo cáo
    UPDATE bao_cao_sau_chuyen_di
    SET ma_don_vi_xac_nhan = p_ma_don_vi,
        ngay_xac_nhan = CURRENT_TIMESTAMP
    WHERE ma_bao_cao = p_ma_bao_cao
    RETURNING ma_ho_so INTO v_ma_ho_so;

    -- Cập nhật hồ sơ
    SELECT ma_trang_thai INTO v_trang_thai_id FROM trang_thai_ho_so WHERE ten_trang_thai = 'hoan_thanh';
    
    UPDATE ho_so_di_nuoc_ngoai
    SET ma_trang_thai_hien_tai = v_trang_thai_id,
        nguoi_cap_nhat = p_nguoi_xac_nhan,
        thoi_diem_cap_nhat = CURRENT_TIMESTAMP
    WHERE ma_ho_so = v_ma_ho_so;

    -- Ghi tiến trình
    SELECT ma_buoc INTO v_buoc_don_vi FROM buoc_xu_ly_type WHERE ma_buoc_key = 'DON_VI';
    INSERT INTO tien_trinh_xu_ly (ma_ho_so, ma_buoc_xu_ly, ma_nguoi_xu_ly, hanh_dong, noi_dung)
    VALUES (v_ma_ho_so, v_buoc_don_vi, p_nguoi_xac_nhan, 'xac_nhan_bao_cao', 'Đơn vị xác nhận báo cáo đã nhận');

    INSERT INTO lich_su_trang_thai_ho_so (ma_ho_so, ma_trang_thai, nguoi_thuc_hien, ghi_chu)
    VALUES (v_ma_ho_so, v_trang_thai_id, p_nguoi_xac_nhan, 'Đơn vị xác nhận đã nhận báo cáo - hoàn thành');
END;
$$ LANGUAGE plpgsql;

-- =========================
-- COMMENTS
-- =========================
COMMENT ON FUNCTION sp_tao_ho_so IS 'Tạo hồ sơ đi nước ngoài mới';
COMMENT ON FUNCTION sp_dinh_kem_file IS 'Đính kèm file vào hồ sơ';
COMMENT ON FUNCTION sp_submit_ho_so IS 'Nộp hồ sơ lên đơn vị';
COMMENT ON FUNCTION sp_tiep_nhan_don_vi IS 'Đơn vị tiếp nhận và xử lý hồ sơ';
COMMENT ON FUNCTION sp_them_y_kien IS 'Thêm ý kiến xử lý';
COMMENT ON FUNCTION sp_chuyen_ho_so IS 'Chuyển hồ sơ giữa các bước';
COMMENT ON FUNCTION sp_tcns_soan_to_trinh IS 'TCNS soạn tờ trình';
COMMENT ON FUNCTION sp_phe_duyet_bgh IS 'BGH phê duyệt hoặc từ chối';
COMMENT ON FUNCTION sp_nop_bao_cao IS 'Viên chức nộp báo cáo sau chuyến đi';
COMMENT ON FUNCTION sp_xac_nhan_bao_cao IS 'Đơn vị xác nhận báo cáo';
