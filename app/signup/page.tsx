"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Check, Store } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignupPage() {
  const router = useRouter()
  const { signup, adminSignup } = useAuth()
  const [signupType, setSignupType] = useState<"user" | "admin">("user")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
    farmName: "",
  })
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
    })
  }

  const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
    const newAgreements = { ...agreements, [key]: checked }
    newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.marketing
    setAgreements(newAgreements)
  }

  const passwordStrength = () => {
    const { password } = formData
    if (!password) return { level: 0, text: "", color: "" }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 1) return { level: 1, text: "약함", color: "bg-destructive" }
    if (strength === 2) return { level: 2, text: "보통", color: "bg-yellow-500" }
    if (strength === 3) return { level: 3, text: "강함", color: "bg-accent" }
    return { level: 4, text: "매우 강함", color: "bg-green-500" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    if (formData.password.length < 8 || formData.password.length > 20) {
      setError("비밀번호는 8~20자 사이여야 합니다.")
      return
    }
    if (formData.name.length < 2 || formData.name.length > 20) {
      setError("이름은 2~20자 사이여야 합니다.")
      return
    }
    if (!agreements.terms || !agreements.privacy) {
      setError("필수 약관에 동의해주세요.")
      return
    }
    
    setIsLoading(true)
    
    try {
      if (signupType === "admin") {
        if (!formData.adminKey) {
          setError("관리자 키를 입력해주세요.")
          setIsLoading(false)
          return
        }
        if (formData.farmName.length < 2 || formData.farmName.length > 20) {
          setError("농장/업체명은 2~20자 사이여야 합니다.")
          setIsLoading(false)
          return
        }
        await adminSignup({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          adminKey: formData.adminKey,
          farmName: formData.farmName,
        })
      } else {
        await signup({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        })
      }
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-background flex">
      {/* 왼쪽 브랜딩 섹션 */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="mb-8">
            <span className="text-4xl font-bold text-primary-foreground">모아</span>
          </Link>
          <h1 className="text-3xl xl:text-4xl font-bold text-primary-foreground mb-4 text-balance">
            지금 가입하고
            <br />혜택을 누리세요
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-12">
            청년을 위한 공동구매 플랫폼
          </p>
          
          <div className="space-y-6">
            <div className="bg-primary-foreground/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-primary-foreground">신규 가입 혜택</span>
              </div>
              <p className="text-primary-foreground/80 text-sm pl-11">
                첫 구매 시 5,000원 할인 쿠폰 즉시 지급
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-primary-foreground">매월 적립금</span>
              </div>
              <p className="text-primary-foreground/80 text-sm pl-11">
                공동구매 참여 시 구매금액의 1% 적립
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-primary-foreground">알림 서비스</span>
              </div>
              <p className="text-primary-foreground/80 text-sm pl-11">
                관심 카테고리 신규 공구 알림 제공
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 회원가입 폼 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">모아</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">회원가입</h2>
            <p className="text-muted-foreground">
              모아와 함께 스마트한 소비를 시작하세요
            </p>
          </div>

          <Tabs value={signupType} onValueChange={(v) => setSignupType(v as "user" | "admin")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                일반 회원
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                판매자
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동 (2~20자)"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 h-12"
                  required
                  minLength={2}
                  maxLength={20}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {signupType === "admin" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="farmName" className="text-sm font-medium text-foreground">
                    농장/업체명
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="farmName"
                      name="farmName"
                      type="text"
                      placeholder="농장/업체명 (2~20자)"
                      value={formData.farmName}
                      onChange={handleInputChange}
                      className="pl-10 h-12"
                      required
                      minLength={2}
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="adminKey" className="text-sm font-medium text-foreground">
                    관리자 키
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="adminKey"
                      name="adminKey"
                      type="password"
                      placeholder="관리자 인증 키"
                      value={formData.adminKey}
                      onChange={handleInputChange}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    판매자 등록을 위한 인증 키를 입력해주세요
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8~20자"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12"
                  required
                  minLength={8}
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= strength.level ? strength.color : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    비밀번호 강도: <span className="font-medium">{strength.text}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-destructive">비밀번호가 일치하지 않습니다</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-600">비밀번호가 일치합니다</p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Checkbox
                  id="all"
                  checked={agreements.all}
                  onCheckedChange={(checked) => handleAllAgreement(checked as boolean)}
                />
                <label htmlFor="all" className="text-sm font-medium text-foreground cursor-pointer">
                  전체 동의
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={agreements.terms}
                  onCheckedChange={(checked) => handleAgreementChange("terms", checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer flex-1">
                  <span className="text-destructive">[필수]</span> 이용약관 동의
                </label>
                <Link href="#" className="text-xs text-primary hover:underline">보기</Link>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="privacy"
                  checked={agreements.privacy}
                  onCheckedChange={(checked) => handleAgreementChange("privacy", checked as boolean)}
                />
                <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer flex-1">
                  <span className="text-destructive">[필수]</span> 개인정보 수집 및 이용 동의
                </label>
                <Link href="#" className="text-xs text-primary hover:underline">보기</Link>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="marketing"
                  checked={agreements.marketing}
                  onCheckedChange={(checked) => handleAgreementChange("marketing", checked as boolean)}
                />
                <label htmlFor="marketing" className="text-sm text-muted-foreground cursor-pointer flex-1">
                  <span className="text-muted-foreground">[선택]</span> 마케팅 정보 수신 동의
                </label>
                <Link href="#" className="text-xs text-primary hover:underline">보기</Link>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? "가입 중..." : signupType === "admin" ? "판매자 가입" : "회원가입"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
