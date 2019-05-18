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
        <Title text="View Supplier Info." />
      </PageSection>

      <PageSection>
        Content for View Supplier
      </PageSection>
    </Container>
  </Page>
)

export default View
