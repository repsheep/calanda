import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { RaceCourses, RaceNumbers, Surfaces, Distances, RaceClasses, BetTypes, FieldSizes, getEnumList, NO_SELECTION_ID } from '../constants/MasterDataEnum';
import { addRecord } from '../db/database';
import FormDropdown from '../components/FormDropdown';
import FormDatePicker from '../components/FormDatePicker';

export default function RegisterScreen() {
  // ローカルタイムで YYYY-MM-DD を取得する関数
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getLocalDateString(new Date())); // YYYY-MM-DD
  const [raceCourse, setRaceCourse] = useState<number>(NO_SELECTION_ID);
  const [raceNumber, setRaceNumber] = useState<number>(NO_SELECTION_ID);
  const [surface, setSurface] = useState<number>(NO_SELECTION_ID);
  const [distance, setDistance] = useState<number>(NO_SELECTION_ID);
  const [fieldSize, setFieldSize] = useState<number>(NO_SELECTION_ID);
  const [raceClass, setRaceClass] = useState<number>(NO_SELECTION_ID);
  const [betType, setBetType] = useState<number>(NO_SELECTION_ID);
  const [stake, setStake] = useState('');
  const [payout, setPayout] = useState('');
  const [memo, setMemo] = useState('');

  const handleSave = async () => {
    // 必須項目チェック
    if (!date || !raceCourse || raceCourse === NO_SELECTION_ID || !raceNumber || raceNumber === NO_SELECTION_ID || !stake || !payout) {
      Alert.alert('エラー', '必須項目（日付、競馬場、レース、購入金額、払戻金額）を入力してください');
      return;
    }

    // バリデーション: 金額 (100円単位)
    const stakeNum = Number(stake);
    if (isNaN(stakeNum) || stakeNum <= 0 || stakeNum % 100 !== 0) {
      Alert.alert('エラー', '購入金額は100円単位で入力してください');
      return;
    }

    const payoutNum = Number(payout);
    if (isNaN(payoutNum) || payoutNum < 0 || payoutNum % 100 !== 0) {
      Alert.alert('エラー', '払戻金額は100円単位で入力してください');
      return;
    }

    // バリデーション: メモ (文字数 & SQLインジェクション対策)
    if (memo.length > 400) {
      Alert.alert('エラー', 'メモは400文字以内で入力してください');
      return;
    }
    // ※expo-sqliteはプリペアドステートメントを使用しているが念のため
    const dangerousPatterns = /(--|;)/;
    if (dangerousPatterns.test(memo)) {
      Alert.alert('エラー', 'メモに無効な記号(--, ;)が含まれています');
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert('確認', 'Web版では保存機能は無効です（UI確認のみ）');
      return;
    }

    try {
      await addRecord({
        date,
        race_course: raceCourse,
        race_number: raceNumber,
        surface: surface,
        distance: distance,
        field_size: fieldSize,
        class: raceClass,
        bet_type: betType,
        stake: Number(stake),
        payout: Number(payout),
        memo
      });
      Alert.alert('成功', '記録を保存しました');
      // フォームリセット
      setRaceCourse(NO_SELECTION_ID);
      setRaceNumber(NO_SELECTION_ID);
      setSurface(NO_SELECTION_ID);
      setDistance(NO_SELECTION_ID);
      setFieldSize(NO_SELECTION_ID);
      setRaceClass(NO_SELECTION_ID);
      setBetType(NO_SELECTION_ID);
      setStake('');
      setPayout('');
      setMemo('');
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <FormDatePicker
              label="日付 *"
              value={new Date(date)}
              onChange={(d) => setDate(getLocalDateString(d))}
            />

            <FormDropdown
              label="競馬場 *"
              value={raceCourse}
              onSelect={setRaceCourse}
              options={getEnumList(RaceCourses)}
            />

            <FormDropdown
              label="レース *"
              value={raceNumber}
              onSelect={setRaceNumber}
              options={getEnumList(RaceNumbers)}
            />

            <FormDropdown
              label="馬場"
              value={surface}
              onSelect={setSurface}
              options={getEnumList(Surfaces)}
            />

            <FormDropdown
              label="距離"
              value={distance}
              onSelect={setDistance}
              options={getEnumList(Distances)}
            />

            <FormDropdown
              label="頭数"
              value={fieldSize}
              onSelect={setFieldSize}
              options={getEnumList(FieldSizes)}
            />

            <FormDropdown
              label="クラス"
              value={raceClass}
              onSelect={setRaceClass}
              options={getEnumList(RaceClasses)}
            />

            <FormDropdown
              label="券種"
              value={betType}
              onSelect={setBetType}
              options={getEnumList(BetTypes)}
            />

            <TextInput
              label="購入金額 *"
              value={stake}
              onChangeText={setStake}
              keyboardType="numeric"
              mode="outlined"
              placeholder="例: 500"
              style={styles.input}
              right={<TextInput.Affix text="円" />}
            />

            <TextInput
              label="払戻金額 *"
              value={payout}
              onChangeText={setPayout}
              keyboardType="numeric"
              mode="outlined"
              placeholder="例: 0"
              style={styles.input}
              right={<TextInput.Affix text="円" />}
            />

            <TextInput
              label="メモ"
              value={memo}
              onChangeText={setMemo}
              multiline
              numberOfLines={3}
              mode="outlined"
              placeholder="レース名などを入力"
              style={styles.input}
            />

            <Button mode="contained" onPress={handleSave} style={styles.button}>
              登録する
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 50,
  },
  card: {
    padding: 5,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
});
