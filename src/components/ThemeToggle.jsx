import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@iconify/react'

export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="btn btn-icon"
      onClick={onToggle}
      aria-label={dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      title={dark ? 'Giao diện sáng' : 'Giao diện tối'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="icon-wrap"
          initial={{ rotate: -180, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 180, scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          <Icon icon={dark ? 'ph:sun-bold' : 'ph:moon-bold'} width={28} />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
