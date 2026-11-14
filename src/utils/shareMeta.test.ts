import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveCategoryFromHints,
  buildInvitationMeta,
  injectMetaIntoHtml,
  parseFirestoreDocumentFields,
  buildAllShareTemplates,
  resolveSelectedShareTemplateId,
} from './shareMeta';
import { EVENT_PRESETS } from '../data/eventTemplates';

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

test('non-wedding categories ignore leaked wedding cover URLs and inject empty og:image / twitter:image tags', () => {
  const origin = 'https://invitationonline-six.vercel.app';
  const meta = buildInvitationMeta({
    event: {
      id: 'housewarming-hm001',
      eventType: 'housewarming',
      groom: 'លោក សំ ភារម្យ',
      image: '/assets/images/white_arch_columns_wedding_cover_1790394461049.jpg',
    },
    origin,
  });

  assert.equal(meta.category, 'housewarming');
  assert.equal(meta.image, `${origin}/assets/images/khmer_housewarming_villa_emblem_1794537020715.jpg`);

  const html = `<!doctype html><html><head><title>Digital</title><meta property="og:image" content="" /><meta name="twitter:image" content="" /></head><body></body></html>`;
  const injected = injectMetaIntoHtml(html, meta);
  assert.ok(injected.includes(`<meta property="og:image" content="${origin}/assets/images/khmer_housewarming_villa_emblem_1794537020715.jpg" />`));
  assert.ok(injected.includes(`<meta name="twitter:image" content="${origin}/assets/images/khmer_housewarming_villa_emblem_1794537020715.jpg" />`));
});

test('buildAllShareTemplates preserves all All Templates presets, custom templates, and distinct wedding presets', () => {
  const savedWedding = {
    id: 'cmgrawhnk0003le0434762j7n',
    templateId: 'preset-wedding',
    eventType: 'wedding',
    name: 'អាពាហ៍ពិពាហ៍ កែវ & ម៉ាលី',
    groom: 'កែវ',
    bride: 'ម៉ាលី',
  };
  const customEvt = {
    id: 'custom-event-999',
    templateId: 'custom-event-999',
    eventType: 'birthday',
    name: 'ខួបកំណើត សុជាតិ ៣០ឆ្នាំ',
    groom: 'សុជាតិ',
    bride: '',
    date: '2026-11-30',
    location: 'ភ្នំពេញ',
    singlePerson: true,
    cover_image: 'https://example.com/bday-custom.jpg',
  };

  const options = buildAllShareTemplates({
    presets: EVENT_PRESETS,
    deletedPresetIds: ['preset-engagement'],
    savedEventsById: {
      'cmgrawhnk0003le0434762j7n': savedWedding,
    },
    savedEventsByType: {
      wedding: savedWedding,
    },
    customTemplates: [customEvt],
  });

  assert.equal(options.some((o) => o.templateId === 'preset-engagement'), false);
  const tradWedding = options.find((o) => o.templateId === 'preset-wedding');
  const modWedding = options.find((o) => o.templateId === 'preset-modern-wedding');
  const anniv = options.find((o) => o.templateId === 'preset-anniversary');
  const custom = options.find((o) => o.templateId === 'custom-event-999');

  assert.ok(tradWedding && modWedding && anniv && custom);
  assert.equal(tradWedding.event.name, 'អាពាហ៍ពិពាហ៍ កែវ & ម៉ាលី');
  // Modern wedding must keep its own data instead of being overwritten by savedEventsByType['wedding']
  assert.equal(modWedding.event.name, 'អាពាហ៍ពិពាហ៍បែបសម័យ ដារ៉ា​ & បុប្ផា');
  assert.equal(anniv.category, 'anniversary');
  assert.equal(custom.isCustom, true);
  assert.equal(custom.coverImage, 'https://example.com/bday-custom.jpg');
});

test('resolveSelectedShareTemplateId picks matching preset or custom template from All Templates', () => {
  const customEvt = {
    id: 'custom-event-777',
    eventType: 'housewarming',
    name: 'ឡើងផ្ទះថ្មី វីរៈ',
    groom: 'វីរៈ',
  };
  const options = buildAllShareTemplates({
    presets: EVENT_PRESETS,
    customTemplates: [customEvt],
    currentEvent: {
      id: 'event_auth_user_1',
      templateId: 'preset-modern-wedding',
      eventType: 'wedding',
      name: 'អាពាហ៍ពិពាហ៍បែបសម័យ ដារ៉ា​ & បុប្ផា',
    },
  });

  assert.equal(
    resolveSelectedShareTemplateId({
      options,
      currentEvent: { id: 'event_auth_user_1', templateId: 'preset-modern-wedding' },
    }),
    'preset-modern-wedding'
  );

  assert.equal(
    resolveSelectedShareTemplateId({
      options,
      currentEvent: customEvt,
    }),
    'custom-event-777'
  );

  assert.equal(
    resolveSelectedShareTemplateId({
      options,
      queryType: 'anniversary',
    }),
    'preset-anniversary'
  );
});

test('buildInvitationMeta resolves specific preset by eventId when category has multiple presets', () => {
  const origin = 'https://invitationonline-six.vercel.app';
  const meta = buildInvitationMeta({
    eventId: 'modern-wedding-mw001',
    queryType: 'wedding',
    origin,
  });
  assert.equal(meta.category, 'wedding');
  assert.ok(meta.title.includes('ដារ៉ា'));
  assert.ok(meta.description.includes('Sofitel') || meta.description.includes('សូហ្វីតែល'));
});
