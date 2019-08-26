const { system, filesystem } = require('gluegun');
const {version} = require('../package.json');

const src = filesystem.path(__dirname, '..');

const cli = async cmd =>
  system.run('node ' + filesystem.path(src, 'bin', 'clitt') + ` ${cmd}`);

test('outputs version', async () => {
  const output = await cli('--version');
  expect(output).toContain(version);
});

test('outputs help', async () => {
  const output = await cli('--help');
  expect(output).toContain(version);
});
