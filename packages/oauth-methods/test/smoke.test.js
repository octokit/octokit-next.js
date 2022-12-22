import test from "ava";

import {
  getWebFlowAuthorizationUrl,
  exchangeWebFlowCode,
  createDeviceCode,
  exchangeDeviceCode,
  checkToken,
  refreshToken,
  scopeToken,
  resetToken,
  deleteToken,
  deleteAuthorization,
  VERSION,
} from "../index.js";

test("exports getWebFlowAuthorizationUrl", (t) => {
  t.true(getWebFlowAuthorizationUrl instanceof Function);
});
test("exports exchangeWebFlowCode", (t) => {
  t.true(exchangeWebFlowCode instanceof Function);
});
test("exports createDeviceCode", (t) => {
  t.true(createDeviceCode instanceof Function);
});
test("exports exchangeDeviceCode", (t) => {
  t.true(exchangeDeviceCode instanceof Function);
});
test("exports checkToken", (t) => {
  t.true(checkToken instanceof Function);
});
test("exports refreshToken", (t) => {
  t.true(refreshToken instanceof Function);
});
test("exports scopeToken", (t) => {
  t.true(scopeToken instanceof Function);
});
test("exports resetToken", (t) => {
  t.true(resetToken instanceof Function);
});
test("exports deleteToken", (t) => {
  t.true(deleteToken instanceof Function);
});
test("exports deleteAuthorization", (t) => {
  t.true(deleteAuthorization instanceof Function);
});

test("exports VERSION", (t) => {
  t.is(VERSION, "0.0.0-development");
});
