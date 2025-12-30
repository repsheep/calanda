import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { TextInput, Text, TouchableRipple, Surface } from 'react-native-paper';

type Option = {
  id: number;
  name: string;
};

type Props = {
  label: string;
  value: number | undefined;
  onSelect: (value: number) => void;
  options: Option[];
};

export default function FormDropdown({ label, value, onSelect, options }: Props) {
  const [visible, setVisible] = useState(false);
  
  // ドロップダウンの表示位置とサイズ
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

  const buttonRef = useRef<View>(null);

  const openDropdown = () => {
    // ボタンの絶対位置を測る
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      if (!width || pageX === undefined || pageY === undefined) return;

      setDropdownCoords({
        // 入力欄の「真下」に表示
        top: pageY + height, 
        left: pageX,
        width: width,
      });
      setVisible(true);
    });
  };

  const closeDropdown = () => setVisible(false);

  const handleSelect = (id: number) => {
    onSelect(id);
    closeDropdown();
  };

  const selectedName = options.find((opt) => opt.id === value)?.name || '';

  return (
    <>
      {/* 1. トリガー（入力欄） */}
      <View style={styles.container}>
        <Pressable
          ref={buttonRef}
          onPress={openDropdown}
          collapsable={false} 
        >
          <View pointerEvents="none">
            <TextInput
              label={label}
              value={selectedName}
              mode="outlined"
              editable={false}
              placeholder="選択してください"
              right={<TextInput.Icon icon={visible ? "menu-up" : "menu-down"} />}
              style={styles.input}
            />
          </View>
        </Pressable>
      </View>

      {/* 2. モーダル本体 */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
        // Modalの座標系が画面全体（ステータスバー含む）になり
        // measureで取った座標とドンピシャで合うようになる
        statusBarTranslucent={true}
      >
        {/* 背景（ここを押したら閉じる） */}
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.modalOverlay}>
            
            {/* ドロップダウンの中身 */}
            <View
              style={[
                styles.dropdownContent,
                {
                  top: dropdownCoords.top,
                  left: dropdownCoords.left,
                  width: dropdownCoords.width,
                },
              ]}
            >
              <Surface style={styles.surface} elevation={4}>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.id.toString()}
                  style={{ maxHeight: 250 }}
                  // スクロールバーがコンテンツに被らないようにするおまじない
                  persistentScrollbar={true} 
                  renderItem={({ item }) => (
                    <TouchableRipple
                      onPress={() => handleSelect(item.id)}
                      style={styles.optionItem}
                    >
                      <Text style={styles.optionText}>{item.name}</Text>
                    </TouchableRipple>
                  )}
                />
              </Surface>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
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
    backgroundColor: 'transparent',
  },
  dropdownContent: {
    position: 'absolute',
  },
  surface: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: -0.55, 
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
  },
});