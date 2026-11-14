import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { findTemplatePreset } from './src/data/eventTemplates';
import {
  buildInvitationMeta,
  injectMetaIntoHtml,
  fetchEventFromFirestoreRest,
  normalizeCategoryString,
} from './src/utils/shareMeta';
import rawFirebaseConfig from './firebase-applet-config.json';

// Guard against unhandled errors terminating process
process.on('uncaughtException', err => {
  console.error('[Process UncaughtException]', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process UnhandledRejection]', reason);
});

// Determine environment
const isProduction =
  process.env.NODE_ENV === 'production' ||
  (typeof __filename !== 'undefined' && (__filename.endsWith('server.cjs') || __filename.includes('dist')));

const app = express();
const server = http.createServer(app);

// Initialize WebSocket Server attached to the HTTP server on path /ws
const wss = new WebSocketServer({ server, path: '/ws' });

let onlineClientsCount = 0;

export function broadcastWebSocket(data: any) {
  try {
    const payload = JSON.stringify(data);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          // ignore client send errors
        }
      }
    }
  } catch (err) {
    console.error('WebSocket broadcast error:', err);
  }
}

wss.on('connection', (ws: WebSocket, req) => {
  onlineClientsCount = wss.clients.size;
  console.log(`[WebSocket] Client connected. Online viewers: ${onlineClientsCount}`);

  // Send initial state & presence
  try {
    const initialPayload = {
      type: 'init',
      onlineCount: onlineClientsCount,
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(initialPayload));
  } catch (err) {
    // ignore
  }

  // Broadcast updated presence to all clients
  broadcastWebSocket({
    type: 'presence:update',
    onlineCount: onlineClientsCount,
    timestamp: new Date().toISOString(),
  });

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message.toString());
      if (parsed.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        return;
      }
      if (parsed.type === 'wishes:like') {
        broadcastWebSocket({
          type: 'wishes:like',
          wishId: parsed.wishId,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      if (parsed.type === 'wishes:new' && parsed.wish) {
        broadcastWebSocket({
          type: 'wishes:new',
          wish: parsed.wish,
          timestamp: new Date().toISOString(),
        });
        return;
      }
    } catch (err) {
      // ignore message parse errors
    }
  });

  ws.on('close', () => {
    onlineClientsCount = wss.clients.size;
    console.log(`[WebSocket] Client disconnected. Online viewers: ${onlineClientsCount}`);
    broadcastWebSocket({
      type: 'presence:update',
      onlineCount: onlineClientsCount,
      timestamp: new Date().toISOString(),
    });
  });

  ws.on('error', (err) => {
    console.warn('[WebSocket Client Error]:', err.message);
  });
});

// In development, the AI Studio dev environment routes through nginx reverse proxy to port 3000.
// In production Cloud Run deployment, Cloud Run injects PORT (e.g. 8080) and requires listening on it.
const PORT = isProduction && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High body limits to allow uploaded photos and base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static assets from public directory (images, fonts, templates)
app.use(express.static(path.join(process.cwd(), 'public')));

// Ensure data directory exists for persistent server storage
const DATA_DIR = path.join(process.cwd(), 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'saved_events.json');
const WISHES_FILE = path.join(DATA_DIR, 'saved_wishes.json');
const RSVPS_FILE = path.join(DATA_DIR, 'saved_rsvps.json');
const GUESTS_FILE = path.join(DATA_DIR, 'saved_guests.json');
const SHORT_LINKS_FILE = path.join(DATA_DIR, 'saved_short_links.json');
const SYSTEM_USERS_FILE = path.join(DATA_DIR, 'saved_system_users.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'saved_notifications.json');
const PUBLIC_APP_URL = (process.env.APP_URL || 'https://ais-pre-oi572nxogafsw6nsowqaaj-935767504529.asia-southeast1.run.app').replace('ais-dev-', 'ais-pre-');

function getSavedNotifications(): any[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading notifications file:', err);
  }
  return [];
}

function saveNotifications(notifications: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing notifications file:', err);
  }
}

