import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import Upload from './pages/Upload1.js'
import GlobalStyles from './globalStyles'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <Upload />
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals()
