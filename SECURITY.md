# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x | yes |
| < 2.0 | no |

## Reporting a Vulnerability

Please report vulnerabilities privately and do not open public issues for security problems.

- Security email: `security@amlak-web.com`
- GitHub advisory: [Create a private advisory](https://github.com/MHDcoderC/amlak-web/security/advisories/new)

Include the following in your report:

- Affected component and version
- Clear reproduction steps
- Expected vs actual behavior
- Impact assessment
- Optional mitigation suggestion

## Response Targets

- Initial acknowledgement: within 24 hours
- Triage decision: within 48 hours
- Fix timeline: usually 7-14 days (depends on severity)

## Current Security Controls

- JWT authentication with expiration
- Role-based access checks for admin endpoints
- Password hashing via bcrypt
- Login and registration rate limiting
- Request payload size limits
- File upload type and size checks
- Environment-based CORS policy

## Deployment Hardening Checklist

- Use HTTPS only in production
- Set strong `JWT_SECRET` (required)
- Restrict `ALLOWED_ORIGINS` to trusted domains
- Keep dependencies updated
- Rotate credentials periodically
- Store secrets only in environment variables

## Disclosure Policy

We follow responsible disclosure:

1. Private report
2. Verification and severity assessment
3. Patch and validation
4. Coordinated public disclosure if needed

