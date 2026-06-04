// Mock Data Based API - No external server required

// Token management
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("accessToken")
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("refreshToken")
}

export function setTokens(accessToken: string, refreshToken: string, accessExp: string, refreshExp: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
  localStorage.setItem("accessExp", accessExp)
  localStorage.setItem("refreshExp", refreshExp)
}

export function clearTokens() {
  if (typeof window === "undefined") return
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("accessExp")
  localStorage.removeItem("refreshExp")
}

export function isLoggedIn(): boolean {
  const token = getAccessToken()
  if (!token) return false
  
  const expStr = typeof window !== "undefined" ? localStorage.getItem("accessExp") : null
  if (!expStr) return false
  
  const exp = new Date(expStr).getTime()
  return Date.now() < exp
}

// Types
export interface TokenResponse {
  accessToken: string
  accessExp: string
  refreshToken: string
  refreshExp: string
}

export interface SignupRequest {
  email: string
  name: string
  password: string
}

export interface AdminSignupRequest {
  email: string
  name: string
  password: string
  adminKey: string
  farmName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GroupPurchaseListResponse {
  id: number
  title: string
  category: "FRUIT" | "VEGETABLE" | "GRAIN" | "MEAT" | "SEAFOOD" | "OTHER"
  thumbnailUrl: string
  basePrice: number
  currentPrice: number
  discountRate: number
  currentCount: number
  remainingSeconds: number
  status: "RECRUITING" | "COMPLETED" | "CANCELLED"
}

export interface DiscountTierResponse {
  requiredCount: number
  discountPrice: number
}

export interface NextDiscountResponse {
  remainingCount: number
  nextPrice: number
}

export interface GroupPurchaseDetailResponse {
  id: number
  title: string
  category: "FRUIT" | "VEGETABLE" | "GRAIN" | "MEAT" | "SEAFOOD" | "OTHER"
  thumbnailUrl: string
  content: string
  basePrice: number
  currentPrice: number
  targetCount: number
  currentCount: number
  deadline: string
  remainingSeconds: number
  status: "RECRUITING" | "COMPLETED" | "CANCELLED"
  totalRevenue: number
  achievementRate: number
  ownerName: string
  isOwner: boolean
  isJoined: boolean
  discountTiers: DiscountTierResponse[]
  nextDiscount?: NextDiscountResponse
}

export interface CategoryResponse {
  category: "FRUIT" | "VEGETABLE" | "GRAIN" | "MEAT" | "SEAFOOD" | "OTHER"
  displayName: string
  count: number
}

export interface PaymentReadyRequest {
  quantity: number
  shippingAddress: string
}

export interface PaymentReadyResponse {
  merchantUid: string
  amount: number
}

export interface PaymentVerifyRequest {
  impUid: string
  merchantUid: string
}

export interface AdminMyPageResponse {
  name: string
  farmName?: string
  profileImageUrl?: string
  createdAt: string
}

// Mock Data
const mockGroupPurchases: GroupPurchaseListResponse[] = [
  {
    id: 1,
    title: "제주 감귤 5kg - 산지직송 신선 과일",
    category: "FRUIT",
    thumbnailUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=60",
    basePrice: 35000,
    currentPrice: 25000,
    discountRate: 29,
    currentCount: 78,
    remainingSeconds: 5 * 24 * 60 * 60,
    status: "RECRUITING",
  },
  {
    id: 2,
    title: "유기농 토마토 2kg - 당도 높은 완숙 토마토",
    category: "VEGETABLE",
    thumbnailUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=60",
    basePrice: 28000,
    currentPrice: 18000,
    discountRate: 36,
    currentCount: 45,
    remainingSeconds: 2 * 24 * 60 * 60,
    status: "RECRUITING",
  },
  {
    id: 3,
    title: "횡성 한우 등심 500g - 1++ 등급",
    category: "MEAT",
    thumbnailUrl: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&auto=format&fit=crop&q=60",
    basePrice: 85000,
    currentPrice: 62000,
    discountRate: 27,
    currentCount: 32,
    remainingSeconds: 3 * 24 * 60 * 60,
    status: "RECRUITING",
  },
  {
    id: 4,
    title: "완도 전복 1kg - 자연산 활전복",
    category: "SEAFOOD",
    thumbnailUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60",
    basePrice: 75000,
    currentPrice: 55000,
    discountRate: 27,
    currentCount: 88,
    remainingSeconds: 1 * 24 * 60 * 60,
    status: "RECRUITING",
  },
  {
    id: 5,
    title: "이천 햅쌀 10kg - 임금님표",
    category: "GRAIN",
    thumbnailUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60",
    basePrice: 48000,
    currentPrice: 35000,
    discountRate: 27,
    currentCount: 120,
    remainingSeconds: 4 * 24 * 60 * 60,
    status: "RECRUITING",
  },
  {
    id: 6,
    title: "나주 배 5kg - 명품 신고배",
    category: "FRUIT",
    thumbnailUrl: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&auto=format&fit=crop&q=60",
    basePrice: 42000,
    currentPrice: 30000,
    discountRate: 29,
    currentCount: 56,
    remainingSeconds: 6 * 24 * 60 * 60,
    status: "RECRUITING",
  },
]

const mockCategories: CategoryResponse[] = [
  { category: "FRUIT", displayName: "과일", count: 12 },
  { category: "VEGETABLE", displayName: "채소", count: 8 },
  { category: "GRAIN", displayName: "곡물", count: 5 },
  { category: "MEAT", displayName: "육류", count: 6 },
  { category: "SEAFOOD", displayName: "수산물", count: 9 },
  { category: "OTHER", displayName: "기타", count: 3 },
]

// Helper function to simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Auth APIs (Mock)
export async function signup(data: SignupRequest): Promise<TokenResponse> {
  await delay(500)
  
  const expDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const refreshExpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
  const result: TokenResponse = {
    accessToken: `mock_access_${Date.now()}`,
    refreshToken: `mock_refresh_${Date.now()}`,
    accessExp: expDate.toISOString(),
    refreshExp: refreshExpDate.toISOString(),
  }
  
  // Store user data
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify({ name: data.name, email: data.email }))
  }
  
  setTokens(result.accessToken, result.refreshToken, result.accessExp, result.refreshExp)
  return result
}

