const { defaultOptions } = require('./options');

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  const { utilities, ...pluginOptions } = Object.assign(
    {},
    defaultOptions,
    opts
  );
  const props = {};

  for (const util of Object.keys(utilities)) {
    props[util] = {};
  }

  return {
    postcssPlugin: 'postcss-util-generator',
    AtRule: {
      utils: (atRule, { Declaration, Rule }) => {
        const rules = [];
        for (const util of Object.keys(utilities)) {
          const collectedProps = props[util];
          const utilMap = utilities[util].utilities;

          for (const [key, value] of Object.entries(utilMap)) {
            for (const [name, val] of Object.entries(collectedProps)) {
              const rule = new Rule({
                selector: `.${pluginOptions.classNameGenerator([key, name])}`,
              });

              for (const prop of value) {
                rule.append(
                  new Declaration({
                    prop,
                    value: `var(${val})`,
                  })
                );
              }

              rules.push(rule);
            }
          }
        }
        atRule.replaceWith(...rules);
      },
    },

    Declaration(decl) {
      if (decl.parent?.selector === ':root') {
        props[decl.prop] = decl.prop;

        for (const util of Object.keys(utilities)) {
          if (decl.prop.match(utilities[util].customPropertyRegex)) {
            const key = decl.prop.replace(
              utilities[util].customPropertyRegex,
              ''
            );
            props[util][key] = decl.prop;
          }
        }
      }
    },
  };
};

module.exports.postcss = true;
