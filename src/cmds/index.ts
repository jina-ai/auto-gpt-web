import * as cmd from '.';

export * from './google';
export * from './browse-website';
export * from './shutdown';
export * from './do-nothing';

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

  if (typeof cmd[name] !== 'function') {
    throw new Error(`Command ${name} not found`);
  }

  switch (name) {
    case 'google':
      return cmd[name](args.input);
    case 'browse':
      return cmd[name](args.url, args.question);
    case 'doNothing':
      return cmd[name]();
    case 'shutdown':
      return cmd[name](args.reason);
    default:
      throw new Error(`Command ${name} not implemented`);
  }
}
