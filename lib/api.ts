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

function parseUtcTimestamp(value: string): number {
  const hasOffset = /[Z+-]$/i.test(value) || /[+-]\d{2}:?\d{2}$/.test(value)
  const normalized = hasOffset ? value : `${value}Z`
  return new Date(normalized).getTime()
}

export function isLoggedIn(): boolean {
  const token = getAccessToken()
  if (!token) return false

  const expStr = typeof window !== "undefined" ? localStorage.getItem("accessExp") : null
  if (!expStr) return false

  const exp = parseUtcTimestamp(expStr)
  if (Number.isNaN(exp)) return false

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

export interface TossPaymentVerifyRequest {
  paymentKey: string
  orderId: string
  amount: number
}

export interface TossPaymentVerifyResponse {
  paymentKey: string
  orderId: string
  amount: number
  status: string
}

export interface AdminMyPageResponse {
  name: string
  farmName?: string
  profileImageUrl?: string
  createdAt: string
}
// API base URL - set via environment variable `NEXT_PUBLIC_API_URL`.
const API_BASE = (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://13.208.243.83:8080"

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    try {
      const json = JSON.parse(text)
      throw new Error(json.message || text || res.statusText)
    } catch {
      throw new Error(text || res.statusText)
    }
  }
  // Some endpoints return empty body
  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as unknown as T)
}

async function apiMultipartFetch<T>(path: string, formData: FormData): Promise<T> {
  const token = getAccessToken()
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
    headers,
  })

  if (!res.ok) {
    const text = await res.text()
    try {
      const json = JSON.parse(text)
      throw new Error(json.message || text || res.statusText)
    } catch {
      throw new Error(text || res.statusText)
    }
  }

  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as unknown as T)
}

export async function signup(data: SignupRequest): Promise<TokenResponse> {
  const result = await apiFetch<TokenResponse>(`/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
  })

  setTokens(result.accessToken, result.refreshToken, result.accessExp, result.refreshExp)
  return result
}

export async function adminSignup(data: AdminSignupRequest): Promise<TokenResponse> {
  const result = await apiFetch<TokenResponse>(`/auth/signup/admin`, {
    method: "POST",
    body: JSON.stringify(data),
  })

  setTokens(result.accessToken, result.refreshToken, result.accessExp, result.refreshExp)
  return result
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const result = await apiFetch<TokenResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  })

  setTokens(result.accessToken, result.refreshToken, result.accessExp, result.refreshExp)
  return result
}

export function logout() {
  clearTokens()
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData")
  }
}

// Group Purchase APIs
export async function getGroupPurchaseList(
  category?: string,
  sort?: "LATEST" | "DISCOUNT_RATE" | "POPULARITY"
): Promise<GroupPurchaseListResponse[]> {
  const params = new URLSearchParams()
  if (category) params.append("category", category)
  if (sort) params.append("sort", sort)
  const path = `/group-purchase${params.toString() ? `?${params.toString()}` : ""}`
  return apiFetch<GroupPurchaseListResponse[]>(path)
}

export async function getGroupPurchaseDetail(id: number): Promise<GroupPurchaseDetailResponse> {
  return apiFetch<GroupPurchaseDetailResponse>(`/group-purchase/${id}`)
}

export async function getCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>(`/group-purchase/categories`)
}

// Payment APIs
export async function paymentReady(groupPurchaseId: number, data: PaymentReadyRequest): Promise<PaymentReadyResponse> {
  return apiFetch<PaymentReadyResponse>(`/payment/ready/${groupPurchaseId}`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function paymentVerify(data: PaymentVerifyRequest): Promise<void> {
  await apiFetch<void>(`/payment/verify`, { method: "POST", body: JSON.stringify(data) })
}

export async function verifyTossPayment(data: TossPaymentVerifyRequest): Promise<TossPaymentVerifyResponse> {
  const response = await fetch(`/api/toss/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(bodyText || response.statusText)
  }

  return response.json()
}

export async function paymentCancel(groupPurchaseId: number): Promise<void> {
  await apiFetch<void>(`/payment/cancel/${groupPurchaseId}`, { method: "POST" })
}

export async function createGroupPurchase(formData: FormData): Promise<GroupPurchaseDetailResponse> {
  return apiMultipartFetch<GroupPurchaseDetailResponse>(`/group-purchase`, formData)
}

// User APIs
export async function getAdminMyPage(): Promise<AdminMyPageResponse> {
  return apiFetch<AdminMyPageResponse>(`/user/admin`)
}

export async function withdrawUser(): Promise<void> {
  await apiFetch<void>(`/users/me`, { method: "DELETE" })
  clearTokens()
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData")
  }
}

// Seller / Orders APIs
export interface ParticipantResponse {
  id: string
  buyerName: string
  buyerPhone?: string
  buyerEmail?: string
  quantity: number
  totalPrice: number
  address?: string
  orderDate: string
  status: string
}

export interface OrderResponse {
  id: string
  productName: string
  imageUrl?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: string
  currentParticipants?: number
  targetParticipants?: number
  endDate?: string
  orderedAt?: string
}

export async function getSellerProducts(): Promise<GroupPurchaseListResponse[]> {
  try {
    return await apiFetch<GroupPurchaseListResponse[]>(`/admin/group-purchases`)
  } catch (error) {
    // Fallback for backends that do not expose a dedicated admin list endpoint.
    return apiFetch<GroupPurchaseListResponse[]>(`/group-purchase`)
  }
}

export async function getProductParticipants(id: string): Promise<ParticipantResponse[]> {
  return apiFetch<ParticipantResponse[]>(`/group-purchases/${id}/participants`)
}

export async function getMyOrders(): Promise<OrderResponse[]> {
  return apiFetch<OrderResponse[]>(`/orders`)
}

// Cancellation APIs
// Buyer: cancel a participation/order
export async function cancelParticipation(orderId: string): Promise<void> {
  await apiFetch<void>(`/orders/${orderId}/cancel`, { method: "POST" })
}

// Seller: cancel a group purchase (owner cancels the entire group purchase)
// Returns optional penalty info (backend may return penalty count or metadata)
export async function cancelGroupPurchase(groupPurchaseId: string): Promise<{ penaltyCount?: number } | void> {
  return apiFetch<{ penaltyCount?: number }>(`/group-purchase/${groupPurchaseId}/cancel`, { method: "POST" })
}
