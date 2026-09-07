import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db/index';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    const result = queryOne<{ alive: number }>('SELECT 1 as alive;');
    dbLatencyMs = Date.now() - dbStart;
    if (!result || result.alive !== 1) {
      dbStatus = 'degraded';
    }
  } catch (err: any) {
    dbStatus = `unhealthy: ${err.message}`;
  }

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.round(process.uptime());

  const isHealthy = dbStatus === 'healthy';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'agroflow-agri-os',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      latencyMs: Date.now() - startTime,
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        engine: 'sqlite-wal',
      },
      system: {
        memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        memoryHeapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
      },
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
