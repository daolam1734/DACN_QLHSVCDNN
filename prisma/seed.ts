import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Tạo đơn vị mẫu
  const donVi = await prisma.donVi.upsert({
    where: { maDonVi: 1 },
    update: {},
    create: {
      tenDonVi: 'Khoa Công nghệ Thông tin',
      maLoaiDonVi: 1,
    },
  });

  console.log('✅ Created Đơn vị:', donVi.tenDonVi);

  // Hash mật khẩu mẫu
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Tạo người dùng mẫu
  const user1 = await prisma.nguoiDung.upsert({
    where: { email: 'admin@tvu.edu.vn' },
    update: {},
    create: {
      tenDangNhap: 'admin',
      matKhauHash: hashedPassword,
      hoTen: 'Quản trị viên',
      email: 'admin@tvu.edu.vn',
      trangThai: 'active',
      phaiDoiMatKhau: false,
    },
  });

  console.log('✅ Created user:', user1.email);

  // Tạo viên chức cho user
  const vienChuc1 = await prisma.vienChuc.upsert({
    where: { maNguoiDung: user1.maNguoiDung },
    update: {},
    create: {
      maNguoiDung: user1.maNguoiDung,
      maDonVi: donVi.maDonVi,
      laDangVien: true,
    },
  });

  console.log('✅ Created viên chức for:', user1.hoTen);

  // Tạo user 2
  const user2 = await prisma.nguoiDung.upsert({
    where: { email: 'giangvien@tvu.edu.vn' },
    update: {},
    create: {
      tenDangNhap: 'giangvien',
      matKhauHash: hashedPassword,
      hoTen: 'Nguyễn Văn A',
      email: 'giangvien@tvu.edu.vn',
      trangThai: 'active',
      phaiDoiMatKhau: true,
    },
  });

  console.log('✅ Created user:', user2.email);

  const vienChuc2 = await prisma.vienChuc.upsert({
    where: { maNguoiDung: user2.maNguoiDung },
    update: {},
    create: {
      maNguoiDung: user2.maNguoiDung,
      maDonVi: donVi.maDonVi,
      laDangVien: false,
    },
  });

  console.log('✅ Created viên chức for:', user2.hoTen);

  console.log('\n🎉 Seeding completed!');
  console.log('\n📝 Test accounts:');
  console.log('   Email: admin@tvu.edu.vn | Password: 123456');
  console.log('   Email: giangvien@tvu.edu.vn | Password: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
