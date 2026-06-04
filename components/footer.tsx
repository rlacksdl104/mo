"use client"

import Link from "next/link"


export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary">모아</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              청년을 위한 공동구매 플랫폼
              <br />
              함께 모여서 더 저렴하게
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">진행중인 공구</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">카테고리</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">이용방법</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">자주 묻는 질문</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">판매자</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">판매자 신청</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">판매자 가이드</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">수수료 안내</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">판매자 센터</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">공지사항</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">1:1 문의</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">이용약관</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 모아. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>고객센터: 1234-5678</span>
            <span>평일 09:00 - 18:00</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
