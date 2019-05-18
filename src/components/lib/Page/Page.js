import React from 'react'
import classNames from 'classnames'

type Props = {
  name: string,
  children?: Object
}

const Page = ({ name, children }: Props) => (
  <div className={classNames('page', name)}>
    {children}
  </div>
)

export default Page
