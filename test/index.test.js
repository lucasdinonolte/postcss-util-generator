const postcss = require('postcss');
const plugin = require('../src/index.js');

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });

  expect(result.css).toEqual(output);
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

const utilCss = `.bgBlue {
  background-color: var(--color-blue);
}

.bgBlue100 {
  background-color: var(--color-blue-100);
}

.textBlue {
  color: var(--color-blue);
}

.textBlue100 {
  color: var(--color-blue-100);
}`;

const input = `${rootDecl}

@utils;`;

const inputReverse = `@utils;

${rootDecl}`;

const output = `${rootDecl}

${utilCss}`;

const outputReverse = `${utilCss}

${rootDecl}`;

describe('postcss-util-generator', () => {
  it('works', async () => {
    await run(input, output, {});
  });

  it('works with reverse', async () => {
    await run(inputReverse, outputReverse);
  });
});
