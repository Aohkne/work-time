import { memo, useEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { Icon } from '@iconify/react'
import { formatClock, formatDuration } from '../lib/workTime.js'

function useCountUp(target) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    if (reduce) {
      from.current = target
      return
    }
    // Lần đầu có kết quả: chạy từ 90 phút trước cho nhanh gọn.
    const start = from.current && from.current !== target ? from.current : target - 90
    const controls = animate(start, target, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    })
    from.current = target
    return () => controls.stop()
  }, [target, reduce])

  return reduce ? target : value
}

function StatusBadge({ schedule }) {
  if (schedule.isLate) {
    return (
      <motion.span
        className="badge badge-late"
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Icon icon="ph:warning-octagon-bold" width={20} />
        Đi trễ {formatDuration(schedule.lateMinutes)}
      </motion.span>
    )
  }
  if (schedule.isEarly) {
    return (
      <span className="badge">
        <Icon icon="ph:sun-horizon-bold" width={20} /> Đến sớm · tính từ 08:30
      </span>
    )
  }
  return (
    <span className="badge">
      <Icon icon="ph:check-circle-bold" width={20} /> Đúng giờ
    </span>
  )
}

function ResultCard({ schedule }) {
  const animatedEnd = useCountUp(schedule ? schedule.end : 0)

  if (!schedule) {
    return (
      <div className="result result-empty">
        <span className="kicker">Giờ tan dự kiến</span>
        <span className="result-time ghost">--:--</span>
        <p className="muted">Nhập giờ vào để xem mấy giờ được về.</p>
      </div>
    )
  }

  const nextDay = schedule.end >= 24 * 60

  return (
    <motion.div
      className="result"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    >
      <span className="kicker">
        <Icon icon="ph:door-open-bold" width={20} /> Giờ tan dự kiến
      </span>
      <span className="result-time" aria-live="polite">
        {formatClock(animatedEnd)}
        {nextDay && <small className="next-day">+1 ngày</small>}
      </span>
      <div className="result-meta">
        <StatusBadge schedule={schedule} />
        <span className="badge badge-outline">
          <Icon icon="ph:sign-in-bold" width={20} /> Vào {formatClock(schedule.checkIn)}
        </span>
      </div>
    </motion.div>
  )
}

export default memo(ResultCard)
