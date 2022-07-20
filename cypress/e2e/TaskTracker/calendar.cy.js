/// <reference types="cypress" />

describe('User can create events on the Calendar', () => {
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
  
      /* Task Tracker Page */
      cy.get('[data-cy="task-tracker-header"]').click()
    })

    it('Create event in monthly, weekly & agenda view', () => {
      cy.get('[data-cy="calendar"]').click()
      cy.get('[class="rbc-day-bg"]').eq(13).click()
      cy.on('window:prompt', (str) => {
        expect(str).to.equal(`Create a new event`)
      })

      cy.get('[type="button"]').eq(4).click()
      cy.get('[class="rbc-row-segment"]').contains('event 2')

      cy.get('[type="button"]').eq(5).click()
      cy.get('[class="rbc-agenda-event-cell"]').contains('event 1')

    })
})