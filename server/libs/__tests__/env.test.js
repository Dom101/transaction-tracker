import env from '../env';

test('It should return the process.env value for the requested key', () => {
  const actual = env.get('NODE_ENV');
  const expected = 'test';

  expect(actual).toBe(expected);
});

test('It should return the provided default value if the key does not exist', () => {
  const actual = env.get('SOME_ENV_VARIABLE_THAT_DOES_NOT_EXIST', 123);
  const expected = 123;

  expect(actual).toBe(expected);
});