export async function adminSignup(data: AdminSignupRequest): Promise<TokenResponse> {
  await delay(500)
  
  if (data.adminKey !== "admin123") {
    throw new Error("유효하지 않은 관리자 키입니다.")
  }
  
  const expDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const refreshExpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
  const result: TokenResponse = {
    accessToken: `mock_admin_access_${Date.now()}`,
    refreshToken: `mock_admin_refresh_${Date.now()}`,
    accessExp: expDate.toISOString(),
    refreshExp: refreshExpDate.toISOString(),
  }
  
  // Store admin user data
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify({ 
      name: data.name, 
      email: data.email,
      farmName: data.farmName,
      isAdmin: true 
    }))
  }
  
  setTokens(result.accessToken, result.refreshToken, result.accessExp, result.refreshExp)
  return result
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  await delay(500)
  
  // Demo login - accept any credentials
  const expDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const refreshExpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
  // Check if admin login (email contains 'admin')
  const isAdmin = data.email.includes("admin")
  
  const result: TokenResponse = {
    accessToken: isAdmin ? `mock_admin_access_${Date.now()}` : `mock_access_${Date.now()}`,
    refreshToken: `mock_refresh_${Date.now()}`,
    accessExp: expDate.toISOString(),
    refreshExp: refreshExpDate.toISOString(),
  }
  
  // Store user data
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("userData")
    if (!storedData) {
      localStorage.setItem("userData", JSON.stringify({ 
        name: isAdmin ? "관리자" : "사용자", 
        email: data.email,
        farmName: isAdmin ? "푸른농장" : undefined,
        isAdmin 
      }))
    }
  }
  
  setTokens(result.accessToken, result.refreshToken, result.accessExp, result.refreshExp)
  return result
}

