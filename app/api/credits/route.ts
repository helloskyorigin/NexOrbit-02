import { NextRequest, NextResponse } from 'next/server';
import { CreditService } from '@/services/credits/credit.service';
import { SubscriptionService } from '@/services/subscription/subscription.service';
import { handleApiError } from '@/lib/errors';
import { OperationType } from '@/config';

const creditService = new CreditService();
const subService = new SubscriptionService(creditService);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user_demo_phase0';

    const balance = await creditService.getCreditBalance(userId);
    const sub = await subService.getSubscription(userId);

    return NextResponse.json({
      success: true,
      data: {
        balance,
        subscription: sub,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user_demo_phase0';
    const action = body.action || 'CONSUME';
    const operation = (body.operation || 'ASK_MY_WORLD') as OperationType;

    if (action === 'CHECK') {
      const check = await creditService.checkCredits(userId, operation);
      return NextResponse.json({ success: true, data: check });
    }

    if (action === 'SET_PLAN') {
      const plan = body.plan || 'PRO';
      const sub = await subService.setPlan(userId, plan);
      const newBalance = await creditService.getCreditBalance(userId);
      return NextResponse.json({ success: true, data: { subscription: sub, balance: newBalance } });
    }

    const result = await creditService.consumeCredits(userId, operation, body.metadata);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
