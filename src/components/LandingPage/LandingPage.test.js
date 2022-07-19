import React from 'react';
import LandingPage from './LandingPage.jsx';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'

test("title should be rendered", () => {
    render(<LandingPage />, {wrapper: MemoryRouter})
    const title = screen.getByText("studyPal")
    expect(title).toBeInTheDocument()
})

test("description should be rendered", () => {
    render(<LandingPage/>, {wrapper:MemoryRouter})
    const desc = screen.getByText("A productivity application to help you plan your busy days!")
    expect(desc).toBeInTheDocument()
})

test("log in button should be rendered", () => {
    render(<LandingPage/>, {wrapper:MemoryRouter})
    const loginButton = screen.getByText("Log in")
    expect(loginButton).toBeInTheDocument()
})

test("sign up button should be rendered", () => {
    render(<LandingPage/>, {wrapper:MemoryRouter})
    const signupButton = screen.getByText("Sign up")
    expect(signupButton).toBeInTheDocument()
})

test("landing page image should be rendered", () => {
    render(<LandingPage/>, {wrapper:MemoryRouter})
    const img = screen.getByAltText("landing-page-img")
    expect(img).toBeInTheDocument()
})

test('check if login button is enabled on click', () => {
    render(<LandingPage/>, {wrapper:MemoryRouter})
    userEvent.click(screen.getByText('Log in'))
    expect(screen.getByText('Log in')).toBeEnabled()
});

test('check if signup button is enabled on click', () => {
    render(<LandingPage/>, {wrapper:MemoryRouter})
    userEvent.click(screen.getByText('Sign up'))
    expect(screen.getByText('Sign up')).toBeEnabled()
});