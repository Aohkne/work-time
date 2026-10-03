import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@iconify/react'

const RULES = [
  { icon: 'ph:sign-in-bold', label: 'Giờ vào', value: '08:30 – 09:30' },
  { icon: 'ph:bowl-food-bold', label: 'Nghỉ trưa', value: '12:30 – 13:45' },
  { icon: 'ph:sign-out-bold', label: 'Giờ tan', value: 'Từ 17:45' },
  { icon: 'ph:timer-bold', label: 'Làm thực', value: '8 tiếng' },
]

export default function RulesInfo() {
  const [open, setOpen] = useState(false)
  return (
    <section className="card rules">
      <button
        type="button"
        className="rules-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="rules-body"
      >
        <span>
          <Icon icon="ph:info-bold" width={24} /> Quy định giờ làm
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="icon-wrap">
          <Icon icon="ph:plus-bold" width={24} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="rules-body"
            className="rules-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="rules-grid">
              {RULES.map((r) => (
                <li key={r.label}>
                  <Icon icon={r.icon} width={26} />
                  <span className="muted">{r.label}</span>
                  <strong>{r.value}</strong>
                </li>
              ))}
            </ul>
            <p className="muted rules-note">
              Giờ tan = giờ vào + 8 tiếng làm (không tính 1h15 nghỉ trưa). Vào trước 08:30 vẫn tính từ
              08:30. Vào sau 09:30 là đi trễ và phải bù đủ 8 tiếng.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
