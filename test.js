import { $log } from 'ts-log-debug';
import { ServerResponse } from 'http';
import { serialize } from 'cookie';
import { get } from 'config';

const cookieAccessToken: string = get('cookie.accessToken');
const cookieRefreshToken: string = get('cookie.refreshToken');
const secureCookies: boolean = get('cookie.secure') === '1';

/**
 * Set auth cookies
 * @param res
 * @param accessToken
 * @param accessTokenExp
 * @param refreshToken
 * @param refreshTokenExp
 */
const setAuthCookies = (
  res: ServerResponse,
  accessToken: string,
  accessTokenExp: Date,
  refreshToken: string,
  refreshTokenExp: Date,
) => {
  const cookies = [
    serialize(cookieAccessToken, accessToken, {
      expires: accessTokenExp,
      secure: secureCookies,
      path: '/',
    }),
  ];

  if (refreshToken) {
    cookies.push(
      serialize(cookieRefreshToken, refreshToken, {
        expires: refreshTokenExp,
        secure: secureCookies,
        path: '/',
      }),
    );
  }

  res.setHeader('Set-Cookie', cookies);
};

/**
 * Send JSON response
 * @param res
 * @param body
 * @param statusCode
 */
const sendJSONResponse = async (res: ServerResponse, body: any, statusCode = 200) => {
  res.statusCode = statusCode;
  await new Promise((resolve, reject) => {
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(body), err => {
      if (err) {
        $log.warn('Unable to write response', err);

        return reject(err);
      }

      res.end(() => {
        resolve();
      });
    });
  });
};

/**
 * Send error response
 * @param res
 * @param statusCode
 * @param description
 */
const sendError = async (res: ServerResponse, statusCode: number, description: string) => {
  $log.warn('Sending error response:', statusCode, description);
  res.statusCode = statusCode;

  await new Promise((resolve, reject) => {
    res.write(description, err => {
      if (err) {
        $log.warn('Unable to write response', err);

        return reject(err);
      }

      res.end(() => {
        resolve();
      });
    });
  });
};

export { sendError, sendJSONResponse, setAuthCookies };