import test from 'node:test'
import assert from 'node:assert/strict'
import { translator, localeFor, initialLanguage } from '../src/i18n.js'
import { formatAmount, formatDate, validateAmount } from '../src/utils/conversion.js'
import { createCsv, csvFilename } from '../src/utils/table.js'

test('idioma traduz parâmetros e erros existentes sem alterar os dados', () => {
  const t = translator('en')
  assert.equal(t('Consultando cotação {base} → {quote}…', { base: 'EUR', quote: 'USD' }), 'Fetching exchange rate EUR → USD…')
  assert.equal(t(validateAmount('0')), 'Enter a numeric amount greater than zero.')
  assert.equal(translator('pt')('Página {page} de {count}', {page:2,count:4}), 'Página 2 de 4')
  assert.equal(formatDate('2026-11-02', localeFor('en')), '11/02/2026')
  assert.equal(formatDate('2026-11-02'), '02/11/2026')
  assert.match(formatAmount(1234.5, 'USD', localeFor('en')), /1,234\.50/)
  assert.match(formatAmount(1234.5, 'USD'), /1\.234,50/)
})

test('CSV inglês traduz cabeçalho e nome, preservando data ISO e precisão', () => {
  const rows = [{date:'2026-11-02',base:'EUR',quote:'USD',rate:1.123456789}]
  const csv = createCsv(rows, 'en')
  assert.ok(csv.startsWith('\uFEFFdate,source_currency,target_currency,rate\r\n'))
  assert.ok(csv.includes('"2026-11-02","EUR","USD","1.123456789"'))
  assert.equal(csvFilename(rows,'en'), 'rates_EUR_USD_2026-11-02_2026-11-02.csv')
  assert.equal(createCsv(rows).split('\r\n')[1], csv.split('\r\n')[1])
})

test('preferência é recuperada e armazenamento bloqueado não impede abertura', t => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  t.after(() => { if (original) Object.defineProperty(globalThis, 'localStorage', original); else delete globalThis.localStorage })
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, writable: true, value: {getItem: () => 'en'} })
  assert.equal(initialLanguage(), 'en')
  globalThis.localStorage = {getItem: () => 'fr'}
  assert.equal(initialLanguage(), 'pt')
  globalThis.localStorage = {getItem: () => {throw new Error('blocked')}}
  assert.equal(initialLanguage(), 'pt')
})

