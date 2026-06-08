"use client"

import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const products: never[] = []

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
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            현재 진행중인 공구가 없습니다.
          </div>
        )}
      </div>
    </section>
  )
}
