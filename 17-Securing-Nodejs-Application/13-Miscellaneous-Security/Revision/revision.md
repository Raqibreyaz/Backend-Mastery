# Miscellaneous Security and Dependency Hygiene — One-Shot Revision

## 1. One-line Definition

Security hygiene is the continuous process of reducing risk across dependencies, code, infrastructure, monitoring, and delivery practices.

## 2. Why was it introduced?

Secure application code can still be compromised by vulnerable transitive packages, unsafe deployment configuration, missing detection, or unaddressed attack classes.

## 3. Core Mental Model

Your attack surface includes everything you ship and operate: direct/transitive dependencies, build scripts, configuration, infrastructure, browser code, and third-party services.

## 4. Internal Working

Package managers resolve a dependency tree, including transitive packages. Advisories map known vulnerable versions to that tree; `npm audit` reports matches, but results need context and remediation can require upgrades or architectural change. Lockfiles make builds reproducible, but do not make old vulnerable versions safe.

Additional defenses work at layers: static analysis finds risky patterns early; WAFs filter traffic; monitoring detects anomalies; secure SDLC practices prevent and respond to flaws.

## 5. Key APIs / Syntax

```bash
npm audit
npm outdated
npm ls <package>
npm ci
npm pack --dry-run
```

Use Dependabot/Renovate or equivalent to propose updates, and security linters/Semgrep/SonarQube-style analysis in CI with reviewable rules.

## 6. Comparison

| Tool/control | Main role |
| --- | --- |
| `npm audit` | Find known advisory matches in dependency tree |
| Lockfile + `npm ci` | Reproducible, reviewed installations |
| SAST/linter | Find unsafe code patterns before deployment |
| WAF/CDN | Filter/absorb traffic at edge |
| DAST/pentest | Exercise running application behavior |
| Monitoring/logging | Detect and investigate live issues |

## 7. Common Mistakes

- Blindly running automated fixes without testing breaking changes.
- Ignoring transitive dependencies and install-time scripts.
- Assuming “no audit findings” means secure.
- Adding many unmaintained packages for trivial utilities.
- Logging secrets/PII or lacking alerting/audit trails.
- Treating WAF or compliance certification as a replacement for secure coding.

## 8. Production Considerations

- Minimize dependencies; review maintainers, provenance, permissions, and release activity before adding packages.
- Run audits/SAST in CI, triage findings by exploitability and exposure, patch promptly, and document accepted risk with expiry.
- Pin/review lockfile changes, protect CI secrets, and consider dependency provenance/SBOM practices.
- Cover SSRF, ReDoS, session fixation, replay protection, upload validation, sandboxed untrusted iframes, and secure SDLC threat modeling.
- Use WAF/security testing as supporting layers; keep incident response, backups, and recovery practiced.

## 9. Interview Questions

1. Direct versus transitive dependency vulnerability?
2. What can `npm audit` tell you—and not tell you?
3. Why use lockfiles and `npm ci`?
4. SAST versus DAST?
5. What is defense in depth?

## 10. Memory Triggers

- **Supply chain is part of the application.**
- **Lockfile reproduces; audit discovers; review decides.**
- **SAST before deploy, monitoring after deploy.**
- **No single tool proves security.**

## 11. Summary

Security requires continuous dependency, code, and operational hygiene. Automate discovery and testing, but apply human review, layered controls, least privilege, and an incident-ready secure SDLC.
