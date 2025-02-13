import { getDataFromOpenAi } from "@/app/utils/openai.utils";

export async function GET() {
  return Response.json({ message: "Please use POST /complexity" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const aiRes = await getDataFromOpenAi(
    body.code,
    process.env.OPENAI_KEY as string
  );
  return Response.json(aiRes);
}
