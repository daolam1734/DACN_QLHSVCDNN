import { NextResponse } from 'next/server';
import { createSuccessResponse } from '@/lib/api-response';

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Lấy thông tin cơ bản của API
 *     description: Trả về thông tin phiên bản và trạng thái của API.
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Thông tin API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
export async function GET() {
  const apiInfo = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    message: 'Chào mừng đến với API Hệ thống quản lý hồ sơ',
  };

  return NextResponse.json(createSuccessResponse(apiInfo));
}