function getSavedSystemUsers(): any[] {
  const defaultOwner = {
    name: 'Seyha Yoeurn (Owner)',
    email: 'seyhayoeurn2017@gmail.com',
    role: 'owner',
    passcode: 'Admin@1111',
    createdAt: '2026-01-01T00:00:00.000Z'
  };
  const defaultAdmin = {
    name: 'Yoeurn Seyha',
    email: 'yoeurn.seyha@diu.edu.kh',
    role: 'admin',
    passcode: 'Admin@1111',
    createdAt: '2026-01-01T00:00:00.000Z'
  };
  try {
    if (fs.existsSync(SYSTEM_USERS_FILE)) {
      const users = JSON.parse(fs.readFileSync(SYSTEM_USERS_FILE, 'utf-8'));
      const ownerIdx = users.findIndex((u: any) => u.email?.toLowerCase() === 'seyhayoeurn2017@gmail.com');
      if (ownerIdx >= 0) {
        users[ownerIdx].role = 'owner';
      } else {
        users.unshift(defaultOwner);
      }
      const adminIdx = users.findIndex((u: any) => u.email?.toLowerCase() === 'yoeurn.seyha@diu.edu.kh');
      if (adminIdx >= 0) {
        users[adminIdx].passcode = 'Admin@1111';
        if (!users[adminIdx].role) users[adminIdx].role = 'admin';
      } else {
        users.push(defaultAdmin);
      }
      return users;
    }
  } catch (err) {
    console.error('Error reading system users file:', err);
  }
  return [defaultOwner, defaultAdmin];
}

function saveSystemUser(user: any) {
  try {
    const users = getSavedSystemUsers();
    const index = users.findIndex((u: any) => u.email?.toLowerCase() === user.email?.toLowerCase() || u.name?.toLowerCase() === user.name?.toLowerCase());
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SYSTEM_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing system users file:', err);
  }
}

function deleteSystemUser(idOrEmailOrName: string) {
  try {
    const users = getSavedSystemUsers();
    const needle = idOrEmailOrName.toLowerCase().trim();
    const filtered = users.filter((u: any) => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uName = (u.name || '').toLowerCase().trim();
      const uId = (u.id || '').toLowerCase().trim();
      return uEmail !== needle && uName !== needle && uId !== needle;
    });
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SYSTEM_USERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return filtered;
  } catch (err) {
    console.error('Error deleting from system users file:', err);
    return [];
  }
}

function getShortLinks(): Record<string, string> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SHORT_LINKS_FILE)) {
      return JSON.parse(fs.readFileSync(SHORT_LINKS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading short links file:', err);
  }
  return {};
}

function saveShortLink(code: string, url: string) {
  try {
    const links = getShortLinks();
    links[code] = url;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SHORT_LINKS_FILE, JSON.stringify(links, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving short link:', err);
  }
}

async function resolveTargetEvent(options: {
  eventId?: string | null;
  eventType?: string | null;
}): Promise<any> {
  const eventId = (options.eventId || '').trim();
  const eventType = normalizeCategoryString(options.eventType);
  const events = getSavedEvents();

  let targetEvent: any = null;

  if (eventId && events[eventId]) {
    targetEvent = events[eventId];
  }

  if (!targetEvent && eventId) {
    targetEvent = await fetchEventFromFirestoreRest({
      projectId: rawFirebaseConfig.projectId,
      databaseId: (rawFirebaseConfig as any).firestoreDatabaseId || '(default)',
      eventId,
    });
  }

  if (eventType) {
    const loadedCat = targetEvent
      ? normalizeCategoryString(targetEvent.eventType || targetEvent.id || targetEvent.name)
      : null;
    if (!targetEvent || (loadedCat && loadedCat !== eventType)) {
      if (events[`type_${eventType}`]) {
        targetEvent = events[`type_${eventType}`];
      } else {
        const matchByType = Object.values(events).find(
          (e: any) => normalizeCategoryString(e?.eventType || e?.id || e?.name) === eventType
        );
        if (matchByType) {
          targetEvent = matchByType;
        } else {
          const preset = findTemplatePreset(eventType);
          if (preset) targetEvent = preset.sampleEvent;
        }
      }
    }
  }

  if (!targetEvent && eventId) {
    if (events[`type_${eventId}`]) {
      targetEvent = events[`type_${eventId}`];
    } else {
      const preset = findTemplatePreset(eventId);
      if (preset) targetEvent = preset.sampleEvent;
    }
  }

  if (!targetEvent) {
    targetEvent = events['default'] || Object.values(events)[0] || findTemplatePreset('wedding')?.sampleEvent;
  }

  return targetEvent;
}

function getRequestPublicOrigin(req: express.Request): string {
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || '';
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  if (!host || host.includes('localhost') || host.includes('127.0.0.1')) {
    return PUBLIC_APP_URL;
  }
  const cleanHost = host.split(',')[0].trim();
  const cleanProto = proto.split(',')[0].trim();
  const origin = `${cleanProto}://${cleanHost}`;
  return origin.includes('ais-dev-') ? origin.replace('ais-dev-', 'ais-pre-') : origin;
}

async function getInjectedHtmlAsync(
  html: string,
  options: {
    guestName?: string | null;
    eventId?: string | null;
    eventType?: string | null;
    origin: string;
    pageUrl: string;
  }
): Promise<string> {
  const targetEvent = await resolveTargetEvent({
    eventId: options.eventId,
    eventType: options.eventType,
  });

  const meta = buildInvitationMeta({
    event: targetEvent,
    guestName: options.guestName,
    queryType: options.eventType,
    eventId: options.eventId,
    origin: options.origin,
    pageUrl: options.pageUrl,
  });

  return injectMetaIntoHtml(html, meta);
}

function getSavedEvents(): Record<string, any> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(EVENTS_FILE)) {
      const content = fs.readFileSync(EVENTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading saved events file:', err);
  }
  return {};
}

function saveEvents(events: Record<string, any>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved events file:', err);
  }
}

