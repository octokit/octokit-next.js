import test from "ava";

import { request } from "@octokit-next/request";
import fetchMock from "fetch-mock";

import { createTokenAuth } from "../index.js";

test("README example", async (t) => {
  const auth = createTokenAuth({
    token: "ghp_PersonalAccessToken01245678900000000",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token: "ghp_PersonalAccessToken01245678900000000",
    tokenType: "oauth",
  });
});

test("installation token (old format)", async (t) => {
  const auth = createTokenAuth({
    token: "v1.1234567890abcdef1234567890abcdef12345678",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token: "v1.1234567890abcdef1234567890abcdef12345678",
    tokenType: "installation",
  });
});

test("installation token (new format)", async (t) => {
  const auth = createTokenAuth({
    token: "ghs_InstallallationOrActionToken00000000",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token: "ghs_InstallallationOrActionToken00000000",
    tokenType: "installation",
  });
});

test("JSON Web Token (GitHub App Authentication)", async (t) => {
  const auth = createTokenAuth({
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
    tokenType: "app",
  });
});

test("User-to-server token (User authentication through app installation)", async (t) => {
  const auth = createTokenAuth({
    token: "ghu_InstallationUserToServer000000000000",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token: "ghu_InstallationUserToServer000000000000",
    tokenType: "user-to-server",
  });
});

test("invalid token", async (t) => {
  const auth = createTokenAuth({ token: "whatislove" });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token: "whatislove",
    tokenType: "oauth",
  });
});

test("no token", async (t) => {
  try {
    createTokenAuth();
    throw new Error("Should not resolve");
  } catch (error) {
    t.regex(error.message, /options.token not set for createTokenAuth/i);
  }
});

test("token is not a string", async (t) => {
  try {
    createTokenAuth({ token: 123 });
    throw new Error("Should not resolve");
  } catch (error) {
    t.regex(
      error.message,
      /options.token is not a string for createTokenAuth/i
    );
  }
});

test("OAuth token with prefix", async (t) => {
  const auth = createTokenAuth({
    token:
      "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
    tokenType: "app",
  });
});

test("JWT with prefix", async (t) => {
  const auth = createTokenAuth({
    token: "token ghp_PersonalAccessToken01245678900000000",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token: "ghp_PersonalAccessToken01245678900000000",
    tokenType: "oauth",
  });
});

test("JWT with capitalized prefix", async (t) => {
  const auth = createTokenAuth({
    token:
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
  });
  const authentication = await auth();

  t.deepEqual(authentication, {
    type: "token",
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
    tokenType: "app",
  });
});

test('auth.hook(request, "GET /user")', async (t) => {
  const expectedRequestHeaders = {
    accept: "application/vnd.github.v3+json",
    authorization: "token ghp_PersonalAccessToken01245678900000000",
    "user-agent": "test",
  };

  const matchGetUser = (url, { body, headers }) => {
    t.is(url, "https://api.github.com/user");
    t.deepEqual(headers, expectedRequestHeaders);
    return true;
  };

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock.sandbox().getOnce(matchGetUser, { id: 123 }),
    },
  });

  const { hook } = createTokenAuth({
    token: "ghp_PersonalAccessToken01245678900000000",
  });
  const { data } = await hook(requestMock, "GET /user");

  t.deepEqual(data, { id: 123 });
});

test("auth.hook() with JWT", async (t) => {
  const expectedRequestHeaders = {
    accept: "application/vnd.github.v3+json",
    authorization:
      "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
    "user-agent": "test",
  };

  const matchGetUser = (url, { body, headers }) => {
    t.is(url, "https://api.github.com/user");
    t.deepEqual(headers, expectedRequestHeaders);
    return true;
  };

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock.sandbox().getOnce(matchGetUser, { id: 123 }),
    },
  });

  const { hook } = createTokenAuth({
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q",
  });
  const { data } = await hook(requestMock, "GET /user");

  t.deepEqual(data, { id: 123 });
});
