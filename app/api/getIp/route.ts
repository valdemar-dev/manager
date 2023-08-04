import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let ip: string | null = request.ip ?? request.headers.get('x-real-ip')
  const forwardedFor = request.headers.get('x-forwarded-for')

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(',').at(0) ?? 'Unknown'
  } 

  return new Response(JSON.stringify(ip));
}