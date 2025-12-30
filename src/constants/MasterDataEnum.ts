export type EnumMap = Record<number, string>;
export type EnumItem = { id: number; name: string };
export const NO_SELECTION_ID = 0;

// 競馬場名
export const RaceCourses: EnumMap = {
  [NO_SELECTION_ID]: '選択なし',
  1: '札幌', 2: '函館', 3: '福島', 4: '新潟',
  5: '東京', 6: '中山', 7: '中京', 8: '京都',
  9: '阪神', 10: '小倉',
  // 地方競馬
  11: '門別', 12: '帯広(ばんえい)', 13: '盛岡', 14: '水沢',
  15: '浦和', 16: '船橋', 17: '大井', 18: '川崎',
  19: '金沢', 20: '笠松', 21: '名古屋', 22: '園田',
  23: '姫路', 24: '高知', 25: '佐賀',
  // その他
  99: '海外'
};

// レース番号
export const RaceNumbers: EnumMap = (() => {
  const nums: EnumMap = { [NO_SELECTION_ID]: '選択なし' };
  for (let i = 1; i <= 12; i++) {
    nums[i] = `${i}R`;
  }
  return nums;
})();

// 芝かダートか
export const Surfaces: EnumMap = {
  [NO_SELECTION_ID]: '選択なし',
  1: '芝', 2: 'ダート', 3: '障害'
};

// 距離 (主要なもの)
export const Distances: EnumMap = {
  [NO_SELECTION_ID]: '選択なし',
  1000: '1000m', 1200: '1200m', 1300: '1300m', 1400: '1400m', 1500: '1500m', 1600: '1600m',
  1700: '1700m', 1800: '1800m', 2000: '2000m', 2200: '2200m',
  2400: '2400m', 2500: '2500m', 3000: '3000m', 3200: '3200m',
  3600: '3600m'
};

// クラス
export const RaceClasses: EnumMap = {
  [NO_SELECTION_ID]: '選択なし',
  1: '新馬', 2: '未勝利', 3: '1勝クラス', 4: '2勝クラス',
  5: '3勝クラス', 6: 'オープン(L)', 7: 'オープン(OP)',
  8: 'G3', 9: 'G2', 10: 'G1',
  11: '平場（地方）', 12: '重賞（地方）', 13: '交流重賞（地方）'
};

// 券種
export const BetTypes: EnumMap = {
  [NO_SELECTION_ID]: '選択なし',
  1: '単勝', 2: '複勝', 3: '枠連', 4: '馬連',
  5: 'ワイド', 6: '馬単', 7: '3連複', 8: '3連単', 9: 'WIN5'
};

// 頭数
export const FieldSizes: EnumMap = (() => {
  const sizes: EnumMap = { [NO_SELECTION_ID]: '選択なし' };
  for (let i = 2; i <= 40; i++) {
    sizes[i] = `${i}頭`;
  }
  return sizes;
})();

// 選択肢リストとして使うためのヘルパー関数
export const getEnumList = (enumObj: EnumMap): EnumItem[] => {
  return Object.keys(enumObj).map(key => ({
    id: Number(key),
    name: enumObj[Number(key)]
  }));
};
