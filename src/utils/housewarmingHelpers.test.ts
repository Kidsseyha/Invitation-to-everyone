import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatHousewarmingSchedule,
  formatKhmerTimeLabel,
  buildHousewarmingHostsDisplay,
  buildGoogleMapsSearchUrl,
  containsKhmerScript,
  formatHousewarmingLocation,
} from './housewarmingHelpers';

test('formatHousewarmingSchedule formats ISO date into Khmer and English', () => {
  const res = formatHousewarmingSchedule('2026-11-08', '05:30 PM');
  assert.ok(res.dateLabelKh.includes('២០២៦'));
  assert.ok(res.dateLabelKh.includes('វិច្ឆិកា'));
  assert.equal(res.dateLabelEn, 'Sunday, November 08, 2026');
  assert.equal(res.timeLabelEn, '05:30 PM');
  assert.equal(res.timeLabelKh, 'ម៉ោង ០៥:៣០ ល្ងាច');
});

test('formatKhmerTimeLabel handles AM and PM periods', () => {
  assert.equal(formatKhmerTimeLabel('08:00 AM'), 'ម៉ោង ០៨:០០ ព្រឹក');
  assert.equal(formatKhmerTimeLabel('02:15 PM'), 'ម៉ោង ០២:១៥ រសៀល');
});

test('buildHousewarmingHostsDisplay handles single and couple hosts', () => {
  assert.equal(
    buildHousewarmingHostsDisplay('លោក សំ ភារម្យ', 'អ្នកស្រី កែវ ស្រីមុំ', false),
    'លោក សំ ភារម្យ & អ្នកស្រី កែវ ស្រីមុំ'
  );
  assert.equal(
    buildHousewarmingHostsDisplay('លោក សំ ភារម្យ', 'អ្នកស្រី កែវ ស្រីមុំ', true),
    'លោក សំ ភារម្យ'
  );
});

test('buildGoogleMapsSearchUrl encodes location query safely', () => {
  const url = buildGoogleMapsSearchUrl('Borey Chip Mong 60M');
  assert.equal(
    url,
    'https://www.google.com/maps/search/?api=1&query=Borey%20Chip%20Mong%2060M'
  );
});

test('containsKhmerScript detects Khmer Unicode characters cleanly', () => {
  assert.equal(containsKhmerScript('ភ្ញៀវកិត្តិយស'), true);
  assert.equal(containsKhmerScript('Honored Guest'), false);
});

test('formatHousewarmingLocation translates default Khmer/English location', () => {
  assert.equal(
    formatHousewarmingLocation('គេហដ្ឋានថ្មី (បុរី ជីបម៉ុង លែន ផ្លូវ៦០ម៉ែត្រ)', 'en'),
    'New Residence (Borey Chip Mong Land 60M Street)'
  );
  assert.equal(
    formatHousewarmingLocation('Custom Villa 12A', 'en'),
    'Custom Villa 12A'
  );
});

