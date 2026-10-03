import { useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { parseTime } from '../lib/workTime.js'

const PRESETS = ['08:30', '09:00', '09:30']

// Tự chèn dấu ":" khi gõ, vd. "0915" → "09:15".
function formatDraft(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits
}

function shiftTime(value, delta) {
  const base = parseTime(value) ?? 8 * 60 + 30
  const next = (base + delta + 24 * 60) % (24 * 60)
  return `${String(Math.floor(next / 60)).padStart(2, '0')}:${String(next % 60).padStart(2, '0')}`
}

function currentHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function CheckInForm({ value, onSubmit, onClear }) {
  const [draft, setDraft] = useState(value ?? '')
  const [error, setError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const submit = (time) => {
    if (parseTime(time) === null) {
      setError('Nhập giờ hợp lệ dạng HH:MM, vd. 08:45')
      setShakeKey((k) => k + 1)
      return
    }
    setError('')
    setDraft(time)
    onSubmit(time)
  }

  return (
    <form
      className="checkin"
      onSubmit={(e) => {
        e.preventDefault()
        submit(draft)
      }}
    >
      <label htmlFor="checkin-time" className="label">
        <Icon icon="ph:sign-in-bold" width={22} /> Giờ vào làm hôm nay
      </label>

      <motion.div
        key={shakeKey}
        className="time-row"
        animate={shakeKey ? { x: [0, -12, 12, -8, 8, 0] } : undefined}
        transition={{ duration: 0.4 }}
      >
        <input
          id="checkin-time"
          className="time-input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="08:30"
          maxLength={5}
          title="Gõ 4 số, vd. 0915 · Mũi tên lên/xuống: ±5 phút (Shift: ±15)"
          value={draft}
          onChange={(e) => {
            setDraft(formatDraft(e.target.value))
            setError('')
          }}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
            e.preventDefault()
            const step = e.shiftKey ? 15 : 5
            setDraft(shiftTime(draft, e.key === 'ArrowUp' ? step : -step))
            setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'checkin-error' : undefined}
        />
        <button type="button" className="btn btn-ghost" onClick={() => submit(currentHHMM())}>
          <Icon icon="ph:lightning-bold" width={22} />
          <span>Bây giờ</span>
        </button>
      </motion.div>

      <div className="presets" role="group" aria-label="Chọn nhanh">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`chip${draft === p ? ' chip-active' : ''}`}
            onClick={() => submit(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {error && (
        <motion.p
          id="checkin-error"
          className="error"
          role="alert"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Icon icon="ph:warning-bold" width={18} /> {error}
        </motion.p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          <span>Tính giờ tan</span>
          <Icon icon="ph:arrow-right-bold" width={24} />
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => {
              setDraft('')
              setError('')
              onClear()
            }}
            aria-label="Xoá giờ vào"
            title="Xoá"
          >
            <Icon icon="ph:arrow-counter-clockwise-bold" width={24} />
          </button>
        )}
      </div>
    </form>
  )
}
