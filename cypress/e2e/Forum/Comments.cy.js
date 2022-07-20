/// <reference types="cypress" />

describe('User can type out tasks on a sticky note', () => {
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
        cy.get('[data-cy="forum-header"]').click()
    })

    it('Create new comment under new post', () => {
        // Create new post
        cy.get('[data-cy="nav-to-create-post"]').click()
        cy.get('[data-cy="create-post-title"]').type("Test comments title")
        cy.get('[data-cy="create-post-body"]').type("Test comments body")
        cy.get('[data-cy="create-post"]').click()
        
        // Find and select newly created post
        cy.get('[data-cy="search-posts"]').type("Test comments title")
        cy.get('[data-cy="search-results"]').eq(0).click()
        cy.get('[data-cy="show-post-comments"]').eq(0).click()

        // Create new comment under post
        cy.get('[data-cy="create-comment"]').type("Testing comment")
        cy.get('[data-cy="submit-comment"]').click()
        cy.get('[data-cy="comments"]').contains('Testing comment')
    })

    it('Delete comment under post', () => {
         // Find and select newly created post
         cy.get('[data-cy="search-posts"]').type("Test comments title")
         cy.get('[data-cy="search-results"]').eq(0).click()
         cy.get('[data-cy="show-post-comments"]').eq(0).click()

        // Delete comment
        cy.get('[data-cy="comments"]').contains('Testing comment')
        cy.get('[data-cy="delete-comment"]').eq(0).click()
        cy.get('[data-cy="comments"]').contains('Testing comment').should('not.exist')
        cy.get('[data-cy="nav-back-to-forum"]').click()

        // Clean up test by deleting testing post
        cy.get('[data-cy="search-posts"]').type("Test comments title")
        cy.get('[data-cy="search-results"]').eq(0).click()
        cy.get('[data-cy="forum"]').contains('Test comments title')
        cy.get('[data-cy="delete-post"]').eq(0).click()
        cy.get('[data-cy="forum"]').contains('Test title').should('not.exist')
    })
})