## Repository Preparation

0.  Fork the repository to your Github and clone it from your Github. Always create MR from your main repository to staging first!
1.  Initiate npm project by command:
    ```
    npm init -y
    ```
2.  Make .gitignore file and copy the .gitignore file format from https://gist.github.com/andreasonny83/b24e38b7772a3ea362d8e8d238d5a7bc
3.  Prepare husky pre-commit to enable doing something when creating a new commit by commands:
    ```
    npm install husky -D
    npm set-script prepare "husky install"
    npm run prepare
    ```
    Details can be seen in https://github.com/typicode/husky
4.  Create commitlint pre-commit hook to standardize commit message by command:
    ```
    npm install --save-dev @commitlint/{config-conventional,cli}
    npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
    ```
    Details of the accepted commit format can be seen in https://github.com/conventional-changelog/commitlint
    For the convention of commit message see https://www.conventionalcommits.org/en/v1.0.0/
    Note: Use 'chore' keyword to commit everything not directly related with user interaction (ex: repository preparation, adding unit test framework, etc.)
5.  Install jest unit testing with command
    ```
    npm install --save-dev jest
    ```
6.  Don't forget to change "test" script in your package.json to become "jest"
7.  Create tests/{something}.test.js directory and setup dummy unit testing with jest which contains only
    ```
    describe("Dummy test to test github workflow", () => {
        test("A should equal to A", () => {
            const dummy = "A";
            expect(dummy).toBe("A");
        });
    });
    ```
8.  Add testing to pre-commit hook by command
    ```
    npx husky set .husky/pre-commit "npm test"
    ```
9.  Add prettier to pre-commit hook to standardize code prettifying before creating a commit
    ```
    npx husky add .husky/pre-commit "npx pretty-quick --staged"
    ```
10. Install prettier package for lint checking workflow preparation
    ```
    npm install --save-dev --save-exact prettier
    ```
11. Create .prettierignore file (see the https://sourcegraph.com/github.com/sourcegraph/sourcegraph/-/blob/.prettierignore for reference) and add *.md , *config.js , \*.html
12. Create .github/workflows directory to prepare Github workflows / actions
13. Create **lint.yml** file (see https://github.com/marketplace/actions/lint-action for the reference) for lint checking workflow

    ```
    name: Lint

    on:
    push:
        branches: [main, staging]
    pull_request:
        branches: [main, staging]

    jobs:
        run-linters:
            name: Run linters
            runs-on: ubuntu-latest

            steps:
            -   name: Check out Git repository
                uses: actions/checkout@v2

            -   name: Set up Node.js
                uses: actions/setup-node@v1
                with:
                    node-version: 14.x

            # ESLint and Prettier must be in `package.json`
            -   name: Install Node.js dependencies
                run: npm ci

            -   name: Run linters
                uses: wearerequired/lint-action@v1
                with:
                    prettier: true
    ```

14. Create **node.js.yml** file for testing workflow

    ```
    name: Node.js CI

    on:
        push:
            branches: [ main, staging ]
        pull_request:
            branches: [ main, staging ]

    jobs:
        build:

            runs-on: ubuntu-latest

            services:
                postgres:
                    image: postgres
                    env:
                        POSTGRES_USER: postgres
                        POSTGRES_PASSWORD: postgres
                        POSTGRES_DB: postgres
                    options: --health-cmd pg_isready
                        --health-interval 10s
                        --health-timeout 5s
                        --health-retries 5
                    ports:
                    - 5432:5432

            steps:
            -   name: Checkout repository code
                uses: actions/checkout@v2
            -   name: Use Node.js 14
                uses: actions/setup-node@v2
                with:
                    node-version: 14.x
            -   name: Install dependencies
                run: npm ci
        #     - name: Install sequelize cli
        #       run: npm install -g sequelize-cli
        #     - name: Do migration
        #       run: sequelize db:migrate --env test
        #     - name: Do seeding
        #       run: sequelize db:seed:all --env test
        #     - name: Creating jwt secret file mock up
        #       run: echo "JWT_SECRET=ABCD" > .env
            -   run: npm run build --if-present
            -   name: Run testing
                run: npm test
            -   name: Upload coverage to Codecov
                uses: codecov/codecov-action@v1
    ```

    You can use services to prepare the database for testing.
    Actually you can use Github secret for the environment variables used in the workflow but rightnow we just use echo.
15. Add build badge to README.md file by adding `![CI workflow](https://github.com/final-project-blazing-fox/{service_name}/actions/workflows/node.js.yml/badge.svg)` in README.md
16. Add codecoverage badge to README.md by adding `[![codecov](https://codecov.io/gh/final-project-blazing-fox/{service_name}/branch/main/graph/badge.svg?token={token})](https://codecov.io/gh/final-project-blazing-fox/{service_name})` (ask codecov admin for the badge url)
17. Add open issues badge in README.md by adding `![GitHub issues](https://img.shields.io/github/issues-raw/final-project-blazing-fox/user-profile-service)`
18. Add open Pull Request badge in README.md by adding `![GitHub pull requests](https://img.shields.io/github/issues-pr/final-project-blazing-fox/user-profile-service)`
19. Commit all your changes and push it

## Creating Pull Requests

1.  For convinience, you can disable Github action in your own repository (which is forked from https://github.com/final-project-blazing-fox/user-profile-service)
2.  Create new branch for every issue / task you are assigned.
3.  Create Pull Request from your Github repository branch to final-project-blazing-fox/user-profile-service staging branch
4.  In your Pull Request title, make sure you explain the summary of the Pull Request
5.  Choose **reviewer, assignee, label, milestone, and projects**
6.  Link your Pull Request to the certain Issue by using "Closes #{something}" in Pull Request description. You can use comma to link to multiple issue (ex: Closes #1, Closes #2). See https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue for another keywords other than "Closes"
