import React from 'react'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import Container from '@lib/Container'
import './style.scss'

const Deliveries = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="Deliveries" />
      </PageSection>

      <PageSection>
        Content from Deliveries
      </PageSection>
    </Container>
  </Page>
)

export default Deliveries
