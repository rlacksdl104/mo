"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  User,
  Download,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Store,
} from "lucide-react"
import { getGroupPurchaseDetail, getProductParticipants, getAdminMyPage } from "@/lib/api"

type Participant = {
  id: string
  buyerName: string
  buyerPhone?: string
  buyerEmail?: string
  quantity: number
  totalPrice: number
  address?: string
  orderDate: string
  status: string
}

export default function ProductParticipantsPage() {
  const params = useParams()
  const productId = params.id as string
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const [product, setProduct] = useState<any | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [sellerInfo, setSellerInfo] = useState<{ name: string; email?: string; profileImage?: string }>({ name: "", email: "", profileImage: "" })

  useEffect(() => {
    ;(async () => {
      try {
        const detail = await getGroupPurchaseDetail(Number(productId))
        setProduct({
          id: String(detail.id),
          title: detail.title,
          imageUrl: detail.thumbnailUrl,
          category: String(detail.category),
          status: detail.status === "RECRUITING" ? "진행중" : detail.status === "COMPLETED" ? "마감" : "취소됨",
          currentParticipants: detail.currentCount,
          targetParticipants: detail.targetCount ?? 100,
          discountPrice: detail.currentPrice,
          totalSales: detail.totalRevenue ?? detail.currentPrice * detail.currentCount,
        })
      } catch (err) {
        console.error("상품 상세 로드 실패:", err)
      }

      try {
        const parts = await getProductParticipants(productId)
        setParticipants(parts)
      } catch (err) {
        console.error("참여자 로드 실패:", err)
      }

      try {
        const info = await getAdminMyPage()
        setSellerInfo({ name: info.name, email: (info as any).email, profileImage: info.profileImageUrl })
      } catch (err) {
        // ignore
      }
    })()
  }, [productId])

  const filteredParticipants = participants.filter(p =>
    p.buyerName?.includes(searchQuery) ||
    (p.buyerPhone || "").includes(searchQuery) ||
    (p.address || "").includes(searchQuery)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "결제완료":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "배송중":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "배송완료":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  const [notificationOpen, setNotificationOpen] = useState(false)

  const openDetail = (participant: typeof participants[0]) => {
    setSelectedParticipant(participant)
    setDetailDialogOpen(true)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">상품을 찾을 수 없습니다</p>
          <Button asChild>
            <Link href="/mypage/seller">마이페이지로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/mypage/seller" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">마이페이지</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">모아</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>알림</DialogTitle>
                  <DialogDescription>새로운 알림을 확인하세요.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-semibold text-foreground">공구 참여 요청</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      새로운 참여자가 판매자의 공구에 참여 요청을 보냈습니다.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-semibold text-foreground">정산 완료 알림</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      지난 공구의 정산이 완료되었습니다.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNotificationOpen(false)}>
                    닫기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sellerInfo.profileImage} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {sellerInfo.name ? sellerInfo.name.slice(0, 1) : "판"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline">{sellerInfo.name || "판매자"}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{sellerInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{sellerInfo.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/mypage/seller" className="cursor-pointer">
                    <Store className="mr-2 h-4 w-4" />
                    마이페이지
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mypage/seller/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Product Info Card */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={product.status === "진행중" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-muted"}>
                    {product.status}
                  </Badge>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">참여자</p>
                    <p className="text-lg font-semibold text-foreground">{product.currentParticipants}/{product.targetParticipants}명</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">판매가</p>
                    <p className="text-lg font-semibold text-foreground">{product.discountPrice.toLocaleString()}원</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">총 매출</p>
                    <p className="text-lg font-semibold text-primary">{product.totalSales.toLocaleString()}원</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">달성률</p>
                    <p className="text-lg font-semibold text-foreground">{Math.round((product.currentParticipants / product.targetParticipants) * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">참여자 목록</h2>
              <p className="text-sm text-muted-foreground">총 {participants.length}명의 참여자</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이름, 연락처, 주소 검색..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Download className="h-4 w-4" />
                엑셀 다운로드
              </Button>
            </div>
          </div>

          {/* Desktop Table */}
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">구매자</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">연락처</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">수량</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">결제금액</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">상태</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">주문일</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{participant.buyerName}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground">{participant.buyerPhone}</div>
                        <div className="text-xs text-muted-foreground">{participant.buyerEmail}</div>
                      </td>
                      <td className="p-4 text-center">{participant.quantity}개</td>
                      <td className="p-4 text-right font-medium text-foreground">
                        {participant.totalPrice.toLocaleString()}원
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className={getStatusColor(participant.status)}>
                          {participant.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-center text-sm text-muted-foreground">
                        {new Date(participant.orderDate).toLocaleDateString("ko-KR")}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetail(participant)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredParticipants.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">참여자가 없습니다</p>
              </div>
            )}
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden grid gap-4">
            {filteredParticipants.map((participant) => (
              <Card key={participant.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{participant.buyerName}</p>
                      <p className="text-sm text-muted-foreground">{participant.buyerPhone}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(participant.status)}>
                      {participant.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">수량: </span>
                      <span className="text-foreground font-medium">{participant.quantity}개</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">금액: </span>
                      <span className="text-foreground font-medium">{participant.totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(participant.orderDate).toLocaleDateString("ko-KR")}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => openDetail(participant)}>
                      상세보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredParticipants.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">참여자가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Participant Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>주문 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedParticipant.buyerName}</p>
                  <Badge variant="outline" className={getStatusColor(selectedParticipant.status)}>
                    {selectedParticipant.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">연락처</p>
                    <p className="text-foreground">{selectedParticipant.buyerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">이메일</p>
                    <p className="text-foreground">{selectedParticipant.buyerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">배송지</p>
                    <p className="text-foreground">{selectedParticipant.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">주문 수량</p>
                    <p className="text-foreground">{selectedParticipant.quantity}개</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">주문일</p>
                    <p className="text-foreground">
                      {new Date(selectedParticipant.orderDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">결제 금액</span>
                  <span className="text-xl font-bold text-primary">
                    {selectedParticipant.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