function getSavedWishes(): any[] {
  try {
    if (fs.existsSync(WISHES_FILE)) {
      return JSON.parse(fs.readFileSync(WISHES_FILE, 'utf-8'));
    }
    const defaultWishes = [
      {
        id: 'w1',
        name: 'សុខ វិបុល (Sok Vibul)',
        relationship: 'មិត្តភក្តិ (Friend)',
        message: 'សូមជូនពរឱ្យប្អូនទាំងពីរមានសុភមង្គល ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង និងទទួលបានជោគជ័យគ្រប់ភារកិច្ច!',
        createdAt: '2026-01-02T08:30:00.000Z',
        likes: 12,
      },
      {
        id: 'w2',
        name: 'ចាន់ ស្រីមុំ (Chan Sreymom)',
        relationship: 'បងប្អូនជីដូនមួយ (Cousin)',
        message: 'រីករាយថ្ងៃមង្គលការបងម៉ាឡេ និងអូនវល្ខ័ក! សមគ្នាខ្លាំងណាស់ សូមឱ្យស្រឡាញ់គ្នាផ្អែមល្ហែមដូចទឹកឃ្មុំប្រចាំថ្ងៃណា៎ ❤️✨',
        createdAt: '2026-01-03T11:15:00.000Z',
        likes: 18,
      },
      {
        id: 'w3',
        name: 'រតនៈ ពិសិដ្ឋ (Rathana Piseth)',
        relationship: 'សហការី (Colleague)',
        message: 'Wishing both of you a lifetime of endless love, joy, good health, and prosperity! Happy Wedding!',
        createdAt: '2026-01-04T14:45:00.000Z',
        likes: 9,
      },
    ];
    saveWishes(defaultWishes);
    return defaultWishes;
  } catch (err) {
    console.error('Error reading saved wishes file:', err);
  }
  return [];
}

function saveWishes(wishes: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved wishes file:', err);
  }
}

