import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.scss'

type Props = {
  pages: Number,
  current: Number,
  limit: Number,
  pageClick: Function
}

const Paginator = ({ pages, current, pageClick, limit }: Props) => {
  const pageLinks = []

  const startPage = ((Math.ceil(current / limit) -1) * limit) + 1
  const endPage = (startPage + limit - 1) < pages ? (startPage + limit - 1) : pages

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    pageLinks.push((
      <li
        key={`page-${pageNum}`}
        data-page={pageNum}
        className={classNames('page-number', { active: pageNum == current })}
        onClick={() => {
          pageClick(pageNum)
        }}
      >
        <a>{pageNum}</a>
      </li>
    ))
  }

  const prevPageNumber = current > 1 ? current - 1 : 1
  const nexPageNumber = current < pages ? current + 1 : pages

  const prevPageArrow = (
    <li
      key={`prev-page-${prevPageNumber}`}
      data-page={prevPageNumber}
      className={classNames('page-number', 'prev-page')}
      onClick={() => {
        pageClick(prevPageNumber)
      }}
    >
      <a>
        <FontAwesomeIcon className="action-icon" icon="angle-left" />
      </a>
    </li>
  )

  const firstPageArrow = (
    <li
      key={`first-page-${1}`}
      data-page={1}
      className={classNames('page-number', 'first-page')}
      onClick={() => {
        pageClick(1)
      }}
    >
      <a><FontAwesomeIcon className="action-icon" icon="angle-double-left" /></a>
    </li>
  )

  const nexPageArrow = (
    <li
      key={`next-page-${nexPageNumber}`}
      data-page={nexPageNumber}
      className={classNames('page-number', 'next-page')}
      onClick={() => {
        pageClick(nexPageNumber)
      }}
    >
      <a><FontAwesomeIcon className="action-icon" icon="angle-right" /></a>
    </li>
  )

  const lastPageArrow = (
    <li
      key={`last-page-${pages}`}
      data-page={pages}
      className={classNames('page-number', 'last-page')}
      onClick={() => {
        pageClick(pages)
      }}
    >
      <a><FontAwesomeIcon className="action-icon" icon="angle-double-right" /></a>
    </li>
  )

  return (
    <div className="paginator">
      <ul className="pages">
        {firstPageArrow}
        {prevPageArrow}

        {pageLinks}

        {nexPageArrow}
        {lastPageArrow}
      </ul>
    </div>
  )
}

export default Paginator
