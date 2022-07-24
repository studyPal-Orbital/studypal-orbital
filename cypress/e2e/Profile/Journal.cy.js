/// <reference types="cypress" />

describe('User can create and delete journal entries', () => {
    beforeEach(() => {
      /* Visit website */
      cy.visit('http://localhost:3000')
  
      /* Landing page */
      cy.contains('div','studyPal')
      cy.contains('div','A productivity application to help you plan your busy days!')
      cy.get('[data-cy="greeting-img"]')
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
      cy.get('[data-cy="log-in"]').click()
  
      /* Log in page */ 
      cy.get('[data-cy="email-input"]').type('test123@email.com')
      cy.get('[data-cy="password-input"]').type('test12345')
      cy.get('[data-cy="log-in-account"]').click()
  
      /* Home Page */
      cy.get('[data-cy="home-img"]').should('be.visible')
      cy.get('[data-cy="greeting"]').should('be.visible')
      cy.get('[data-cy="upcoming-event"]').should('be.visible')
  
      /* Forum Page */
      cy.get('[data-cy="profile-header"]').click()
    })

    it('User can create an active journal entry', () => {
      // Create active journal
      cy.get('[data-cy="create-journal"]').click()
      cy.get('[data-cy="title"]').type("Active journal title")
      cy.get('[data-cy="body"]').type("Active journal body")
      cy.get('[data-cy="conclusion"]').type("Active journal conclusion")
      cy.get('[data-cy="set-active-journal"]').click()
      cy.get('[data-cy="thoughts-kept-journal-text"]').should('be.visible')
      cy.get('[data-cy="thoughts-kept-journal-text"]').should('have.text', 'Please rest more and take good care of yourself!')
      cy.get('[data-cy="close"]').click()

      // View all active journals
      cy.get('[data-cy="active-thoughts"]').click()
      cy.get('[data-cy="active-title"]').eq(0).click()
      cy.get('[data-cy="active-title"]').eq(0).should('have.text', 'Active journal title')
      cy.get('[data-cy="active-body"]').eq(0).should('have.text', 'Active journal body')
      cy.get('[data-cy="active-conclusion"]').eq(0).should('have.text', 'Active journal conclusion')
    })

    it('User can archive active journal entries', () => {
      // View all archived entries
      cy.get('[data-cy="active-thoughts"]').click()
      cy.get('[data-cy="active-title"]').eq(0).click()
      cy.get('[data-cy="send-to-archive"]').eq(0).click()
      
      // Check that previously archived active journal entry is shown in archived entries page
      cy.get('[data-cy="back-to-profile"]').eq(0).click()
      cy.get('[data-cy="archived-thoughts"]').click()
      cy.get('[data-cy="archived-title"]').eq(0).click()
      cy.get('[data-cy="archived-title"]').eq(0).should('have.text', 'Active journal conclusion')
      cy.get('[data-cy="archived-body"]').eq(0).should('have.text', 'Active journal title')
      cy.get('[data-cy="archived-conclusion"]').eq(0).should('have.text', 'Active journal body')

      // Clean up test by deleting archived test journal 
      cy.get('[data-cy="delete"]').click()
    })

    it('User can create an archived journal entry', () => {
      // Create archived journal
      cy.get('[data-cy="create-journal"]').click()
      cy.get('[data-cy="title"]').type("Archived journal title")
      cy.get('[data-cy="body"]').type("Archived journal body")
      cy.get('[data-cy="conclusion"]').type("Archived journal conclusion")
      cy.get('[data-cy="set-archive-journal"]').click()
      cy.get('[data-cy="thoughts-let-go-journal-text"]').should('be.visible')
      cy.get('[data-cy="thoughts-let-go-journal-text"]').should('have.text', 'Congrats on letting go of your negative emotions!')
      cy.get('[data-cy="close"]').click()

      // View all archived journals
      cy.get('[data-cy="archived-thoughts"]').click()
      cy.get('[data-cy="archived-title"]').eq(0).click()
      cy.get('[data-cy="archived-title"]').eq(0).should('have.text', 'Archived journal conclusion')
      cy.get('[data-cy="archived-body"]').eq(0).should('have.text', 'Archived journal title')
      cy.get('[data-cy="archived-conclusion"]').eq(0).should('have.text', 'Archived journal body')
      
      // Clean up test by deleting archived test journal 
      cy.get('[data-cy="delete"]').click()
    })
})