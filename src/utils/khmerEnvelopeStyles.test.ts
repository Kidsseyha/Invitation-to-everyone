import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveKhmerEnvelopeVariant,
  extractSingleKhmerInitial,
  extractKhmerMonogramInitials,
  formatKhmerCoverDateBadge,
  sanitizeCoverBackgroundUrl,
} from './khmerEnvelopeStyles.ts';

test('resolveKhmerEnvelopeVariant selects all 6 Khmer styles accurately', () => {
  const trad = resolveKhmerEnvelopeVariant({
    eventType: 'wedding',
    id: 'cmgrawhnk0003le0434762j7n',
    name: 'អាពាហ៍ពិពាហ៍ ម៉ាឡេ & វល្ខ័ក',
  });
  assert.equal(trad.styleId, 'traditional-wedding');
  assert.equal(trad.champagneGold, '#D9A441');
  assert.equal(trad.ivoryPaper, '#FFF8E9');

  const modern = resolveKhmerEnvelopeVariant({
    eventType: 'wedding',
    id: 'modern-wedding-mw001',
    name: 'អាពាហ៍ពិពាហ៍បែបសម័យ ដារ៉ា & បុប្ផា',
  });
  assert.equal(modern.styleId, 'modern-wedding');

  const anniversary = resolveKhmerEnvelopeVariant({
    eventType: 'anniversary',
    id: 'anniv-01',
    name: 'ខួបអាពាហ៍ពិពាហ៍',
  });
  assert.equal(anniversary.styleId, 'anniversary');
  assert.equal(anniversary.accentColor, '#8B2435');

  const engagement = resolveKhmerEnvelopeVariant({
    eventType: 'engagement',
    id: 'eng-01',
    name: 'ពិធីភ្ជាប់ពាក្យ',
  });
  assert.equal(engagement.styleId, 'engagement');

  const housewarming = resolveKhmerEnvelopeVariant({
    eventType: 'housewarming',
    id: 'house-01',
    name: 'ពិធីឡើងគេហដ្ឋានថ្មី',
  });
  assert.equal(housewarming.styleId, 'housewarming');
  assert.equal(housewarming.accentColor, '#115E46');

  const birthday = resolveKhmerEnvelopeVariant({
    eventType: 'birthday',
    id: 'bday-01',
    name: 'រីករាយពិធីខួបកំណើត',
  });
  assert.equal(birthday.styleId, 'birthday');
});

test('extractSingleKhmerInitial handles honorifics and Khmer given names', () => {
  assert.equal(extractSingleKhmerInitial('រ៉ូ ម៉ាឡេ'), 'ម');
  assert.equal(extractSingleKhmerInitial('អួម វល្ខ័ក'), 'វ');
  assert.equal(extractSingleKhmerInitial('លោក ជា ដារ៉ា'), 'ដ');
  assert.equal(extractSingleKhmerInitial('កញ្ញា សុខ បុប្ផា'), 'ប');
  assert.equal(extractSingleKhmerInitial('Chea Dara'), 'D');
  assert.equal(extractSingleKhmerInitial('', 'ធ'), 'ធ');
});

test('extractKhmerMonogramInitials pairs groom and bride cleanly', () => {
  const pair = extractKhmerMonogramInitials('រ៉ូ ម៉ាឡេ', 'អួម វល្ខ័ក');
  assert.deepEqual(pair, { groomInitial: 'ម', brideInitial: 'វ' });
});

test('formatKhmerCoverDateBadge formats ISO date with Khmer numerals & weekdays', () => {
  const badge = formatKhmerCoverDateBadge('2026-09-25', '05:00 PM');
  assert.equal(badge.monthKh, 'កញ្ញា');
  assert.equal(badge.monthEn, 'SEPTEMBER');
  assert.equal(badge.dayKh, '២៥');
  assert.equal(badge.dayEn, '25');
  assert.equal(badge.weekdayKh, 'ថ្ងៃសុក្រ');
  assert.equal(badge.weekdayEn, 'FRIDAY');
  assert.equal(badge.timeDisplay, '05:00 PM');
});

test('sanitizeCoverBackgroundUrl replaces brittle CDN URLs with safe local artwork', () => {
  assert.equal(
    sanitizeCoverBackgroundUrl('https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg'),
    '/assets/template15/opening-background.webp'
  );
  assert.equal(
    sanitizeCoverBackgroundUrl('https://images.unsplash.com/photo-1510076857177-7470076d4098'),
    '/assets/template15/opening-background.webp'
  );
  assert.equal(
    sanitizeCoverBackgroundUrl('/assets/images/khmer_royal_gold_wedding_cover_1790393678341.jpg'),
    '/assets/images/khmer_royal_gold_wedding_cover_1790393678341.jpg'
  );
});
