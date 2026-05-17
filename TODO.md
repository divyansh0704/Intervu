- [x] Locate auth cookie issues causing GET /api/auth/getme to return 401
- [x] Patch backend cookie creation to include proper cookie options (httpOnly/sameSite/secure)
- [ ] Patch backend clearCookie to match cookie options (already updated in controller)
- [ ] Re-test login flow: cookie should be present and homepage should render

