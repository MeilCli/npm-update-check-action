# npm-update-check-action
[![CI-Master](https://github.com/MeilCli/npm-update-check-action/actions/workflows/ci-master.yml/badge.svg)](https://github.com/MeilCli/npm-update-check-action/actions/workflows/ci-master.yml)  
npm new package version check action for GitHub Actions.

## Required
This action must execute after `npm install` for your dependencies.

## Example
Slack notification example, using [8398a7/action-slack](https://github.com/8398a7/action-slack):

```yaml
name: Check Package

on: 
  schedule:
    - cron: '0 8 * * 5' # every friday AM 8:00
jobs:
  npm:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm install
    - uses: MeilCli/npm-update-check-action@v5
      id: outdated
    - uses: 8398a7/action-slack@v2
      if: steps.outdated.outputs.has_npm_update != 'false'
      with:
        status: ${{ job.status }}
        text: ${{ steps.outdated.outputs.npm_update_text }}
        author_name: GitHub Actions
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
You can also pin to a [specific release](https://github.com/MeilCli/npm-update-check-action/releases) version in the format `@v5.x.x`

## input
- `execute_directories`
  - optional
  - execute directories of npm outdated command
  - if multiple directories, write multiline
- `depth`
  - optional
  - max depth for checking dependency tree
- `output_text_style`
  - optional
  - output text style
  - value: `short` or `long`, default: `short`

## output
- `has_npm_update`
  - has new package version information
  - value: `true` or `false` 
- `npm_update_text`
  - new package version information text, styled by `output_text_style`
- `npm_update_json`
  - new package version information json

## Contributes
[<img src="https://gist.github.com/MeilCli/025c2c75e8af0e8c3a38f3afdb9bbed3/raw/7891a19b834b96fe89940c07691e0d0ffca2999d/metrics_contributors.svg">](https://github.com/MeilCli/npm-update-check-action/graphs/contributors)

### Could you want to contribute?
see [Contributing.md](./.github/CONTRIBUTING.md)

## License
[<img src="https://gist.github.com/MeilCli/025c2c75e8af0e8c3a38f3afdb9bbed3/raw/7891a19b834b96fe89940c07691e0d0ffca2999d/metrics_licenses.svg">](LICENSE)
