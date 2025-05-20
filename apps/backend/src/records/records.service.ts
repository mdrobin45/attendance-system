import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface dtoTypes {
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
}
@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: dtoTypes, userEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });
    return this.prisma.record.create({
      data: {
        date: new Date(dto.date),
        clockIn: dto.clockIn,
        clockOut: dto.clockOut,
        totalHours: dto.totalHours,
        userId: user.id,
      },
    });
  }

  async findAllByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return this.prisma.record.findMany({ where: { userId: user.id } });
  }
}
