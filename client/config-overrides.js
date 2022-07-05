/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { alias } = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    '@types': 'src/client/@types/',
    '@utils/constants': 'src/utils/constants',
  })(config)
  return config
}