export function logout() {
  clearTokens()
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData")
  }
}

// Group Purchase APIs (Mock)
export async function getGroupPurchaseList(
  category?: string,
  sort?: "LATEST" | "DISCOUNT_RATE" | "POPULARITY"
): Promise<GroupPurchaseListResponse[]> {
  await delay(300)
  
  let filtered = [...mockGroupPurchases]
  
  if (category && category !== "전체") {
    filtered = filtered.filter(p => p.category === category)
  }
  
  if (sort === "DISCOUNT_RATE") {
    filtered.sort((a, b) => b.discountRate - a.discountRate)
  } else if (sort === "POPULARITY") {
    filtered.sort((a, b) => b.currentCount - a.currentCount)
  }
  
  return filtered
}

export async function getGroupPurchaseDetail(id: number): Promise<GroupPurchaseDetailResponse> {
  await delay(300)
  
  const product = mockGroupPurchases.find(p => p.id === id)
  
  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.")
  }
  
  const targetCount = 100
  const achievementRate = product.currentCount / targetCount
  
  return {
    ...product,
    content: `${product.title}입니다. 신선하고 품질 좋은 상품을 공동구매로 더 저렴하게 만나보세요. 산지에서 직접 배송해 드립니다.`,
    targetCount,
    deadline: new Date(Date.now() + product.remainingSeconds * 1000).toISOString(),
    totalRevenue: product.currentPrice * product.currentCount,
    achievementRate,
    ownerName: "푸른농장",
    isOwner: false,
    isJoined: false,
    discountTiers: [
      { requiredCount: 50, discountPrice: Math.round(product.basePrice * 0.85) },
      { requiredCount: 80, discountPrice: Math.round(product.basePrice * 0.75) },
      { requiredCount: 100, discountPrice: Math.round(product.basePrice * 0.70) },
    ],
    nextDiscount: product.currentCount < 100 ? {
      remainingCount: product.currentCount < 50 ? 50 - product.currentCount : 
                      product.currentCount < 80 ? 80 - product.currentCount : 
                      100 - product.currentCount,
      nextPrice: product.currentCount < 50 ? Math.round(product.basePrice * 0.85) :
                 product.currentCount < 80 ? Math.round(product.basePrice * 0.75) :
                 Math.round(product.basePrice * 0.70),
    } : undefined,
  }
}

export async function getCategories(): Promise<CategoryResponse[]> {
  await delay(200)
  return mockCategories
}

// Payment APIs (Mock)
export async function paymentReady(groupPurchaseId: number, data: PaymentReadyRequest): Promise<PaymentReadyResponse> {
  await delay(300)
  
  const product = mockGroupPurchases.find(p => p.id === groupPurchaseId)
  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.")
  }
  
  return {
    merchantUid: `order_${Date.now()}_${groupPurchaseId}`,
    amount: product.currentPrice * data.quantity,
  }
}

export async function paymentVerify(data: PaymentVerifyRequest): Promise<void> {
  await delay(300)
  // Mock verification - always succeeds
  console.log("Payment verified:", data)
}

// User APIs (Mock)
export async function getAdminMyPage(): Promise<AdminMyPageResponse> {
  await delay(200)
  
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      const userData = JSON.parse(storedData)
      return {
        name: userData.name || "사용자",
        farmName: userData.farmName,
        profileImageUrl: undefined,
        createdAt: new Date().toISOString(),
      }
    }
  }
  
  return {
    name: "사용자",
    farmName: undefined,
    profileImageUrl: undefined,
    createdAt: new Date().toISOString(),
  }
}

export async function withdrawUser(): Promise<void> {
  await delay(300)
  clearTokens()
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData")
  }
}
