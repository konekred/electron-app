import React from 'react'

type Props = {
  children: Object
}

const PageSection = ({ children }: Props) => (
  <div className="page-section">
    {children}
  </div>
)

export default PageSection
