import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateToken } from '@/lib/auth/jwt';
import { generateReferralCode, generateReferralLink } from '@/lib/utils/referral';
import { calculateReferralReward } from '@/lib/tokenomics/rewards';
import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

function validateTelegramAuth(data: TelegramUser, botToken: string): boolean {
  const { hash, ...userData } = data;
  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key as keyof typeof userData]}`)
    .join('\n');

  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const referralCode = body.referralCode; // Optional referral code

    if (!botToken) {
      return NextResponse.json(
        { error: 'Telegram bot token not configured' },
        { status: 500 }
      );
    }

    // Validate Telegram auth data
    if (!validateTelegramAuth(body, botToken)) {
      return NextResponse.json(
        { error: 'Invalid Telegram authentication' },
        { status: 401 }
      );
    }

    const telegramId = body.id.toString();
    const telegramUsername = body.username;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { telegramId },
      include: { wallet: true, level: true },
    });

    if (!user) {
      // Create new user
      const username = telegramUsername || `tg_${telegramId}`;
      
      // Check if referral code is valid
      let referrerId: string | null = null;
      if (referralCode) {
        const referral = await prisma.referral.findUnique({
          where: { code: referralCode },
          include: { referrer: true },
        });
        
        if (referral && referral.status === 'active' && referral.referrerId !== referral.referredId) {
          referrerId = referral.referrerId;
        }
      }

      // Calculate rewards
      const welcomeBonus = 1000;
      const referralBonus = referrerId ? 200 : 0; // Bonus for using referral code
      
      user = await prisma.user.create({
        data: {
          username,
          telegramId,
          telegramUsername,
          firstName: body.first_name,
          lastName: body.last_name,
          avatar: body.photo_url,
          email: `${telegramId}@telegram.vodeco.org`,
          wallet: {
            create: {
              balance: (welcomeBonus + referralBonus).toString(),
            },
          },
          level: {
            create: {
              level: 1,
              experience: 0,
              totalRewards: (welcomeBonus + referralBonus).toString(),
            },
          },
        },
      });

      // Create referral code for new user
      const userReferralCode = generateReferralCode(user.username, user.id);
      await prisma.referral.create({
        data: {
          referrerId: user.id,
          code: userReferralCode,
          link: generateReferralLink(userReferralCode),
          status: 'active',
        },
      });

      // Create welcome transaction
      await prisma.transaction.create({
        data: {
          walletId: user.wallet!.id,
          userId: user.id,
          type: 'reward',
          amount: welcomeBonus.toString(),
          status: 'completed',
          description: 'Welcome bonus (Telegram registration)',
        },
      });

      // Handle referral if used
      if (referrerId) {
        // Update referral record
        const referral = await prisma.referral.findFirst({
          where: {
            referrerId,
            code: referralCode,
            status: 'active',
          },
        });

        if (referral) {
          // Count referrer's referrals
          const referrerReferralCount = await prisma.referral.count({
            where: {
              referrerId,
              status: 'used',
            },
          });

          const rewards = calculateReferralReward(referrerReferralCount);

          // Update referral
          await prisma.referral.update({
            where: { id: referral.id },
            data: {
              referredId: user.id,
              status: 'used',
              rewardAmount: rewards.referrer.toString(),
              usedAt: new Date(),
            },
          });

          // Reward referrer
          const referrer = await prisma.user.findUnique({
            where: { id: referrerId },
            include: { wallet: true, level: true },
          });

          if (referrer && referrer.wallet) {
            const newBalance = parseFloat(referrer.wallet.balance) + rewards.referrer;
            await prisma.wallet.update({
              where: { id: referrer.wallet.id },
              data: { balance: newBalance.toString() },
            });

            await prisma.transaction.create({
              data: {
                walletId: referrer.wallet.id,
                userId: referrer.id,
                type: 'reward',
                amount: rewards.referrer.toString(),
                status: 'completed',
                description: `Referral reward for ${user.username}`,
                metadata: JSON.stringify({ referralId: referral.id }),
              },
            });

            // Update referrer's level XP
            if (referrer.level) {
              const { XP_REWARDS } = await import('@/lib/tokenomics/rewards');
              const newXP = referrer.level.experience + XP_REWARDS.referral;
              await prisma.userLevel.update({
                where: { userId: referrer.id },
                data: { experience: newXP },
              });
            }
          }

          // Reward referred user
          if (referralBonus > 0) {
            await prisma.transaction.create({
              data: {
                walletId: user.wallet!.id,
                userId: user.id,
                type: 'reward',
                amount: referralBonus.toString(),
                status: 'completed',
                description: 'Referral bonus (used referral code)',
                metadata: JSON.stringify({ referralId: referral.id }),
              },
            });

            // Update user's level XP
            if (user.level) {
              const { XP_REWARDS } = await import('@/lib/tokenomics/rewards');
              const newXP = user.level.experience + XP_REWARDS.referral;
              await prisma.userLevel.update({
                where: { userId: user.id },
                data: { experience: newXP },
              });
            }
          }
        }
      }
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          telegramUsername,
          firstName: body.first_name,
          lastName: body.last_name,
          avatar: body.photo_url,
        },
        include: { wallet: true, level: true },
      });

      // Create referral code if user doesn't have one
      const existingReferral = await prisma.referral.findFirst({
        where: { referrerId: user.id },
      });

      if (!existingReferral) {
        const userReferralCode = generateReferralCode(user.username, user.id);
        await prisma.referral.create({
          data: {
            referrerId: user.id,
            code: userReferralCode,
            link: generateReferralLink(userReferralCode),
            status: 'active',
          },
        });
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email || undefined,
      telegramId: user.telegramId || undefined,
    });

    // Return user data with token
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        verified: user.verified,
        level: user.level?.level || 1,
        experience: user.level?.experience || 0,
      },
    });

    // Set cookie with token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
