# 🎨 Vibe Board (바이브 보드)

아이디어를 실시간으로 공유하고 함께 발전시키는 미니멀리스트 온라인 화이트보드

## 🚀 기술 스택

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL DB, Realtime, Storage)
- **UI/UX:** React Draggable, Custom Components
- **Architecture:** Feature-Sliced Design (FSD)

## 📁 프로젝트 구조

```
vibe-board-seochan/
├── app/                    # Next.js App Router (라우팅만)
│   ├── page.tsx           # 홈페이지 라우트
│   ├── layout.tsx         # 루트 레이아웃
│   ├── globals.css        # 글로벌 스타일
│   ├── dashboard/
│   │   └── page.tsx       # 대시보드 라우트
│   └── board/
│       └── page.tsx       # 보드 라우트
├── pages/                  # Next.js Pages Router (빈 폴더)
├── src/                    # FSD 아키텍처
│   ├── app/               # FSD App Layer
│   │   └── providers/     # 앱 레벨 프로바이더
│   ├── pages/             # FSD Pages Layer
│   │   ├── landing/       # 랜딩 페이지
│   │   ├── dashboard/     # 대시보드 페이지
│   │   └── board/         # 보드 페이지
│   ├── widgets/           # FSD Widgets Layer
│   │   ├── header/        # 헤더 위젯
│   │   ├── sidebar/       # 사이드바 위젯
│   │   └── board-canvas/  # 보드 캔버스 위젯
│   ├── features/          # FSD Features Layer
│   │   ├── auth/          # 인증 기능
│   │   ├── board/         # 보드 관리 (구 board-management)
│   │   ├── content/       # 콘텐츠 생성 (구 content-creation)
│   │   └── collaboration/ # 실시간 협업 (구 real-time-collaboration)
│   ├── entities/          # FSD Entities Layer
│   │   ├── user/          # 사용자 엔티티
│   │   ├── board/         # 보드 엔티티
│   │   └── element/       # 보드 요소 엔티티 (구 board-element)
│   └── shared/            # FSD Shared Layer
│       ├── ui/            # 공유 UI 컴포넌트
│       ├── lib/           # 공유 라이브러리
│       ├── hoc/           # Higher-Order Components
│       ├── api/           # API 관련
│       ├── types/         # 공유 타입
│       └── constants/     # 공유 상수
├── postcss.config.mjs      # PostCSS 설정 (Tailwind CSS v4)
└── tsconfig.json          # TypeScript 설정 (FSD 경로 별칭 포함)
```

## 🎯 주요 기능

### 1. 사용자 인증
- Google 계정을 이용한 간편 소셜 로그인
- 로그인한 사용자만 보드 생성 및 수정 가능

### 2. 보드 관리
- 새로운 보드 생성
- 고유 URL 주소 (`vibe-board.com/board/[boardId]`)
- 대시보드에서 보드 목록 관리

### 3. 실시간 협업
- 보드 URL 공유로 즉시 참여
- 실시간 콘텐츠 동기화 (Supabase Realtime)
- 다중 사용자 동시 편집

### 4. 콘텐츠 생성
- **포스트잇:** 다양한 색상의 드래그 가능한 포스트잇
- **이미지:** 업로드 및 드래그 가능한 이미지
- 위치 이동 및 크기 조절 기능

## 🛠️ 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 주요 설정 파일

- **Tailwind CSS v4**: `postcss.config.mjs` + `app/globals.css`
- **TypeScript 경로**: `tsconfig.json`에 FSD 레이어별 경로 별칭 설정
- **FSD 구조**: `src/` 폴더에 Feature-Sliced Design 아키텍처 적용

## 📊 데이터베이스 스키마

### boards 테이블
- `id` (uuid, PK): 보드 고유 ID
- `name` (text): 보드 이름
- `owner_id` (uuid): 생성자 ID
- `created_at` (timestampz): 생성 일시

### board_elements 테이블
- `id` (uuid, PK): 요소 고유 ID
- `board_id` (uuid): 보드 ID
- `user_id` (uuid): 생성자 ID
- `type` (text): 요소 타입 ('note', 'image')
- `content` (text): 내용 (텍스트 또는 이미지 URL)
- `position` (jsonb): 위치 좌표
- `size` (jsonb): 크기 정보
- `color` (text): 색상 (포스트잇용)
- `created_at` (timestampz): 생성 일시

## 🎨 디자인 시스템

### 색상 팔레트
- 포스트잇 색상: 노란색, 분홍색, 연두색, 연파랑색, 연보라색, 연주황색
- 기본 크기: 포스트잇 (200x150), 이미지 (300x200)
- 캔버스 크기: 2000x2000

## 🔄 개발 워크플로우

1. **기능 개발:** `features/` 레이어에서 비즈니스 로직 구현
2. **엔티티 관리:** `entities/` 레이어에서 도메인 모델 관리
3. **UI 구성:** `widgets/` 레이어에서 복합 UI 블록 구성
4. **페이지 구성:** `pages/` 레이어에서 페이지 레이아웃 구성
5. **공유 요소:** `shared/` 레이어에서 재사용 가능한 요소 관리

### FSD 레이어 구조 원칙
- **상위 레이어**는 하위 레이어만 import 가능
- **같은 레벨** 내에서는 직접 import 금지
- **경로 별칭** 사용으로 명확한 의존성 관리

### 폴더명 컨벤션
- 간결하고 명확한 이름 사용
- kebab-case 대신 단일 단어 선호
- 예: `board-management` → `board`, `content-creation` → `content`

## 📝 라이센스

MIT License
