const { promisify } = require('util')
const dateFormat = require('dateformat')
const { join } = require("node:path");
const readFileAsync = promisify(require('fs').readFile)

// Given a `const` variable `TEMPLATE_DIR` which points to "<semantic-release-gitmoji>/lib/assets/templates"
const TEMPLATE_DIR = "node_modules/semantic-release-gitmoji/lib/assets/templates";
// the *.hbs template and partials should be passed as strings of contents
const template = readFileAsync(join(TEMPLATE_DIR, 'default-template.hbs'))
const commitTemplate = readFileAsync(join(TEMPLATE_DIR, 'commit-template.hbs'))

module.exports = {
  plugins: [
    [
      'semantic-release-gitmoji', {
      releaseRules: {
        major: [ ':boom:' ],
        minor: [ ':sparkles:' ],
        patch: [
          ':bug:',
          ':ambulance:',
          ':lock:'
        ]
      },
      releaseNotes: {
        template,
        partials: { commitTemplate },
        helpers: {
          datetime: function (format = 'UTC:yyyy-mm-dd') {
            return dateFormat(new Date(), format)
          }
        },
        issueResolution: {
          template: '{baseUrl}/{owner}/{repo}/issues/{ref}',
          baseUrl: 'https://github.com',
          source: 'github.com',
          removeFromCommit: false,
          regex: /#\d+/g
        }
      }
    }
    ],
    '@semantic-release/github'
  ]
}
