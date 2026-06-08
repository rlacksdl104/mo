"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  User,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { getMyOrders } from "@/lib/api"

type Order = {
  id: string
  productName: string
  imageUrl?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: string
  currentParticipants?: number
  targetParticipants?: number
  endDate?: string
  orderedAt?: string
}

function getStatusBadge(status: string) {
  switch (status) {
    case "진행중":
      return <Badge className="bg-blue-100 text-blue-700">진행중</Badge>
    case "배송완료":
      return <Badge className="bg-green-100 text-green-700">배송완료</Badge>
    case "취소됨":
      return <Badge className="bg-red-100 text-red-700">취소됨</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function BuyerMyPage() {
  const router = useRouter()
  const { isLoggedIn, isAdmin, isInitializing, user } = useAuth()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (isInitializing) {
      return
    }

    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    // If admin, redirect to seller mypage
    if (isAdmin) {
      router.push("/mypage/seller")
      return
    }

    ;(async () => {
      try {
        const data = await getMyOrders()
        const mapped: Order[] = data.map((d: any) => ({
          id: d.id,
          productName: d.productName,
          imageUrl: d.imageUrl,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
          totalPrice: d.totalPrice,
          status: d.status === "RECRUITING" ? "진행중" : d.status === "COMPLETED" ? "배송완료" : d.status === "CANCELLED" ? "취소됨" : d.status,
          currentParticipants: d.currentParticipants,
          targetParticipants: d.targetParticipants,
          endDate: d.endDate,
          orderedAt: d.orderedAt,
        }))
        setOrders(mapped)
      } catch (err) {
        console.error("주문 로드 실패:", err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [isInitializing, isLoggedIn, isAdmin, router])

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(order)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false)
    setSelectedOrder(null)
  }

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
        {/* 프로필 섹션 */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user?.name || "사용자"}</h1>
                  <p className="text-sm text-muted-foreground">공동구매와 함께 스마트한 소비를 즐겨보세요</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{orders.filter(o => o.status === "진행중").length}</p>
              <p className="text-sm text-muted-foreground">참여중인 공구</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{orders.filter(o => o.status === "배송완료").length}</p>
              <p className="text-sm text-muted-foreground">완료된 주문</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{orders.filter(o => o.status === "취소됨").length}</p>
              <p className="text-sm text-muted-foreground">취소된 주문</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                {(orders.filter(o => o.status === "배송완료").reduce((sum, o) => sum + o.totalPrice, 0) / 10000).toFixed(1)}만원
              </p>
              <p className="text-sm text-muted-foreground">총 구매 금액</p>
            </CardContent>
          </Card>
        </div>

        {/* 주문 목록 탭 */}
        <Tabs defaultValue="participating" className="w-full">
          <TabsList className="w-full md:w-auto mb-6">
            <TabsTrigger value="participating" className="flex-1 md:flex-none">
              참여중 ({orders.filter(o => o.status === "진행중").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 md:flex-none">
              완료 ({orders.filter(o => o.status === "배송완료").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex-1 md:flex-none">
              취소 ({orders.filter(o => o.status === "취소됨").length})
            </TabsTrigger>
          </TabsList>

          {/* 참여중인 공구 */}
          <TabsContent value="participating">
            <div className="space-y-4">
              {orders.filter(o => o.status === "진행중").map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={order.imageUrl}
                          alt={order.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{order.productName}</h3>
                            <p className="text-sm text-muted-foreground">
                              주문일: {order.orderedAt} | 수량: {order.quantity}개
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        
                        {/* 진행률 */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              현재 {order.currentParticipants}명 / 목표 {order.targetParticipants}명
                            </span>
                            <span className="text-primary font-medium">
                              {Math.round((order.currentParticipants / order.targetParticipants) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(order.currentParticipants / order.targetParticipants) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            마감일: {order.endDate}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">
                            {order.totalPrice.toLocaleString()}원
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                              onClick={() => handleCancelClick(order)}
                            >
                              참여 취소
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/products/${order.id}`}>
                                상세보기
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {orders.filter(o => o.status === "진행중").length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">참여중인 공구가 없습니다.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/products">공구 둘러보기</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* 완료된 주문 */}
          <TabsContent value="completed">
            <div className="space-y-4">
              {orders.filter(o => o.status === "배송완료").map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={order.imageUrl}
                          alt={order.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{order.productName}</h3>
                            <p className="text-sm text-muted-foreground">
                              주문일: {order.orderedAt} | 수량: {order.quantity}개
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-green-600 mb-3">
                          배송완료: {order.deliveredAt}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">
                            {order.totalPrice.toLocaleString()}원
                          </p>
                          <Button variant="outline" size="sm">
                            리뷰 작성
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 취소된 주문 */}
          <TabsContent value="cancelled">
            <div className="space-y-4">
              {orders.filter(o => o.status === "취소됨").map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted opacity-60">
                        <Image
                          src={order.imageUrl}
                          alt={order.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{order.productName}</h3>
                            <p className="text-sm text-muted-foreground">
                              수량: {order.quantity}개
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-red-600 mb-3">
                          취소일: {order.cancelledAt} | 사유: {order.cancelReason}
                        </p>
                        <p className="font-semibold text-muted-foreground line-through">
                          {order.totalPrice.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              공구 참여 취소
            </DialogTitle>
            <DialogDescription className="text-left pt-4">
              <span className="font-medium text-foreground">{selectedOrder?.productName}</span> 공구 참여를 취소하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
            <p className="text-sm text-amber-800">
              <strong>주의:</strong> 취소 시 현재 참여 인원이 줄어들어 할인 단계가 변경될 수 있습니다.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              돌아가기
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              취소하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
