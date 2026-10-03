import { motion } from 'motion/react'
import { LUNCH_END, LUNCH_START, formatClock } from '../lib/workTime.js'

export default function ProgressBar({ schedule, timePercent, workPercent }) {
  const { start, end, spansLunch } = schedule
  const span = end - start
  const lunchLeft = ((LUNCH_START - start) / span) * 100
  const lunchWidth = ((LUNCH_END - LUNCH_START) / span) * 100

  return (
    <div className="progress">
      <div className="progress-head">
        <span>Tiến độ 8 tiếng</span>
        <span className="progress-pct">{Math.floor(workPercent)}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.floor(workPercent)}
      >
        <motion.div
          className="progress-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: timePercent / 100 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        />
        {spansLunch && (
          <div
            className="progress-lunch"
            style={{ left: `${lunchLeft}%`, width: `${lunchWidth}%` }}
            title="Nghỉ trưa 12:30 – 13:45"
          />
        )}
      </div>
      <div className="progress-scale">
        <span>{formatClock(start)}</span>
        <span>{formatClock(end)}</span>
      </div>
    </div>
  )
}
