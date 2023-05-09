/* global test, expect */
import { Receipt, getTaxCents } from './receipt.js'

test('correctly calculates tax', () => {
  const tests = [
    {
      price: 1499,
      rate: 10,
      tax: 150
    },
    {
      price: 1000,
      rate: 10,
      tax: 100
    },
    {
      price: 1500,
      rate: 15,
      tax: 225
    },
    {
      price: 1400,
      rate: 15,
      tax: 210
    },
    {
      price: 1300,
      rate: 13,
      tax: 170
    },
    {
      price: 13,
      rate: 15,
      tax: 5
    },
    {
      price: 1125 * 3,
      rate: 5,
      tax: 170
    },
    {
      price: 1125,
      rate: 5,
      tax: 60
    }
  ]
  for (const t of tests) {
    expect(getTaxCents(t.price, t.rate)).toEqual(t.tax)
  }
})

test('correctly parses items', () => {
  const tests = [
    {
      input: '1 book at 1.20  \n  \nan imported choco at 1,2\n  2 pills at 1.2345',
      items: [
        {
          amount: 1,
          description: 'book',
          invalid: false,
          imported: false,
          priceCents: 120,
          taxRate: 0,
          text: '1 book at 1.20',
          type: 'book'
        },
        {
          invalid: true,
          text: 'an imported choco at 1,2'
        },
        {
          invalid: true,
          text: '2 pills at 1.2345'
        }
      ]
    },
    {
      input: '3   apples at 0.11 \n\n4 jars of peanut butter   at   0.20\n  1 bottle of pills at 1.23',
      items: [
        {
          amount: 3,
          description: 'apples',
          invalid: false,
          imported: false,
          priceCents: 11,
          taxRate: 0,
          text: '3   apples at 0.11',
          type: 'food'
        },
        {
          amount: 4,
          description: 'jars of peanut butter',
          invalid: false,
          imported: false,
          priceCents: 20,
          taxRate: 0,
          text: '4 jars of peanut butter   at   0.20',
          type: 'food'
        },
        {
          amount: 1,
          description: 'bottle of pills',
          invalid: false,
          imported: false,
          priceCents: 123,
          taxRate: 0,
          text: '1 bottle of pills at 1.23',
          type: 'medical'
        }
      ]
    },
    {
      input: `
2 book at 12.49

1 music CD at 14.99
1 chocolate bar at 0.85
`,
      items: [
        {
          amount: 2,
          description: 'book',
          invalid: false,
          imported: false,
          priceCents: 1249,
          taxRate: 0,
          text: '2 book at 12.49',
          type: 'book'
        },
        {
          amount: 1,
          description: 'music CD',
          invalid: false,
          imported: false,
          priceCents: 1499,
          taxRate: 10,
          text: '1 music CD at 14.99',
          type: 'entertainment'
        },
        {
          amount: 1,
          description: 'chocolate bar',
          invalid: false,
          imported: false,
          priceCents: 85,
          taxRate: 0,
          text: '1 chocolate bar at 0.85',
          type: 'food'
        }
      ]
    },
    {
      input: `
1 imported box of chocolates at 10.00
1 imported bottle of perfume at 47.50`,
      items: [
        {
          amount: 1,
          description: 'imported box of chocolates',
          invalid: false,
          imported: true,
          priceCents: 1000,
          taxRate: 5,
          text: '1 imported box of chocolates at 10.00',
          type: 'food'
        },
        {
          amount: 1,
          description: 'imported bottle of perfume',
          invalid: false,
          imported: true,
          priceCents: 4750,
          taxRate: 15,
          text: '1 imported bottle of perfume at 47.50',
          type: 'luxury'
        }
      ]
    },
    {
      input: `
1 imported bottle of perfume at 27.99
1 bottle of perfume at 18.99
1 packet of headache pills at 9.75
3 imported boxes of chocolates at 11.25`,
      items: [
        {
          amount: 1,
          description: 'imported bottle of perfume',
          invalid: false,
          imported: true,
          priceCents: 2799,
          taxRate: 15,
          text: '1 imported bottle of perfume at 27.99',
          type: 'luxury'
        },
        {
          amount: 1,
          description: 'bottle of perfume',
          invalid: false,
          imported: false,
          priceCents: 1899,
          taxRate: 10,
          text: '1 bottle of perfume at 18.99',
          type: 'luxury'
        },
        {
          amount: 1,
          description: 'packet of headache pills',
          invalid: false,
          imported: false,
          priceCents: 975,
          taxRate: 0,
          text: '1 packet of headache pills at 9.75',
          type: 'medical'
        },
        {
          amount: 3,
          description: 'imported boxes of chocolates',
          invalid: false,
          imported: true,
          priceCents: 1125,
          taxRate: 5,
          text: '3 imported boxes of chocolates at 11.25',
          type: 'food'
        }
      ]
    }
  ]
  for (const t of tests) {
    expect(new Receipt(t.input).items).toEqual(t.items)
  }
})

test('correctly builds receipt', () => {
  const tests = [
    {
      input: `
2 book at 12.49
1 music CD at 14.99
1 chocolate bar at 0.85
`,
      receipt: `2 book: 24.98
1 music CD: 16.49
1 chocolate bar: 0.85
Sales Taxes: 1.50
Total: 42.32`
    },
    {
      input: `
1 imported box of chocolates at 10.00
1 imported bottle of perfume at 47.50`,
      receipt: `1 imported box of chocolates: 10.50
1 imported bottle of perfume: 54.65
Sales Taxes: 7.65
Total: 65.15`
    },
    {
      input: `
1 imported bottle of perfume at 27.99
1 bottle of perfume at 18.99
1 packet of headache pills at 9.75
3 imported boxes of chocolates at 11.25`,
      receipt: `1 imported bottle of perfume: 32.19
1 bottle of perfume: 20.89
1 packet of headache pills: 9.75
3 imported boxes of chocolates: 35.55
Sales Taxes: 7.90
Total: 98.38`
    }
  ]

  for (const t of tests) {
    expect(new Receipt(t.input).toString()).toEqual(t.receipt)
  }
})
