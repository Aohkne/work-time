import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@iconify/react'

const PIECES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2
  const dist = 160 + (i % 3) * 70
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    rotate: (i % 2 ? 1 : -1) * (90 + i * 20),
    size: 14 + (i % 4) * 8,
    filled: i % 2 === 0,
  }
})

export default function DoneCelebration({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, 4500)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="celebrate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="alertdialog"
          aria-label="Đã đến giờ tan làm"
        >
          <div className="celebrate-burst" aria-hidden="true">
            {PIECES.map((p, i) => (
              <motion.span
                key={i}
                className={`piece${p.filled ? ' piece-filled' : ''}`}
                style={{ width: p.size, height: p.size }}
                initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
                animate={{ x: p.x, y: p.y, scale: [0, 1.2, 1], rotate: p.rotate, opacity: [1, 1, 0] }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1] }}
              />
            ))}
          </div>
          <motion.div
            className="celebrate-card"
            initial={{ scale: 0.3, rotate: -8 }}
            animate={{ scale: 1, rotate: -3 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 14 }}
          >
            <Icon icon="ph:confetti-bold" width={56} />
            <motion.h2
              animate={{ opacity: [1, 0.15, 1, 0.15, 1, 0.15, 1] }}
              transition={{ duration: 1.4, delay: 0.3 }}
            >
              TAN LÀM!
            </motion.h2>
            <p>Đủ 8 tiếng rồi, về thôi 🎉</p>
            <span className="muted small">Bấm bất kỳ đâu để đóng</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
