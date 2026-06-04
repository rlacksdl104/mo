"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
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

// 판매자 정보
const sellerInfo = {
  name: "김영농",
  storeName: "푸른농장 직거래",
  email: "farmer@example.com",
  profileImage: "",
}

// Mock product data
const mockProducts: Record<string, {
  id: string
  title: string
  imageUrl: string
  category: string
  status: string
  currentParticipants: number
  targetParticipants: number
  discountPrice: number
  totalSales: number
}> = {
  "1": {
    id: "1",
    title: "고효율 복합비료 20kg - 질소/인산/칼륨 균형",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=60",
    category: "비료/퇴비",
    status: "진행중",
    currentParticipants: 78,
    targetParticipants: 100,
    discountPrice: 28000,
    totalSales: 2184000,
  },
  "2": {
    id: "2",
    title: "프리미엄 토마토 종자 1000립 - 고당도 품종",
    imageUrl: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&auto=format&fit=crop&q=60",
    category: "종자/모종",
    status: "마감",
    currentParticipants: 50,
    targetParticipants: 50,
    discountPrice: 52000,
    totalSales: 2600000,
  },
  "3": {
    id: "3",
    title: "충전식 전동 분무기 20L - 농약살포용",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=60",
    category: "농기계/장비",
    status: "진행중",
    currentParticipants: 32,
    targetParticipants: 40,
    discountPrice: 125000,
    totalSales: 4000000,
  },
}

// Mock participants data by product
const mockParticipantsByProduct: Record<string, Array<{
  id: string
  buyerName: string
  buyerPhone: string
  buyerEmail: string
  quantity: number
  totalPrice: number
  address: string
  orderDate: string
  status: string
}>> = {
  "1": [
    {
      id: "p1",
      buyerName: "김철수",
      buyerPhone: "010-1234-5678",
      buyerEmail: "chulsoo@email.com",
      quantity: 2,
      totalPrice: 56000,
      address: "경기도 이천시 모가면 농업로 123",
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "결제완료",
    },
    {
      id: "p2",
      buyerName: "이영희",
      buyerPhone: "010-2345-6789",
      buyerEmail: "younghee@email.com",
      quantity: 3,
      totalPrice: 84000,
      address: "충청남도 논산시 강경읍 농협로 456",
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "결제완료",
    },
    {
      id: "p3",
      buyerName: "박민수",
      buyerPhone: "010-3456-7890",
      buyerEmail: "minsu@email.com",
      quantity: 1,
      totalPrice: 28000,
      address: "전라북도 김제시 금산면 벼루로 789",
      orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "배송중",
    },
    {
      id: "p6",
      buyerName: "강미정",
      buyerPhone: "010-6789-0123",
      buyerEmail: "mijeong@email.com",
      quantity: 2,
      totalPrice: 56000,
      address: "경상남도 밀양시 삼랑진읍 농원로 111",
      orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "배송완료",
    },
  ],
  "2": [
    {
      id: "p4",
      buyerName: "정수현",
      buyerPhone: "010-4567-8901",
      buyerEmail: "suhyun@email.com",
      quantity: 2,
      totalPrice: 104000,
      address: "경상북도 상주시 함창읍 농원로 321",
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "배송완료",
    },
    {
      id: "p7",
      buyerName: "윤서연",
      buyerPhone: "010-7890-1234",
      buyerEmail: "seoyeon@email.com",
      quantity: 1,
      totalPrice: 52000,
      address: "전라남도 나주시 금천면 과일로 222",
      orderDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      status: "배송완료",
    },
  ],
  "3": [
    {
      id: "p5",
      buyerName: "최지훈",
      buyerPhone: "010-5678-9012",
      buyerEmail: "jihoon@email.com",
      quantity: 1,
      totalPrice: 125000,
      address: "강원도 횡성군 청일면 농기로 654",
      orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "결제완료",
    },
    {
      id: "p8",
      buyerName: "임동현",
      buyerPhone: "010-8901-2345",
      buyerEmail: "donghyun@email.com",
      quantity: 1,
      totalPrice: 125000,
      address: "충청북도 충주시 앙성면 농업로 333",
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "결제완료",
    },
  ],
}

export default function ProductParticipantsPage() {
  const params = useParams()
  const productId = params.id as string
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedParticipant, setSelectedParticipant] = useState<typeof mockParticipantsByProduct["1"][0] | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const product = mockProducts[productId]
  const participants = mockParticipantsByProduct[productId] || []

  const filteredParticipants = participants.filter(p =>
    p.buyerName.includes(searchQuery) ||
    p.buyerPhone.includes(searchQuery) ||
    p.address.includes(searchQuery)
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
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sellerInfo.profileImage} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {sellerInfo.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{sellerInfo.name}</span>
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
