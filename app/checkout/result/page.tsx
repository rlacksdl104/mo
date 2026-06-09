"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, XCircle, Loader2 } from "lucide-react"
import { verifyTossPayment } from "@/lib/api"

export default function CheckoutResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "invalid">("loading")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const code = searchParams.get("code")
    const errMsg = searchParams.get("message")
    const paymentKey = searchParams.get("paymentKey")
    const orderId = searchParams.get("orderId")
    const amountParam = searchParams.get("amount")
    const amount = amountParam ? Number(amountParam) : NaN

    if (code) {
      setStatus("failed")
      setMessage(errMsg || "결제에 실패했습니다.")
      return
    }

    if (!paymentKey || !orderId || Number.isNaN(amount)) {
      setStatus("invalid")
      setMessage("결제 결과를 확인할 수 없습니다. 다시 시도해주세요.")
      return
    }

    ;(async () => {
      try {
        await verifyTossPayment({
          paymentKey,
          orderId,
          amount,
        })
        setStatus("success")
      } catch (err) {
        setStatus("failed")
        setMessage(err instanceof Error ? err.message : "토스 결제 검증에 실패했습니다.")
      }
    })()
  }, [searchParams])

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-base text-muted-foreground">결제 결과를 확인하는 중입니다...</p>
        </div>
      )
    }

    if (status === "success") {
      return (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">결제가 완료되었습니다</h1>
          <p className="text-muted-foreground mb-8">결제가 정상적으로 승인되었습니다. 마이페이지에서 주문 내역을 확인하세요.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild>
              <Link href="/mypage">마이페이지</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">계속 둘러보기</Link>
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {status === "invalid" ? "결제 정보를 찾을 수 없습니다" : "결제에 실패했습니다"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {message || "다시 시도해 주세요."}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild>
            <Link href="/checkout">결제 다시 시도</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">상품 목록으로</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl">
          <Card>
            <CardContent className="p-8">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
