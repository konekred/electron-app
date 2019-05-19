import React, { useState } from 'react'
import classNames from 'classnames'
import './style.scss'

type Props = {
  id: string,
  text: string,
  ref?: Object,
  custom?: string,
  accept?: string,
  onChange: Function
}

const InputFile = React.forwardRef(({ id, text, custom, onChange, ...rest }: Props, ref) => {
  const [inputText, setInputText] = useState(text)

  const inputOnChange = () => {
    if (ref) {
      const files = ref.current.files[0]
      let fileName = ''
      if (files && files.length > 1) {
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', ref.current.files.length)
      } else {
        fileName = ref.current.value.split('\\').pop()
      }

      setInputText(fileName)
    }

    if (onChange) {
      onChange()
    }
  }

  return (
    <div className={classNames('input-file', custom ? `input-file-${custom}` : '')}>
      <input
        id={id}
        type="file"
        onChange={inputOnChange}
        ref={ref}
        {...rest}
        data-multiple-caption="{count} files selected"
      />
      <label htmlFor={id}>
        <figure>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
            <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
          </svg>
        </figure>
        <span>{inputText}</span>
      </label>
    </div>
  )
})

InputFile.displayName = 'InputFile'

export default InputFile
