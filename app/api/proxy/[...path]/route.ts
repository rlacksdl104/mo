import { NextResponse } from "next/server"

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
])

function filterHeaders(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {}
  headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      out[key] = value
    }
  })
  return out
}

function getBackendBase() {
  // Prefer server-only BACKEND_URL, then NEXT_PUBLIC_API_URL, then fallback IP
  return (
    process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://13.208.243.83:8080"
  )
}

async function proxy(request: Request, params: { path?: string[] }) {
  const backendBase = getBackendBase().replace(/\/$/, "")
  const path = (params.path || []).join("/")

  const url = new URL(`${backendBase}/${path}`)
  // Preserve query string from incoming request
  const incomingUrl = new URL(request.url)
  incomingUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value))

  const init: RequestInit = {
    method: request.method,
    headers: filterHeaders(request.headers),
    // body must be omitted for GET/HEAD
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    // allow backend to respond with large bodies
  }

  const res = await fetch(url.toString(), init)

  // Filter response headers
  const headers = filterHeaders(res.headers)

  const body = await res.arrayBuffer()

  return new NextResponse(body, { status: res.status, headers })
}

export async function GET(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params)
}

export async function POST(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params)
}

export async function PUT(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params)
}

export async function PATCH(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params)
}

export async function DELETE(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
