// @ts-check

/**
 * Prefix token for usage in the Authorization header
 *
 * @param {string} token OAuth token or JSON Web Token
 */
export function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}
