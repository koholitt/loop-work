#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/18a86f25360f818b1f0fa2240995e8478370992dfbbd25043046bf86f630f9d9/contract';
import endContract from '../../snapshots/18a86f25360f818b1f0fa2240995e8478370992dfbbd25043046bf86f630f9d9/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8eb112f082e620cd3478d46c7ac84717ec8e9daf28e0749a04496e7d175a938b/contract';
import startContract from '../../snapshots/8eb112f082e620cd3478d46c7ac84717ec8e9daf28e0749a04496e7d175a938b/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  placeholder,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'user', column: 'image' }),
      this.createTable({
        schema: 'public',
        table: 'comment',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('requestId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'request',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('priority', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('responsibleId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'role',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'account',
        column: 'id',
        type: 'int4',
        using: placeholder('Account.id:convert'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'session',
        column: 'id',
        type: 'int4',
        using: placeholder('Session.id:convert'),
      }),
      this.alterColumnType({ schema: 'public', table: 'verification', column: 'id', type: 'int4' }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'user',
        column: 'lastName',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'user',
        column: 'roleId',
        type: 'int4',
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment',
        index: 'comment_requestId_idx_fd667f92',
        columns: ['requestId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment',
        index: 'comment_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'request',
        index: 'request_responsibleId_idx_cc071067',
        columns: ['responsibleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_roleId_idx_ffccc9a4',
        columns: ['roleId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment',
        foreignKey: {
          name: 'comment_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment',
        foreignKey: {
          name: 'comment_requestId_fkey',
          columns: ['requestId'],
          references: { schema: 'public', table: 'request', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'request',
        foreignKey: {
          name: 'request_responsibleId_fkey',
          columns: ['responsibleId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user',
        foreignKey: {
          name: 'user_roleId_fkey',
          columns: ['roleId'],
          references: { schema: 'public', table: 'role', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
