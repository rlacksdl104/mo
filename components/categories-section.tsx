"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tractor, Leaf, Sprout, Bug, Package, Warehouse } from "lucide-react"
import { getCategories, CategoryResponse } from "@/lib/api"

const categoryMeta = [
  {
    icon: Sprout,
    title: "과일",
    description: "과일 카테고리 상품",
    key: "FRUIT",
    color: "bg-chart-3",
  },
  {
    icon: Leaf,
    title: "채소",
    description: "채소 카테고리 상품",
    key: "VEGETABLE",
    color: "bg-chart-4",
  },
  {
    icon: Package,
    title: "곡물",
    description: "곡물 카테고리 상품",
    key: "GRAIN",
    color: "bg-chart-5",
  },
  {
    icon: Tractor,
    title: "육류",
    description: "육류 카테고리 상품",
    key: "MEAT",
    color: "bg-chart-1",
  },
  {
    icon: Bug,
    title: "수산물",
    description: "수산물 카테고리 상품",
    key: "SEAFOOD",
    color: "bg-chart-2",
  },
  {
    icon: Warehouse,
    title: "기타",
    description: "기타 카테고리 상품",
    key: "OTHER",
    color: "bg-primary",
  },
]

type CategoryItem = (typeof categoryMeta)[number] & { productCount: number }

export function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryItem[]>(
    categoryMeta.map((item) => ({ ...item, productCount: 0 }))
  )

  useEffect(() => {
    let isMounted = true

    getCategories()
      .then((data) => {
        if (!isMounted) return

        setCategories((prev) =>
          prev.map((item) => {
            const found = data.find((category) => category.category === item.key)
            return {
              ...item,
              productCount: found?.count ?? 0,
            }
          })
        )
      })
      .catch(() => {
        // 실패 시에는 기본값(0) 유지
      })

    return () => {
      isMounted = false
    }
  }, [])

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
