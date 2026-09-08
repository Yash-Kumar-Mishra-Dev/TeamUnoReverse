import Dexie, { Table } from 'dexie';
import { OfflineMutation } from '../types';

export class RakshaSetuOfflineDB extends Dexie {
  mutations!: Table<OfflineMutation>;

  constructor() {
    super('RakshaSetuOfflineDB');
    this.version(1).stores({
      mutations: '++id, type, timestamp'
    });
  }
}

export const db = new RakshaSetuOfflineDB();
