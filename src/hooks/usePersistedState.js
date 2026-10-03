import { useEffect, useState } from 'react'

// Lưu theo key; key đổi (vd. sang ngày mới) thì đọc lại giá trị tương ứng.
export function usePersistedState(key, fallback) {
  const read = () => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  }

  const [state, setState] = useState(read)
  const [loadedKey, setLoadedKey] = useState(key)

  if (loadedKey !== key) {
    setLoadedKey(key)
    setState(read())
  }

  useEffect(() => {
    try {
      if (state === null || state === undefined) localStorage.removeItem(key)
      else localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* storage bị chặn */
    }
  }, [key, state])

  return [state, setState]
}
