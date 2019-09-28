# npm-update-check-action
![](https://github.com/MeilCli/npm-update-check-action/workflows/CI/badge.svg)  
JavaScript based npm new package version check action for GitHub Actions.

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
    - uses: actions/checkout@v1
    - run: npm install
    - uses: MeilCli/npm-update-check-action@v1
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
  - value: `short` or `long`

## output
- `has_npm_update`
  - has new package version information
  - value: `true` or `false` 
- `npm_update_text`
  - new package version information text, styled by `output_text_style`
- `npm_update_json`
  - new package version information json

## License
[MIT License](LICENSE).