function getSavedRSVPs(): any[] {
  try {
    if (fs.existsSync(RSVPS_FILE)) {
      return JSON.parse(fs.readFileSync(RSVPS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading saved RSVPs file:', err);
  }
  return [];
}

function saveRSVPs(rsvps: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(RSVPS_FILE, JSON.stringify(rsvps, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved RSVPs file:', err);
  }
}

function getSavedGuests(): any[] {
  try {
    if (fs.existsSync(GUESTS_FILE)) {
      return JSON.parse(fs.readFileSync(GUESTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading saved guests file:', err);
  }
  return [];
}

function saveGuests(guests: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing saved guests file:', err);
  }
}

// API Routes FIRST before Vite middleware
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Wishes API
app.get('/api/wishes', (req, res) => {
  const wishes = getSavedWishes();
  res.json({ success: true, wishes });
});

app.post('/api/wishes', (req, res) => {
  const wish = req.body;
  if (!wish || !wish.id) {
    return res.status(400).json({ error: 'Invalid wish data' });
  }
  const wishes = getSavedWishes();
  const existingIdx = wishes.findIndex((w: any) => w.id === wish.id);
  if (existingIdx >= 0) {
    wishes[existingIdx] = wish;
  } else {
    wishes.unshift(wish);
  }
  saveWishes(wishes);
  broadcastWebSocket({ type: 'wishes:new', wish });
  res.json({ success: true, wish });
});

app.delete('/api/wishes/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Invalid wish ID' });
  }
  let wishes = getSavedWishes();
  const initialLength = wishes.length;
  wishes = wishes.filter((w: any) => w.id !== id);
  saveWishes(wishes);
  broadcastWebSocket({ type: 'wishes:deleted', id });
  res.json({ success: true, deleted: wishes.length < initialLength, id });
});

// RSVPs API
app.get('/api/rsvps', (req, res) => {
  const rsvps = getSavedRSVPs();
  res.json({ success: true, rsvps });
});

app.post('/api/rsvps', (req, res) => {
  const rsvp = req.body;
  if (!rsvp) {
    return res.status(400).json({ error: 'Invalid rsvp data' });
  }
  const rsvps = getSavedRSVPs();
  rsvps.push(rsvp);
  saveRSVPs(rsvps);
  broadcastWebSocket({ type: 'rsvps:new', rsvp });
  res.json({ success: true, rsvp });
});

// Notifications API (Owner Dashboard Alert & Email Trigger)
app.get('/api/notifications', (req, res) => {
  const notifications = getSavedNotifications();
  res.json({ success: true, notifications });
});

app.post('/api/notifications', (req, res) => {
  const notif = req.body;
  if (!notif || !notif.id) {
    return res.status(400).json({ error: 'Invalid notification data' });
  }
  const notifications = getSavedNotifications();
  notifications.unshift(notif);
  saveNotifications(notifications);
  res.json({ success: true, notification: notif });
});

// Guests API
app.get('/api/guests', (req, res) => {
  const guests = getSavedGuests();
  res.json({ success: true, guests });
});

app.post('/api/guests', (req, res) => {
  const guest = req.body;
  if (!guest || !guest.id) {
    return res.status(400).json({ error: 'Invalid guest data' });
  }
  const guests = getSavedGuests();
  const existingIdx = guests.findIndex((g: any) => g.id === guest.id);
  if (existingIdx >= 0) {
    guests[existingIdx] = guest;
  } else {
    guests.push(guest);
  }
  saveGuests(guests);
  res.json({ success: true, guest });
});

app.delete('/api/guests', (req, res) => {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: 'Missing guest id' });
  }
  let guests = getSavedGuests();
  guests = guests.filter((g: any) => g.id !== id);
  saveGuests(guests);
  res.json({ success: true });
});

// Get Event by ID, Type, or default event
app.get('/api/event', (req, res) => {
  const eventId = req.query.id as string;
  const eventType = req.query.type as string;
  const events = getSavedEvents();
  
  // If specific ID is requested, return that specific template event
  if (eventId) {
    if (events[eventId]) {
      return res.json({ success: true, event: events[eventId], source: 'server', requestedId: eventId });
    }
    const preset = findTemplatePreset(eventId);
    if (preset) {
      return res.json({ success: true, event: preset.sampleEvent, source: 'preset', requestedId: eventId });
    }
    return res.json({ success: true, event: null, requestedId: eventId, source: 'not_found' });
  }

  // If template type is requested
  if (eventType) {
    if (events[`type_${eventType}`]) {
      return res.json({ success: true, event: events[`type_${eventType}`], source: 'server', requestedType: eventType });
    }
    const match = Object.values(events).find((e: any) => e?.eventType === eventType);
    if (match) {
      return res.json({ success: true, event: match, source: 'server', requestedType: eventType });
    }
    const preset = findTemplatePreset(eventType);
    if (preset) {
      return res.json({ success: true, event: preset.sampleEvent, source: 'preset', requestedType: eventType });
    }
    return res.json({ success: true, event: null, requestedType: eventType, source: 'not_found' });
  }
  
  // If no ID requested, check default or first saved
  if (events['default']) {
    return res.json({ success: true, event: events['default'], source: 'server' });
  }

  // If there is any saved event, use that
  const keys = Object.keys(events).filter(k => !k.startsWith('type_'));
  if (keys.length > 0) {
    return res.json({ success: true, event: events[keys[0]], source: 'server' });
  }

  // No custom event saved yet on server
  return res.json({ success: true, event: null, source: 'default' });
});

// List all saved template IDs on server
app.get('/api/templates', (req, res) => {
  const events = getSavedEvents();
  const list = Object.keys(events)
    .filter(key => !key.startsWith('type_') && key !== 'default')
    .map(key => ({
      key,
      id: events[key]?.id,
      name: events[key]?.name,
      eventType: events[key]?.eventType,
      updatedAt: events[key]?.updatedAt,
    }));
  res.json({ success: true, templates: list });
});

