import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import '@styles/app.scss'

// icons
import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faUpload,
  faFileUpload,
  faAngleRight,
  faAngleLeft,
  faAngleDoubleRight,
  faAngleDoubleLeft
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUpload,
  faFileUpload,
  faAngleRight,
  faAngleLeft,
  faAngleDoubleRight,
  faAngleDoubleLeft
)

const RootElement = document.getElementById('app')
ReactDOM.render(<App />, RootElement)
