import React from 'react'
import Container from '@lib/Container'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import './style.scss'

const View = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="View Delivery Info." />
      </PageSection>

      <PageSection>
        Content for View Delivery
      </PageSection>
    </Container>
  </Page>
)

export default View
