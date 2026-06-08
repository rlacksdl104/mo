"use client"

import { Search, UserPlus, CreditCard, Package } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "원하는 상품 찾기",
    description: "다양한 카테고리에서 할인된 가격의 공동구매 상품을 둘러보세요.",
  },
  {
    icon: UserPlus,
    step: "02",
    title: "공구 참여하기",
    description: "마음에 드는 상품의 공구에 참여하고 목표 인원 달성을 기다리세요.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "자동 결제",
    description: "목표 인원이 달성되면 등록된 결제 수단으로 자동 결제가 진행됩니다.",
  },
  {
    icon: Package,
    step: "04",
    title: "배송 받기",
    description: "결제 완료 후 상품이 배송됩니다. 실시간으로 배송 현황을 확인하세요.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이용방법
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            간단한 4단계로 공동구매에 참여하세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
