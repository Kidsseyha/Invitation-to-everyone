import fs from 'fs';
import path from 'path';
import rawFirebaseConfig from '../firebase-applet-config.json';
import { findTemplatePreset } from '../src/data/eventTemplates';
import {
  buildInvitationMeta,
  injectMetaIntoHtml,
  fetchEventFromFirestoreRest,
  normalizeCategoryString,
} from '../src/utils/shareMeta';

interface VercelReq {
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
}

interface VercelRes {
  status: (code: number) => VercelRes;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
}

function getHeader(req: VercelReq, key: string): string {
  const val = req.headers?.[key] ?? req.headers?.[key.toLowerCase()];
  if (Array.isArray(val)) return val[0] || '';
  return val || '';
}

function getQueryParam(params: URLSearchParams, req: VercelReq, key: string): string {
  const fromUrl = params.get(key);
  if (fromUrl) return fromUrl;
  const fromReq = req.query?.[key];
  if (Array.isArray(fromReq)) return fromReq[0] || '';
  return fromReq || '';
}

export default async function handler(req: VercelReq, res: VercelRes) {
  try {
    const host = getHeader(req, 'x-forwarded-host') || getHeader(req, 'host') || 'invitationonline-six.vercel.app';
    const proto = getHeader(req, 'x-forwarded-proto') || 'https';
    const origin = `${proto.split(',')[0].trim()}://${host.split(',')[0].trim()}`;

    const rawUrl = req.url || '/';
    const parsedUrl = new URL(rawUrl, origin);
    const params = parsedUrl.searchParams;

    const eventId = getQueryParam(params, req, 'id').trim();
    const rawType = (getQueryParam(params, req, 'type') || getQueryParam(params, req, 'category')).trim();
    let rawGuest = (
      getQueryParam(params, req, 'name') ||
      getQueryParam(params, req, 'i') ||
      getQueryParam(params, req, 'guest') ||
      getQueryParam(params, req, 'to')
    ).trim();

    let guestName = rawGuest;
    try {
      if (rawGuest && rawGuest.includes('%')) {
        guestName = decodeURIComponent(rawGuest);
      }
    } catch {
      guestName = rawGuest;
    }

    const eventType = normalizeCategoryString(rawType);
    let targetEvent: any = null;

    if (eventId) {
      targetEvent = await fetchEventFromFirestoreRest({
        projectId: rawFirebaseConfig.projectId,
        databaseId: (rawFirebaseConfig as any).firestoreDatabaseId || '(default)',
        eventId,
        apiKey: (rawFirebaseConfig as any).apiKey,
      });
    }

    if (eventType) {
      const loadedCat = targetEvent
        ? normalizeCategoryString(targetEvent.eventType || targetEvent.id || targetEvent.name)
        : null;
      if (!targetEvent || (loadedCat && loadedCat !== eventType)) {
        const preset = findTemplatePreset(eventType);
        if (preset) targetEvent = preset.sampleEvent;
      }
    }

    if (!targetEvent && eventId) {
      const preset = findTemplatePreset(eventId);
      if (preset) targetEvent = preset.sampleEvent;
    }

    if (!targetEvent) {
      targetEvent = findTemplatePreset('wedding')?.sampleEvent;
    }

    let html = '';
    const candidatePaths = [
      path.join(process.cwd(), 'dist', 'app.html'),
      path.join(process.cwd(), 'dist', 'index.html'),
      path.join(process.cwd(), 'index.html'),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        html = fs.readFileSync(p, 'utf-8');
        break;
      }
    }

    if (!html) {
      try {
        const fallbackRes = await fetch(`${origin}/app.html`);
        if (fallbackRes.ok) {
          html = await fallbackRes.text();
        } else {
          const indexRes = await fetch(`${origin}/index.html`);
          if (indexRes.ok) {
            html = await indexRes.text();
          }
        }
      } catch {
        // ignore
      }
    }

    if (!html) {
      html = `<!doctype html><html lang="km"><head><meta charset="UTF-8" /><title>Digital Invitation</title></head><body><div id="root"></div></body></html>`;
    }

    const meta = buildInvitationMeta({
      event: targetEvent,
      guestName: guestName || null,
      queryType: rawType || null,
      eventId: eventId || null,
      origin,
      pageUrl: parsedUrl.toString(),
    });

    const injected = injectMetaIntoHtml(html, meta);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).send(injected);
  } catch (err: any) {
    console.error('[Vercel OG Handler Error]:', err);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!doctype html><html lang="km"><head><meta charset="UTF-8" /><title>Digital Invitation</title></head><body><div id="root"></div></body></html>`);
  }
}
