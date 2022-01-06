User stories
===

Definitions
---

- **User**: a person using the application
- **Browser**: the browser client the User is using

1. When a User navigates to any page in the application (`/app`), the Browser checks if they are logged in.

  - _**If logged in**_, they continue to the requested page.
  - _**If not logged in**_, they are redirected to `/authenticate`.

2. When a User navigates to `/authenticate`, the Browser renders a login form

  1. When a User enters a username & password, the info is sent to `/api/token` to get an authentication token.

    - _**If successful**_, the User is redirected to the originally requested page, or to `/app/`.
    - _**If not successful**_, the User stays on `/authenticate` without navigating, the form is cleared, & an error message is displayed.

3. When a User navigates to the application homepage `/app/`, they are shown a list of all of their Transactions as well as their Available Funds Balance.
