import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { Button, Text, Card, DataTable, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RaceCourses, BetTypes, getEnumList } from '../constants/MasterDataEnum';
import FormDropdown from '../components/FormDropdown';
import FormDatePicker from '../components/FormDatePicker';
import { searchRecords, deleteRecord, BettingRecord } from '../db/database';

const ALL_ID = -1;

export default function SearchScreen() {
  const navigation = useNavigation();

  // 日付フォーマット関数 (YYYY-MM-DD, ローカル時間)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 初期値: 当月の初日と末日
  const getInitialDates = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: formatDate(first), end: formatDate(last) };
  };

  const initialDates = getInitialDates();
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [raceCourse, setRaceCourse] = useState<number | undefined>(undefined);
  const [betType, setBetType] = useState<number | undefined>(undefined);
  const [records, setRecords] = useState<BettingRecord[]>([]);

  // 初回ロード時に全件表示するか、あるいは検索ボタンを押すまで表示しないか。
  // ここでは初回は全件表示にしておく
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    const criteria = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      race_course: raceCourse,
      bet_type: betType,
    };
    const result = await searchRecords(criteria);
    setRecords(result);
  };

  const handleQuote = (record: BettingRecord) => {
    // @ts-ignore
    navigation.navigate('登録', { initialData: record });
  };

  const handleDelete = (id: number) => {
    if (Platform.OS === 'web') {
      Alert.alert('確認', 'Web版では削除機能は無効です');
      return;
    }

    Alert.alert(
      '削除確認',
      'この記録を削除してもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecord(id);
              // 削除後にリストを更新
              handleSearch();
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  // 収支計算
  const totalStake = records.reduce((sum, record) => sum + record.stake, 0);
  const totalPayout = records.reduce((sum, record) => sum + record.payout, 0);
  const totalProfit = totalPayout - totalStake;
  const profitColor = totalProfit > 0 ? 'blue' : totalProfit < 0 ? 'red' : 'black';

  return (
    <View style={styles.container}>
      <Card style={styles.filterContainer}>
        <Card.Content>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormDatePicker
                label="開始日"
                value={startDate ? new Date(startDate) : new Date()}
                onChange={(d) => setStartDate(formatDate(d))}
              />
            </View>
            <View style={{ width: 10 }} />
            <View style={{ flex: 1 }}>
              <FormDatePicker
                label="終了日"
                value={endDate ? new Date(endDate) : new Date()}
                onChange={(d) => setEndDate(formatDate(d))}
              />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormDropdown
                label="競馬場"
                value={raceCourse ?? ALL_ID}
                onSelect={(val) => setRaceCourse(val === ALL_ID ? undefined : val)}
                options={[{ id: ALL_ID, name: '全ての競馬場' }, ...getEnumList(RaceCourses)]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormDropdown
                label="券種"
                value={betType ?? ALL_ID}
                onSelect={(val) => setBetType(val === ALL_ID ? undefined : val)}
                options={[{ id: ALL_ID, name: '全ての券種' }, ...getEnumList(BetTypes)]}
              />
            </View>
          </View>

          <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
            検索
          </Button>
        </Card.Content>
      </Card>

      {/* 収支サマリー */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryRow}>
            <Text variant="bodyMedium">購入: {totalStake.toLocaleString()}円</Text>
            <Text variant="bodyMedium">払戻: {totalPayout.toLocaleString()}円</Text>
          </View>
          <Text style={[styles.totalProfit, { color: profitColor }]}>
            収支: {totalProfit > 0 ? '+' : ''}{totalProfit.toLocaleString()}円
          </Text>
        </Card.Content>
      </Card>

      {/* テーブル表示 */}
      <ScrollView horizontal style={styles.tableContainer}>
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ width: 100 }}>日付</DataTable.Title>
              <DataTable.Title style={{ width: 80 }}>競馬場</DataTable.Title>
              <DataTable.Title style={{ width: 40 }}>R</DataTable.Title>
              <DataTable.Title style={{ width: 60 }}>券種</DataTable.Title>
              <DataTable.Title numeric style={{ width: 80 }}>購入</DataTable.Title>
              <DataTable.Title numeric style={{ width: 80 }}>払戻</DataTable.Title>
              <DataTable.Title numeric style={{ width: 80 }}>収支</DataTable.Title>
              <DataTable.Title style={{ width: 50 }}>{null}</DataTable.Title>
              <DataTable.Title style={{ width: 100 }}>{null}</DataTable.Title>
            </DataTable.Header>

            <ScrollView style={{ maxHeight: 400 }}>
              {records.map((item) => {
                const itemProfit = item.payout - item.stake;
                const itemProfitColor = itemProfit > 0 ? 'blue' : itemProfit < 0 ? 'red' : 'black';
                return (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell style={{ width: 100 }}>{item.date}</DataTable.Cell>
                    <DataTable.Cell style={{ width: 80 }}>{RaceCourses[item.race_course]}</DataTable.Cell>
                    <DataTable.Cell style={{ width: 40 }}>{item.race_number}R</DataTable.Cell>
                    <DataTable.Cell style={{ width: 60 }}>{BetTypes[item.bet_type]}</DataTable.Cell>
                    <DataTable.Cell numeric style={{ width: 80 }}>{item.stake.toLocaleString()}</DataTable.Cell>
                    <DataTable.Cell numeric style={{ width: 80 }}>{item.payout.toLocaleString()}</DataTable.Cell>
                    <DataTable.Cell numeric style={{ width: 80 }}>
                      <Text style={{ color: itemProfitColor }}>
                        {itemProfit > 0 ? '+' : ''}{itemProfit.toLocaleString()}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ width: 50 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <IconButton
                          icon="content-copy"
                          size={20}
                          onPress={() => handleQuote(item)}
                        />
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ width: 100 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => item.id && handleDelete(item.id)}
                        />
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </ScrollView>
          </DataTable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    margin: 10,
    marginBottom: 5,
  },
  summaryCard: {
    margin: 10,
    marginTop: 0,
    marginBottom: 5,
    backgroundColor: '#e8f5e9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  totalProfit: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 5,
  },
  searchButton: {
    marginTop: 5,
  },
});
