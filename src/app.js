import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import 'styles/app.scss'

const RootElement = document.getElementById('app')

if (RootElement) {
  ReactDOM.render(<App />, RootElement)
} else {
  throw 'Root Element does not exists'
}
