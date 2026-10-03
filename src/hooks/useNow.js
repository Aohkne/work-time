import { useEffect, useState } from 'react'

// Tick đúng lúc sang giây mới để đồng hồ không bị lệch nhịp.
export function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer
    const tick = () => {
      const date = new Date()
      setNow(date)
      timer = setTimeout(tick, 1000 - date.getMilliseconds())
    }
    timer = setTimeout(tick, 1000 - new Date().getMilliseconds())
    return () => clearTimeout(timer)
  }, [])

  return now
}
