## Frontend URL Structure

- **Dashboard Home**

  - `/` → Main dashboard view (overview cards, recent activity)

- **Profile**

  - `/profile` → View & edit your user profile (name, avatar, preferences)

- **Courses & Lectures**

  - **(Sidebar)** Your courses live in a persistent sidebar under the dashboard layout.
  - `/course/[courseId]`

    - Course home:

      - Lecture list
      - "Upload PDF" form (creates new lecture in this course)
      - Course settings (edit title/description, delete course)

  - `/lecture/[lectureId]`

    - Lecture detail page:
      - Chat

- **Fallback**

  - `/error` → Custom 404 page (with link back to `/`)

## CI/CD Workflow

### Staging Environment

1. A developer writes code on a feature branch and opens a Pull Request to `main`. CI is triggered.
2. After code review and approval, the PR is merged.
3. The merge to `main` automatically triggers a GitHub Actions workflow (`cd.yml`).
4. This workflow deploys to Vercel staging project.

### Production Environment

1. After changes are verified in staging, a release can be deployed to production.
2. Create a new release on the GitHub repository.
3. This will trigger the release workflow (`release.yml`).
4. This workflow deploys to Vercel production project.
