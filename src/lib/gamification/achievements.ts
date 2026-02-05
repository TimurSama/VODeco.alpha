import { prisma } from '@/lib/db/prisma';

type AchievementInput = {
  name: string;
  description: string;
  icon?: string | null;
  category: string;
  points: number;
};

const ACHIEVEMENTS: Record<string, AchievementInput> = {
  first_post: {
    name: 'First Post',
    description: 'Опубликована первая публикация',
    icon: '📝',
    category: 'social',
    points: 50,
  },
  first_mission: {
    name: 'First Mission',
    description: 'Первая одобренная миссия',
    icon: '🎯',
    category: 'participation',
    points: 100,
  },
  active_contributor: {
    name: 'Active Contributor',
    description: 'Опубликовано 10+ материалов',
    icon: '🌊',
    category: 'social',
    points: 200,
  },
  network_builder: {
    name: 'Network Builder',
    description: '5+ успешных рефералов',
    icon: '🤝',
    category: 'social',
    points: 200,
  },
  mission_master: {
    name: 'Mission Master',
    description: '3+ одобренных миссии',
    icon: '🏆',
    category: 'participation',
    points: 300,
  },
};

async function ensureAchievement(achievement: AchievementInput) {
  return prisma.achievement.upsert({
    where: { name: achievement.name },
    update: {
      description: achievement.description,
      icon: achievement.icon,
      category: achievement.category,
      points: achievement.points,
    },
    create: achievement,
  });
}

export async function grantAchievement(userId: string, key: keyof typeof ACHIEVEMENTS) {
  const achievement = ACHIEVEMENTS[key];
  const record = await ensureAchievement(achievement);

  const existing = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: record.id } },
  });
  if (existing) return;

  await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: record.id,
    },
  });
}
