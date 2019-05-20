import React, {
  Fragment,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import Container from '@lib/Container'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'
import InputFile from '@lib/InputFile'

import { toFormData } from '@helpers'
import './style.scss'

const Import = () => {
  const [processingStatus, setProcessingStatus] = useState(false)
  const [processingSave, setProcessingSave] = useState(false)

  const [csvRows, setRows] = useState([])
  const uploadInput = useRef(null)

  const uploadImportClick = () => {
    setRows([])
    setProcessingStatus(true)

    const file = uploadInput.current.files[0]

    if (file) {
      fetch('/suppliers/import', { method: 'POST', body: toFormData({ file }) }).then(res => res.json()).then(json => {
        setProcessingStatus(false)
        setRows(json.rows)
      })
    }
  }

  const saveImportClick = () => {
    setProcessingSave(true)
    fetch('/suppliers/save-import', { method: 'POST' }).then(res => res.json()).then(json => {
      setProcessingStatus(false)
      setProcessingSave(false)
      setRows([])
      console.log(json) // eslint-disable-line no-console
    })
  }

  return (
    <Page name="supplier-import">
      <Container>
        <PageSection>
          <Title text="Import Suppliers" />

          <div className="import-button">
            <InputFile
              id="import-supplier"
              text="Choose a file..."
              custom="circle"
              ref={uploadInput}
              accept=".csv"
              onChange={uploadImportClick}
            />
          </div>

          {processingStatus && (
            <div className="process-loading">
              Processing and validating your data ...
            </div>
          )}

          {csvRows.length > 0 && (
            <Fragment>
              <table className="import-table">
                <thead>
                  <tr>
                    <th className="counter">#</th>
                    <th>Status</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>TIN</th>
                    <th>Tax Class</th>
                    <th>Principal</th>
                    <th>Terms</th>
                  </tr>
                </thead>
                <tbody>
                  {csvRows.map((row, index) => (
                    <tr key={`row-${index}`}>
                      <td>{index + 1}</td>
                      <td>
                        <span className={classNames('badge', { success: row.ok, error: !row.ok })}>
                          {row.ok ? 'OK' : 'Duplicate'}
                        </span>
                      </td>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.address}</td>
                      <td>{row.TIN}</td>
                      <td>{row.taxClass}</td>
                      <td>{row.principal}</td>
                      <td>{row.terms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="import-action">
                <button
                  className="save-import"
                  onClick={saveImportClick}
                  disabled={processingSave}
                >
                  { processingSave ? 'Processing your import ...' : 'Save Import' }
                </button>
              </div>
            </Fragment>
          )}
        </PageSection>
      </Container>
    </Page>
  )
}

export default Import
