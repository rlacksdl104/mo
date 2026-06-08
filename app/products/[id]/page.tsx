"use client"

import { use, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  getGroupPurchaseDetail, 
  getGroupPurchaseList,
  GroupPurchaseDetailResponse,
  GroupPurchaseListResponse
} from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import {
  Clock,
  Users,
  Truck,
  ShieldCheck,
  ChevronLeft,
  Minus,
  Plus,
  Heart,
  Share2,
  Loader2,
  TrendingDown,
} from "lucide-react"

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  "FRUIT": "과일",
  "VEGETABLE": "채소",
  "GRAIN": "곡물",
  "MEAT": "육류",
  "SEAFOOD": "수산물",
  "OTHER": "기타",
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn, isInitializing } = useAuth()

  const [product, setProduct] = useState<GroupPurchaseDetailResponse | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<GroupPurchaseListResponse[]>([])
  const [quantity, setQuantity] = useState(1)
  const [timeLeft, setTimeLeft] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await getGroupPurchaseDetail(Number(id))
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "상품 정보를 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const fetchRelatedProducts = useCallback(async () => {
    try {
      const data = await getGroupPurchaseList()
      setRelatedProducts(data.filter(p => p.id !== Number(id)).slice(0, 4))
    } catch (err) {
      console.error("관련 상품 로드 실패:", err)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [fetchProduct, fetchRelatedProducts])

  useEffect(() => {
    if (!product) return

    const calculateTimeLeft = () => {
      const seconds = product.remainingSeconds
      
      if (seconds <= 0) {
        setTimeLeft("마감")
        return
      }

      const days = Math.floor(seconds / (60 * 60 * 24))
      const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
      const minutes = Math.floor((seconds % (60 * 60)) / 60)

      if (days > 0) {
        setTimeLeft(`${days}일 ${hours}시간 ${minutes}분`)
      } else {
        setTimeLeft(`${hours}시간 ${minutes}분`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [product])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "상품을 찾을 수 없습니다"}
            </h1>
            <Button asChild>
              <Link href="/products">목록으로 돌아가기</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const achievementPercent = Math.round(product.achievementRate * 100)
  const discountPercent = Math.round(
    ((product.basePrice - product.currentPrice) / product.basePrice) * 100
  )
  const totalPrice = product.currentPrice * quantity
  const categoryDisplayName = CATEGORY_DISPLAY_NAMES[product.category] || product.category

  const handlePurchase = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            뒤로가기
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <img
                  src={product.thumbnailUrl || "https://via.placeholder.com/800"}
                  alt={product.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg">
                    {discountPercent}% 할인
                  </span>
                </div>
                {product.status === "COMPLETED" && (
                  <div className="absolute inset-0 bg-primary/90 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">모집 완료!</span>
                  </div>
                )}
                {product.status === "CANCELLED" && (
                  <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center">
                    <span className="text-2xl font-bold text-destructive-foreground">취소됨</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                    {categoryDisplayName}
                  </span>
                  {product.isOwner && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                      내 공구
                    </span>
                  )}
                  {product.isJoined && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-600 rounded">
                      참여중
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.content}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">판매자:</span>
                <span className="font-medium text-foreground">
                  {product.ownerName}
                </span>
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">남은 시간</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{timeLeft}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">참여 현황</span>
                      <span className="font-medium text-foreground">
                        {product.currentCount}/{product.targetCount}명 ({achievementPercent}%)
                      </span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(achievementPercent, 100)}%` }}
                      />
                    </div>
                    {product.nextDiscount && (
                      <p className="text-xs text-muted-foreground">
                        {product.nextDiscount.remainingCount}명 더 모이면{" "}
                        <span className="font-semibold text-primary">
                          {product.nextDiscount.nextPrice.toLocaleString()}원
                        </span>
                        으로 할인!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 할인 단계 */}
              {product.discountTiers && product.discountTiers.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">할인 단계</span>
                    </div>
                    <div className="space-y-2">
                      {product.discountTiers.map((tier, index) => (
                        <div 
                          key={index} 
                          className={`flex justify-between py-2 px-3 rounded-lg ${
                            product.currentCount >= tier.requiredCount 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span>{tier.requiredCount}명 이상</span>
                          <span className="font-medium">{tier.discountPrice.toLocaleString()}원</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {product.currentPrice.toLocaleString()}원
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.basePrice.toLocaleString()}원
                  </span>
                </div>
                <p className="text-sm text-green-600 font-medium">
                  {(product.basePrice - product.currentPrice).toLocaleString()}원
                  절약!
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">수량</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-border">
                  <span className="font-medium text-foreground">총 금액</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={product.status !== "RECRUITING" || product.isJoined}
                    onClick={handlePurchase}
                  >
                    {product.isJoined 
                      ? "이미 참여중" 
                      : product.status !== "RECRUITING" 
                        ? "마감됨" 
                        : "참여하기"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">배송 정보</p>
                    <p className="text-xs text-muted-foreground">
                      공구 성사 후 순차 배송
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">안전 결제</p>
                    <p className="text-xs text-muted-foreground">
                      공구 미성사시 전액 환불
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-4">
                다른 공구도 둘러보세요
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted">
                        <img
                          src={p.thumbnailUrl || "https://via.placeholder.com/400"}
                          alt={p.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                          {p.title}
                        </h3>
                        <p className="text-sm font-bold text-primary">
                          {p.currentPrice.toLocaleString()}원
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
