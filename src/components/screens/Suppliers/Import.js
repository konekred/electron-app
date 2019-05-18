import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import Container from '@lib/Container'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import { toFormData } from '@helpers'
import './style.scss'

const Import = () => {
  const [processingStatus, setProcessingStatus] = useState(false)
  const [csvRows, setRows] = useState([])
  const uploadInput = useRef(null)


  const uploadImportClick = () => {
    setRows([])
    setProcessingStatus(true)

    const fetchOption = {
      method: 'POST',
      body: toFormData({
        file: uploadInput.current.files[0]
      })
    }

    fetch('/suppliers/import', fetchOption).then(res => res.json()).then(json => {
      setProcessingStatus(false)
      setRows(json.rows)
    })
  }

  const saveImportClick = () => {
    fetch('/suppliers/save-import', { method: 'POST' }).then(res => res.json()).then(json => {
      setProcessingStatus(false)
      setRows([])
      console.log(json)
    })
  }


  return (
    <Page name="supplier-import">
      <Container>
        <PageSection>
          <Title text="Import Suppliers" />
        </PageSection>

        <PageSection>
          <div>
            Content for Import Suppliers
          </div>

          <div className="padded">
            <input
              type="file"
              ref={uploadInput}
              accept=".csv"
            />
          </div>

          <div className="padded">
            <button onClick={uploadImportClick}>Validate Data</button>
          </div>

          <div className="padded">
            <button onClick={saveImportClick}>Save and Import</button>
          </div>
        </PageSection>

        <PageSection>
          {processingStatus && (
            <div className="process-loading">
              Processing and validating your file ...
            </div>
          )}

          {csvRows.length > 0 && (
            <table className="suppliers-import-table">
              <thead>
                <tr>
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
          )}
        </PageSection>
      </Container>
    </Page>
  )
}

export default Import
