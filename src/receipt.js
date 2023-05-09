export class Receipt {
  constructor (text) {
    this.items = []
    const lines = text.split('\n')
    for (const l of lines) {
      const t = l.trim()
      if (t) {
        this.items.push(new ReceiptItem(t))
      }
    }
  }

  toString () {
    const lines = []
    let totalCents = 0
    let taxCents = 0
    for (const i of this.items) {
      lines.push(i.toString())
      if (i.invalid) {
        continue
      }
      totalCents += i.totalCents()
      taxCents += i.totalTaxCents()
    }
    lines.push(`Sales Taxes: ${(taxCents / 100).toFixed(2)}`)
    lines.push(`Total: ${(totalCents / 100).toFixed(2)}`)
    return lines.join('\n')
  }
}

const goodTypeToText = {
  book: ['book'],
  food: ['chocolate', 'apple', 'banana', 'kiwi', 'peanut'],
  medical: ['pills'],
  luxury: ['perfume'],
  entertainment: ['CD', 'DVD']
}

const salesTax = {
  book: 0,
  food: 0,
  medical: 0,
  luxury: 10,
  entertainment: 10
}

const importedTax = 5

const getGoodType = (desc) => {
  for (const t in goodTypeToText) {
    if (goodTypeToText[t].some((d) => desc.includes(d))) {
      return t
    }
  }
}

export const getTaxCents = (price, rate) => {
  const roundingFactor = 5
  const raw = (price * rate) / 100
  const round = Math.round(raw)
  if (round % roundingFactor === 0) {
    return round
  }
  return (round + (roundingFactor - (round % roundingFactor)))
}

class ReceiptItem {
  constructor (text) {
    this.text = text
    this.invalid = true
    const m = text.match(/^(\d+) (.+) at +(\d+\.\d{2})$/)
    if (!m) {
      return
    }
    this.amount = parseInt(m[1])
    if (isNaN(this.amount)) {
      return
    }
    const price = parseFloat(m[3])
    if (isNaN(price)) {
      return
    }
    this.priceCents = Math.round(price * 100)
    this.description = m[2].trim()
    this.imported = this.description.includes('imported')
    this.type = getGoodType(this.description)
    if (!this.type) {
      return
    }
    this.invalid = false
    this.taxRate = salesTax[this.type] + (this.imported ? importedTax : 0)
  }

  toString () {
    if (this.invalid) {
      return `INVALID INPUT: ${this.text}`
    } else {
      return `${this.amount} ${this.description}: ${this.total().toFixed(2)}`
    }
  }

  totalWithoutTaxCents () {
    return this.priceCents * this.amount
  }

  taxPerItemCents () {
    return getTaxCents(this.priceCents, this.taxRate)
  }

  totalTaxCents () {
    return this.taxPerItemCents() * this.amount
  }

  totalCents () {
    return this.totalWithoutTaxCents() + this.totalTaxCents()
  }

  total () {
    return this.totalCents() / 100
  }

  totalTax () {
    return this.totalTaxCents() / 100
  }
}
