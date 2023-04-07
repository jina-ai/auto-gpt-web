import * as cmd from '.';

export * from './google';

export const exec = async (raw = '{}') => {
  const { name, args } = JSON.parse(raw).command as {
    name: keyof typeof cmd;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any;
  };

  // Disallow recursive running of exec
  if (name === 'exec') {
    return;
  }

  if (typeof cmd[name] === 'function') {
    return cmd[name](args.input);
  }
}
