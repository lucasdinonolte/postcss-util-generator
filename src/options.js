const { camelCaseFromArray } = require('./string');

module.exports.defaultOptions = {
  classNamePrefix: '',
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
    background: {
      customPropertyRegex: /^--color-/,
      utilities: {
        bg: (v) => ({ 'background-color': v }),
      },
    },
    color: {
      customPropertyRegex: /^--color-/,
      utilities: {
        text: ['color'],
      },
    },
  },
  staticUtilities: {
    text: {
      items: { left: 'left', right: 'right', center: 'center' },
      properties: ['text-align'],
    },
  },
};
