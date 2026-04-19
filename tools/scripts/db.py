"""共有 SQLite 接続ヘルパー"""

import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # tools/
REPO_ROOT = ROOT.parent
DB_PATH = REPO_ROOT / 'web' / 'data' / 'danin-log.db'


def get_connection(readonly=False) -> sqlite3.Connection:
    """FK 有効・Row factory 付きの接続を返す"""
    uri = f'file:{DB_PATH}'
    if readonly:
        uri += '?mode=ro'
    conn = sqlite3.connect(uri, uri=True)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn


def get_readonly_connection() -> sqlite3.Connection:
    return get_connection(readonly=True)
