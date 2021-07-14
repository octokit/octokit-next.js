import { Base } from "javascript-plugin-architecture-with-typescript-definitions";

type Constructor<T> = new (...args: any[]) => T;

export const Octokit: typeof Base &
  Constructor<{
    request: () => void;
  }>;
