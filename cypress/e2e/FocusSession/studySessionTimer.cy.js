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

    it('Start 10 seconds timer', () => {
      [...Array(10)].forEach((second) => {cy.get('[data-cy="set-seconds-increase"]').click()})
      cy.get('[data-cy="start-timer"]').click()
      cy.wait(12000)
      cy.get('[data-cy="session-finished"]').should('be.visible')
      cy.get('[data-cy="close-popup"]').click()
   })

   it('Start 30 minute timer', () => {
      [...Array(30)].forEach((second) => {cy.get('[data-cy="set-minutes-increase"]').click()})
      cy.get('[data-cy="start-timer"]').click()
      cy.wait(5000)
      cy.get('[data-cy="time-left"]').should("have.text","00 : 29  : 55")
  })

 it('Start 1 hour timer', () => {
    [...Array(1)].forEach((second) => {cy.get('[data-cy="set-hours-increase"]').click()})
    cy.get('[data-cy="start-timer"]').click()
    cy.wait(5000)
    cy.get('[data-cy="time-left"]').should("have.text","00 : 59  : 55")
  })


  it('Reset timer', () => {
    [...Array(5)].forEach((second) => {cy.get('[data-cy="set-seconds-increase"]').click()})
    cy.get('[data-cy="start-timer"]').click()
    cy.wait(2000)
    cy.get('[data-cy="stop-timer"]').click()
    cy.get('[data-cy="reset-timer"]').click()
    cy.wait(5000)
    cy.get('[data-cy="time-left"]').should("have.text","00 : 00  : 00")
  })

  it('Stop and resume timer with new time set', () => {
      [...Array(5)].forEach((second) => {cy.get('[data-cy="set-seconds-increase"]').click()})
      cy.get('[data-cy="start-timer"]').click()
      cy.wait(2000)
      cy.get('[data-cy="stop-timer"]').click()
      let increaseFiveSecs = [...Array(5)]
      increaseFiveSecs.forEach((second) => {cy.get('[data-cy="set-seconds-increase"]').click()})
      let decreaseThreeSecs = [...Array(3)]
      decreaseThreeSecs.forEach((second) => {cy.get('[data-cy="set-seconds-increase"]').click()})
      cy.get('[data-cy="resume-timer"]').click()
      cy.wait(10000)
      cy.get('[data-cy="time-left"]').should("have.text","00 : 00  : 00")

      })
  })
