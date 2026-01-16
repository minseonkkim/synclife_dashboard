# 🗂️ Kanban Task Board

## 🔗 배포 URL
https://minseonkkim.github.io/synclife_dashboard/

## ▶️ 프로젝트 실행 방법
```
# 레포지토리 클론
git clone https://github.com/minseonkkim/synclife_dashboard.git

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

## ⏱️ 개발 기간
2일(1/15~1/16)

## ✨ 구현 기능 목록
**Priority 1 - 필수 구현**
1. 기본 칸반보드 
2. 태스크 추가 기능
3. 데이터 저장
4. GitHub Pages 배포 

**Priority 2 - 권장 구현**
1. 드래그 앤 드롭 
2. 태스크 관리 기능 
3. 기본 검색 

**Priority 3 - 추가 구현**
1. 고급 필터링
- 우선순위별 필터 (High/Medium/Low) 
- 상태별 필터 
- 다중 필터 조합 (AND 조건) 
2. 검색 고도화 
- 디바운싱 적용 (300ms) 
- 검색어 하이라이트 
- 최근 검색어 저장 (최대 5개) 
3. UI/UX 개선
- 반응형 디자인 (Desktop 1920px, Tablet 768px, Mobile 375px) 
- 다크 모드 
- 빈 상태 안내 메시지
4. 추가 기능
- 정렬 기능 (날짜/우선순위)


## ❌ 미구현 기능 및 이유
- 태그 시스템 및 태그별 필터
  - 태스크 모델에 태그 구조를 추가하고, 다중 태그 기반 필터링 UI까지 설계해야 했기 때문에 구현 범위가 커져 핵심 기능에 집중하기 위해 제외했습니다.
- 애니메이션 효과
  - 드래그 앤 드롭 외 추가적인 UI 애니메이션은 사용자 경험을 향상시킬 수 있으나 필수 기능은 아니라고 판단했습니다.
- 키보드 단축키
  - 검색 포커스 이동, 태스크 추가 등 단축키를 고려했으나 접근성 및 충돌 이슈 검토가 필요해 구현하지 않았습니다.
- 태스크 통계 기능
  - 태스크 개수 시각화를 고려했으나, 시각화 라이브러리 도입이 필요해 핵심 기능에 집중하기 위해 제외했습니다.
 
## 🛠️ 사용 기술 스택
- React
- TypeScript
- Vite
- Tailwind CSS
- @hello-pangea/dnd
  - react-beautiful-dnd의 공식 유지보수 중단 이후, 동일한 API를 유지하면서 지속적으로 관리되는 라이브러리입니다. 칸반 보드와 같은 리스트 기반 UI에 최적화된 라이브러리여서 선택했습니다.
 
## 🤖 AI 도구 사용 내역
- ChatGPT: 프로젝트 설계 검토, 코드 로직 개선, UI/UX 구현 아이디어 제안
- VSCode Copilot: 반복적인 코드 작성 보조 및 코드 자동 완성
