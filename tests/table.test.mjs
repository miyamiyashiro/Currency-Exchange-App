import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyFilters, validateFilters, filterAndSort, createCsv, csvFilename } from '../src/utils/table.js'

const rows = [
  { date: '2024-05-01', base: 'EUR', quote: 'USD', rate: 10 },
  { date: '2024-05-02', base: 'EUR', quote: 'USD', rate: 2 },
  { date: '2024-05-03', base: 'EUR', quote: 'USD', rate: 3 },
]
test('filtros combinam limites inclusivos e ordenação é numérica', () => {
  const filters = { from: '2024-05-02', to: '2024-05-03', min: '2', max: '3' }
  assert.deepEqual(filterAndSort(rows, filters, { field: 'rate', direction: 'desc' }).map(row => row.rate), [3, 2])
  assert.deepEqual(filterAndSort(rows, emptyFilters, { field: 'rate', direction: 'asc' }).map(row => row.rate), [2, 3, 10])
  assert.equal(rows[0].rate, 10)
})
test('datas, limites invertidos e valores inválidos são rejeitados', () => {
  for (const change of [{ from: '2024-05-03', to: '2024-05-01' }, { min: '10', max: '2' }, { min: '-1' }, { max: 'abc' }, { from: '2024-02-31' }]) {
    assert.ok(validateFilters({ ...emptyFilters, ...change }))
  }
  assert.equal(validateFilters({ ...emptyFilters, min: '0' }), '')
  assert.equal(validateFilters(emptyFilters), '')
})
test('CSV mantém precisão, ordem e todas as páginas', () => {
  const many = Array.from({ length: 30 }, (_, i) => ({ date: '2024-05-' + String(i + 1).padStart(2, '0'), base: 'EUR', quote: 'USD', rate: 1.123456789 }))
  const sorted = filterAndSort(many, emptyFilters, { field: 'date', direction: 'desc' })
  const csv = createCsv(sorted)
  assert.equal(csv.split('\r\n').length, 32)
  assert.ok(csv.startsWith('\uFEFFdata,moeda_origem,moeda_destino,cotacao'))
  assert.ok(csv.split('\r\n')[1].includes('2024-05-30'))
  assert.ok(csv.includes('1.123456789'))
  assert.equal(csvFilename(sorted), 'cotacoes_EUR_USD_2024-05-01_2024-05-30.csv')
  assert.throws(() => createCsv([]))
})
test('filtro sem correspondências retorna lista vazia', () => {
  assert.deepEqual(filterAndSort(rows, { ...emptyFilters, min: '20' }, { field: 'date', direction: 'asc' }), [])
})
