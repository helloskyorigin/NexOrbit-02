import { NextResponse } from 'next/server';
import { NEXORBIT_CONFIG } from '@/config';

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    app: NEXORBIT_CONFIG.appName,
    tagline: NEXORBIT_CONFIG.tagline,
    version: NEXORBIT_CONFIG.version,
    environment: NEXORBIT_CONFIG.env,
    architecture: {
      userIsolation: 'ACTIVE',
      firestoreSecurityRules: 'CONFIGURED',
      creditSystem: 'SERVER_AUTHORITATIVE',
      subscriptionTier: 'FREE_AND_PRO',
      aiGateway: 'MODEL_ROUTING_ACTIVE',
      personalBrain: 'CONTEXT_ENGINE_ACTIVE',
      connectorAbstraction: 'UNIFIED_INTERFACE',
      actionLifecycle: 'PREPARE_TO_COMPLETE_STAGES',
    },
    timestamp: new Date().toISOString(),
  });
}
