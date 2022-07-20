/// <reference types="cypress" />

describe('User can search for and play music', () => {
    beforeEach(() => {
      // Visit website 
      cy.visit('http://localhost:3000')
  
      // Landing page
      cy.contains('div','studyPal')
      cy.contains('div','A productivity application to help you plan your busy days!')
      cy.get('[data-cy="greeting-img"]')
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
      cy.get('[data-cy="log-in"]').click()
  
      // Log in page 
      cy.get('[data-cy="email-input"]').type('test123@email.com')
      cy.get('[data-cy="password-input"]').type('test12345')
      cy.get('[data-cy="log-in-account"]').click()
  
      // Home Page 
      cy.get('[data-cy="home-img"]').should('be.visible')
      cy.get('[data-cy="greeting"]').should('be.visible')
      cy.get('[data-cy="upcoming-event"]').should('be.visible')
  
      // Task Tracker Page 
      cy.get('[data-cy="focus-session-header"]').click()
    })

    it('Search for and play music with no filters', () => {
        // Search by sub-term 
        cy.get('[data-cy="search-music"]').type("a")
        cy.get('[data-cy="option"]').eq(0).click()
        cy.get('[data-cy="audio"]').should('be.visible')

        // Search by full name
        cy.get('[data-cy="search-music"]').clear()
        cy.get('[data-cy="search-music"]').type("Studio Ghibli piano covers")
        cy.get('[data-cy="option"]').eq(0).click()
        cy.get('[data-cy="audio"]').should('be.visible')

     })

     it('Search for and play music (genre filters are applied before search)', () => {
      // Apply filter before search (only songs in Piano Genre should be shown)
      cy.get('[data-cy="genre-select"]').select('Piano')
      cy.get('[data-cy="search-music"]').type("Studio Ghibli piano covers").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("English pop songs piano cover").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Audiomachi").should('be.visible')
      cy.contains('Audiomachine').should('not.exist')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Workout ED").should('be.visible')
      cy.contains('Workout EDM').should('not.exist')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Rain").should('be.visible')
      cy.contains('Rain lo-fi').should('not.exist')
     })

    it('Search for and play music (genre filters are applied after search)', () => {
      // Play a song with normal search (no filters applied)
      cy.get('[data-cy="search-music"]').type("Hans Zimmer").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="genre-select"]').select('Sounds of nature')

      // Only songs with Sounds of nature genre will appear
      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Fire").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Forest").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Hans Zimmer").should('be.visible')
      cy.contains('Hans Zimmer soundtrack').should('not.exist')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Indie games").should('be.visible')
      cy.contains('Indie games lo-fi').should('not.exist')

      // Songs of all genre will appear
      cy.get('[data-cy="genre-select"]').select('All')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Hans Zimmer").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Rain").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Movie").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("Odesza").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')

      cy.get('[data-cy="search-music"]').clear()
      cy.get('[data-cy="search-music"]').type("English pop songs piano cover").should('be.visible')
      cy.get('[data-cy="option"]').eq(0).click()
      cy.get('[data-cy="audio"]').should('be.visible')
    })
  })

