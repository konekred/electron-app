import React from 'react'
import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import Container from '@lib/Container'
import './style.scss'

const Home = () => {

  return (
    <Page>
      <Container>
        <PageSection>
          <Title text="Dashboard" />
        </PageSection>

        <PageSection>
            Content for Dashboard
        </PageSection>
      </Container>
    </Page>
  )
}

export default Home
