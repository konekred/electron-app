import React from 'react'
import classNames from 'classnames'
import './style.scss'

type Props = {
  pages: Number,
  current: Number,
  pageClick: Function
}

const Paginator = ({ pages, current, pageClick }: Props) => {
  const pageLinks = []

  for (let pageNum = 1; pageNum <= pages; pageNum++) {
    pageLinks.push((
      <li
        key={`page-${pageNum}`}
        className={classNames('page-number', { active: pageNum == current })}
        onClick={() => {
          pageClick(pageNum)
        }}
      >
        <a>{pageNum}</a>
      </li>
    ))
  }

  return (
    <div className="paginator">
      <ul className="pages">
        {pageLinks}
      </ul>
    </div>
  )
}

export default Paginator
