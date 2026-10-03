import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Icon } from '@iconify/react'
import Header from './components/Header.jsx'
import CheckInForm from './components/CheckInForm.jsx'
import ResultCard from './components/ResultCard.jsx'
import Countdown from './components/Countdown.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import Timeline from './components/Timeline.jsx'
import DoneCelebration from './components/DoneCelebration.jsx'
import RulesInfo from './components/RulesInfo.jsx'
import { useNow } from './hooks/useNow.js'
import { useTheme } from './hooks/useTheme.js'
import { usePersistedState } from './hooks/usePersistedState.js'
import {
  calcSchedule,
  formatDuration,
  getProgress,
  nowInMinutes,
  parseTime,
  splitSeconds,
  todayKey,
} from './lib/workTime.js'

const PHASE_TEXT = {
  before: { icon: 'ph:hourglass-high-bold', text: 'Chưa tới giờ tính công' },
  working: { icon: 'ph:lightning-bold', text: 'Đang làm việc' },
  lunch: { icon: 'ph:bowl-food-bold', text: 'Đang nghỉ trưa' },
  done: { icon: 'ph:confetti-bold', text: 'Đã đủ giờ — tan làm!' },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function App() {
  const now = useNow()
  const [theme, toggleTheme] = useTheme()
  const [checkIn, setCheckIn] = usePersistedState(`worktime:checkin:${todayKey(now)}`, null)

  const schedule = useMemo(() => {
    const minutes = parseTime(checkIn)
    return minutes === null ? null : calcSchedule(minutes)
  }, [checkIn])

  const nowMin = nowInMinutes(now)
  const progress = schedule ? getProgress(schedule, nowMin) : null
  const phase = progress?.phase

  // Bắn pháo hoa đúng lúc chuyển sang "done" (không bắn khi mở lại trang sau giờ tan).
  const [celebrate, setCelebrate] = useState(false)
  const prevPhase = useRef(phase)
  useEffect(() => {
    if (prevPhase.current && prevPhase.current !== 'done' && phase === 'done') setCelebrate(true)
    prevPhase.current = phase
  }, [phase])
  const closeCelebrate = useCallback(() => setCelebrate(false), [])

  // Countdown trên tab trình duyệt.
  useEffect(() => {
    if (!progress) {
      document.title = 'Giờ Tan — Tính giờ tan làm'
    } else if (phase === 'done') {
      document.title = '🎉 TAN LÀM! — Giờ Tan'
    } else {
      const { h, m, s } = splitSeconds(progress.remainingSec)
      document.title = `⏳ ${pad(h)}:${pad(m)}:${pad(s)} — Giờ Tan`
    }
  })

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Header now={now} theme={theme} onToggleTheme={toggleTheme} />

        <motion.main className="grid" variants={container} initial="hidden" animate="show">
          <motion.section className="card card-form" variants={item}>
            <CheckInForm
              key={checkIn ?? 'empty'}
              value={checkIn}
              onSubmit={setCheckIn}
              onClear={() => setCheckIn(null)}
            />
          </motion.section>

          <motion.section className="card card-result" variants={item}>
            <AnimatePresence mode="wait">
              <ResultCard key={schedule ? 'has' : 'empty'} schedule={schedule} />
            </AnimatePresence>
          </motion.section>

          <motion.section className="card card-countdown" variants={item}>
            <AnimatePresence mode="wait" initial={false}>
              {progress ? (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="countdown-head">
                    <motion.span
                      key={phase}
                      className={`phase phase-${phase}`}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Icon icon={PHASE_TEXT[phase].icon} width={22} />
                      {PHASE_TEXT[phase].text}
                    </motion.span>
                    <span className="muted">
                      Đã làm {formatDuration(progress.workedMin)} / 8 tiếng
                    </span>
                  </div>

                  {phase === 'done' ? (
                    <motion.p
                      className="done-text"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.06, 1] }}
                    >
                      VỀ THÔI!
                    </motion.p>
                  ) : (
                    <>
                      <span className="kicker">Còn lại</span>
                      <Countdown remainingSec={progress.remainingSec} />
                    </>
                  )}

                  <ProgressBar
                    schedule={schedule}
                    timePercent={progress.timePercent}
                    workPercent={progress.workPercent}
                  />
                  <Timeline schedule={schedule} nowMin={nowMin} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="countdown-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.span
                    className="icon-wrap"
                    animate={{ rotate: [0, 180, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Icon icon="ph:hourglass-medium-bold" width={64} />
                  </motion.span>
                  <p>Đồng hồ đếm ngược sẽ chạy ngay khi bạn nhập giờ vào.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          <motion.div className="card-rules" variants={item}>
            <RulesInfo />
          </motion.div>
        </motion.main>

        <footer className="footer">
          <span>Làm đủ 8 tiếng · Nghỉ trưa 12:30–13:45</span>
          <a
            className="footer-link"
            href="https://github.com/Aohkne/work-time"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="ph:github-logo-bold" width={20} />
            GitHub
          </a>
        </footer>

        <DoneCelebration open={celebrate} onClose={closeCelebrate} />
      </div>
    </MotionConfig>
  )
}
