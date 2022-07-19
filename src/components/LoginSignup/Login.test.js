import React, { useState } from 'react';
import Login from './Login.js'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { AuthContextProvider } from '../../context/AuthContext.js'
import { BrowserRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom/extend-expect";
import { signInWithEmailAndPassword } from '../../firebase'

import { Home } from '../Home/Home.js'

test ("Log in title is rendered", async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper: AuthContextProvider})
    await waitFor(() => {
        const title = screen.getByText("Log in")
        expect(title).toBeInTheDocument()
    })
})

test ("Log in description is rendered", async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper: AuthContextProvider})
    await waitFor(() => {
        const desc = screen.getByText("Don't have an account yet?")
        expect(desc).toBeInTheDocument()
    })
})

test ("Sign up link is rendered", async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper: AuthContextProvider})
    await waitFor(() => {
        const signUpLink = screen.getByRole('link', { name: 'Sign up' })
        expect(signUpLink).toHaveAttribute('href','/signup')
    })
})

test ("Email label is rendered", async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    await waitFor(() => {
        const emailLabel = screen.getByText("Email")
        expect(emailLabel).toBeInTheDocument()
    })
})

test ("Password label is rendered", async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    await waitFor(() => {
        const passwordLabel = screen.getByText("Password")
        expect(passwordLabel).toBeInTheDocument()
    })
})

test('log in button is rendered and enabled on click', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    await waitFor(() => {
        const loginButton = screen.getByText('Log in')
        userEvent.click(loginButton)
        expect(loginButton).toBeInTheDocument()
        expect(screen.getByText('Log in')).toBeEnabled()
    })
});

test ("Home navigation link is rendered and enabled on click", async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper: AuthContextProvider})
    await waitFor(() => {
        const homeLink = screen.getByRole('link', { name: 'Home' })
        userEvent.click(homeLink)
        expect(homeLink).toHaveAttribute('href','/')
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Log in')).toBeEnabled()
    })
})

test("login page image is rendered", async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    await waitFor(() => {
        const img = screen.getByAltText("login-page-img")
        expect(img).toBeInTheDocument()
    })
})

test('email input is rendered', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    await waitFor(() => {
        const emailInput = screen.getByLabelText('Email')
        expect(emailInput).toBeInTheDocument()
        expect(emailInput).toHaveAttribute("type", "email")
    })
});

test('password input is rendered', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    await waitFor(() => {
        const passwordInput = screen.getByLabelText('Password')
        expect(passwordInput).toBeInTheDocument()
        expect(passwordInput).toHaveAttribute("type", "password")
    })
})
 
test ('email input accepts user input', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    await waitFor(() => {
        const emailInput = screen.getByLabelText('Email')
        const inputValue = "test@mail.com"
        fireEvent.change(emailInput, {target: {value: inputValue}})
        expect(emailInput.value).toBe(inputValue)
    })
})

test ('password input accepts user input', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})
    const passwordInput = screen.getByLabelText('Password')
    const inputValue = "password"
    fireEvent.change(passwordInput, {target: {value: inputValue}})
    await waitFor(() => 
        expect(passwordInput.value).toBe(inputValue))
})

test ('Error message rendered when user provides an email that has not been registered', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button')
    const loginErrorText = screen.getByTestId("error")

    userEvent.type(emailInput, "test@mail.com")
    userEvent.type(passwordInput, "password")
    fireEvent.click(loginButton)

    await waitFor(() => {
        expect(loginErrorText).toBeVisible()
        expect(screen.getByText('You do not have a registered account')).toBeInTheDocument()

    })
})

test ('Error message rendered when user provides a valid email but invalid password', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button')
    const loginErrorText = screen.getByTestId("error")

    userEvent.type(emailInput, "helloworld@gmail.com")
    userEvent.type(passwordInput, "password")
    fireEvent.click(loginButton)

    await waitFor(() => {
        expect(loginErrorText).toBeVisible()
        expect(screen.getByText('Your login credentials are inaccurate')).toBeInTheDocument()

    })
})


test ('Error message rendered when user did not provide password', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button')
    const loginErrorText = screen.getByTestId("error")

    userEvent.type(emailInput, "helloworld@hotmail.com")
    fireEvent.click(loginButton)

    await waitFor(() => {
        expect(loginErrorText).toBeVisible()
        expect(screen.getByText('Your login credentials are inaccurate')).toBeInTheDocument()

    })
})

test ('Error message rendered when user did not provide email', async () => {
    render(<BrowserRouter><Login/></BrowserRouter>, {wrapper:AuthContextProvider})

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button')
    const loginErrorText = screen.getByTestId("error")

    userEvent.type(passwordInput, "password")
    fireEvent.click(loginButton)

    await waitFor(() => {
        expect(loginErrorText).toBeVisible()
        expect(screen.getByText('Your login credentials are inaccurate')).toBeInTheDocument()

    })
})




/*








/*

test('pass valid email to test email input field', () => {
    render(<App />);
 
    const inputEl = screen.getByTestId("email-input");
    userEvent.type(inputEl, "test@mail.com");
 
    expect(screen.getByTestId("email-input")).toHaveValue("test@mail.com");
    expect(screen.queryByTestId("error-msg")).not.toBeInTheDocument();
  });

  */