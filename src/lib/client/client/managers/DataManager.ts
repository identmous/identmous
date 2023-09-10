import type Rest from "../Rest";

export default class DataManager {
  rest: Rest;

  constructor(rest: Rest) {
    this.rest = rest;
  }
}
