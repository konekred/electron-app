import React from 'react'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import Container from '@lib/Container'
import './style.scss'

const Vouchers = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="Vouchers" />
      </PageSection>

      <PageSection>
        Content from Vouchers
      </PageSection>
    </Container>
  </Page>
)

export default Vouchers
