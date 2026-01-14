# Calanda - 競馬収支管理アプリ

Calandaは、React Native (Expo) を使用して開発された競馬の収支記録・管理アプリケーションです。
日々の投票履歴を記録し、SQLiteを使用して端末内にデータを保存・管理することができます。

## 機能

- **収支登録機能**: 日付、競馬場、レース番号、馬場状態、距離、頭数、クラス、券種、購入金額、払戻金、メモなどの詳細情報を記録。
- **履歴検索・閲覧**: 登録した収支データの検索と一覧表示。
- **データ永続化**: SQLiteを使用したローカルデータベースへの保存により、オフラインでもデータの参照・更新が可能。

## 技術スタック

### フロントエンド / フレームワーク
- **React Native**: 0.81.5
- **Expo SDK**: 54
- **Language**: TypeScript
- **UI Component Library**: React Native Paper
- **Navigation**: React Navigation 7 (Bottom Tabs)

### データベース / ストレージ
- **Database**: Expo SQLite

### その他主要ライブラリ
- **Forms**: @react-native-picker/picker, @react-native-community/datetimepicker
- **Icons**: @expo/vector-icons

## 開発環境のセットアップ

### 必要要件
- Node.js
- npm または yarn

### インストール手順

プロジェクトディレクトリへ移動し、依存パッケージをインストールします。

```bash
npm install
```

## アプリケーションの実行

開発サーバー（Expo Go）を起動します。

```bash
npx expo start
# または
npm start
```

実行後、ターミナルにQRコードが表示されます。
スマートフォンの **Expo Go** アプリでこのQRコードをスキャンすることで、実機でのテストが可能です。

また、以下のショートカットキーも利用できます：
- **Android**: `a` を押す（エミュレーター起動）
- **iOS**: `i` を押す（macOSのみ、シミュレーター起動）
- **Web**: `w` を押す

## ビルド・デプロイ

EAS Buildを使用してビルドを行います。

### Android プレビュービルド
実機確認用のapkを作成するコマンドです。
**注意**: Expoの無料プランでは月間のビルド数に制限があります。

```bash
npx eas-cli build --platform android --profile preview
```

## ディレクトリ構成

```
src/
├── components/     # 再利用可能なUIコンポーネント (Form部品など)
├── constants/      # 定数定義 (マスタデータ、Enumなど)
├── db/            # データベース接続・操作ロジック
└── screens/        # 画面コンポーネント (登録画面、検索画面など)
```