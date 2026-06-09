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
  "'기대 구성'에 나열된 핵심 요소들이 '실제 렌더링된 내용' 안에 존재하는지 확인하는 것이 너의 임무다.",
  "'실제 렌더링된 내용'은 화면에서 자동 추출한 텍스트라, 대소문자·줄바꿈·순서·표현이 기대 구성과 다를 수 있고 잡음(긴 표 데이터 등)이 섞여 있을 수 있다.",
  "따라서 글자 그대로가 아니라 '의미' 기준으로 비교하라.",
  "기대 구성의 핵심 요소(주요 제목·카드/지표·표 컬럼·핵심 버튼)가 표현이 달라도 대부분 내용 안에 나타나면 ok=true 로 판정한다.",
  "데이터 값·건수·문구·언어(한/영) 차이는 통과로 본다.",
  "명백히 다른 페이지의 내용이거나, 핵심 요소가 대부분 빠진 경우에만 ok=false 로 판정한다.",
  "애매하면 통과(ok=true)를 기본으로 한다.",
  '반드시 JSON 객체로만 답한다: {"ok": boolean, "reason": "한국어 한 문장 (어떤 핵심 요소를 확인했는지)"}',
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
