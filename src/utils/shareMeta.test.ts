import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveCategoryFromHints,
  buildInvitationMeta,
  injectMetaIntoHtml,
  parseFirestoreDocumentFields,
} from './shareMeta';

test('resolveCategoryFromHints prioritizes explicit queryType and detects Khmer/English keywords', () => {
  assert.equal(
    resolveCategoryFromHints({ queryType: 'engagement', eventId: 'cmgrawhnk0003le0434762j7n' }),
    'engagement'
  );
  assert.equal(
    resolveCategoryFromHints({ eventId: 'housewarming-001' }),
    'housewarming'
  );
  assert.equal(
    resolveCategoryFromHints({ eventName: 'ពិធីខួបអាពាហ៍ពិពាហ៍ សុខា & ម៉ាលី' }),
    'anniversary'
  );
  assert.equal(
    resolveCategoryFromHints({ eventName: 'ពិធីខួបកំណើត កែវ ពិសិដ្ធ' }),
    'birthday'
  );
});

test('buildInvitationMeta builds category-specific metadata and absolute og:image URLs', () => {
  const origin = 'https://invitationonline-six.vercel.app';

  const engagementMeta = buildInvitationMeta({
    queryType: 'engagement',
    guestName: 'លោក សុខ វិសាល',
    origin,
    pageUrl: `${origin}/?id=engagement-001&type=engagement`,
  });

  assert.equal(engagementMeta.category, 'engagement');
  assert.ok(engagementMeta.title.includes('ពិធីភ្ជាប់ពាក្យ'));
  assert.ok(engagementMeta.title.includes('លោក សុខ វិសាល'));
  assert.ok(engagementMeta.description.includes('ពិធីភ្ជាប់ពាក្យ'));
  assert.equal(engagementMeta.image, `${origin}/assets/aistudio/image_6e49a03a.png`);

  const houseMeta = buildInvitationMeta({
    eventId: 'housewarming-001',
    origin,
  });
  assert.equal(houseMeta.category, 'housewarming');
  assert.ok(houseMeta.title.includes('ពិធីឡើងគេហដ្ឋានថ្មី'));
  assert.equal(houseMeta.image, `${origin}/assets/images/khmer_housewarming_villa_emblem_1794537020715.jpg`);
});

test('buildInvitationMeta uses custom Firestore event data when provided', () => {
  const origin = 'https://invitationonline-six.vercel.app';
  const customEvent = {
    id: 'event_QFZHXRKzhgPYeHjpYhuI2blRUBo2',
    eventType: 'housewarming',
    groom: 'លោក តារា',
    date: 'ថ្ងៃអាទិត្យ ទី២០ ខែធ្នូ ឆ្នាំ២០២៦',
    location: 'បុរី ប៉េងហួត បឹងស្នោ',
    cover_image: 'https://example.com/custom-house.jpg',
  };

  const meta = buildInvitationMeta({
    event: customEvent,
    guestName: 'ក្រុមគ្រួសារ និងបងប្អូនសាច់ញាតិ',
    origin,
  });

  assert.equal(meta.category, 'housewarming');
  assert.equal(meta.title, 'ពិធីឡើងគេហដ្ឋានថ្មី លោក តារា - សូមគោរពអញ្ជើញ ក្រុមគ្រួសារ និងបងប្អូនសាច់ញាតិ');
  assert.ok(meta.description.includes('បុរី ប៉េងហួត បឹងស្នោ'));
  assert.equal(meta.image, 'https://example.com/custom-house.jpg');
});

test('injectMetaIntoHtml replaces existing title and meta tags safely with HTML escaping', () => {
  const sampleHtml = `<!doctype html>
<html>
  <head>
    <title>Old Title</title>
    <meta name="description" content="Old Desc" />
    <meta property="og:title" content="Old OG" />
    <meta property="og:description" content="Old OG Desc" />
    <meta property="og:image" content="https://old.example/img.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body></body>
</html>`;

  const updated = injectMetaIntoHtml(sampleHtml, {
    title: 'ពិធីភ្ជាប់ពាក្យ គង់ វិសាល & ជា ស្រីពៅ',
    description: 'សូមគោរពអញ្ជើញ "ភ្ញៀវកិត្តិយស" & មិត្តភក្តិ',
    image: 'https://example.com/assets/aistudio/image_6e49a03a.png',
    url: 'https://example.com/?type=engagement',
    category: 'engagement',
  });

  assert.ok(updated.includes('<title>ពិធីភ្ជាប់ពាក្យ គង់ វិសាល & ជា ស្រីពៅ</title>'));
  assert.ok(updated.includes('<meta property="og:title" content="ពិធីភ្ជាប់ពាក្យ គង់ វិសាល &amp; ជា ស្រីពៅ" />'));
  assert.ok(updated.includes('<meta name="description" content="សូមគោរពអញ្ជើញ &quot;ភ្ញៀវកិត្តិយស&quot; &amp; មិត្តភក្តិ" />'));
  assert.ok(updated.includes('<meta property="og:image" content="https://example.com/assets/aistudio/image_6e49a03a.png" />'));
  assert.ok(updated.includes('<meta name="twitter:title" content="ពិធីភ្ជាប់ពាក្យ គង់ វិសាល &amp; ជា ស្រីពៅ" />'));
});

test('parseFirestoreDocumentFields decodes nested maps and arrays cleanly', () => {
  const decoded = parseFirestoreDocumentFields({
    id: { stringValue: 'event_123' },
    eventType: { stringValue: 'engagement' },
    singlePerson: { booleanValue: false },
    config: {
      mapValue: {
        fields: {
          invitation_kh: {
            mapValue: {
              fields: {
                location: { stringValue: 'Phnom Penh' },
              },
            },
          },
        },
      },
    },
  });

  assert.equal(decoded.id, 'event_123');
  assert.equal(decoded.eventType, 'engagement');
  assert.equal(decoded.singlePerson, false);
  assert.equal(decoded.config.invitation_kh.location, 'Phnom Penh');
});
