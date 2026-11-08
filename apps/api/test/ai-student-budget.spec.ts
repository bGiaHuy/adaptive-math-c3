import 'reflect-metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { aiConfig } from '../src/modules/ai/ai.config';
import { AiBudgetService } from '../src/modules/ai/ai-budget.service';

afterEach(() => vi.unstubAllEnvs());

function setup(options: { day?: number; userDay?: number; requests?: number; concurrent?: number } = {}) {
  for (const [key, value] of Object.entries({
    AI_ENABLED: 'false', AI_PROVIDER: 'anthropic', AI_MODEL: 'claude-sonnet-4-6',
    AI_USER_DAILY_BUDGET_USD: 'unlimited', AI_LIFETIME_BUDGET_USD: '90',
    AI_MONTHLY_BUDGET_USD: '30', AI_DAILY_BUDGET_USD: '5',
    AI_USER_DAILY_REQUESTS: '40', AI_USER_REQUESTS_PER_MINUTE: '6',
    AI_IP_REQUESTS_PER_MINUTE: '30', AI_MAX_CONCURRENT_REQUESTS: '4'
  })) vi.stubEnv(key, value);
  const day = options.day ?? 0.3;
  const aggregate = vi.fn();
  for (const costUsd of [day, day, day, options.userDay ?? day]) {
    aggregate.mockResolvedValueOnce({ _sum: { costUsd, reservedUsd: 0 } });
  }
  const count = vi.fn();
  for (const value of [options.requests ?? 0, 0, 0, options.concurrent ?? 0, 0]) {
    count.mockResolvedValueOnce(value);
  }
  const create = vi.fn().mockResolvedValue({ id: 'request' });
  const tx = { $queryRaw: vi.fn(), aiRequest: { aggregate, count, create } };
  const service = new AiBudgetService({ $transaction: (fn: any) => fn(tx) } as any);
  return { service, create };
}

const request = {
  userId: 'student', ipHash: 'test', task: 'MATH_TUTOR',
  model: 'claude-sonnet-4-6', reservedUsd: 0.3
};

describe('Student AI spending cap configuration', () => {
  it('keeps the existing default and validates numeric caps', () => {
    expect(aiConfig({}).userDailyUsd).toBe(0.15);
    expect(aiConfig({ AI_USER_DAILY_BUDGET_USD: '0.5' }).userDailyUsd).toBe(0.5);
    expect(() => aiConfig({ AI_USER_DAILY_BUDGET_USD: '0' })).toThrow('Invalid AI_USER_DAILY_BUDGET_USD');
    expect(() => aiConfig({ AI_USER_DAILY_BUDGET_USD: 'invalid' })).toThrow('Invalid AI_USER_DAILY_BUDGET_USD');
    expect(aiConfig({ AI_USER_DAILY_BUDGET_USD: 'unlimited' }).userDailyUsd).toBeNull();
  });

  it('admits Sonnet reservations above the old per-student spending cap', async () => {
    const { service, create } = setup();
    await expect(service.reserve(request)).resolves.toEqual({ id: 'request' });
    expect(create).toHaveBeenCalledWith({ data: request });
  });

  it('still enforces an explicitly configured per-student spending cap', async () => {
    const { service, create } = setup();
    vi.stubEnv('AI_USER_DAILY_BUDGET_USD', '0.15');
    await expect(service.reserve(request)).rejects.toMatchObject({ response: { code: 'AI_USER_LIMIT' } });
    expect(create).not.toHaveBeenCalled();
  });

  it('still enforces the global daily budget when student spending is unlimited', async () => {
    const { service, create } = setup({ day: 4.9 });
    await expect(service.reserve(request)).rejects.toMatchObject({ response: { code: 'AI_BUDGET_EXHAUSTED' } });
    expect(create).not.toHaveBeenCalled();
  });

  it('preserves request-count and concurrency controls', async () => {
    await expect(setup({ requests: 40 }).service.reserve(request)).rejects.toMatchObject({ response: { code: 'AI_USER_LIMIT' } });
    await expect(setup({ concurrent: 4 }).service.reserve(request)).rejects.toMatchObject({ response: { code: 'AI_RATE_LIMIT' } });
  });

  it('reports available student spending without changing the usage response shape', async () => {
    setup();
    const db = { aiRequest: {
      aggregate: vi.fn().mockResolvedValue({ _sum: { costUsd: 2, reservedUsd: 0 } }),
      count: vi.fn().mockResolvedValue(1)
    } };
    const service = new AiBudgetService(db as any);
    expect(await service.usage('student', false)).toMatchObject({ budgetRemaining: true, remainingRequests: 39 });
    vi.stubEnv('AI_USER_DAILY_BUDGET_USD', '0.15');
    expect(await service.usage('student', false)).toMatchObject({ budgetRemaining: false, remainingRequests: 39 });
  });
});