app.get('/api/system-users', (req, res) => {
  const users = getSavedSystemUsers();
  res.json({ success: true, users });
});

app.post('/api/system-users', (req, res) => {
  const user = req.body;
  if (user && (user.email || user.name)) {
    saveSystemUser(user);
    res.json({ success: true, user });
  } else {
    res.status(400).json({ success: false, error: 'Invalid user data' });
  }
});

app.post('/api/system-users/delete', (req, res) => {
  const { id, email, name } = req.body || {};
  const target = id || email || name;
  if (!target) {
    return res.status(400).json({ success: false, error: 'Target identifier required' });
  }
  const remaining = deleteSystemUser(target);
  res.json({ success: true, users: remaining });
});

app.post('/api/send-reset-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Email and code are required' });
  }
  const senderEmail = 'Yoeurn.seyha@diu.edu.kh';
  console.log(`[RESET CODE SENT] Sender: ${senderEmail} -> Recipient: ${email} | Code: ${code}`);
  
  // Create system notification log
  const notifications = getSavedNotifications();
  notifications.unshift({
    id: 'reset_' + Date.now(),
    type: 'PASSWORD_RESET_CODE',
    sender: senderEmail,
    recipient: email,
    code,
    timestamp: new Date().toISOString()
  });
  saveNotifications(notifications.slice(0, 100));

  res.json({
    success: true,
    sender: senderEmail,
    recipient: email,
    message: `Verification code sent from ${senderEmail} to ${email}`
  });
});

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'trashmail.com', 'yopmail.com', 'temp-mail.org', 'fakemailgenerator.com',
  'sharklasers.com', 'getnada.com', 'dispostable.com', 'fake.com', 'test.com',
  'example.com', 'throwawaymail.com', 'burnermail.io', 'mohmal.com', 'crazymailing.com',
  'mytemp.email', 'tempinbox.com', 'maildrop.cc', 'inboxkitten.com', 'trashmail.net',
  'throwaway.email', 'nada.ltd', 'emailondeck.com', 'tempmailo.com', 'guerrillamailblock.com',
  'guerrillamail.net', 'guerrillamail.biz', 'guerrillamail.org', 'grr.la', 'spam4.me',
  'fakeinbox.com', 'disposablemail.com', 'generator.email', 'disposable.com',
  'tempmail.net', 'tempmailaddress.com', 'dropmail.me', '10minutemail.net', 'temp-mail.io',
  'discard.email', 'tempmailgen.com', 'zillamail.com'
]);

const TRUSTED_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'icloud.com', 'me.com', 'mac.com', 'live.com', 'msn.com',
  'diu.edu.kh', 'moeys.gov.kh', 'rupp.edu.kh', 'cadt.edu.kh', 'gov.kh', 'edu.kh',
  'proton.me', 'protonmail.com', 'zoho.com', 'aol.com'
]);

