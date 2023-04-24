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
    // Find all global custom properties and add them to the props object
    Once(root) {
      root.walkDecls((decl) => {
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
      });
    },
    AtRule: {
      utils: (atRule, { Declaration, Rule }) => {
        const rules = [];
        for (const util of Object.keys(utilities)) {
          const collectedProps = props[util];
          const utilMap = utilities[util].utilities;

          for (const [key, value] of Object.entries(utilMap)) {
            for (const [name, val] of Object.entries(collectedProps)) {
              const cleanedName = name.split('-').map((k) => k.replaceAll(/[-_]/g, ''));
              const rule = new Rule({
                selector: `.${pluginOptions.classNameGenerator([key, ...cleanedName])}`,
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
  };
};

module.exports.postcss = true;
