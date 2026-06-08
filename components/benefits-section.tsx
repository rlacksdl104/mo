"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Shield, Users, BarChart3, ArrowRight } from "lucide-react"

const buyerBenefits = [
  {
    icon: TrendingUp,
    title: "최대 50% 할인",
    description: "공동구매로 대량 할인 혜택을 받으세요",
  },
  {
    icon: Shield,
    title: "안전한 거래",
    description: "목표 미달성 시 자동 취소, 100% 환불 보장",
  },
  {
    icon: Users,
    title: "실시간 현황",
    description: "참여 인원과 마감 시간을 실시간으로 확인",
  },
]

const sellerBenefits = [
  {
    icon: BarChart3,
    title: "안정적 수익",
    description: "최소 수량 보장으로 예측 가능한 매출",
  },
  {
    icon: TrendingUp,
    title: "재고 회전율 증가",
    description: "대량 판매로 빠른 재고 회전",
  },
  {
    icon: Users,
    title: "신규 고객 확보",
    description: "청년층 타겟 마케팅 효과",
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              구매자 혜택
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              청년을 위한
              <br />
              스마트한 소비
            </h2>
            <p className="text-muted-foreground mb-8">
              생활비 부담을 줄이고 더 스마트하게 소비하세요. 
              공동구매로 개인 구매보다 최대 50% 저렴하게 구매할 수 있습니다.
            </p>
            <div className="space-y-4">
              {buyerBenefits.map((benefit) => (
                <Card key={benefit.title} className="border-border">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/50 px-3 py-1 text-sm font-medium text-accent-foreground mb-4">
              판매자 혜택
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              농민·중소판매자를 위한
              <br />
              안정적 판로
            </h2>
            <p className="text-muted-foreground mb-8">
              최소 판매 수량이 보장되어 안정적인 수익을 얻을 수 있습니다. 
              대량 판매로 재고 관리 효율성도 높아집니다.
            </p>
            <div className="space-y-4 mb-8">
              {sellerBenefits.map((benefit) => (
                <Card key={benefit.title} className="border-border">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/30">
                      <benefit.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="gap-2">
              판매자 신청하기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
