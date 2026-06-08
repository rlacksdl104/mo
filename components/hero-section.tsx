"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingDown, Users, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.08),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" />
            청년을 위한 스마트한 소비
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
            함께 모여서
            <span className="text-primary block mt-2">더 저렴하게</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            20~30대 청년을 위한 공동구매 플랫폼. 
            생활용품부터 전자기기, 취미·문화 상품까지 함께 구매하고 최대 50% 할인받으세요.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/products">
                공구 둘러보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              판매자 신청하기
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">12,000+</span>
              <span className="text-sm text-muted-foreground">참여 청년</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">평균 35%</span>
              <span className="text-sm text-muted-foreground">할인율</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">500+</span>
              <span className="text-sm text-muted-foreground">성사된 공구</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
