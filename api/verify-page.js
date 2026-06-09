/* =====================================================================
   /api/verify-page — GPT 페이지 검증 서버리스 함수
   브라우저는 .env 를 직접 읽을 수 없으므로, 이 함수가 서버 측에서
   GPT_API_KEY 로 OpenAI 를 대신 호출하고 판정 결과(JSON)만 돌려준다.

   요청(POST, JSON):
     { view, name, expected, content }
   응답(JSON):
     { ok: boolean, reason: string }

   - Vercel: api/ 폴더의 함수로 자동 배포됨 (대시보드/CLI 에 GPT_API_KEY 설정)
   - 로컬: server.js 가 .env 를 읽어 동일 핸들러를 호출함
   ===================================================================== */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = [
  "너는 웹 애플리케이션 페이지 QA 검수자다.",
  "주어진 페이지의 '기대 구성'과 '실제 렌더링된 내용'을 비교해,",
  "그 페이지가 의도한 내용으로 올바르게 구성되어 있는지 판정한다.",
  "데이터 값의 차이, 건수 차이, 사소한 표현/순서 차이는 통과(ok=true)로 본다.",
  "기대 구성의 핵심 요소(주요 제목·표 컬럼·핵심 버튼/지표)가 빠졌거나",
  "엉뚱한 페이지의 내용이면 실패(ok=false)로 본다.",
  '반드시 JSON 객체로만 답한다: {"ok": boolean, "reason": "한국어 한 문장"}',
].join(" ");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, reason: "POST 요청만 허용됩니다." });
  }

  const apiKey = process.env.GPT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      reason: ".env 에 GPT_API_KEY 가 설정되지 않았습니다.",
    });
  }

  // 본문 파싱 (Vercel 은 req.body 자동 파싱, 로컬 서버는 문자열일 수 있음)
  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body || "{}");
  } catch {
    return res.status(400).json({ ok: false, reason: "요청 본문 JSON 파싱 실패." });
  }
  body = body || {};

  const { view, name, expected, content } = body;
  if (!expected || !content) {
    return res.status(400).json({ ok: false, reason: "expected/content 필드가 필요합니다." });
  }

  const userPrompt =
    `[페이지 ID] ${view || "-"}\n` +
    `[페이지 이름] ${name || "-"}\n\n` +
    `[기대 구성]\n${expected}\n\n` +
    `[실제 렌더링된 내용]\n${String(content).slice(0, 6000)}`;

  const model = process.env.GPT_MODEL || "gpt-4o-mini";

  try {
    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      return res.status(502).json({
        ok: false,
        reason: `OpenAI 오류 (${r.status}): ${errText.slice(0, 200)}`,
      });
    }

    const data = await r.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(502).json({ ok: false, reason: "GPT 응답 파싱 실패." });
    }

    return res.status(200).json({
      ok: !!parsed.ok,
      reason: typeof parsed.reason === "string" ? parsed.reason : "",
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      reason: `검증 호출 실패: ${err && err.message ? err.message : String(err)}`,
    });
  }
}
