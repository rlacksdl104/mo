# moa-xv

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_1qZoxCplH2qQOVwCDkgsfV9kp515)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

공동구매 API
공동구매 게시글 생성, 조회, 참여를 담당합니다.



DELETE
/group-purchase/{id}
공동구매 게시글 취소 (판매자 전용, 전원 환불 및 패널티)


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
204	
No Content

No links

GET
/group-purchase
공동구매 목록 조회 (비로그인 가능)

Parameters
Try it out
Name	Description
category
string
(query)
Available values : FRUIT, VEGETABLE, GRAIN, MEAT, SEAFOOD, OTHER


--
sort
string
(query)
Available values : LATEST, DISCOUNT_RATE, POPULARITY


--
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "id": 9007199254740991,
    "title": "string",
    "category": "FRUIT",
    "thumbnailUrl": "string",
    "basePrice": 1073741824,
    "currentPrice": 1073741824,
    "discountRate": 1073741824,
    "currentCount": 1073741824,
    "remainingSeconds": 9007199254740991,
    "status": "RECRUITING"
  }
]
No links

GET
/group-purchase/{id}
공동구매 상세 조회 (비로그인 가능)

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": 9007199254740991,
  "title": "string",
  "category": "FRUIT",
  "thumbnailUrl": "string",
  "content": "string",
  "basePrice": 1073741824,
  "currentPrice": 1073741824,
  "targetCount": 1073741824,
  "currentCount": 1073741824,
  "deadline": "2026-06-04T04:51:10.412Z",
  "remainingSeconds": 9007199254740991,
  "status": "RECRUITING",
  "totalRevenue": 1073741824,
  "achievementRate": 0.1,
  "ownerName": "string",
  "isOwner": true,
  "isJoined": true,
  "discountTiers": [
    {
      "requiredCount": 1073741824,
      "discountPrice": 1073741824
    }
  ],
  "nextDiscount": {
    "remainingCount": 1073741824,
    "nextPrice": 1073741824
  }
}
No links

GET
/group-purchase/categories
카테고리 목록 조회 (비로그인 가능)

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "category": "FRUIT",
    "displayName": "string",
    "count": 9007199254740991
  }
]
No links

POST
/group-purchase
공동구매 게시글 생성 (ADMIN 전용)


Parameters
Try it out
Name	Description
data *
string
(query)
data
Request body

multipart/form-data
image *
string($binary)
Responses
Code	Description	Links
201	
Created

No links
유저 관련 API
유저 관련 API



DELETE
/user
회원 탈퇴


Parameters
Try it out
No parameters

Responses
Code	Description	Links
204	
No Content

No links

GET
/user/admin
관리자 마이페이지 조회


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "name": "string",
  "farmName": "string",
  "profileImageUrl": "string",
  "createdAt": "2026-06-04T04:51:10.414Z"
}
No links
결제 관련 API
결제 관련 API



POST
/payment/verify
결제 검증 및 완료


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "impUid": "string",
  "merchantUid": "string"
}
Responses
Code	Description	Links
200	
OK

No links

POST
/payment/ready/{groupPurchaseId}
결제 준비 (merchant_uid 생성)


Parameters
Try it out
Name	Description
groupPurchaseId *
integer($int64)
(path)
groupPurchaseId
Request body

application/json
Example Value
Schema
{
  "quantity": 1073741824,
  "shippingAddress": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "merchantUid": "string",
  "amount": 1073741824
}
No links

POST
/payment/cancel/{groupPurchaseId}
참여 취소 및 환불


Parameters
Try it out
Name	Description
groupPurchaseId *
integer($int64)
(path)
groupPurchaseId
Responses
Code	Description	Links
200	
OK

No links
참여자 관련 API
참여자 관련 API



GET
/participation/{groupPurchaseId}
참여자 목록 조회


Parameters
Try it out
Name	Description
groupPurchaseId *
integer($int64)
(path)
groupPurchaseId
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "userId": 9007199254740991,
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "quantity": 1073741824,
    "paymentAmount": 1073741824,
    "status": "string",
    "orderedAt": "2026-06-04T04:51:10.417Z"
  }
]
No links

GET
/participation/{groupPurchaseId}/{userId}
참여자 상세 조회


Parameters
Try it out
Name	Description
groupPurchaseId *
integer($int64)
(path)
groupPurchaseId
userId *
integer($int64)
(path)
userId
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "userId": 9007199254740991,
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "status": "string",
  "shippingAddress": "string",
  "quantity": 1073741824,
  "orderedAt": "2026-06-04T04:51:10.418Z",
  "paymentAmount": 1073741824
}
No links
인증 API
회원가입, 로그인, 토큰 재발급을 담당합니다.



POST
/auth/signup
일반 회원가입

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "email": "string",
  "name": "string",
  "password": "stringst"
}
Responses
Code	Description	Links
201	
Created

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "accessToken": "string",
  "accessExp": "2026-06-04T04:51:10.418Z",
  "refreshToken": "string",
  "refreshExp": "2026-06-04T04:51:10.418Z"
}
No links

POST
/auth/signup/admin
관리자(판매자) 회원가입

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "email": "string",
  "name": "string",
  "password": "stringst",
  "adminKey": "string",
  "farmName": "string"
}
Responses
Code	Description	Links
201	
Created

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "accessToken": "string",
  "accessExp": "2026-06-04T04:51:10.419Z",
  "refreshToken": "string",
  "refreshExp": "2026-06-04T04:51:10.419Z"
}
No links

POST
/auth/reissue
토큰 재발급

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "refreshToken": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "accessToken": "string",
  "accessExp": "2026-06-04T04:51:10.419Z",
  "refreshToken": "string",
  "refreshExp": "2026-06-04T04:51:10.419Z"
}
No links

POST
/auth/login
로그인

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "email": "string",
  "password": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "accessToken": "string",
  "accessExp": "2026-06-04T04:51:10.420Z",
  "refreshToken": "string",
  "refreshExp": "2026-06-04T04:51:10.420Z"
}