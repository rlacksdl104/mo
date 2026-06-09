import React, { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

import ClientResult from "./ClientResult"

export default function CheckoutResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl">
          <Card>
            <CardContent className="p-8">
              <Suspense fallback={<div className="text-center">로딩...</div>}>
                <ClientResult />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
