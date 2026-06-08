"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  getGroupPurchaseList, 
  getCategories, 
  GroupPurchaseListResponse, 
  CategoryResponse 
} from "@/lib/api"
import { Search, Clock, Users, SlidersHorizontal, X, Loader2 } from "lucide-react"

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  "FRUIT": "과일",
  "VEGETABLE": "채소",
  "GRAIN": "곡물",
  "MEAT": "육류",
  "SEAFOOD": "수산물",
  "OTHER": "기타",
}

function ProductCard({ product }: { product: GroupPurchaseListResponse }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const seconds = product.remainingSeconds
      
      if (seconds <= 0) {
        setTimeLeft("마감")
        return
      }

      const days = Math.floor(seconds / (60 * 60 * 24))
      const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))

      if (days > 0) {
        setTimeLeft(`${days}일 ${hours}시간`)
      } else {
        const minutes = Math.floor((seconds % (60 * 60)) / 60)
        setTimeLeft(`${hours}시간 ${minutes}분`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [product.remainingSeconds])

  const categoryDisplayName = CATEGORY_DISPLAY_NAMES[product.category] || product.category

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.thumbnailUrl || "https://via.placeholder.com/400x300"}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
              {product.discountRate}% 할인
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-card/90 backdrop-blur text-foreground rounded-md">
              {categoryDisplayName}
            </span>
          </div>
          {product.status === "COMPLETED" && (
            <div className="absolute inset-0 bg-primary/90 flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">모집 완료!</span>
            </div>
          )}
          {product.status === "CANCELLED" && (
            <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center">
              <span className="text-xl font-bold text-destructive-foreground">취소됨</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-primary">
              {product.currentPrice.toLocaleString()}원
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {product.basePrice.toLocaleString()}원
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  <span className="font-medium text-foreground">{product.currentCount}</span>명 참여중
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{timeLeft}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<GroupPurchaseListResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"LATEST" | "DISCOUNT_RATE" | "POPULARITY">("LATEST")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await getGroupPurchaseList(selectedCategory || undefined, sortBy)
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "상품 목록을 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, sortBy])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error("카테고리 로드 실패:", err)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              진행중인 공구
            </h1>
            <p className="text-muted-foreground mb-8">
              함께 구매하고 더 저렴하게! 원하는 상품을 찾아보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="상품명으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                className="gap-2 sm:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                필터
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside
                className={`lg:w-64 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
              >
                <div>
                  <h3 className="font-semibold text-foreground mb-3">카테고리</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === ""
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      전체
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.category}
                        onClick={() => setSelectedCategory(category.category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.category
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {category.displayName} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">정렬</h3>
                  <div className="space-y-2">
                    {[
                      { value: "LATEST" as const, label: "최신순" },
                      { value: "DISCOUNT_RATE" as const, label: "할인율순" },
                      { value: "POPULARITY" as const, label: "인기순" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          sortBy === option.value
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    총 <span className="font-medium text-foreground">{filteredProducts.length}</span>개의 상품
                  </p>
                  <div className="hidden sm:flex gap-2">
                    {[
                      { value: "LATEST" as const, label: "최신순" },
                      { value: "DISCOUNT_RATE" as const, label: "할인율순" },
                      { value: "POPULARITY" as const, label: "인기순" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-destructive text-lg mb-4">{error}</p>
                    <Button variant="outline" onClick={fetchProducts}>
                      다시 시도
                    </Button>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                      검색 결과가 없습니다.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("")
                      }}
                    >
                      필터 초기화
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
