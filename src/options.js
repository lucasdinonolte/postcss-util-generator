const { camelCaseFromArray } = require('./string');

module.exports.defaultOptions = {
  classNameGenerator: camelCaseFromArray,
  utilities: {
    space: {
      customPropertyRegex: /^--space-/,
      utilities: {
        m: ['margin'],
        p: ['padding'],
        mx: ['margin-left', 'margin-right'],
        my: ['margin-top', 'margin-bottom'],
        px: ['padding-left', 'padding-right'],
        py: ['padding-top', 'padding-bottom'],
        mt: ['margin-top'],
        mr: ['margin-right'],
        mb: ['margin-bottom'],
        ml: ['margin-left'],
        pt: ['padding-top'],
        pr: ['padding-right'],
        pb: ['padding-bottom'],
        pl: ['padding-left'],
      },
    },
    color: {
      customPropertyRegex: /^--color-/,
      utilities: {
        bg: ['background-color'],
        text: ['color'],
      },
    },
  },
};
