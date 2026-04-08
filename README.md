# michak.me

Personal site — a playground for experimenting with Astro, Bunny CDN, Buddy.works CI/CD, and Terraform.

> This is not a production-grade setup. It's a personal sandbox to try out these tools together.

## Stack

- **Astro** — static site framework
- **Bunny CDN** — hosting and content delivery
- **Buddy.works** — CI/CD pipeline for automated deployments
- **Terraform** — infrastructure provisioning

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |
