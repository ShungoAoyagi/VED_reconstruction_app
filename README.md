# VED Reconstruction App

電子密度を再構成するゲームアプリ。ElectronフロントエンドとPython (FastAPI) バックエンドで構成されています。

## 開発環境のセットアップ

### 必要なもの

- Node.js 18+
- Python 3.10+

### バックエンドのセットアップ

```powershell
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
```

### フロントエンドのセットアップ

```powershell
cd frontend
npm install
```

### 開発サーバーの起動

```powershell
cd frontend
npm run dev
```

バックエンドは自動的に起動されます（`backend/.venv` の Python を使用）。

---

## Windows向けのコンパイル（Python環境不要な配布物を作る）

Python環境がない Windows マシンでも動作する `.exe` インストーラーを作成する手順です。

### 前提条件

- Windows マシン上で実行すること（クロスコンパイル不可）
- `backend/.venv` がセットアップ済みであること

### 手順1: PyInstaller をインストール

```powershell
cd backend
.venv\Scripts\pip install pyinstaller
```

### 手順2: バックエンドを exe にコンパイル

```powershell
cd backend
.venv\Scripts\pyinstaller `
  --onefile `
  --name ved_backend `
  --add-data "..\data;data" `
  --hidden-import uvicorn.logging `
  --hidden-import uvicorn.loops `
  --hidden-import uvicorn.loops.auto `
  --hidden-import uvicorn.protocols `
  --hidden-import uvicorn.protocols.http `
  --hidden-import uvicorn.protocols.http.auto `
  --hidden-import uvicorn.protocols.websockets `
  --hidden-import uvicorn.protocols.websockets.auto `
  --hidden-import uvicorn.lifespan `
  --hidden-import uvicorn.lifespan.on `
  --distpath ..\frontend\resources\backend-win `
  server.py
```

完了すると `frontend/resources/backend-win/ved_backend.exe` が生成されます。

### 手順3: Electron アプリをビルド

```powershell
cd frontend
npm run build:win
```

`dist/` に Windows インストーラー (`.exe`) が生成されます。

### 仕組み

- パッケージ済みアプリ起動時、`ved_backend.exe <port>` が自動的に起動します
- `electron-builder.yml` の `extraResources` 設定により `backend-win/` がアプリに同梱されます
- システムの Python は一切不要です
