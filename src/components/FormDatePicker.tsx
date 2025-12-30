import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Platform, Modal, TouchableOpacity, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Props = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

export default function FormDatePicker({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Androidは選択したら自動で閉じる
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const closeDatepicker = () => {
    setShow(false);
  };

  // YYYY-MM-DD 形式に変換
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={showDatepicker}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={formatDate(value)}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
            style={styles.input}
          />
        </View>
      </Pressable>
      
      {/* iOS用の表示制御 */}
      {show && Platform.OS === 'ios' && (
        <Modal transparent={true} animationType="fade" visible={show}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeDatepicker}>
                  <Text style={styles.doneButton}>完了</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                value={value}
                mode="date"
                is24Hour={true}
                onChange={handleChange}
                display="spinner"
                locale="ja-JP"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android & Web用 */}
      {show && Platform.OS !== 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode="date"
          is24Hour={true}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  doneButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
