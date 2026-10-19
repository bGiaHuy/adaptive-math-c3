import {describe,it,expect} from 'vitest';
import {webOrigins,trustedRequestOrigin} from '../src/config/web-origins';
describe('Review origin isolation',()=>{
 it('accepts only explicitly listed production sites',()=>{
  const allowed=webOrigins({NODE_ENV:'production',WEB_URL:'https://math.example.com',WEB_ALLOWED_ORIGINS:'https://my-math.vercel.app'});
  expect(trustedRequestOrigin('https://my-math.vercel.app',undefined,allowed)).toBe(true);
  expect(trustedRequestOrigin('https://someone-else.vercel.app','https://math.example.com/',allowed)).toBe(false);
  expect(trustedRequestOrigin(undefined,'https://math.example.com/lesson',allowed)).toBe(true);
  expect(()=>webOrigins({NODE_ENV:'production',WEB_URL:'http://math.example.com'})).toThrow();
 });
});
