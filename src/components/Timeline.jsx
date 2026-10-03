import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { LUNCH_END, LUNCH_START, formatClock } from '../lib/workTime.js'

function buildSteps(schedule) {
  const steps = [{ at: schedule.start, label: 'Bắt đầu', icon: 'ph:laptop-bold' }]
  if (schedule.spansLunch) {
    steps.push({ at: LUNCH_START, label: 'Nghỉ trưa', icon: 'ph:bowl-food-bold' })
    steps.push({ at: LUNCH_END, label: 'Làm chiều', icon: 'ph:coffee-bold' })
  }
  steps.push({ at: schedule.end, label: 'Tan làm', icon: 'ph:house-line-bold' })
  return steps
}

export default function Timeline({ schedule, nowMin }) {
  const steps = buildSteps(schedule)
  // Bước hiện tại = mốc cuối cùng đã qua.
  let current = -1
  steps.forEach((s, i) => {
    if (nowMin >= s.at) current = i
  })

  return (
    <ol className="timeline">
      {steps.map((step, i) => {
        const state = i < current ? 'past' : i === current ? 'active' : 'upcoming'
        return (
          <motion.li
            key={step.label}
            className={`tl-step tl-${state}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300, damping: 22 }}
          >
            <span className="tl-icon">
              <Icon icon={state === 'past' ? 'ph:check-bold' : step.icon} width={22} />
            </span>
            <span className="tl-time">{formatClock(step.at)}</span>
            <span className="tl-label">{step.label}</span>
          </motion.li>
        )
      })}
    </ol>
  )
}
