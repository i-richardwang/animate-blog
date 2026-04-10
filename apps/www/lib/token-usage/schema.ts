import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  date,
  timestamp,
  jsonb,
  boolean,
  bigint,
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

export const logs = pgTable('logs', {
  id: varchar('id').primaryKey(),
  parentRequestId: varchar('parent_request_id'),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  objectType: varchar('object_type').notNull(),
  provider: varchar('provider').notNull(),
  model: varchar('model').notNull(),
  numberOfRetries: bigint('number_of_retries', { mode: 'number' }).default(0),
  fallbackIndex: bigint('fallback_index', { mode: 'number' }).default(0),
  selectedKeyId: varchar('selected_key_id'),
  selectedKeyName: varchar('selected_key_name'),
  virtualKeyId: varchar('virtual_key_id'),
  virtualKeyName: varchar('virtual_key_name'),
  promptTokens: bigint('prompt_tokens', { mode: 'number' }).default(0),
  completionTokens: bigint('completion_tokens', { mode: 'number' }).default(0),
  totalTokens: bigint('total_tokens', { mode: 'number' }).default(0),
  cost: numeric('cost'),
  latency: numeric('latency'),
  status: varchar('status').notNull(),
  stream: boolean('stream').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});
