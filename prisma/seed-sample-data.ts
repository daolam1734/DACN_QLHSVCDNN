import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedSampleData() {
  console.log('🌱 Seeding sample data...');

  try {
    // 1. Seed TrangThaiHoSo
    console.log('📝 Creating status types...');
    const statuses = await Promise.all([
      prisma.trangThaiHoSo.upsert({
        where: { tenTrangThai: 'Nháp' },
        update: {},
        create: { tenTrangThai: 'Nháp', moTa: 'Hồ sơ đang soạn thảo' }
      }),
      prisma.trangThaiHoSo.upsert({
        where: { tenTrangThai: 'Chờ duyệt' },
        update: {},
        create: { tenTrangThai: 'Chờ duyệt', moTa: 'Hồ sơ đang chờ phê duyệt' }
      }),
      prisma.trangThaiHoSo.upsert({
        where: { tenTrangThai: 'Đã duyệt' },
        update: {},
        create: { tenTrangThai: 'Đã duyệt', moTa: 'Hồ sơ đã được phê duyệt' }
      }),
      prisma.trangThaiHoSo.upsert({
        where: { tenTrangThai: 'Từ chối' },
        update: {},
        create: { tenTrangThai: 'Từ chối', moTa: 'Hồ sơ bị từ chối' }
      }),
      prisma.trangThaiHoSo.upsert({
        where: { tenTrangThai: 'Đang xử lý' },
        update: {},
        create: { tenTrangThai: 'Đang xử lý', moTa: 'Hồ sơ đang được xử lý' }
      })
    ]);
    console.log(`✅ Created ${statuses.length} status types`);

    // 2. Seed LoaiHoSo
    console.log('📝 Creating profile types...');
    const types = await Promise.all([
      prisma.loaiHoSo.upsert({
        where: { tenLoaiHoSo: 'Hội thảo' },
        update: {},
        create: { tenLoaiHoSo: 'Hội thảo', moTa: 'Tham gia hội thảo khoa học' }
      }),
      prisma.loaiHoSo.upsert({
        where: { tenLoaiHoSo: 'Nghiên cứu' },
        update: {},
        create: { tenLoaiHoSo: 'Nghiên cứu', moTa: 'Nghiên cứu khoa học' }
      }),
      prisma.loaiHoSo.upsert({
        where: { tenLoaiHoSo: 'Đào tạo' },
        update: {},
        create: { tenLoaiHoSo: 'Đào tạo', moTa: 'Tham gia khóa đào tạo' }
      }),
      prisma.loaiHoSo.upsert({
        where: { tenLoaiHoSo: 'Công tác' },
        update: {},
        create: { tenLoaiHoSo: 'Công tác', moTa: 'Công tác trao đổi' }
      })
    ]);
    console.log(`✅ Created ${types.length} profile types`);

    // 3. Seed BuocXuLyType
    console.log('📝 Creating workflow steps...');
    const steps = await Promise.all([
      prisma.buocXuLyType.upsert({
        where: { maBuocKey: 'SUBMIT' },
        update: {},
        create: { maBuocKey: 'SUBMIT', tenBuoc: 'Nộp hồ sơ' }
      }),
      prisma.buocXuLyType.upsert({
        where: { maBuocKey: 'REVIEW' },
        update: {},
        create: { maBuocKey: 'REVIEW', tenBuoc: 'Thẩm định' }
      }),
      prisma.buocXuLyType.upsert({
        where: { maBuocKey: 'APPROVE' },
        update: {},
        create: { maBuocKey: 'APPROVE', tenBuoc: 'Phê duyệt' }
      }),
      prisma.buocXuLyType.upsert({
        where: { maBuocKey: 'REJECT' },
        update: {},
        create: { maBuocKey: 'REJECT', tenBuoc: 'Từ chối' }
      })
    ]);
    console.log(`✅ Created ${steps.length} workflow steps`);

    // 4. Seed DonVi
    console.log('📝 Creating units...');
    const existingUnits = await prisma.donVi.count();
    let units;
    
    if (existingUnits === 0) {
      await prisma.donVi.createMany({
        data: [
          { tenDonVi: 'Khoa Công Nghệ Thông Tin', maDonViCha: null },
          { tenDonVi: 'Khoa Kinh Tế', maDonViCha: null },
          { tenDonVi: 'Khoa Nông Nghiệp', maDonViCha: null }
        ]
      });
    }
    units = await prisma.donVi.findMany({ take: 3 });
    console.log(`✅ Created/found ${units.length} units`);

    // 5. Create sample VienChuc if not exists
    console.log('📝 Creating staff members...');
    const adminUser = await prisma.nguoiDung.findUnique({
      where: { email: 'admin@tvu.edu.vn' }
    });

    if (adminUser) {
      const existingVienChuc = await prisma.vienChuc.findFirst({
        where: { maNguoiDung: adminUser.maNguoiDung }
      });

      if (!existingVienChuc) {
        await prisma.vienChuc.create({
          data: {
            maNguoiDung: adminUser.maNguoiDung,
            maDonVi: units[0].maDonVi,
            maChucVu: null,
            laDangVien: false,
            ngayVaoDang: null,
            ngaySinh: new Date('1990-01-01')
          }
        });
        console.log('✅ Created admin staff member');
      }
    }

    // 6. Create sample HoSo
    console.log('📝 Creating sample profiles...');
    const vienChucs = await prisma.vienChuc.findMany({ take: 3 });
    
    if (vienChucs.length > 0) {
      const sampleProfiles = [];
      const statusIds = statuses.map(s => s.maTrangThai);
      const typeIds = types.map(t => t.maLoaiHoSo);

      for (let i = 0; i < 15; i++) {
        const vienChuc = vienChucs[i % vienChucs.length];
        const randomStatus = statusIds[Math.floor(Math.random() * statusIds.length)];
        const randomType = typeIds[Math.floor(Math.random() * typeIds.length)];
        const daysAgo = Math.floor(Math.random() * 180);

        sampleProfiles.push({
          maVienChuc: vienChuc.maVienChuc,
          maLoaiHoSo: randomType,
          tieuDe: `Hồ sơ ${i + 1} - Chuyến công tác quốc tế`,
          mucDich: `Mục đích chuyến đi số ${i + 1}`,
          quocGia: ['USA', 'Japan', 'Singapore', 'Australia', 'UK'][i % 5],
          thoiGianBatDau: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          thoiGianKetThuc: new Date(Date.now() - (daysAgo - 7) * 24 * 60 * 60 * 1000),
          maTrangThaiHienTai: randomStatus,
          nguoiTao: vienChuc.maNguoiDung,
          thoiDiemTao: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        });
      }

      await prisma.hoSoDiNuocNgoai.createMany({
        data: sampleProfiles,
        skipDuplicates: true
      });
      console.log(`✅ Created ${sampleProfiles.length} sample profiles`);
    }

    // Final stats
    const stats = {
      statuses: await prisma.trangThaiHoSo.count(),
      types: await prisma.loaiHoSo.count(),
      steps: await prisma.buocXuLyType.count(),
      units: await prisma.donVi.count(),
      vienChucs: await prisma.vienChuc.count(),
      profiles: await prisma.hoSoDiNuocNgoai.count()
    };

    console.log('\n📊 Final Stats:');
    console.log(`  Status Types: ${stats.statuses}`);
    console.log(`  Profile Types: ${stats.types}`);
    console.log(`  Workflow Steps: ${stats.steps}`);
    console.log(`  Units: ${stats.units}`);
    console.log(`  Staff: ${stats.vienChucs}`);
    console.log(`  Profiles: ${stats.profiles}`);
    console.log('\n✨ Sample data seed completed!');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSampleData();
