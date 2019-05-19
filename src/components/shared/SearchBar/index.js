import React from 'react'
import './style.scss'

type Props = {
  onChange: Function,
  value: string
}

const SearchBar = ({ onChange, value }: Props) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search ..."
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default SearchBar
