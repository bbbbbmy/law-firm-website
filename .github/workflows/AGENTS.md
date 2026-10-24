# GitHub workflows

| File | Purpose |
|---|---|
| `docker-publish.yml` | Matrix publishes frontend/backend only to respective GHCR image names; single-image metadata tags prevent cross-job overwrite. See change: fix-image-tag-race-20261024. |
