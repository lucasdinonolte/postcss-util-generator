const { defaultOptions } = require('./options');

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  const { utilities, staticUtilities, ...pluginOptions } = Object.assign(
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

    /**
     * Before doing any processing we walk the entire tree to find all the
     * custom properties at the root level. These are stored in the props
     * object to be turned into rules later.
     */
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

        const params = atRule.params
          .replace('(', '')
          .replace(')', '')
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);

        const shouldGenerateUtility = (key) =>
          params.length === 0 || params.includes(key);

        // Static Utilities
        for (const util of Object.keys(staticUtilities)) {
          if (shouldGenerateUtility(util)) {
            const { properties, items } = staticUtilities[util];

            for (const [key, value] of Object.entries(items)) {
              const rule = new Rule({
                selector: `.${pluginOptions.classNameGenerator([util, key])}`,
              });

              for (const prop of properties) {
                rule.append(
                  new Declaration({
                    prop,
                    value,
                  })
                );
              }

              rules.push(rule);
            }
          }
        }

        // Utilities generated from custom properties
        for (const util of Object.keys(utilities)) {
          const collectedProps = props[util];
          const utilMap = utilities[util].utilities;

          if (shouldGenerateUtility(util)) {
            for (const [key, valueResolver] of Object.entries(utilMap)) {
              for (const [name, val] of Object.entries(collectedProps)) {
                const varValue = `var(${val})`;
                let value = {};

                const cleanedName = name
                  .split('-')
                  .map((k) => k.replaceAll(/[-_]/g, ''));

                const rule = new Rule({
                  selector: `.${pluginOptions.classNameGenerator([
                    key,
                    ...cleanedName,
                  ])}`,
                });

                if (Array.isArray(valueResolver)) {
                  for (const prop of valueResolver) {
                    value[prop] = varValue;
                  }
                } else if (typeof valueResolver === 'function') {
                  value = valueResolver(varValue);
                } else {
                  throw new Error(
                    `Invalid value resolver for ${key}. Exptected an array or function, got ${typeof valueResolver}`
                  );
                }

                for (const [prop, val] of Object.entries(value)) {
                  rule.append(
                    new Declaration({
                      prop,
                      value: val,
                    })
                  );
                }

                rules.push(rule);
              }
            }
          }
        }
        atRule.replaceWith(...rules);
      },
    },
  };
};

module.exports.postcss = true;
