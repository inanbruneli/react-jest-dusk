import { cleanup, render, screen, waitFor } from '@testing-library/react'
import Login from '../views/pages/authentication/Login'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { BrowserRouter } from 'react-router-dom'
import { AbilityContext } from '../utility/context/Can'
import { ThemeContext } from '../utility/context/ThemeColors'
import { Suspense } from 'react'
import Spinner from '../@core/components/spinner/Fallback-spinner'
import ability from '../configs/acl/ability'

import userEvent from '@testing-library/user-event'

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <AbilityContext.Provider value={ability}>
            <ThemeContext>
              <Login />
            </ThemeContext>
          </AbilityContext.Provider>
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
})

test('It shoud login', async () => {
  userEvent.type(screen.getByTestId('login-email'), 'admin@demo.com');
  userEvent.type(screen.getByTestId('login-password'), 'admin');
  await userEvent.click(screen.getByText('Sign in'))

  await waitFor(() => {
    expect(history.location.pathname).toBe('/dashboard/ecommerce');
  });
})

test('It shoudnt login with wrong user', async () => {
  userEvent.type(screen.getByTestId('login-email'), 'invalid_user@example.com');
  userEvent.type(screen.getByTestId('login-password'), 'invalid password');
  await userEvent.click(screen.getByText('Sign in'))

  expect(screen.getByTestId('login-email')).toHaveClass('is-invalid');
})

test('It shoudnt login with empty values', async () => {
  await userEvent.click(screen.getByText('Sign in'))

  expect(screen.getByTestId('login-email')).toHaveClass('is-invalid');
  expect(screen.getByTestId('login-password')).toHaveClass('is-invalid');
})