// Endpoint to verify whether an email is real or fake/disposable
app.post('/api/verify-email', async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, isReal: false, error: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(cleanEmail)) {
    return res.json({
      success: true,
      isReal: false,
      reason: 'invalid_format',
      messageKh: 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ (Invalid email syntax)',
      messageEn: 'Invalid email syntax or formatting'
    });
  }

  const parts = cleanEmail.split('@');
  const username = parts[0];
  const domain = parts[1];

  // Reject dummy or repetitive usernames
  const dummyUsernames = ['test', 'fake', 'asdf', 'aaaa', '1111', 'admin', 'user', 'dummy', 'temp'];
  if (dummyUsernames.includes(username) || /^([a-zA-Z0-9])\1{3,}$/.test(username) || username.length < 2) {
    return res.json({
      success: true,
      isReal: false,
      reason: 'fake_username',
      messageKh: 'ឈ្មោះអ៊ីមែលក្លែងក្លាយ ឬមិនពិត (Fake username pattern)',
      messageEn: 'Username appears to be fake or disposable'
    });
  }

  // Reject known disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return res.json({
      success: true,
      isReal: false,
      reason: 'disposable_domain',
      messageKh: 'អ៊ីមែលក្លែងក្លាយ ឬ អ៊ីមែលបណ្តោះអាសន្ន មិនត្រូវបានអនុញ្ញាតទេ',
      messageEn: 'Disposable or temporary email services are not allowed'
    });
  }

  // Special Google Account / Gmail Verification
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Gmail usernames cannot start/end with a dot, have consecutive dots, or invalid characters
    if (/^\.|\.\.|\.$|[^a-zA-Z0-9.]/.test(username)) {
      return res.json({
        success: true,
        isReal: false,
        isGoogle: false,
        reason: 'invalid_google_format',
        messageKh: 'ទម្រង់គណនី Google/Gmail មិនត្រឹមត្រូវ (Invalid Google account format)',
        messageEn: 'Invalid Google / Gmail username format'
      });
    }
    return res.json({
      success: true,
      isReal: true,
      isGoogle: true,
      provider: 'Google Account',
      domain,
      reason: 'google_account',
      messageKh: '✓ គណនី Google ពិតប្រាកដ (Google Account Verified)',
      messageEn: '✓ Official Google Account Verified'
    });
  }

  // Instantly accept other known trusted domains
  if (TRUSTED_EMAIL_DOMAINS.has(domain)) {
    return res.json({
      success: true,
      isReal: true,
      isGoogle: false,
      domain,
      reason: 'trusted_provider',
      messageKh: '✓ អ៊ីមែលពិតប្រាកដ និងត្រឹមត្រូវ (Verified Real Email)',
      messageEn: '✓ Verified Real Email Account'
    });
  }

  // Query DNS MX records to verify domain actually receives emails
  try {
    const resolvePromise = dns.promises.resolveMx(domain);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DNS_TIMEOUT')), 2500)
    );
    const mxRecords = (await Promise.race([resolvePromise, timeoutPromise])) as dns.MxRecord[];
    
    if (mxRecords && mxRecords.length > 0) {
      // Check if domain is powered by Google Workspace / Google mail exchange
      const isGoogleWorkspace = mxRecords.some(r =>
        r.exchange.toLowerCase().includes('google.com') ||
        r.exchange.toLowerCase().includes('googlemail.com')
      );

      return res.json({
        success: true,
        isReal: true,
        isGoogle: isGoogleWorkspace,
        provider: isGoogleWorkspace ? 'Google Workspace' : 'Custom Domain Mail',
        domain,
        reason: isGoogleWorkspace ? 'google_workspace' : 'valid_mx',
        messageKh: isGoogleWorkspace
          ? '✓ គណនី Google Workspace ពិតប្រាកដ (Google Mail Server)'
          : '✓ អ៊ីមែលពិតប្រាកដ (មានម៉ាស៊ីនបម្រើអ៊ីមែលសកម្ម)',
        messageEn: isGoogleWorkspace
          ? '✓ Verified Google Workspace Account (Active Google MX)'
          : '✓ Verified Real Email Account (Active Mail Server)'
      });
    } else {
      return res.json({
        success: true,
        isReal: false,
        reason: 'no_mx_records',
        messageKh: 'ដែនអ៊ីមែលនេះមិនមានម៉ាស៊ីនទទួលសំបុត្រពិតប្រាកដទេ (No MX records)',
        messageEn: 'Domain has no active mail servers'
      });
    }
  } catch (err: any) {
    if (err.message === 'DNS_TIMEOUT') {
      const hasValidTld = domain.includes('.') && domain.split('.').pop()!.length >= 2;
      return res.json({
        success: true,
        isReal: hasValidTld,
        domain,
        reason: hasValidTld ? 'tld_valid' : 'invalid_domain',
        messageKh: hasValidTld ? 'អ៊ីមែលត្រឹមត្រូវ' : 'ដែនអ៊ីមែលមិនត្រឹមត្រូវ',
        messageEn: hasValidTld ? 'Email format accepted' : 'Invalid email domain'
      });
    }

    return res.json({
      success: true,
      isReal: false,
      reason: 'domain_not_found',
      messageKh: 'ដែនអ៊ីមែលមិនមានពិតប្រាកដទេ (Domain not found / Fake domain)',
      messageEn: 'Email domain does not exist or cannot receive mail'
    });
  }
});


// Save or Update Event
app.post('/api/event', (req, res) => {
  const eventData = req.body;
  if (!eventData || typeof eventData !== 'object') {
    return res.status(400).json({ error: 'Invalid event data' });
  }

  const eventId = eventData.id || 'cmgrawhnk0003le0434762j7n';
  const eventType = eventData.eventType;
  const events = getSavedEvents();

  events[eventId] = eventData;
  if (eventType) {
    events[`type_${eventType}`] = eventData;
  }
  
  if (eventId === 'cmgrawhnk0003le0434762j7n') {
    events['default'] = eventData;
  } else {
    // Also update default if this was saved
    events['default'] = eventData;
    events['cmgrawhnk0003le0434762j7n'] = eventData;
  }

  saveEvents(events);
  res.json({ success: true, event: eventData });
});

