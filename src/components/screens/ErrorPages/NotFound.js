import React from 'react'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import Container from '@lib/Container'

const NotFound = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="Content Not Found" />
      </PageSection>

      <PageSection>
        404 Error
      </PageSection>
    </Container>
  </Page>
)

export default NotFound
