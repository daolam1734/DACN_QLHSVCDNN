import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4 md:px-8">
          {/* Logo + Tên trường + Hệ thống */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
            <Image
              src="/logo-tvu.jpg"
              alt="Logo TVU"
              width={48}
              height={48}
              className="rounded-full border-2 border-blue-700 bg-white shadow"
              priority
            />
            <div className="flex flex-col items-start">
              <span className="text-lg md:text-xl font-bold text-blue-800 leading-tight">
                TRƯỜNG ĐẠI HỌC TRÀ VINH
              </span>
              <span className="text-xs md:text-sm text-blue-600">
                TRA VINH UNIVERSITY
              </span>
            </div>
          </div>
          {/* Tên hệ thống (giữa) */}
          <div className="hidden md:block flex-1 text-center">
            <span className="text-base font-semibold text-blue-700 tracking-wide">
              Hệ thống Quản lý Hồ sơ Viên chức đi nước ngoài
            </span>
          </div>
          {/* Menu */}
          <nav className="flex gap-3 md:gap-5 mt-2 md:mt-0 w-full md:w-auto justify-center md:justify-end">
            <a
              href="/"
              className="text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded transition"
            >
              Trang chủ
            </a>
            <a
              href="/login"
              className="text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded transition"
            >
              Đăng nhập
            </a>
            <a
              href="/huong-dan"
              className="text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded transition"
            >
              Hướng dẫn
            </a>
            <a
              href="/lien-he"
              className="text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded transition"
            >
              Liên hệ
            </a>
            <a
              href="/gioi-thieu"
              className="text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded transition"
            >
              Giới thiệu
            </a>
          </nav>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-6 drop-shadow">
          Hệ thống Quản lý Hồ sơ Viên chức đi nước ngoài
        </h1>
        <p className="text-lg text-center text-gray-700 mb-8 max-w-2xl">
          Ứng dụng quản lý hồ sơ viên chức đi nước ngoài, hỗ trợ đăng nhập, quản lý,
          báo cáo và phê duyệt hồ sơ. Xây dựng với Next.js, TypeScript, Tailwind CSS
          và PostgreSQL.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Frontend</h2>
            <p className="text-gray-600 text-center">
              Giao diện hiện đại, thân thiện, sử dụng React và Tailwind CSS.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Backend</h2>
            <p className="text-gray-600 text-center">
              API bảo mật, xác thực, quản lý dữ liệu với Next.js và Prisma ORM.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-700 border-t py-6 px-8 text-center text-sm text-white">
        <div className="mb-2 font-semibold">
          Trường Đại học Trà Vinh - TRA VINH UNIVERSITY
        </div>
        <div className="mb-1">
          Địa chỉ: Số 126, Quốc lộ 53, phường 5, TP. Trà Vinh, tỉnh Trà Vinh
        </div>
        <div className="mb-1">
          Điện thoại: (0294) 3855246 | Email: info@tvu.edu.vn
        </div>
        <div className="mb-1">
          Phát triển & vận hành bởi Phòng Công nghệ Thông tin
        </div>
        <div>
          &copy; {new Date().getFullYear()} Trường Đại học Trà Vinh. Mọi quyền
          được bảo lưu.
        </div>
      </footer>
    </div>
  );
}
