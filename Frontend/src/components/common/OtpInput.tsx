import { useRef, useEffect } from "react"

interface OtpInputProps {
  value: string[]
  onChange: (digits: string[]) => void
  disabled?: boolean
  otpLength?: number
  className?: string
}

export function OtpInput({
  value,
  onChange,
  disabled = false,
  otpLength = 6,
  className = "",
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setTimeout(() => {
      refs.current[0]?.focus()
    }, 50)
  }, [])

  const focusIndex = (idx: number) => {
    refs.current[idx]?.focus()
  }

  const handleChange = (idx: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1)
    if (!digit) return
    const next = [...value]
    next[idx] = digit
    onChange(next)
    if (idx < otpLength - 1) focusIndex(idx + 1)
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const next = [...value]
      if (next[idx]) {
        next[idx] = ""
        onChange(next)
      } else if (idx > 0) {
        next[idx - 1] = ""
        onChange(next)
        focusIndex(idx - 1)
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      focusIndex(idx - 1)
    } else if (e.key === "ArrowRight" && idx < otpLength - 1) {
      focusIndex(idx + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength)
    if (!pasted) return
    const next = Array(otpLength).fill("")
    pasted.split("").forEach((ch, i) => { next[i] = ch })
    onChange(next)
    const lastFilled = Math.min(pasted.length, otpLength - 1)
    focusIndex(lastFilled)
  }

  return (
    <div className={`flex gap-2 justify-center ${className}`} onPaste={handlePaste}>
      {Array.from({ length: otpLength }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { refs.current[idx] = el }}
          id={`otp-digit-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onFocus={(e) => e.target.select()}
          className={`
            h-12 w-11 rounded-[8px] border text-center text-[18px] font-semibold font-mono
            text-[#171717] dark:text-white
            bg-white dark:bg-[#0a0a0a]
            transition-all duration-150 focus:outline-none
            disabled:opacity-40 disabled:cursor-not-allowed
            ${value[idx]
              ? "border-[#171717] dark:border-white ring-2 ring-[#171717]/10 dark:ring-white/10"
              : "border-[#d4d4d4] dark:border-white/15"
            }
            focus-visible:border-[#171717] dark:focus-visible:border-white
            focus-visible:ring-2 focus-visible:ring-[#171717]/20 dark:focus-visible:ring-white/20
          `}
        />
      ))}
    </div>
  )
}
