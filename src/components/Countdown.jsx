import { AnimatePresence, motion } from 'motion/react'
import { splitSeconds } from '../lib/workTime.js'

function Digit({ value }) {
  return (
    <span className="digit">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="digit-inner"
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Unit({ value, label }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="unit">
      <div className="unit-digits">
        {text.split('').map((d, i) => (
          <Digit key={text.length - i} value={d} />
        ))}
      </div>
      <span className="unit-label">{label}</span>
    </div>
  )
}

export default function Countdown({ remainingSec }) {
  const { h, m, s } = splitSeconds(remainingSec)
  return (
    <div className="countdown" role="timer" aria-label={`Còn ${h} giờ ${m} phút ${s} giây`}>
      <Unit value={h} label="Giờ" />
      <span className="sep">:</span>
      <Unit value={m} label="Phút" />
      <span className="sep">:</span>
      <Unit value={s} label="Giây" />
    </div>
  )
}
