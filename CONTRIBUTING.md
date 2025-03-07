# Contributing to CivIQ

Thank you for your interest in contributing to CivIQ, a censorship-resistant civic discourse platform designed for high-quality discussion. This document outlines the guidelines and requirements for contributing to the open-source components of CivIQ.

## Our Mission

CivIQ aims to create a platform that fosters meaningful, evidence-based discussions and productive political dialogue. We prioritize quality discourse over engagement metrics, emphasize transparency and user privacy, and build resilience against censorship, takedowns, and manipulation.

## Code of Conduct

- Treat all contributors with respect and professionalism
- Focus on constructive feedback and solutions
- Maintain privacy and confidentiality of project communications
- Follow security best practices in all contributions

## Communication Requirements

- All project communications must be conducted via encrypted mediums
- Recommended platforms include:
  - Signal for direct messaging
  - Matrix/Element for group discussions
  - ProtonMail for email communications
- Never share sensitive project information over unencrypted channels

## Technical Requirements

### Git Requirements

- All commits must be GPG signed to verify authenticity
  - [GitHub guide on signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
  - [GitLab guide on signing commits](https://docs.gitlab.com/ee/user/project/repository/signed_commits/)
- Use meaningful commit messages following conventional commits format:
  - Format: `type(scope): message` (e.g., `feat(profiles): add privacy settings`)
  - Types: feat, fix, docs, style, refactor, test, chore
- Keep commits focused on a single logical change

### Pull Request Process

1. Fork the repository and create a feature branch from `main`
2. Ensure code follows the project's style guidelines
3. Update documentation as necessary
4. Include tests for new functionality
5. Submit PR with a clear description of changes and their purpose
6. Ensure all automated checks pass
7. Address feedback from maintainers

### Code Standards

- Follow existing code style and patterns in the repository
- Write clear, commented, and maintainable code
- Ensure code is tested with appropriate unit/integration tests
- Maintain backward compatibility where possible
- Adhere to security best practices

### Security Considerations

- Report security vulnerabilities to security@civiq.us (not as public issues)
- Never commit sensitive information (tokens, credentials, etc.)
- Follow secure coding practices to prevent common vulnerabilities
- Consider privacy implications of all contributions

## License Compliance

All contributions must comply with our AGPLv3 license with Mission-Aligned Usage Clauses. Your submitted code must:

- Remain open source
- Prohibit use for profit-driven social media, misinformation, censorship, or surveillance
- Support civic engagement, misinformation prevention, education, and transparency initiatives

## Getting Started

1. Review open issues labeled as `good-first-issue` or `help-wanted`
2. Comment on the issue you'd like to work on
3. Follow the development setup in our README.md
4. Make your changes following our guidelines
5. Submit a PR for review

We value every contribution and look forward to building CivIQ together.

---

## Recognition

Contributors who make significant and consistent contributions will be recognized in our documentation and may be invited to join as core contributors with additional repository access.