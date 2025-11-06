// src/utils/idb.js
import { openDB } from 'idb'

const DB_NAME = 'resume-db'
const STORE_FILE = 'pdf-files'
const STORE_META = 'pdf-meta'

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_FILE)) db.createObjectStore(STORE_FILE)
      if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META, { keyPath: 'id' })
    }
  })
}

/** 保存 PDF 二进制 */
export async function savePDF(id, blob) {
  const db = await getDB()
  await db.put(STORE_FILE, blob, id)
}

/** 读取 PDF 二进制 */
export async function getPDF(id) {
  const db = await getDB()
  return db.get(STORE_FILE, id)
}

/** 删除 PDF + 元信息 */
export async function deletePDF(id) {
  const db = await getDB()
  await db.delete(STORE_FILE, id)
  await db.delete(STORE_META, id)
}

/** 列出所有元信息（倒序） */
export async function listMeta() {
  const db = await getDB()
  const all = await db.getAll(STORE_META)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

/** 保存元信息 */
export async function saveMeta(meta) {
  const db = await getDB()
  await db.put(STORE_META, meta)
}
