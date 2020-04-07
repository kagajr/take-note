import { useEffect, useRef } from 'react'

const noop = () => {}

export function useInterval(callback: () => void, delay: number | null, immediate?: boolean) {
  const savedCallback = useRef(noop)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (!immediate) return
    if (delay === null) return

    savedCallback.current()
  }, [delay, immediate])

  useEffect(() => {
    if (delay === null) return undefined
    const tick = () => savedCallback.current()
    const id = setInterval(tick, delay)

    return () => clearInterval(id)
  }, [delay])
}

export default useInterval
