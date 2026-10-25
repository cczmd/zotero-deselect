# Security Policy

## Supported versions

Security fixes are provided for the latest published release of Zotero Deselect.

## Security model

Zotero Deselect is intentionally small. The plugin only changes Zotero UI selection and focus state. It does not intentionally:

- read or upload library contents;
- send telemetry or analytics;
- make network requests;
- write to the Zotero database;
- execute operating-system commands.

The source code and release workflow are public so users can inspect what is shipped.

## Reporting a vulnerability

Please do not publish exploit details or sensitive information in a public issue.

If GitHub shows **Report a vulnerability** in the repository's Security tab, use that private reporting channel. Otherwise, open a minimal issue titled `Security report request` without exploit details so a private reporting path can be arranged.

## Release integrity

Official releases are published from this repository. Release assets include a SHA-256 checksum file, and Zotero update metadata includes the expected SHA-256 hash for the XPI.
