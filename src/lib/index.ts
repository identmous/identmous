// import type { AccessPath } from "lizod";

export type AccessPath = Array<string | number>;

export type ValidatorContext = {
  errors: Array<AccessPath>;
};
