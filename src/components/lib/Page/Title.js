import React from 'react'

type Props = {
  text: string
}

const Title = ({ text }: Props) => (
  <h1 className="page-title">{text}</h1>
)

export default Title
