"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import {
  Package,
  Users,
  TrendingUp,
  Plus,
  Search,
  Eye,
  AlertTriangle,
  Wallet,
  XCircle,
  AlertOctagon,
  Loader2,
} from "lucide-react"

import { getSellerProducts } from "@/lib/api"

type SellerProduct = {
  id: string
  title: string
  originalPrice: number
  discountPrice: number
  currentParticipants: number
  targetParticipants: number
  imageUrl: string
  category: string
  status: string
  endDate: string
  totalSales: number
}

// 패널티 정책 메시지
const getPenaltyMessage = (cancelCount: number) => {
  switch (cancelCount) {
    case 0:
      return {
        title: "첫 번째 취소 경고",
        message: "첫 판매자 취소가 발생했습니다. 공동구매 신뢰도에 영향을 줄 수 있으니 주의해 주세요.",
        severity: "warning" as const,
      }
    case 1:
      return {
        title: "부분 제한 경고",
        message: "해당 취소를 진행할 경우 판매자 패널티가 누적되며 3일간 공동구매 생성이 제한됩니다.",
        severity: "warning" as const,
      }
    default:
      return {
        title: "강력 제한 경고",
        message: "취소를 진행할 경우 공동구매 및 거래 기능이 제한될 수 있습니다.",
        severity: "danger" as const,
      }
  }
}

export default function SellerMyPage() {
  const router = useRouter()
  const { isLoggedIn, isAdmin, isInitializing, user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [productToCancel, setProductToCancel] = useState<SellerProduct | null>(null)
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [cancelCount, setCancelCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isInitializing) {
      return
    }
    // Check if user is logged in and is admin
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    if (!isAdmin) {
      router.push("/mypage")
      return
    }
    // fetch seller products
    ;(async () => {
      try {
        const items = await getSellerProducts()
        const mapped: SellerProduct[] = items.map((p) => ({
          id: String(p.id),
          title: p.title,
          originalPrice: (p as any).basePrice ?? 0,
          discountPrice: (p as any).currentPrice ?? 0,
          currentParticipants: (p as any).currentCount ?? 0,
          targetParticipants: (p as any).targetCount ?? 100,
          imageUrl: p.thumbnailUrl ?? "",
          category: String(p.category),
          status: p.status === "RECRUITING" ? "진행중" : p.status === "COMPLETED" ? "마감" : "취소됨",
          endDate: new Date(Date.now() + ((p as any).remainingSeconds ?? 0) * 1000).toISOString(),
          totalSales: ((p as any).currentPrice ?? 0) * ((p as any).currentCount ?? 0),
        }))
        setProducts(mapped)
      } catch (err) {
        console.error("판매자 상품 로드 실패:", err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [isInitializing, isLoggedIn, isAdmin, router])

  const totalSales = products.reduce((sum, p) => sum + p.totalSales, 0)
  const totalParticipants = products.reduce((sum, p) => sum + p.currentParticipants, 0)
  const activeProducts = products.filter(p => p.status === "진행중").length
  const pendingSettlement = totalSales * 0.15

  const handleCancelProduct = (product: SellerProduct) => {
    if (product.status === "마감") return
    setProductToCancel(product)
    setCancelDialogOpen(true)
  }

  const confirmCancel = () => {
    if (productToCancel) {
      setProducts(products.map(p => 
        p.id === productToCancel.id 
          ? { ...p, status: "취소됨" }
          : p
      ))
      setCancelCount(prev => prev + 1)
      setCancelDialogOpen(false)
      setProductToCancel(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-primary/10 text-primary border-primary/20"
      case "마감":
        return "bg-muted text-muted-foreground border-muted"
      case "취소됨":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  const penaltyInfo = getPenaltyMessage(cancelCount)

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user?.name?.slice(0, 1) || "판"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-xl font-bold text-foreground">{user?.name || "판매자"}</h1>
                      <Badge className="bg-primary/10 text-primary border-primary/20">인증 판매자</Badge>
                    </div>
                    <p className="text-muted-foreground">{user?.farmName || "농장"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">총 매출</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    {(totalSales / 10000).toFixed(0)}만원
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">정산 대기</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    {(pendingSettlement / 10000).toFixed(0)}만원
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">총 참여자</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    {totalParticipants}명
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">진행중 공구</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    {activeProducts}개
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">내 상품 목록</h2>
              <p className="text-sm text-muted-foreground">상품을 클릭하여 참여자 목록을 확인하세요</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="상품명 검색..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="gap-2 w-full sm:w-auto" asChild>
                <Link href="/mypage/seller/products/new">
                  <Plus className="h-4 w-4" />
                  새 상품 등록
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {products
              .filter(p => p.title.includes(searchQuery))
              .map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className={getStatusColor(product.status)}>
                                {product.status}
                              </Badge>
                              <Badge variant="outline">{product.category}</Badge>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                              {product.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>
                                참여: <strong className="text-foreground">{product.currentParticipants}/{product.targetParticipants}</strong>명
                              </span>
                              <span>
                                판매가: <strong className="text-foreground">{product.discountPrice.toLocaleString()}원</strong>
                              </span>
                              <span>
                                매출: <strong className="text-primary">{product.totalSales.toLocaleString()}원</strong>
                              </span>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            <Button variant="outline" size="sm" className="gap-1 flex-1 sm:flex-none" asChild>
                              <Link href={`/mypage/seller/products/${product.id}`}>
                                <Users className="h-4 w-4" />
                                <span>참여자</span>
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1 flex-1 sm:flex-none" asChild>
                              <Link href={`/products/${product.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">보기</span>
                              </Link>
                            </Button>
                            {product.status === "진행중" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 flex-1 sm:flex-none text-amber-600 hover:text-amber-600 hover:bg-amber-50"
                                onClick={() => handleCancelProduct(product)}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">공구취소</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>목표 달성률</span>
                            <span>{Math.round((product.currentParticipants / product.targetParticipants) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{
                                width: `${Math.min((product.currentParticipants / product.targetParticipants) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {products.filter(p => p.title.includes(searchQuery)).length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">등록된 상품이 없습니다</p>
              <Button className="mt-4 gap-2" asChild>
                <Link href="/mypage/seller/products/new">
                  <Plus className="h-4 w-4" />
                  첫 상품 등록하기
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {penaltyInfo.severity === "danger" ? (
                <AlertOctagon className="h-5 w-5 text-destructive" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              {penaltyInfo.title}
            </DialogTitle>
            <DialogDescription>
              {productToCancel && (
                <span className="block mt-2 font-medium text-foreground">
                  {productToCancel.title}
                </span>
              )}
              <span className="block mt-2">{penaltyInfo.message}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              공구 취소하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