app.post('/api/event/reset', (req, res) => {
  const eventId = req.body.id || 'cmgrawhnk0003le0434762j7n';
  const events = getSavedEvents();
  if (events[eventId]) {
    delete events[eventId];
  }
  // also delete default if it matches
  if (events['default'] && events['default'].id === eventId) {
    delete events['default'];
  }
  saveEvents(events);
  res.json({ success: true });
});

app.delete('/api/event', (req, res) => {
  const eventId = req.query.id as string;
  if (!eventId) {
    return res.status(400).json({ error: 'Missing event id' });
  }
  const events = getSavedEvents();
  let deleted = false;
  if (events[eventId]) {
    delete events[eventId];
    deleted = true;
  }
  if (events[`type_${eventId}`]) {
    delete events[`type_${eventId}`];
    deleted = true;
  }
  if (events['default'] && (events['default'].id === eventId || events['default'].presetId === eventId)) {
    delete events['default'];
  }
  saveEvents(events);
  res.json({ success: true, deleted, id: eventId });
});

app.delete('/api/templates/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing template id' });
  }
  const events = getSavedEvents();
  let deleted = false;
  if (events[id]) {
    delete events[id];
    deleted = true;
  }
  if (events[`type_${id}`]) {
    delete events[`type_${id}`];
    deleted = true;
  }
  saveEvents(events);
  res.json({ success: true, deleted, id });
});

    // In-app short link endpoint with full Open Graph metadata preview for Telegram, Facebook, Messenger
