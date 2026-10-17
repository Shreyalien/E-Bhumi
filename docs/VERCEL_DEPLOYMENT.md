# Vercel deployment and shared state

The maintained repository is [Shreyalien/E-Bhumi](https://github.com/Shreyalien/E-Bhumi). The production address is [e-bhumi-xi.vercel.app](https://e-bhumi-xi.vercel.app). Deploy the repository root using Node.js 24; `vercel.json` builds the runtime and routes requests through `api/index.js`.

## Persistent hosted demo

Vercel functions do not share their memory or temporary disk. Hosted sessions, accounts, applications, sample documents and audit records therefore use a **private Vercel Blob store**. The linked project needs `BLOB_READ_WRITE_TOKEN` in both Preview and Production. Keep this secret in Vercel environment settings; never put it in source code or browser scripts.

The adapter reads the latest state without CDN caching, runs the request against an isolated in-memory platform, then conditionally commits the snapshot using the storage ETag. A conflicting write replays the request against the latest state. A response or login cookie is released only after its state commits. This preserves concurrent changes and makes logout apply across instances. Storage failures return a retriable 503 without pretending an application or login was saved.

Reads request the identity representation: compressed download ETags can be weak validators and cannot safely drive conditional writes. Preview and production have separate state paths. The deployed application seeds synthetic demo records; the local `.data` store is excluded from upload and is never automatically imported. Redeploying does not reset the hosted store.

This adapter supports the hosted demo. It rewrites a shared JSON snapshot, so it is **not a database architecture for substantial traffic or sensitive real land records**. Blob operations consume the account's storage/transfer quota. A production service needs a transactional database, managed session expiry, document scanning, backup/restore testing, monitoring and authorised government/payment integrations. The application still labels simulated payments and outcomes as demo information.

## Local commands (PowerShell)

```powershell
Set-Location 'C:\Users\RimasumIT\Downloads\LANDFINAL'
npm ci
npm run build
npm run check
npm test
npm start
```

The default local address is `http://127.0.0.1:8080`. Local mode retains the existing private JSON file and in-memory sessions; restarting the local server ends those sessions.

## Publish an update

```powershell
git status
git add <reviewed-files>
git commit -m "Describe the verified change"
git push origin main
vercel deploy --yes
# Verify the returned preview URL, then promote that exact deployment:
vercel promote <verified-preview-url> --yes
```

Existing authenticated Git and Vercel access can be used from this workspace. If access expires, run `vercel login` or the configured Git credential manager's sign-in interactively. Do not paste tokens into chat. The GitHub integration may also build a pushed commit; check the resulting production deployment instead of assuming a successful push implies a healthy runtime.

## Verification

`npm test` includes the frontend's 101 lifecycle/security cases and a hosted-state regression covering independent workers, concurrent writes, restart, ownership, cross-worker logout and storage failure. Verify the actual HTTPS deployment too: landing/login/assets, catalog, authenticated role routes, CSRF, document upload, filing and decision payments, three-desk mutation review and outcome integrity. A Vercel `READY` build alone does not prove these flows work.

References: [Vercel Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk), [private storage](https://vercel.com/docs/vercel-blob/private-storage).
