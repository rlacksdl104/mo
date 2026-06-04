"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tractor, Leaf, Sprout, Bug, Package, Warehouse } from "lucide-react"

const categories = [
  {
    icon: Tractor,
    title: "농기계/장비",
    description: "트랙터, 경운기, 관리기 등",
    productCount: 32,
    color: "bg-chart-1",
  },
  {
    icon: Leaf,
    title: "비료/퇴비",
    description: "유기질, 복합비료, 퇴비 등",
    productCount: 45,
    color: "bg-chart-2",
  },
  {
    icon: Sprout,
    title: "종자/모종",
    description: "채소, 과일, 화훼 종자 등",
    productCount: 38,
    color: "bg-chart-3",
  },
  {
    icon: Bug,
    title: "농약/방제",
    description: "살충제, 살균제, 제초제 등",
    productCount: 28,
    color: "bg-chart-4",
  },
  {
    icon: Package,
    title: "포장/유통",
    description: "박스, 포장재, 라벨 등",
    productCount: 22,
    color: "bg-chart-5",
  },
  {
    icon: Warehouse,
    title: "시설자재",
    description: "비닐하우스, 관수시설 등",
    productCount: 18,
    color: "bg-primary",
  },
]

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            카테고리별 공구
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            다양한 카테고리에서 원하는 상품을 찾아보세요
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.title} 
              className="group cursor-pointer hover:shadow-md transition-all duration-300 hover:border-primary/30"
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <span className="text-sm font-medium text-primary">
                  {category.productCount}개 공구 중
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
