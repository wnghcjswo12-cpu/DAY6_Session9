/* =====================================================================
   로컬 개발 서버 — 정적 파일(index.html 등) + /api/verify-page
   브라우저는 .env 를 못 읽으므로, 이 서버가 .env 를 읽어 GPT_API_KEY 를
   process.env 에 올린 뒤 api/verify-page.js 핸들러로 요청을 넘긴다.

   실행:  node server.js   (또는 npm run dev)
   접속:  http://localhost:3000

   * Vercel 배포 시에는 이 파일은 쓰이지 않는다(정적 파일 + api/ 자동 처리).
   ===================================================================== */

import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

// ---------- .env 로드 (이미 설정된 값은 덮어쓰지 않음) ----------
function loadEnv() {
  const file = path.join(ROOT, ".env");
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && !(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(""));
  });
}

const server = http.createServer(async (req, rawRes) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // ----- API 라우트 -----
  if (url.pathname === "/api/verify-page") {
    const bodyStr = await readBody(req);
    const res = {
      statusCode: 200,
      _headers: {},
      status(code) { this.statusCode = code; return this; },
      setHeader(k, v) { this._headers[k] = v; },
      json(obj) {
        this.setHeader("Content-Type", "application/json; charset=utf-8");
        rawRes.writeHead(this.statusCode, this._headers);
        rawRes.end(JSON.stringify(obj));
      },
    };
    const proxyReq = { method: req.method, headers: req.headers, body: bodyStr, query: {} };
    try {
      const mod = await import("./api/verify-page.js");
      await mod.default(proxyReq, res);
    } catch (err) {
      rawRes.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      rawRes.end(JSON.stringify({ ok: false, reason: "핸들러 오류: " + (err?.message || err) }));
    }
    return;
  }

  // ----- 정적 파일 -----
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    rawRes.writeHead(403);
    rawRes.end("Forbidden");
    return;
  }
  try {
    const buf = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    rawRes.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    rawRes.end(buf);
  } catch {
    rawRes.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    rawRes.end("404 Not Found");
  }
});

server.listen(PORT, () => {
  const hasKey = !!process.env.GPT_API_KEY;
  console.log(`▶ 설비이력관리 서버: http://localhost:${PORT}`);
  console.log(hasKey
    ? "  GPT_API_KEY 감지됨 — 페이지 검증 사용 가능"
    : "  ⚠ GPT_API_KEY 없음 — .env 에 키를 넣어야 페이지 검증이 동작합니다");
});
