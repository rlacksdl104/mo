"use client"

import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const products = [
  {
    id: "1",
    title: "프리미엄 무선 이어폰 - 노이즈캔슬링 & 30시간 재생",
    originalPrice: 89000,
    discountPrice: 52000,
    currentParticipants: 45,
    targetParticipants: 50,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60",
    category: "전자기기",
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "친환경 세탁세제 대용량 패키지 (4L x 3개)",
    originalPrice: 45000,
    discountPrice: 28000,
    currentParticipants: 78,
    targetParticipants: 100,
    imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=60",
    category: "생활용품",
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "인기 보드게임 컬렉션 - 파티용 3종 세트",
    originalPrice: 75000,
    discountPrice: 45000,
    currentParticipants: 32,
    targetParticipants: 40,
    imageUrl: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800&auto=format&fit=crop&q=60",
    category: "취미/문화",
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "유기농 간편식 도시락 20팩 세트",
    originalPrice: 68000,
    discountPrice: 42000,
    currentParticipants: 120,
    targetParticipants: 150,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60",
    category: "생활용품",
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "고속 무선 충전기 + 케이블 세트",
    originalPrice: 55000,
    discountPrice: 32000,
    currentParticipants: 88,
    targetParticipants: 100,
    imageUrl: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800&auto=format&fit=crop&q=60",
    category: "전자기기",
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "베스트셀러 자기계발 도서 5권 세트",
    originalPrice: 85000,
    discountPrice: 48000,
    currentParticipants: 65,
    targetParticipants: 80,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60",
    category: "취미/문화",
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              진행중인 공구
            </h2>
            <p className="text-muted-foreground">
              실시간으로 참여 현황을 확인하고 함께 구매하세요
            </p>
          </div>
          <Button variant="outline" className="gap-2 w-fit" asChild>
            <Link href="/products">
              전체보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
