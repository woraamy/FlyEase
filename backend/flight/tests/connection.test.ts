// // tests/connection.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppDataSource } from '../src/data-source';

describe('Database Connection', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('should connect to the database', () => {
    expect(AppDataSource.isInitialized).toBe(true);
  });

  it('should have all entity metadata registered', () => {
    const entityNames = AppDataSource.entityMetadatas.map(metadata => metadata.name);
    expect(entityNames).toContain('Airport');
    expect(entityNames).toContain('Flight');
    expect(entityNames).toContain('TravelClass');
    expect(entityNames).toContain('FlightClassDetail');
  });
});