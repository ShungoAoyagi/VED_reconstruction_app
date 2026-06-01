"""Entry point for PyInstaller-bundled executable. Accepts port as first argument."""
import sys
import multiprocessing
import uvicorn
from main import app  # direct import required in frozen PyInstaller bundles

if __name__ == '__main__':
    multiprocessing.freeze_support()  # required for Windows PyInstaller
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    uvicorn.run(app, host='localhost', port=port)
