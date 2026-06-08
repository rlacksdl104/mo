"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createGroupPurchase } from "@/lib/api"
import { ArrowLeft, ImagePlus, X, Plus, Info } from "lucide-react"

const categories = [
  { value: "FRUIT", label: "과일" },
  { value: "VEGETABLE", label: "채소" },
  { value: "GRAIN", label: "곡물" },
  { value: "MEAT", label: "육류" },
  { value: "SEAFOOD", label: "수산물" },
  { value: "OTHER", label: "기타" },
]

interface PriceTier {
  minParticipants: number
  price: number
}

interface ImageItem {
  file: File
  previewUrl: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [images, setImages] = useState<ImageItem[]>([])
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([
    { minParticipants: 10, price: 0 },
    { minParticipants: 30, price: 0 },
    { minParticipants: 50, price: 0 },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    originalPrice: "",
    targetParticipants: "",
    minParticipants: "",
    endDate: "",
    stock: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - images.length)
      const newImages = newFiles.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addPriceTier = () => {
    if (priceTiers.length < 5) {
      setPriceTiers((prev) => [...prev, { minParticipants: 0, price: 0 }])
    }
  }

  const removePriceTier = (index: number) => {
    if (priceTiers.length > 1) {
      setPriceTiers((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const updatePriceTier = (index: number, field: keyof PriceTier, value: number) => {
    setPriceTiers((prev) =>
      prev.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.category || !formData.description) {
      setErrorMessage("필수 항목을 모두 입력해주세요.")
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const payload = new FormData()
      const data = {
        title: formData.title,
        category: formData.category,
        content: formData.description,
        basePrice: parseInt(formData.originalPrice || "0", 10),
        targetCount: parseInt(formData.targetParticipants || "0", 10),
        deadline: new Date(formData.endDate).toISOString(),
        discountTiers: priceTiers.map((tier) => ({
          requiredCount: tier.minParticipants,
          discountPrice: tier.price,
        })),
      }

      payload.append("data", JSON.stringify(data))
      images.forEach((image) => {
        payload.append("image", image.file)
      })

      // Debug: confirm image files are appended to FormData
      console.log("그룹구매 등록 FormData entries:")
      for (const [key, value] of payload.entries()) {
        if (value instanceof File) {
          console.log(key, value.name, value.type, value.size)
        } else {
          console.log(key, value)
        }
      }

      await createGroupPurchase(payload)
      router.push("/mypage/seller")
    } catch (err: any) {
      setErrorMessage(err?.message || "상품 등록 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/mypage/seller">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">새 공구 등록</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 상품 이미지 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">상품 이미지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative h-24 w-24 rounded-lg overflow-hidden border border-border">
                    <img src={image.previewUrl} alt={`상품 이미지 ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 h-5 w-5 bg-black/50 rounded-full flex items-center justify-center"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs text-center py-0.5">
                        대표
                      </span>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">추가</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                최대 5장까지 등록 가능합니다. 첫 번째 이미지가 대표 이미지로 사용됩니다.
              </p>
            </CardContent>
          </Card>

          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">상품명 *</Label>
                <Input
                  id="title"
                  placeholder="상품명을 입력하세요"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">상품 설명 *</Label>
                <Textarea
                  id="description"
                  placeholder="상품에 대한 상세한 설명을 입력하세요"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* 가격 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                가격 설정
                <span className="text-sm font-normal text-muted-foreground">
                  (인원별 할인가)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">정가 (원) *</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>인원별 할인가</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPriceTier}
                    disabled={priceTiers.length >= 5}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    단계 추가
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  {priceTiers.map((tier, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="0"
                          value={tier.minParticipants || ""}
                          onChange={(e) => updatePriceTier(index, "minParticipants", parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">명 이상</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="0"
                          value={tier.price || ""}
                          onChange={(e) => updatePriceTier(index, "price", parseInt(e.target.value) || 0)}
                        />
                        <span className="text-sm text-muted-foreground">원</span>
                      </div>
                      {priceTiers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePriceTier(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>참여 인원이 늘어날수록 더 저렴한 가격이 적용됩니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 공구 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">공구 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetParticipants">목표 인원 *</Label>
                  <Input
                    id="targetParticipants"
                    type="number"
                    placeholder="100"
                    value={formData.targetParticipants}
                    onChange={(e) => setFormData({ ...formData, targetParticipants: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minParticipants">최소 인원 *</Label>
                  <Input
                    id="minParticipants"
                    type="number"
                    placeholder="10"
                    value={formData.minParticipants}
                    onChange={(e) => setFormData({ ...formData, minParticipants: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">마감일 *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">재고 수량 *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>마감일까지 최소 인원이 모이지 않으면 공구가 자동 취소되며, 모든 참여자에게 환불됩니다.</p>
              </div>
            </CardContent>
          </Card>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/mypage/seller">취소</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "공구 등록하기"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
