import test from 'node:test'
import assert from 'node:assert/strict'
import { validateAmount, convertAmount, formatDate } from '../src/utils/conversion.js'
import { fetchResource } from '../src/services/frankfurter.js'

test('valida valores e preserva precisão no cálculo', () => {
  for (const value of ['', ' ', '0', '-1', 'abc', 'Infinity']) assert.ok(validateAmount(value))
  assert.equal(validateAmount('0.01'), '')
  assert.ok(Math.abs(convertAmount('100', 1.1234) - 112.34) < 1e-10)
  assert.equal(convertAmount('1e308', 10), null)
  assert.equal(formatDate('2024-05-03'), '03/05/2024')
})
test('valida resposta e traduz erros HTTP', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 422 }))
  await assert.rejects(fetchResource('/rate/INVALID/USD'), /moedas selecionadas/)
})
test('rejeita taxa de par errado ou taxa inválida', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true, json: async () => ({ base: 'USD', quote: 'EUR', rate: 2, date: '2024-05-03' }),
  }))
  await assert.rejects(fetchResource('/rate/EUR/USD'), /inválida/)
})
test('aceita cotação válida e organiza moedas', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => ({
    ok: true, json: async () => ({ base: 'EUR', quote: 'USD', rate: 2, date: '2024-05-03' }),
  }))
  assert.equal((await fetchResource('/rate/EUR/USD')).rate, 2)
  mock.mock.mockImplementation(async () => ({ ok: true, json: async () => [
    { iso_code: 'USD', name: 'Dollar' }, { iso_code: 'EUR', name: 'Euro' }, { name: 'Invalid' },
  ] }))
  assert.deepEqual((await fetchResource('/currencies')).map(item => item.iso_code), ['EUR', 'USD'])
})

