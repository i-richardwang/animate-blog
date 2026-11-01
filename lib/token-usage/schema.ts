import {
  pgTable,
  serial,
  varchar,
  integer,
  bigint,
  numeric,
  doublePrecision,
  date,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

// Read-only mirrors of tables other projects own and migrate. Columns are
// declared as upstream defines them; keys and indexes are left to the owners.

// ============================================================
// MyCCusage schema (coding-agent CLI usage: Claude Code, Codex, Amp, ...)
// ============================================================

// One row is the usage of one agent with one model on one device, in one hour
// of the account calendar when hour_start is set, otherwise in a whole day
// (sources and days whose hours are unknown). `date` is the day in the
// account's time zone (USAGE_TIMEZONE on the MyCCusage side, default
// Asia/Shanghai), not UTC. Model "" holds usage the source did not attribute
// to a model, mostly days synced before per-model collection existed.
export const usageBuckets = pgTable('usage_buckets', {
  id: serial('id').primaryKey(),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  agentType: varchar('agent_type', { length: 50 }).notNull(),
  date: date('date').notNull(),
  hourStart: timestamp('hour_start', { withTimezone: true }),
  model: varchar('model', { length: 255 }).notNull().default(''),
  // Excludes cache reads and writes
  inputTokens: bigint('input_tokens', { mode: 'number' }).notNull().default(0),
  // Includes reasoning
  outputTokens: bigint('output_tokens', { mode: 'number' })
    .notNull()
    .default(0),
  cacheCreationTokens: bigint('cache_creation_tokens', { mode: 'number' })
    .notNull()
    .default(0),
  cacheReadTokens: bigint('cache_read_tokens', { mode: 'number' })
    .notNull()
    .default(0),
  // Part of output; null where the source does not report it
  reasoningTokens: bigint('reasoning_tokens', { mode: 'number' }),
  totalTokens: bigint('total_tokens', { mode: 'number' }).notNull().default(0),
  cost: numeric('cost', { precision: 14, scale: 6 }).notNull().default('0'),
  // API requests; null where the source does not count them
  requests: integer('requests'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================
// LLMeter schema (LLM API usage via Bifrost gateway)
// ============================================================

// Reads from `logs_archive`: the metadata-only replica of the Bifrost gateway's
// `logs` table, synced by bifrost-log-archive (content columns are dropped, all
// analytics/cost columns kept). See bifrost-log-archive/01_schema.sql.
export const logs = pgTable('logs_archive', {
  id: varchar('id').primaryKey(),
  parentRequestId: varchar('parent_request_id'),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  objectType: varchar('object_type').notNull(),
  provider: varchar('provider').notNull(),
  model: varchar('model').notNull(),
  numberOfRetries: integer('number_of_retries'),
  fallbackIndex: integer('fallback_index'),
  selectedKeyId: varchar('selected_key_id'),
  selectedKeyName: varchar('selected_key_name'),
  virtualKeyId: varchar('virtual_key_id'),
  virtualKeyName: varchar('virtual_key_name'),
  promptTokens: integer('prompt_tokens'),
  completionTokens: integer('completion_tokens'),
  totalTokens: integer('total_tokens'),
  // Native column on the source table, fully populated and identical to the
  // value previously parsed out of token_usage JSON. Used directly for speed.
  cachedReadTokens: integer('cached_read_tokens'),
  // What the gateway itself billed. Kept as the archive's audit baseline but
  // NOT what these queries sum: gateways record NULL or 0 for whole providers
  // (subscription routes, free channels, models missing from their price
  // table), so summing it silently undercounts.
  cost: doublePrecision('cost'),
  // Filled by the archive's pricing pass: the gateway's own figure where it
  // billed something, otherwise the usage valued at the model vendor's list
  // price. costBasis says which ('gateway' | 'listprice' | 'unpriced').
  costEffective: doublePrecision('cost_effective'),
  costBasis: varchar('cost_basis'),
  // Canonical model behind `model`, resolved by the archive's alias table.
  // Unused here -- model grouping still runs through normalizeModelName(),
  // whose prefix stripping also handles models the archive has no alias for.
  modelKey: varchar('model_key'),
  latency: doublePrecision('latency'),
  status: varchar('status').notNull(),
  stream: boolean('stream').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});
