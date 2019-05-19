import React from 'react'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import Container from '@lib/Container'
import './style.scss'

const EWT = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="EWT" />
      </PageSection>

      <PageSection>
        Content from EWT
      </PageSection>
    </Container>
  </Page>
)

export default EWT
