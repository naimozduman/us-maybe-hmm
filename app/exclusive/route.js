const SOURCE = 'https://raw.githubusercontent.com/naimozduman/us-maybe-hmm/028072a03ee15fd1da4b85e4f7356ae24f11088f/exclusive-note/index.html';

export async function GET() {
  const response = await fetch(SOURCE, { cache: 'no-store' });
  if (!response.ok) {
    return new Response('Unable to load the note right now.', { status: 502 });
  }
  const html = await response.text();
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
    },
  });
}
