import React from 'react'
import './style.scss'

type Props = {
  error: Object
}

const ErrorBlock = ({ error }: Props) => (
  <div className="error-block">
    <pre>
      {JSON.stringify(error, null, 2)}
    </pre>
  </div>
)

export default ErrorBlock
