"use client"

import { useState, Suspense, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  getGroupPurchaseDetail, 
  paymentReady, 
  paymentVerify,
  GroupPurchaseDetailResponse 
} from "@/lib/api"

const PORTONE_CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-18215079-1fd1-4a4a-88c9-dd3a2a1c2222"
import { useAuth } from "@/lib/auth-context"
import {
  ChevronLeft,
  Check,
  Minus,
  Plus,
  Search,
  Users,
  Loader2,
} from "lucide-react"

declare global {
  interface Window {
    IMP?: {
      init: (merchantId: string) => void
      request_pay: (
        options: {
          pg: string
          pay_method: string
          merchant_uid: string
          name: string
          amount: number
          buyer_email?: string
          buyer_name?: string
          buyer_tel?: string
          buyer_addr?: string
        },
        callback: (response: {
          success: boolean
          imp_uid?: string
          merchant_uid?: string
          error_msg?: string
        }) => void
      ) => void
    }
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string
          roadAddress: string
          jibunAddress: string
          bname: string
          buildingName: string
          apartment: string
        }) => void
      }) => { open: () => void }
    }
  }
}

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  "FRUIT": "과일",
  "VEGETABLE": "채소",
  "GRAIN": "곡물",
  "MEAT": "육류",
  "SEAFOOD": "수산물",
  "OTHER": "기타",
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const initialQuantity = parseInt(searchParams.get("quantity") || "1")
  const { isLoggedIn, isInitializing, user } = useAuth()

  const [product, setProduct] = useState<GroupPurchaseDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [quantity, setQuantity] = useState(initialQuantity)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // 배송지 정보
  const [shippingInfo, setShippingInfo] = useState({
    receiverName: "",
    receiverPhone: "",
    zipCode: "",
    address: "",
    addressDetail: "",
    isSameAsOrderer: false,
  })

  // 약관 동의
  const [agreements, setAgreements] = useState({
    paymentTerms: false,
    privacyTerms: false,
    allAgree: false,
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchProduct = useCallback(async () => {
    if (!productId) return
    try {
      setIsLoading(true)
      const data = await getGroupPurchaseDetail(Number(productId))
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "상품 정보를 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (isInitializing) {
      return
    }
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    fetchProduct()
  }, [isInitializing, isLoggedIn, router, fetchProduct])

  useEffect(() => {
    const initializeImp = () => {
      if (typeof window === "undefined" || !window.IMP) return
      try {
        window.IMP.init(PORTONE_CHANNEL_KEY)
        console.log("PortOne initialized with channel key", PORTONE_CHANNEL_KEY)
      } catch (error) {
        console.warn("PortOne init failed:", error)
      }
    }

    initializeImp()
    const checkInterval = window.setInterval(() => {
      if (typeof window !== "undefined" && window.IMP) {
        initializeImp()
        window.clearInterval(checkInterval)
      }
    }, 500)

    return () => {
      window.clearInterval(checkInterval)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "상품 정보를 찾을 수 없습니다"}
            </h1>
            <Button asChild>
              <Link href="/products">상품 목록으로</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 수량 조절
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)))
  }

  // 배송지 정보 변경
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // 주문자 정보와 동일
  const handleSameAsOrderer = (checked: boolean) => {
    setShippingInfo((prev) => ({
      ...prev,
      isSameAsOrderer: checked,
      receiverName: checked ? (user?.name || "") : "",
      receiverPhone: "",
    }))
  }

  // 전체 동의
  const handleAllAgree = (checked: boolean) => {
    setAgreements({
      paymentTerms: checked,
      privacyTerms: checked,
      allAgree: checked,
    })
  }

  // 개별 동의
  const handleAgreementChange = (key: "paymentTerms" | "privacyTerms", checked: boolean) => {
    const newAgreements = { ...agreements, [key]: checked }
    newAgreements.allAgree = newAgreements.paymentTerms && newAgreements.privacyTerms
    setAgreements(newAgreements)
  }

  // 주소 검색 (다음 주소 API 연동)
  const handleAddressSearch = () => {
    if (typeof window === "undefined" || !window.daum) return
    
    new window.daum.Postcode({
      oncomplete: function(data) {
        let fullAddress = data.roadAddress
        let extraAddress = ""

        if (data.bname !== "") {
          extraAddress += data.bname
        }
        if (data.buildingName !== "") {
          extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName
        }
        if (extraAddress !== "") {
          fullAddress += ` (${extraAddress})`
        }

        setShippingInfo((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          address: fullAddress,
        }))
      },
    }).open()
  }

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!shippingInfo.receiverName.trim()) newErrors.receiverName = "받는 분 이름을 입력해주세요"
    if (!shippingInfo.receiverPhone.trim()) newErrors.receiverPhone = "연락처를 입력해주세요"
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "우편번호를 입력해주세요"
    if (!shippingInfo.address.trim()) newErrors.address = "주소를 입력해주세요"
    if (!agreements.paymentTerms) newErrors.paymentTerms = "결제 대행 서비스 이용약관에 동의해주세요"
    if (!agreements.privacyTerms) newErrors.privacyTerms = "개인정보 제3자 제공에 동의해주세요"

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 결제하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)
    setError("")

    try {
      // 배송지 주소 조합
      const fullShippingAddress = `${shippingInfo.address} ${shippingInfo.addressDetail}`.trim()

      // 1. 결제 준비 API 호출
      const readyResponse = await paymentReady(product.id, {
        quantity,
        shippingAddress: fullShippingAddress,
      })

      // 2. 아임포트 결제창 호출
      if (typeof window !== "undefined" && window.IMP) {
        window.IMP.request_pay(
          {
            pg: "kakaopay",
            pay_method: "card",
            merchant_uid: readyResponse.merchantUid,
            name: product.title,
            amount: readyResponse.amount,
            buyer_name: shippingInfo.receiverName,
            buyer_tel: shippingInfo.receiverPhone,
            buyer_addr: fullShippingAddress,
          },
          async (response) => {
            if (response.success && response.imp_uid && response.merchant_uid) {
              try {
                // 3. 결제 검증 API 호출
                await paymentVerify({
                  impUid: response.imp_uid,
                  merchantUid: response.merchant_uid,
                })
                setIsComplete(true)
              } catch (verifyError) {
                setError(verifyError instanceof Error ? verifyError.message : "결제 검증에 실패했습니다.")
              }
            } else {
              setError(response.error_msg || "결제가 취소되었습니다.")
            }
            setIsProcessing(false)
          }
        )
      } else {
        // Iamport SDK 로드 실패시 - 데모용으로 바로 완료 처리
        console.log("[v0] Iamport SDK not loaded, simulating payment success")
        setIsComplete(true)
        setIsProcessing(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다.")
      setIsProcessing(false)
    }
  }

  // 금액 계산
  const unitPrice = product.currentPrice
  const totalPrice = unitPrice * quantity
  const deliveryFee = totalPrice >= 50000 ? 0 : 3000
  const finalPrice = totalPrice + deliveryFee
  const discountRate = Math.round((1 - product.currentPrice / product.basePrice) * 100)
  const categoryDisplayName = CATEGORY_DISPLAY_NAMES[product.category] || product.category

  // 결제 완료 화면
  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto px-4 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              공구 참여 완료!
            </h1>
            <p className="text-muted-foreground mb-8">
              결제가 완료되었습니다.
              <br />
              진행 상황은 마이페이지에서 확인하실 수 있습니다.
            </p>

            <Card className="mb-6 text-left">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">주문 상품</span>
                  <span className="font-medium text-foreground">{product.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수량</span>
                  <span className="font-medium text-foreground">{quantity}개</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">결제 금액</span>
                  <span className="font-bold text-primary">
                    {finalPrice.toLocaleString()}원
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/products">계속 둘러보기</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/mypage">마이페이지</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* 뒤로가기 */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            뒤로가기
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            공구 참여하기
          </h1>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. 주문 상품 정보 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">주문 상품</h2>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.thumbnailUrl || "https://via.placeholder.com/200"}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                      {categoryDisplayName}
                    </span>
                    <h3 className="font-medium text-foreground line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-primary">
                        {product.currentPrice.toLocaleString()}원
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.basePrice.toLocaleString()}원
                      </span>
                      <span className="text-sm font-medium text-destructive">
                        {discountRate}% 할인
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>현재 {product.currentCount}명 참여중</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. 주문자 정보 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">주문자 정보</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">이름</span>
                    <span className="font-medium text-foreground">{user?.name || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. 배송지 정보 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">배송지 정보</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={shippingInfo.isSameAsOrderer}
                      onCheckedChange={(checked) => handleSameAsOrderer(checked as boolean)}
                    />
                    <span className="text-sm text-muted-foreground">주문자 정보와 동일</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="receiverName">
                        받는 분 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="receiverName"
                        name="receiverName"
                        value={shippingInfo.receiverName}
                        onChange={handleShippingChange}
                        placeholder="받는 분 이름"
                      />
                      {formErrors.receiverName && (
                        <p className="text-sm text-destructive">{formErrors.receiverName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiverPhone">
                        연락처 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="receiverPhone"
                        name="receiverPhone"
                        value={shippingInfo.receiverPhone}
                        onChange={handleShippingChange}
                        placeholder="010-0000-0000"
                      />
                      {formErrors.receiverPhone && (
                        <p className="text-sm text-destructive">{formErrors.receiverPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">
                      주소 <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        placeholder="우편번호"
                        className="w-32"
                        readOnly
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddressSearch}
                        className="gap-2"
                      >
                        <Search className="h-4 w-4" />
                        주소 검색
                      </Button>
                    </div>
                    {formErrors.zipCode && (
                      <p className="text-sm text-destructive">{formErrors.zipCode}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      placeholder="도로명 주소"
                      readOnly
                    />
                    {formErrors.address && (
                      <p className="text-sm text-destructive">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      id="addressDetail"
                      name="addressDetail"
                      value={shippingInfo.addressDetail}
                      onChange={handleShippingChange}
                      placeholder="상세 주소 (동/호수 등)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. 수량 선택 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">수량 선택</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-foreground">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 99}
                        className="p-3 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-muted-foreground">
                      {unitPrice.toLocaleString()}원 x {quantity}개
                    </span>
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 5. 최종 결제 금액 */}
            <Card className="border-primary">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">최종 결제 금액</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">상품 금액</span>
                    <span className="text-foreground">{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">배송비</span>
                    <span className="text-foreground">
                      {deliveryFee === 0 ? "무료" : `${deliveryFee.toLocaleString()}원`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      * 50,000원 이상 구매 시 무료배송
                    </p>
                  )}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">총 결제 금액</span>
                      <span className="text-2xl font-bold text-primary">
                        {finalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg mt-4">
                    <p className="text-sm text-primary">
                      현재 {product.currentCount}명이 참여중이며, {discountRate}% 할인가가 적용되었습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. 약관 동의 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">약관 동의</h2>
                <div className="space-y-4">
                  {/* 전체 동의 */}
                  <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer">
                    <Checkbox
                      checked={agreements.allAgree}
                      onCheckedChange={(checked) => handleAllAgree(checked as boolean)}
                    />
                    <span className="font-medium text-foreground">전체 동의</span>
                  </label>

                  <div className="space-y-3 pl-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        checked={agreements.paymentTerms}
                        onCheckedChange={(checked) => handleAgreementChange("paymentTerms", checked as boolean)}
                      />
                      <div>
                        <span className="text-sm text-foreground">
                          <span className="text-destructive">[필수]</span> 결제 대행 서비스 이용약관 동의
                        </span>
                        {formErrors.paymentTerms && (
                          <p className="text-sm text-destructive mt-1">{formErrors.paymentTerms}</p>
                        )}
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        checked={agreements.privacyTerms}
                        onCheckedChange={(checked) => handleAgreementChange("privacyTerms", checked as boolean)}
                      />
                      <div>
                        <span className="text-sm text-foreground">
                          <span className="text-destructive">[필수]</span> 개인정보 제3자 제공 동의
                        </span>
                        {formErrors.privacyTerms && (
                          <p className="text-sm text-destructive mt-1">{formErrors.privacyTerms}</p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 결제 버튼 */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  결제 처리 중...
                </>
              ) : (
                `${finalPrice.toLocaleString()}원 결제하기`
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              공구가 성사되지 않을 경우 전액 환불됩니다.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
