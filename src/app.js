import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import '@styles/app.scss'

// icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
library.add(faUpload)

const RootElement = document.getElementById('app')
ReactDOM.render(<App />, RootElement)
