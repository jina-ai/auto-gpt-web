import * as cmd from '.';

export * from './google';

export interface Command {
  name: keyof typeof cmd;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
}

export const exec = async ({ name, args }: Command) => {
  // Disallow recursive running of exec
  if (name === 'exec') {
    return;
  }

  if (typeof cmd[name] === 'function') {
    return cmd[name](args.input);
  }
}
