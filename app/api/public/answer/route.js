import { proxyPublicRequest } from "../_proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  return proxyPublicRequest(request, ["save_answer"]);
}
