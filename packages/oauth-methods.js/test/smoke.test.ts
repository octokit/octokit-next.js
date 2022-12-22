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
} from "../src";

describe("Smoke test", () => {
  it("exports getWebFlowAuthorizationUrl", () => {
    expect(getWebFlowAuthorizationUrl).toBeInstanceOf(Function);
  });
  it("exports exchangeWebFlowCode", () => {
    expect(exchangeWebFlowCode).toBeInstanceOf(Function);
  });
  it("exports createDeviceCode", () => {
    expect(createDeviceCode).toBeInstanceOf(Function);
  });
  it("exports exchangeDeviceCode", () => {
    expect(exchangeDeviceCode).toBeInstanceOf(Function);
  });
  it("exports checkToken", () => {
    expect(checkToken).toBeInstanceOf(Function);
  });
  it("exports refreshToken", () => {
    expect(refreshToken).toBeInstanceOf(Function);
  });
  it("exports scopeToken", () => {
    expect(scopeToken).toBeInstanceOf(Function);
  });
  it("exports resetToken", () => {
    expect(resetToken).toBeInstanceOf(Function);
  });
  it("exports deleteToken", () => {
    expect(deleteToken).toBeInstanceOf(Function);
  });
  it("exports deleteAuthorization", () => {
    expect(deleteAuthorization).toBeInstanceOf(Function);
  });

  it("exports VERSION", () => {
    expect(VERSION).toEqual("0.0.0-development");
  });
});
