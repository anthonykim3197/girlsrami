# Deployment audit and rollback reference — 2026-10-15

This document records the read-only baseline audit before the rollout. No push, deployment, credential change or Cloudflare configuration change was performed during that audit. It is not a claim that later release/upload work has not occurred; record the final rollout commit and deployment separately.

## Verified source and access

- Repository: `anthonykim3197/girlsrami` (public), default branch `main`.
- `git ls-remote origin refs/heads/main` returned `98aeb9009d96ccec59cdbf457845e620d2607679`.
- Working branch: `codex/storefront-standard-rollout-20261015`, originally based on that commit.
- GitHub CLI is not authenticated. The connected GitHub app is authenticated as `anthonykim3197` and reports repository admin/maintain/push/pull permissions. No credential material was read or exported.
- Cloudflare Pages project: `girlsrami`, linked to the repository's `main` production branch according to deployment records.
- GitHub's Cloudflare Pages check for the baseline SHA completed successfully on 2026-10-13 at 10:46:50 UTC.
- Successful deployment ID: `0766658b-1607-4491-80d8-a8aac5fa7c6f`; preview: <https://0766658b.girlsrami.pages.dev>.

## Build evidence and current limits

The repository declares `npm run build`, which executes `node scripts/build.mjs` and produces `dist`. Production and the successful deployment URL serve generated product HTML, while `/scripts/build.mjs` and `/seo-products.json` return the fallback HTML instead of source files. Production `app.js` matches the baseline source byte-for-byte. Production `member.js` matches the baseline after applying the build script's versioned admin-import transformation. This confirms the current public deployment is the built output.

The Cloudflare dashboard session was logged out, so its exact current build-command/output-directory fields and preview-branch rules were not read. The initial 2026-10-01 setup record said `exit 0` and `.`; that is historical, not an assertion of today's settings. Verify project Settings > Builds & deployments before relying on a changed build or branch policy. The current source contract is `npm run build` / `dist` / repository root.

The static site has no application start command: Cloudflare serves the generated files. Local Python preview servers are not production services.

## Rollback path

The baseline successful production deployment above is the intended rollback candidate after this rollout. In Cloudflare, open Workers & Pages > girlsrami > Deployments > All deployments, choose the target deployment's action menu, and select **Rollback to this deployment**. Confirm that the selected deployment is a successful production deployment; preview deployments cannot be rollback targets. See [Cloudflare's rollback documentation](https://developers.cloudflare.com/pages/configuration/rollbacks/).

If rollback must be performed through Git instead, revert only the new rollout commit(s) in a new commit and push to `main`. Preserve other work; do not force-reset the branch. Cloudflare's linked build can then publish the reverted source. A static-site rollback does not revert Supabase product data or SmartStore listings.

## Live catalog comparison

A second anonymous read on 2026-10-15 still returned 12 active products and 8 coming/test products. The active products' status, price, channel price and purchase URLs had no changes from the earlier audit snapshot. No stock, price or product record was modified during that comparison. The later owner confirmation of FREE / cm for RM382 and RM495 is reflected in the local detail manifest; any backend option update must be verified separately.

Build documentation: [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).
