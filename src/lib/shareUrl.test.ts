import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPublicShareUrl, VERCEL_APP_URL, PUBLIC_APP_URL } from './shareUrl';

test('getPublicShareUrl defaults to lang=kh and includes share=1', () => {
  const urlStr = getPublicShareUrl('សុខ វិបុល', 'event_123', 'housewarming');
  const url = new URL(urlStr);
  assert.equal(url.searchParams.get('id'), 'event_123');
  assert.equal(url.searchParams.get('type'), 'housewarming');
  assert.equal(url.searchParams.get('lang'), 'kh');
  assert.equal(url.searchParams.get('share'), '1');
  assert.equal(url.searchParams.get('name'), 'សុខ វិបុល');
});

test('getPublicShareUrl supports customOrigin for Vercel deployment', () => {
  const urlStr = getPublicShareUrl('ក្រុមគ្រួសារ និងបងប្អូនសាច់ញាតិ', 'event_QFZHXRKzhgPYeHjpYhuI2blRUBo2', 'housewarming', {
    customOrigin: VERCEL_APP_URL,
    lang: 'kh',
  });
  const url = new URL(urlStr);
  assert.equal(url.origin, 'https://invitationonline-six.vercel.app');
  assert.equal(url.searchParams.get('id'), 'event_QFZHXRKzhgPYeHjpYhuI2blRUBo2');
  assert.equal(url.searchParams.get('lang'), 'kh');
  assert.equal(url.searchParams.get('name'), 'ក្រុមគ្រួសារ និងបងប្អូនសាច់ញាតិ');
});

test('getPublicShareUrl supports English lang override when requested', () => {
  const urlStr = getPublicShareUrl('John Doe', 'event_456', 'birthday', {
    lang: 'en',
  });
  const url = new URL(urlStr);
  assert.equal(url.searchParams.get('lang'), 'en');
});
