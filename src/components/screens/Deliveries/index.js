import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import Container from '@lib/Container'
import SearchBar from '@shared/SearchBar'

import './style.scss'

const Deliveries = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="Deliveries" />

        <div className="action-bar">
          <div className="actions two search-action">
            <SearchBar />
          </div>

          <div className="actions two link-action">
            <Link to="/deliveries/import">
              <FontAwesomeIcon className="action-icon" icon="upload" />
              <span>Import</span>
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection>
        Content from Deliveries
      </PageSection>
    </Container>
  </Page>
)

export default Deliveries
