/// <reference types="cypress" />

describe('User can create, edit, toggle complete and delete tasks on the todo list', () => {
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
    cy.get('[data-cy="email-input"]').type('ongyongen95@gmail.com')
    cy.get('[data-cy="password-input"]').type('blooberry95')
    cy.get('[data-cy="log-in-account"]').click()

    /* Home Page */
    cy.get('[data-cy="home-img"]').should('be.visible')
    cy.get('[data-cy="greeting"]').should('be.visible')
    cy.get('[data-cy="upcoming-event"]').should('be.visible')

    /* Task Tracker Page */
    cy.get('[data-cy="task-tracker-header"]').click()
  })

  /* View more info about the todo list */ 
  it('View about page', () => {
     cy.get('[data-cy="more-info"]').click()
     cy.get('[data-cy="about-title"]').should('be.visible')
     cy.get('[data-cy="delete"]').should('be.visible')
     cy.get('[data-cy="save"]').should('be.visible')
     cy.get('[data-cy="complete"]').should('be.visible')
     cy.get('[data-cy="back"]').click()
  })

  /* Create tasks */ 
  it('Create tasks', () => {
    cy.get('[data-cy="create-task"]').contains('Create Task').click()
    cy.get('[data-cy="title"]').type('Task 1 Title')
    cy.get('[data-cy="desc"]').type('Task 1 Description')
    cy.get('[data-cy="urgency"]').select('High')
    cy.get('[data-cy="submit"]').click()

    cy.get('[data-cy="create-task"]').contains('Create Task').click()
    cy.get('[data-cy="title"]').type('Task 2 Title')
    cy.get('[data-cy="desc"]').type('Task 2 Description')
    cy.get('[data-cy="urgency"]').select('Medium')
    cy.get('[data-cy="submit"]').click()

    cy.get('[data-cy="create-task"]').contains('Create Task').click()
    cy.get('[data-cy="title"]').type('Task 3 Title')
    cy.get('[data-cy="desc"]').type('Task 3 Description')
    cy.get('[data-cy="urgency"]').select('Low')
    cy.get('[data-cy="submit"]').click()
    
    /* View created tasks and ensure that they are updated accurately */
    cy.get('[data-cy="todos"]').contains('Task 1 Title')
    cy.get('[data-cy="todos"]').contains('Task 2 Title')
    cy.get('[data-cy="todos"]').contains('Task 3 Title')
    cy.get('[data-cy="todos"]').contains('High')
    cy.get('[data-cy="todos"]').contains('Medium')
    cy.get('[data-cy="todos"]').contains('Low')

    /* Expand each task card to show task description */
    cy.get('[data-cy="expand-tasks"]').click({ multiple: true })
    cy.get('[data-cy="todos"]').contains('Task 1 Description')
    cy.get('[data-cy="todos"]').contains('Task 2 Description')
    cy.get('[data-cy="todos"]').contains('Task 3 Description')

    cy.get('[data-cy="expand-tasks"]').click({ multiple: true })
    cy.get('[data-cy="todos"]').contains('Task 1 Description').should('not.exist')
    cy.get('[data-cy="todos"]').contains('Task 2 Description').should('not.exist')
    cy.get('[data-cy="todos"]').contains('Task 3 Description').should('not.exist')
  })

  /* Sort Tasks */ 
  it('Sort tasks', () => {
    cy.get('[data-cy="sort"]').click()
    cy.get('[data-cy="time-desc"]').click()
    cy.get('[data-cy="todos"]').contains('Task 1 Title')
    cy.get('[data-cy="todos"]').contains('Task 2 Title')
    cy.get('[data-cy="todos"]').contains('Task 3 Title')
    
    cy.get('[data-cy="sort"]').click()
    cy.get('[data-cy="time-asc"]').click()
    cy.get('[data-cy="todos"]').contains('Task 1 Title')
    cy.get('[data-cy="todos"]').contains('Task 2 Title')
    cy.get('[data-cy="todos"]').contains('Task 3 Title')

    cy.get('[data-cy="sort"]').click()
    cy.get('[data-cy="urgency-desc"]').click()
    cy.get('[data-cy="todos"]').contains('Task 1 Title')
    cy.get('[data-cy="todos"]').contains('Task 2 Title')
    cy.get('[data-cy="todos"]').contains('Task 3 Title')

    cy.get('[data-cy="sort"]').click()
    cy.get('[data-cy="urgency-asc"]').click()
    cy.get('[data-cy="todos"]').contains('Task 1 Title')
    cy.get('[data-cy="todos"]').contains('Task 2 Title')
    cy.get('[data-cy="todos"]').contains('Task 3 Title')
  })
  
  /* Edit Tasks */
  it('Edit tasks', () => {
    cy.get('[data-cy="edit-tasks"]').eq(0).click()
    cy.get('[data-cy="edit-title"]').clear()
    cy.get('[data-cy="edit-title"]').type('Task 1 Title Edited')
    cy.get('[data-cy="edit-body"]').clear()
    cy.get('[data-cy="edit-body"]').type('Task 1 Description Edited')
    cy.get('[data-cy="edit-urgency"]').select('Low')
    cy.get('[data-cy="update"]').click()

    cy.get('[data-cy="todos"]').contains('Task 1 Title Edited')
    cy.get('[data-cy="todos"]').contains('High').should('not.exist')
    cy.get('[data-cy="expand-tasks"]').eq(1).click()
    cy.get('[data-cy="todos"]').contains('Task 1 Description Edited')
  })

  /* Toggle tasks as complete */
    it('Toggle tasks', () => {
    cy.get('[data-cy="toggle-tasks"]').eq(1).click()
    cy.get('[data-cy="task-title"]').eq(1).should('have.css', 'textDecoration', 'line-through solid rgb(71, 71, 71)')
    })

  /* Delete tasks */ 
  it('Delete tasks', () => {
    cy.get('[data-cy="delete-tasks"]').eq(2).click()
    cy.get('[data-cy="todos"]').contains('Title 3').should('not.exist')
  })

})
