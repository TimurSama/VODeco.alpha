import { prisma } from '@/lib/db/prisma';
import { calculateLevel } from '@/lib/tokenomics/rewards';

export async function addUserXP(userId: string, xp: number) {
  if (xp <= 0) return;
  const level = await prisma.userLevel.findUnique({
    where: { userId },
  });

  if (!level) {
    const newLevel = calculateLevel(xp);
    await prisma.userLevel.create({
      data: {
        userId,
        level: newLevel,
        experience: xp,
        totalRewards: '0',
      },
    });
    return;
  }

  const updatedXP = level.experience + xp;
  const updatedLevel = calculateLevel(updatedXP);
  await prisma.userLevel.update({
    where: { userId },
    data: {
      experience: updatedXP,
      level: updatedLevel,
    },
  });
}
