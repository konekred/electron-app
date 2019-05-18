import React from 'react'
import {
  Page,
  PageSection,
  Title
} from '@lib/Page'

import Container from '@lib/Container'
import './style.scss'

const BadOrders = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="Bad Orders" />
      </PageSection>

      <PageSection>
        Content for Bad Orders
      </PageSection>
    </Container>
  </Page>
)

export default BadOrders
