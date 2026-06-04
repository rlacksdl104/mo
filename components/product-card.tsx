"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface ProductCardProps {
  id: string
  title: string
  originalPrice: number
  discountPrice: number
  currentParticipants: number
  targetParticipants: number
  imageUrl: string
  category: string
  endDate: string
}

export function ProductCard({
  id,
  title,
  originalPrice,
  discountPrice,
  currentParticipants,
  targetParticipants,
  imageUrl,
  category,
  endDate,
}: ProductCardProps) {
  const [participants, setParticipants] = useState(currentParticipants)
  const progress = Math.min((participants / targetParticipants) * 100, 100)
  const discountPercent = Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
  
  const [timeLeft, setTimeLeft] = useState("")
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const diff = end - now
      
      if (diff <= 0) {
        setTimeLeft("마감")
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      if (days > 0) {
        setTimeLeft(`${days}일 ${hours}시간`)
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}시간 ${minutes}분`)
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [endDate])

  // Simulate real-time participant updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && participants < targetParticipants) {
        setParticipants(prev => Math.min(prev + 1, targetParticipants))
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [participants, targetParticipants])

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
            {discountPercent}% 할인
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-card/90 backdrop-blur text-foreground rounded-md">
            {category}
          </span>
        </div>
        {progress >= 100 && (
          <div className="absolute inset-0 bg-primary/90 flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">목표 달성!</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-primary">
            {discountPrice.toLocaleString()}원
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {originalPrice.toLocaleString()}원
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                <span className="font-medium text-foreground">{participants}</span>
                /{targetParticipants}명
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-4" disabled={progress >= 100} asChild={progress < 100}>
          {progress >= 100 ? (
            "마감됨"
          ) : (
            <Link href={`/products/${id}`}>참여하기</Link>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
