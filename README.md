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

      - Client-side tabs or sections for Summary, Slide Explainer, Chat, Notes

- **Fallback**

  - `/error` → Custom 404 page (with link back to `/`)

## Full CI/CD Workflow

1. Developer writes code, tests locally, and commits to a feature branch.
2. Developer opens a PR from the feature branch to main. Preview deployment is automatically created.
3. Code is reviewed by a reviewer.
4. Once approved, PR is merged to main.
5. GitHub Actions workflow builds and deploys to staging.
6. Developer tests in staging.
7. If no issues are detected in staging, developer manually deploys to production using Github Actions.
