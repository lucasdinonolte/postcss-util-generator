const postcss = require('postcss');
const plugin = require('../src/index.js');

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });

  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

const input = `:root {
  --color-blue: #0000ff;
}

@utils;`;

const output = `:root {
  --color-blue: #0000ff;
}

.bgBlue {
  background-color: var(--color-blue);
}

.textBlue {
  color: var(--color-blue);
}`;

describe('postcss-util-generator', () => {
  it('works', async () => {
    await run(input, output, {});
  });
});
