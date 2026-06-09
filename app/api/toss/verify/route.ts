import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { paymentKey, orderId, amount } = body as {
    paymentKey?: string
    orderId?: string
    amount?: number
  }

  if (!paymentKey || !orderId || typeof amount !== "number") {
    return NextResponse.json({ message: "paymentKey, orderId, amount은 필수입니다." }, { status: 400 })
  }

  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: "서버에 토스 시크릿 키가 설정되지 않았습니다." }, { status: 500 })
  }

  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`

  const tossResponse = await fetch(`https://api.tosspayments.com/v1/payments/${encodeURIComponent(paymentKey)}`, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      amount,
    }),
  })

  const tossJson = await tossResponse.json().catch(() => null)
  if (!tossResponse.ok) {
    return NextResponse.json({ message: tossJson?.message || "토스 결제 승인에 실패했습니다.", error: tossJson }, { status: tossResponse.status })
  }

  return NextResponse.json({
    paymentKey: tossJson.paymentKey,
    orderId: tossJson.orderId,
    amount: tossJson.amount?.value ?? amount,
    status: tossJson.status,
  })
}
