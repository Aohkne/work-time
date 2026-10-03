import { memo } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import ThemeToggle from './ThemeToggle.jsx'

const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })

function LiveClock({ now }) {
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return (
    <div className="live-clock" aria-label="Giờ hiện tại">
      <span className="live-clock-date">{weekday.format(now)}</span>
      <span className="live-clock-time">
        {hh}
        <span className="blink">:</span>
        {mm}
        <span className="live-clock-sec">{ss}</span>
      </span>
    </div>
  )
}

function Header({ now, theme, onToggleTheme }) {
  return (
    <header className="header">
      <motion.div
        className="logo"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.span
          className="logo-mark"
          animate={{ rotate: [0, -12, 12, 0] }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
        >
          <Icon icon="ph:clock-countdown-bold" width={36} />
        </motion.span>
        <span className="logo-text">
          GIỜ<span className="logo-invert">TAN</span>
        </span>
      </motion.div>
      <div className="header-right">
        <LiveClock now={now} />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}

export default memo(Header)