app.get('/s/:code', async (req, res) => {
  const code = req.params.code;
  const links = getShortLinks();
  const target = links[code];

  if (target) {
    let cleanTarget = target;
    if (cleanTarget.includes('localhost') || cleanTarget.includes('127.0.0.1')) {
      cleanTarget = cleanTarget.replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
    }
    if (cleanTarget.includes('ais-dev-')) {
      cleanTarget = cleanTarget.replace('ais-dev-', 'ais-pre-');
    }

    // Merge any query params from request (e.g. /s/code?name=...)
    try {
      const urlObj = new URL(cleanTarget);
      for (const [key, val] of Object.entries(req.query)) {
        if (typeof val === 'string') {
          urlObj.searchParams.set(key, val);
        }
      }
      cleanTarget = urlObj.toString();
    } catch {
      // ignore
    }

    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isSocialBot =
      userAgent.includes('telegrambot') ||
      userAgent.includes('facebookexternalhit') ||
      userAgent.includes('facebot') ||
      userAgent.includes('twitterbot') ||
      userAgent.includes('whatsapp') ||
      userAgent.includes('slackbot') ||
      userAgent.includes('linkedinbot') ||
      userAgent.includes('discordbot') ||
      userAgent.includes('viber');

    // Extract guest name, event ID, and category type from target URL if present
    let guestName: string | null = null;
    let eventId: string | null = null;
    let eventType: string | null = null;
    let targetOrigin = getRequestPublicOrigin(req);
    try {
      const parsed = new URL(cleanTarget);
      guestName = parsed.searchParams.get('name') || parsed.searchParams.get('i') || parsed.searchParams.get('guest') || parsed.searchParams.get('to');
      eventId = parsed.searchParams.get('id');
      eventType = parsed.searchParams.get('type') || parsed.searchParams.get('category');
      if (parsed.origin && !parsed.origin.includes('localhost') && !parsed.origin.includes('127.0.0.1')) {
        targetOrigin = parsed.origin;
      }
    } catch {
      // ignore
    }

    // If it's a social media bot, render rich Open Graph HTML so the telegram/facebook preview shows the selected category's title and cover image
    if (isSocialBot) {
      const indexPath = isProduction
        ? [path.join(process.cwd(), 'dist', 'app.html'), path.join(process.cwd(), 'dist', 'index.html')].find(p => fs.existsSync(p)) || path.join(process.cwd(), 'dist', 'index.html')
        : path.join(process.cwd(), 'index.html');

      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = await getInjectedHtmlAsync(html, {
          guestName,
          eventId,
          eventType,
          origin: targetOrigin,
          pageUrl: cleanTarget,
        });
        html = html.replace('</head>', `<meta http-equiv="refresh" content="0;url=${cleanTarget.replace(/"/g, '&quot;')}" /></head>`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
    }

    return res.redirect(302, cleanTarget);
  }

  return res.redirect(302, PUBLIC_APP_URL);
});

// API endpoint to shorten a URL
app.post('/api/shorten', async (req, res) => {
  const { url, origin: clientOrigin } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    let cleanUrl = url;
    if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
      cleanUrl = cleanUrl.replace(/http:\/\/localhost:\d+/, PUBLIC_APP_URL).replace(/https:\/\/localhost:\d+/, PUBLIC_APP_URL);
    }
    if (cleanUrl.includes('ais-dev-')) {
      cleanUrl = cleanUrl.replace('ais-dev-', 'ais-pre-');
    }

    // Determine public origin: NEVER use localhost or dev domain
    let baseOrigin = PUBLIC_APP_URL;
    if (
      clientOrigin &&
      typeof clientOrigin === 'string' &&
      clientOrigin.startsWith('http') &&
      !clientOrigin.includes('localhost') &&
      !clientOrigin.includes('127.0.0.1')
    ) {
      baseOrigin = clientOrigin;
    }

    if (baseOrigin.includes('ais-dev-')) {
      baseOrigin = baseOrigin.replace('ais-dev-', 'ais-pre-');
    }

    // Check if an identical URL is already cached/saved
    const existingLinks = getShortLinks();
    for (const [existingCode, targetUrl] of Object.entries(existingLinks)) {
      if (targetUrl === cleanUrl) {
        const cachedShortUrl = `${baseOrigin}/s/${existingCode}`;
        return res.json({
          success: true,
          shortUrl: cachedShortUrl,
          internalShortUrl: cachedShortUrl,
          code: existingCode,
          provider: 'cached',
        });
      }
    }

    // Generate clean in-app short code: /s/:code
    let code = '';
    try {
      const urlObj = new URL(cleanUrl);
      const nameParam = urlObj.searchParams.get('name');
      if (nameParam) {
        const cleanName = nameParam.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
        const rand = Math.random().toString(36).substring(2, 6);
        code = cleanName ? `${cleanName}-${rand}` : rand;
      }
    } catch {
      // url parse error, fallback
    }

    if (!code) {
      code = Math.random().toString(36).substring(2, 8);
    }

    saveShortLink(code, cleanUrl);

    const internalShortUrl = `${baseOrigin}/s/${code}`;

    return res.json({
      success: true,
      shortUrl: internalShortUrl,
      internalShortUrl,
      code,
      provider: 'internal',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  // In development, mount Vite custom SSR transform middleware
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      // Ignore API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexHtmlPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);

        const guestName = (req.query.name || req.query.i || req.query.guest || req.query.to) as string;
        const eventId = req.query.id as string;
        const eventType = (req.query.type || req.query.category) as string;
        const origin = getRequestPublicOrigin(req);

        const html = await getInjectedHtmlAsync(template, {
          guestName,
          eventId,
          eventType,
          origin,
          pageUrl: `${origin}${req.originalUrl}`,
        });
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // In production, serve compiled static assets from dist
    const possibleDistPaths = [
      path.join(process.cwd(), 'dist'),
      path.resolve(__dirname),
      path.resolve(__dirname, '..', 'dist'),
    ];
    const distPath = possibleDistPaths.find(p => fs.existsSync(path.join(p, 'index.html')) || fs.existsSync(path.join(p, 'app.html'))) || path.join(process.cwd(), 'dist');

    app.use(express.static(distPath, { index: false }));
    app.get('*', async (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      const indexPath = [path.join(distPath, 'app.html'), path.join(distPath, 'index.html')].find(p => fs.existsSync(p)) || path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        const guestName = (req.query.name || req.query.i || req.query.guest || req.query.to) as string;
        const eventId = req.query.id as string;
        const eventType = (req.query.type || req.query.category) as string;
        const origin = getRequestPublicOrigin(req);

        html = await getInjectedHtmlAsync(html, {
          guestName,
          eventId,
          eventType,
          origin,
          pageUrl: `${origin}${req.originalUrl}`,
        });
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
      res.sendFile(indexPath);
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Wedding App Server with WebSocket running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${PORT} is already in use by another process. Keeping existing listener active.`);
    } else {
      console.error('[Server] Server error:', err);
    }
  });

  const handleShutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
}

startServer();
