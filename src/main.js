import { Receipt } from './receipt.js'

const App = {
  $: {
    submitBtn: document.querySelector('#submit-btn'),
    inputBox: document.querySelector('#input-box'),
    outputBox: document.querySelector('#output-box')
  },
  init: () => {
    window.addEventListener('load', () => {
      App.$.submitBtn.addEventListener('click', () => {
        const input = App.$.inputBox.value
        const r = new Receipt(input)
        App.$.outputBox.innerText = r.toString()
      })
    })
  }
}

App.init()
