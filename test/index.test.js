const postcss = require('postcss');
const plugin = require('../src/index.js');

async function run(input, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });

  expect(result.css).toMatchSnapshot();
  expect(result.warnings()).toHaveLength(0);
}

const rootDecl = `:root {
  --color-blue: #0000ff;
  --color-blue-100: #0000ff;
}

@media (min-width: 640px) {
  :root {
    --color-blue: #0000ff;
  }
}`;

const input = `${rootDecl}

@utils;`;

const inputReverse = `@utils;

${rootDecl}`;

describe('postcss-util-generator', () => {
  it('works', async () => {
    await run(input, { staticUtilities: {} });
  });

  it('works with reverse', async () => {
    await run(inputReverse, { staticUtilities: {} });
  });

  it('generates static utilities', async () => {
    const staticInput = `@utils`;

    await run(staticInput, {
      staticUtilities: {
        text: {
          items: { left: 'left', right: 'right' },
          properties: ['text-align'],
        },
      },
    });
  });

  it('should only build the specified utilities', async () => {
    const input = `${rootDecl}; @utils(color);`;

    await run(input, {});
  });
});
