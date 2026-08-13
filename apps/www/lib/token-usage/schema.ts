import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  doublePrecision,
  date,
  timestamp,
  jsonb,
  boolean,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// ============================================================
// MyCCusage schema (Claude Code usage tracking)
// ============================================================

export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  deviceId: varchar('device_id', { length: 255 }).notNull().unique(),
  deviceName: varchar('device_name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usageRecords = pgTable(
  'usage_records',
  {
    id: serial('id').primaryKey(),
    deviceId: varchar('device_id', { length: 255 }).notNull(),
    agentType: varchar('agent_type', { length: 50 }).notNull().default('claude-code'),
    date: date('date').notNull(),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    cacheCreationTokens: integer('cache_creation_tokens').notNull().default(0),
    cacheReadTokens: integer('cache_read_tokens').notNull().default(0),
    totalTokens: integer('total_tokens').notNull().default(0),
    totalCost: numeric('total_cost', { precision: 10, scale: 4 })
      .notNull()
      .default('0'),
    credits: numeric('credits', { precision: 10, scale: 4 }).default('0'),
    modelsUsed: jsonb('models_used').notNull().default([]),
    rawData: jsonb('raw_data').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('usage_records_device_date_agent_idx').on(
      table.deviceId,
      table.date,
      table.agentType,
    ),
    index('usage_records_date_idx').on(table.date),
  ],
);

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
