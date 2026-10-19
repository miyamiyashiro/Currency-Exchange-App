import { useEffect, useState } from 'react'
import { fetchResource } from '../services/frankfurter'

// Cada resposta pertence a uma URL e tentativa. Dados de outra seleção nunca são exibidos.
export default function useFrankfurter(path) {
  const [attempt, setAttempt] = useState(0)
  const [response, setResponse] = useState(null)

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    let active = true
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 15000)

    async function load() {
      try {
        const data = await fetchResource(path, controller.signal)
        if (active) setResponse({ path, attempt, data, error: null })
      } catch (error) {
        if (active) setResponse({
          path, attempt, data: null,
          error: timedOut ? 'A consulta demorou demais. Tente novamente.' :
            error instanceof TypeError ? 'Não foi possível conectar à API. Confira sua conexão e tente novamente.' : error.message,
        })
      } finally {
        clearTimeout(timer)
      }
    }
    load()
    return () => {
      active = false
      clearTimeout(timer)
      controller.abort()
    }
  }, [path, attempt])

  const current = path && response?.path === path && response?.attempt === attempt
  return {
    data: current ? response.data : null,
    error: current ? response.error : null,
    loading: Boolean(path && !current),
    retry: () => setAttempt(value => value + 1),
  }
}
