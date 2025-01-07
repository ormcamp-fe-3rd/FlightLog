# FlightLog

드론 비행 데이터를 시각화하여 비행 결과를 분석하고 리뷰할 수 있는 웹 애플리케이션입니다.

FlightLog는 드론 운용의 효율성을 높이고 안전한 운영을 지원하기 위한 데이터 시각화 플랫폼입니다.

<br>

# 주요 기능

📊 텔레메트리 데이터 시각화

🗺️ 비행 경로 및 시간별 데이터 분석

📈 드론 상태 및 비행 데이터 로그 시각화

🔑 로그인을 한 회원에게만 데이터 제공

<br>

## 기술 스택

| 유형               |                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend           | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)                                                                                                                                         |
| Backend            | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)                                                                                                                                                                                                                                                         |
| Styling            | ![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=flat-square&logo=daisyui&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)                                                                                                                                   |
| Data Visualization | ![React Leaflet](https://img.shields.io/badge/React_Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white) ![Highcharts](https://img.shields.io/badge/Highcharts-058DC7?style=flat-square&logo=highcharts&logoColor=white) ![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-000000?style=flat-square&logo=three.js&logoColor=white) |

<br>

## 팀 소개

| 이름   | 역할                |                                         |
| :----- | :------------------ | :-------------------------------------- |
| 박한솔 | Frontend, TeamLeder | [GitHub](https://github.com/incolore9)  |
| 김민섭 | Frontend            | [GitHub](https://github.com/mycreature) |
| 김지균 | Frontend            | [GitHub](https://github.com/kimjigyun)  |
| 조지연 | Frontend            | [GitHub](https://github.com/oratio100)  |

### [기획 보드판](https://www.figma.com/design/hBVjg0JN384rhtNpvHqQWX/vision-drone's-team-library?node-id=3311-2&p=f&t=iiFwUjZL1Ccb0yd4-0)

<br>

## 설치 및 실행방법

1. 저장소 클론

```
git clone https://github.com/[username]/FlightLog.git
```

2. 환경변수 설정:
   프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```2. 환경변수 설정
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]
```

3. 의존성 패키지 설치

```
npm install
```

4. 개발 서버 실행

```
npm run dev
```
