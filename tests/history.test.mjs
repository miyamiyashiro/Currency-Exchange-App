import test from 'node:test'
import assert from 'node:assert/strict'
import { periodRange, normalizeHistory, periods } from '../src/utils/history.js'

test('períodos em dias incluem hoje e atravessam anos', () => {
  assert.deepEqual(periodRange('7d', '2026-01-03'), { from: '2025-12-28', to: '2026-01-03' })
  assert.equal(periodRange('15d', '2026-10-19').from, '2026-10-05')
  assert.equal(periodRange('30d', '2026-10-19').from, '2026-09-20')
})
test('meses e anos ajustam finais de mês e ano bissexto', () => {
  assert.equal(periodRange('3m', '2024-05-31').from, '2024-02-29')
  assert.equal(periodRange('6m', '2025-08-31').from, '2025-02-28')
  assert.equal(periodRange('1y', '2024-02-29').from, '2023-02-28')
  assert.equal(periodRange('5y', '2024-02-29').from, '2019-02-28')
  assert.equal(periodRange('10y', '2026-10-19').from, '2016-10-19')
  assert.equal(periods.length, 8)
})
const query = { base: 'EUR', quote: 'USD', from: '2024-05-01', to: '2024-05-31' }
const row = date => ({ base: 'EUR', quote: 'USD', date, rate: 1.1 })
test('normaliza ordem, duplicatas e limites sem preencher dias', () => {
  const result = normalizeHistory([row('2024-05-03'), row('2024-04-30'), row('2024-05-01'), row('2024-05-03')], query)
  assert.deepEqual(result.map(item => item.date), ['2024-05-01', '2024-05-03'])
  assert.deepEqual(normalizeHistory([], query), [])
})
test('rejeita dados de outro par, taxas inválidas e datas impossíveis', () => {
  assert.throws(() => normalizeHistory([{ ...row('2024-05-03'), quote: 'BRL' }], query))
  assert.throws(() => normalizeHistory([{ ...row('2024-05-03'), rate: null }], query))
  assert.throws(() => normalizeHistory([row('2024-02-31')], query))
})
