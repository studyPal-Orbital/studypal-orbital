import React from 'react';
import Login from './Login.js';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

test("title should be rendered", () => {
    render(<Login />, {wrapper: MemoryRouter})
    const title = screen.getByText("Log in")
    expect(title).toBeInTheDocument()
})
