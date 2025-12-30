import * as SQLite from 'expo-sqlite';

const dbName = 'calanda_horse_racing.db';

// レコードの型定義
export type BettingRecord = {
  id?: number;
  date: string;
  race_course: number;
  race_number: number;
  surface: number;
  distance: number;
  field_size: number;
  class: number;
  bet_type: number;
  stake: number;
  payout: number;
  memo: string;
};

// データベースを開く
let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(dbName);
  }
  return dbInstance;
};

// テーブル作成（初期化）
export const initDatabase = async () => {
  const db = await getDb();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS betting_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,           -- 購入日
        race_course INTEGER, -- 競馬場 (Enum)
        race_number INTEGER, -- レース番号
        surface INTEGER,     -- 芝/ダート (Enum)
        distance INTEGER,    -- 距離 (Enum)
        field_size INTEGER,  -- 頭数
        class INTEGER,       -- 格 (Enum)
        bet_type INTEGER,    -- 券種 (Enum)
        stake INTEGER,       -- 購入金額
        payout INTEGER,      -- 払い戻し
        memo TEXT            -- 備考
      );
    `);

    console.log('Database initialized.');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// データを追加する
export const addRecord = async (record: Omit<BettingRecord, 'id'>) => {
  const db = await getDb();
  const { date, race_course, race_number, surface, distance, field_size, class: raceClass, bet_type, stake, payout, memo } = record;
  try {
    const result = await db.runAsync(
      `INSERT INTO betting_log (date, race_course, race_number, surface, distance, field_size, class, bet_type, stake, payout, memo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [date, race_course, race_number, surface, distance, field_size, raceClass, bet_type, stake, payout, memo]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to add record:', error);
    throw error;
  }
};

// 全データを取得する
export const getRecords = async (): Promise<BettingRecord[]> => {
  const db = await getDb();
  try {
    return await db.getAllAsync('SELECT * FROM betting_log ORDER BY id DESC');
  } catch (error) {
    console.error('Failed to get records:', error);
    return [];
  }
};

// 検索条件の型
export type SearchCriteria = {
  startDate?: string;
  endDate?: string;
  race_course?: number;
  bet_type?: number;
};

// 検索機能
export const searchRecords = async (criteria: SearchCriteria): Promise<BettingRecord[]> => {
  const db = await getDb();
  let query = 'SELECT * FROM betting_log WHERE 1=1';
  const params: any[] = [];

  if (criteria.startDate) {
    query += ' AND date >= ?';
    params.push(criteria.startDate);
  }
  if (criteria.endDate) {
    query += ' AND date <= ?';
    params.push(criteria.endDate);
  }
  if (criteria.race_course) {
    query += ' AND race_course = ?';
    params.push(criteria.race_course);
  }
  if (criteria.bet_type) {
    query += ' AND bet_type = ?';
    params.push(criteria.bet_type);
  }

  query += ' ORDER BY date DESC, id DESC';

  try {
    return await db.getAllAsync(query, params);
  } catch (error) {
    console.error('Failed to search records:', error);
    return [];
  }
};

// レコードを削除する
export const deleteRecord = async (id: number) => {
  const db = await getDb();
  try {
    await db.runAsync('DELETE FROM betting_log WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete record:', error);
    throw error;
  }
};
