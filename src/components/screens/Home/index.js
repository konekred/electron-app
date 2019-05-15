import React, { useRef } from 'react'
import {
  Page,
  Title,
  PageSection
} from 'lib/Page'

import Container from 'lib/Container'
import { toFormData } from 'helpers'

import './style.scss'

const Home = () => {
  const fileInput = useRef(null)

  const onClick = () => {
    const fetchOption = {
      method: 'POST',
      body: toFormData({
        excel: fileInput.current.files[0],
        firstName: 'Wilson',
        lastName: 'Anciro'
      })
    }

    // console.log()

    fetch('/upload', fetchOption).then(data => {
      console.log(data)
    })
  }

  return (
    <Page>
      <Container>
        <PageSection>
          <Title text="Dashboard" />
        </PageSection>

        <PageSection>

            Content for Dashboard

        </PageSection>

        <PageSection>
          <input
            type="file"
            ref={fileInput}
            accept=".csv"
          />
          <button onClick={onClick}>Click MMe!</button>
        </PageSection>
      </Container>
    </Page>

  )
}

export default Home
