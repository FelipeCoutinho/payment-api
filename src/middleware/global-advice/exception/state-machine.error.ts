export class StateMachineError extends Error {
  constructor(from: string, to: string, allowed: string[]) {
    super(`Status not allowed (from ${from} to ${to}). Allowed values: [${allowed}].`);
  }
}
