import React from 'react'

type Props = {
  children: Object
}

const Page = ({ children }: Props) => (
  <div className="page">
    {children}
  </div>
)

export default Page
