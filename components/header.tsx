"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const router = useRouter()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">모아</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            공구 둘러보기
          </Link>
          <button 
            onClick={() => scrollToSection("categories")} 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            카테고리
          </button>
          <button 
            onClick={() => scrollToSection("how-it-works")} 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            이용방법
          </button>
          {isLoggedIn && (
            <Link 
              href={isAdmin ? "/mypage/seller" : "/mypage"} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              마이페이지
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name || "사용자"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? "/mypage/seller" : "/mypage"}>
                    마이페이지
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/mypage/seller/products/new">
                      공동구매 등록
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">회원가입</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              공구 둘러보기
            </Link>
            <button 
              onClick={() => scrollToSection("categories")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground text-left"
            >
              카테고리
            </button>
            <button 
              onClick={() => scrollToSection("how-it-works")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground text-left"
            >
              이용방법
            </button>
            {isLoggedIn && (
              <Link 
                href={isAdmin ? "/mypage/seller" : "/mypage"} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                마이페이지
              </Link>
            )}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {isLoggedIn ? (
                <>
                  <div className="text-sm text-muted-foreground px-2 py-1">
                    {user?.name || "사용자"}님
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                    <Link href="/login">로그인</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/signup">회원가입</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
