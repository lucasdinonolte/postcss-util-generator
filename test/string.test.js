const {
  capitalizeWord,
  kebabCaseFromArray,
  camelCaseFromArray,
} = require('../src/string');

describe('string utils', () => {
  describe('capitalizeWord', () => {
    it('capitalizes a word', () => {
      expect(capitalizeWord('foo')).toBe('Foo');
      expect(capitalizeWord('foo2')).toBe('Foo2');
    });

    it('does not capitalize a word that is already capitalized', () => {
      expect(capitalizeWord('Foo')).toBe('Foo');
      expect(capitalizeWord('Foo2')).toBe('Foo2');
    });
  });

  describe('kebabCaseFromArray', () => {
    it('kebab cases an array of words', () => {
      expect(kebabCaseFromArray(['foo', 'bar'])).toBe('foo-bar');
      expect(kebabCaseFromArray(['foo', 'bar2'])).toBe('foo-bar2');
    });
  });

  describe('camelCaseFromArray', () => {
    it('kebab cases an array of words', () => {
      expect(camelCaseFromArray(['foo', 'bar'])).toBe('fooBar');
      expect(camelCaseFromArray(['FOO', 'bAR'])).toBe('fooBar');
    });
  });
});
