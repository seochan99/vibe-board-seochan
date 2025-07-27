# 🎨 Vibe Board (바이브 보드)

아이디어를 실시간으로 공유하고 함께 발전시키는 미니멀리스트 온라인 화이트보드

## 🚀 기술 스택

- **Frontend:** Next.js 14, TypeScript, TailwindCSS
- **Backend:** Supabase (Auth, PostgreSQL DB, Realtime, Storage)
- **UI/UX:** React Draggable, Custom Components
- **Architecture:** Feature-Sliced Design (FSD)

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── providers/         # Context Providers
│   └── styles/           # Global Styles
├── pages/                 # 페이지 컴포넌트
│   ├── dashboard/        # 대시보드 페이지
│   ├── board/           # 보드 페이지
│   └── landing/         # 랜딩 페이지
├── widgets/              # 독립적인 UI 블록
│   ├── header/          # 헤더 위젯
│   ├── sidebar/         # 사이드바 위젯
│   └── board-canvas/    # 보드 캔버스 위젯
├── features/             # 비즈니스 로직
│   ├── auth/            # 인증 기능
│   ├── board-management/ # 보드 관리
│   ├── real-time-collaboration/ # 실시간 협업
│   └── content-creation/ # 콘텐츠 생성
├── entities/             # 도메인 엔티티
│   ├── user/            # 사용자 엔티티
│   ├── board/           # 보드 엔티티
│   └── board-element/   # 보드 요소 엔티티
└── shared/              # 공유 유틸리티
    ├── ui/              # 공유 UI 컴포넌트
    ├── lib/             # 공유 라이브러리
    ├── api/             # API 관련
    ├── types/           # 공유 타입
    └── constants/       # 공유 상수
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

1. **기능 개발:** features/ 레이어에서 비즈니스 로직 구현
2. **엔티티 관리:** entities/ 레이어에서 도메인 모델 관리
3. **UI 구성:** widgets/ 레이어에서 복합 UI 블록 구성
4. **페이지 구성:** pages/ 레이어에서 페이지 레이아웃 구성
5. **공유 요소:** shared/ 레이어에서 재사용 가능한 요소 관리

## 📝 라이센스

MIT License
