"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      await login({ email, password })
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

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
            함께 모여서
            <br />더 저렴하게
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            청년을 위한 공동구매 플랫폼
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-lg font-semibold">1</span>
              </div>
              <span>원하는 상품의 공동구매에 참여하세요</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-lg font-semibold">2</span>
              </div>
              <span>목표 인원이 달성되면 할인가로 구매!</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-lg font-semibold">3</span>
              </div>
              <span>평균 25% 할인된 가격으로 득템하세요</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">모아</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">로그인</h2>
            <p className="text-muted-foreground">
              계정에 로그인하여 공동구매에 참여하세요
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  로그인 상태 유지
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                비밀번호 찾기
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            아직 계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
