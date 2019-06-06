import React, {
  Fragment,
  useRef,
  useState
} from 'react'

import classNames from 'classnames'
import moment from 'moment'
import numeral from 'numeral'
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
      fetch('/bad-orders/import', { method: 'POST', body: toFormData({ file }) }).then(res => res.json()).then(json => {
        setProcessingStatus(false)
        setRows(json.rows)
      })
    }
  }

  const saveImportClick = () => {
    setProcessingSave(true)
    fetch('/bad-orders/save-import', { method: 'POST' }).then(res => res.json()).then(() => {
      setProcessingStatus(false)
      setProcessingSave(false)
      setRows([])
    })
  }

  return (
    <Page name="bad-orders-import">
      <Container>
        <PageSection>
          <Title text="Import Bad Orders" />

          <div className="import-button">
            <InputFile
              id="import-delivery"
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
                    <th className="status">Status</th>
                    <th className="date">Date</th>
                    <th className="supplier">Supplier</th>
                    <th className="quantity">Quantity</th>
                    <th className="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {csvRows.map((row, index) => (
                    <tr key={`row-${index}`}>
                      <td>{index + 1}</td>
                      <td className="status">
                        <span title={row.errors.map(error => error.message).join(', ')} className={classNames('badge', 'small', { success: row.ok, error: !row.ok })}>
                          {row.ok ? 'OK' : 'Invalid'}
                        </span>
                      </td>

                      <td className="date">
                        {moment(row.date).format('MMM. DD YYYY')}
                      </td>

                      <td className="supplier">
                        {row.supplier.name}
                        {row.supplier.isNew && (
                          <span className="badge small success">New</span>
                        )}
                      </td>

                      <td className="quantity">
                        {numeral(row.quantity).format('0')}
                      </td>

                      <td className="amount">
                        {numeral(row.amount).format('0,0.00')}
                      </td>
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
                  {processingSave ? 'Processing your import ...' : 'Save Import'}
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
