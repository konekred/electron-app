import React from 'react'
import classNames from 'classnames'
import MonacoEditor from 'react-monaco-editor'
import './style.scss'

class SqlEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      code: localStorage.getItem('query'),
      queryStatus: null,
      queryResult: [],
      queryError: null
    }
  }

  render() {
    const fieldNames = []
    const fieldRows = []

    const {
      code,
      queryStatus,
      queryResult,
      queryError
    } = this.state

    if (queryResult.length > 0) {
      const fieldKeys = Object.keys(queryResult[0])

      fieldNames.push((
        <th key="header-counter">#</th>
      ))

      fieldKeys.forEach((field) => {
        fieldNames.push((
          <th key={`header-${field}`}>{field}</th>
        ))
      })

      queryResult.forEach((row, index) => {
        const rowFields = []

        rowFields.push((
          <td key="field-counter">{index + 1}</td>
        ))

        fieldKeys.forEach(field => {
          rowFields.push((
            <td key={`field-${field}`}>{row[field]}</td>
          ))
        })

        fieldRows.push((
          <tr key={`row-${index}`}>{rowFields}</tr>
        ))
      })
    }

    const options = {
      tabSize: 2,
      selectOnLineNumbers: true,
      minimap: {
        enabled: false
      }
    }

    return (
      <React.Fragment>
        <div className="sql-page">
          <div className="sql-editor">
            <MonacoEditor
              width={1200}
              height={480}
              language="sql"
              theme="vs-dark"
              value={code}
              options={options}
              onChange={(code) => {
                localStorage.setItem('query', code)
                this.setState({ code })
              }}
              editorDidMount={(editor) => {
                editor.focus()
              }}
            />
          </div>
          <div className="sql-action">
            <button onClick={() => {
              const { code } = this.state

              fetch('/sql', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                  query: code
                })
              }).then(res => res.json()).then(json => {
                this.setState({
                  queryStatus: json.ok,
                  queryResult: json.results,
                  queryError: json.error
                })
              }).catch(err => {
                console.log(err)

              })
            }}>
              RUN QUERY
            </button>
          </div>
        </div>
        <div className="sql-results">
          <div className={classNames('sql-status', { active: queryStatus == true, error: queryStatus == false })}></div>
          <div className={classNames('sql-error', { active: queryError })}>
            {JSON.stringify(queryError)}
          </div>
          <div className="sql-table">
            <table>
              <thead>
                <tr>
                  {fieldNames}
                </tr>
              </thead>
              <tbody>
                {fieldRows}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default SqlEditor
