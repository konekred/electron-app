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
  const [csvRows, setRows] = useState([])
  const uploadInput = useRef(null)

  const uploadImport = () => {
    const fetchOption = {
      method: 'POST',
      body: toFormData({
        file: uploadInput.current.files[0]
      })
    }

    // console.log()

    fetch('/suppliers/import', fetchOption).then(res => res.json()).then(json => {
      setRows(json.rows)
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

          <div>
            <input
              type="file"
              ref={uploadInput}
              accept=".csv"
            />
          </div>

          <div>
            <button onClick={uploadImport}>Click MMe!</button>
          </div>
        </PageSection>

        <PageSection>
          <table className="suppliers-import-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Address</th>
                <th>TIN</th>
                <th>Tax Class</th>
                <th>Principal</th>
                <th>Terms</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {csvRows.map((row, index) => (
                <tr key={`row-${index}`} className={classNames({ success: row.ok, error: !row.ok })}>
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                  <td>{row.address}</td>
                  <td>{row.TIN}</td>
                  <td>{row.taxClass}</td>
                  <td>{row.principal}</td>
                  <td>{row.terms}</td>
                  <td>
                    <span className="badge badge-success"></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PageSection>
      </Container>
    </Page>
  )
}

export default Import
