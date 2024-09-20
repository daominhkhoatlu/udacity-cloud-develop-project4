import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

// get URL in JSON  Web Key Set
const jwksUrl = 'https://dev-omvykpxcaudwmqf4.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const certificate = '-----BEGIN CERTIFICATE----- MIIDHTCCAgWgAwIBAgIJMAo4BdAuA5lQMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV BAMTIWRldi1vbXZ5a3B4Y2F1ZHdtcWY0LnVzLmF1dGgwLmNvbTAeFw0yNDA5MTkx MzE0NDFaFw0zODA1MjkxMzE0NDFaMCwxKjAoBgNVBAMTIWRldi1vbXZ5a3B4Y2F1 ZHdtcWY0LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC ggEBAJRgBNhxzmgFz5eubgQeTEhixcux5VkCIOoBXFDqMF9oKOrigmB+fF2RQCbs cp/aMvK85m2y76DIzoJxJWr2e13CGfBFGQN4cktgPB7cxJnqQEHhIP5L1nhmGT5Z 9Bd52NI5PRUYEw8IXTvMQt/iWlnGN8ooS2wUJ2XJtzfogHI4AcmlYLYbsofL9o9I AxWQRtMntZNKOJaim9XTR0AuYkt0FJd4lrMJ434PAQQBJffO/JBDMeaaZySQhR3k 0hgCmPAhus5ZTMJGOqxn6fuhv6DWD868SyW0OEM+vGn0khZqtBYaIVKqIP5i8pKh n0mF+TrpkApHWP73XaEtNV4NBq8CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd BgNVHQ4EFgQUNUs8ltbEF6Bv3Tm+IF65SLLs18IwDgYDVR0PAQH/BAQDAgKEMA0G CSqGSIb3DQEBCwUAA4IBAQAhR/TyM2ghC1DathFQpJ0b3CuuwKRS19k8Z/Vb0y0D kv2K8QJTxkVsZ1A1Xw7LAu5kYnhyoXkTblSvw948fxHG0hRKguvcbKbPG/OlezYH 5iikNtQaYRJ+5liOHPxvguNCdDYWuT/hryImohrwpWqZIeu1AVWf2nsRd+RgOJ/0 eFMl9tE4qcjqrG/AmBcdGRTYuoSzuDayEsKWbvYf3BXMqsMbcFEMODmmEzkXfqRi lOZAP8mDJ9IgmTdZWBZykKt0+KITh5JyHaaX4i432G3dOsffXP9p8JyH/u5bNu5K K4D6DwOpKkhRT2RaXO3L8teyvcbV7Rk25A3/jcBVfBtH -----END CERTIFICATE----------BEGIN CERTIFICATE----- MIIDHTCCAgWgAwIBAgIJMAo4BdAuA5lQMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV BAMTIWRldi1vbXZ5a3B4Y2F1ZHdtcWY0LnVzLmF1dGgwLmNvbTAeFw0yNDA5MTkx MzE0NDFaFw0zODA1MjkxMzE0NDFaMCwxKjAoBgNVBAMTIWRldi1vbXZ5a3B4Y2F1 ZHdtcWY0LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC ggEBAJRgBNhxzmgFz5eubgQeTEhixcux5VkCIOoBXFDqMF9oKOrigmB+fF2RQCbs cp/aMvK85m2y76DIzoJxJWr2e13CGfBFGQN4cktgPB7cxJnqQEHhIP5L1nhmGT5Z 9Bd52NI5PRUYEw8IXTvMQt/iWlnGN8ooS2wUJ2XJtzfogHI4AcmlYLYbsofL9o9I AxWQRtMntZNKOJaim9XTR0AuYkt0FJd4lrMJ434PAQQBJffO/JBDMeaaZySQhR3k 0hgCmPAhus5ZTMJGOqxn6fuhv6DWD868SyW0OEM+vGn0khZqtBYaIVKqIP5i8pKh n0mF+TrpkApHWP73XaEtNV4NBq8CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd BgNVHQ4EFgQUNUs8ltbEF6Bv3Tm+IF65SLLs18IwDgYDVR0PAQH/BAQDAgKEMA0G CSqGSIb3DQEBCwUAA4IBAQAhR/TyM2ghC1DathFQpJ0b3CuuwKRS19k8Z/Vb0y0D kv2K8QJTxkVsZ1A1Xw7LAu5kYnhyoXkTblSvw948fxHG0hRKguvcbKbPG/OlezYH 5iikNtQaYRJ+5liOHPxvguNCdDYWuT/hryImohrwpWqZIeu1AVWf2nsRd+RgOJ/0 eFMl9tE4qcjqrG/AmBcdGRTYuoSzuDayEsKWbvYf3BXMqsMbcFEMODmmEzkXfqRi lOZAP8mDJ9IgmTdZWBZykKt0+KITh5JyHaaX4i432G3dOsffXP9p8JyH/u5bNu5K K4D6DwOpKkhRT2RaXO3L8teyvcbV7Rk25A3/jcBVfBtH -----END CERTIFICATE-----';
  jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
  return undefined;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
