
socket.io  https://share.google/aimode/zrLxFVwdMP3yUrxiA

src/
│
├── app/
│   ├── store.ts
│   ├── router.tsx
│   └── providers.tsx
│
├── api/
│   └── axios.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── fonts/
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Table.tsx
│   │   ├── Spinner.tsx
│   │   └── Pagination.tsx
│   │
│   ├── common/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Logo.tsx
│   │   └── PageTitle.tsx
│   │
│   └── feedback/
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       └── Loading.tsx
│
├── constants/
│   ├── routes.ts
│   ├── roles.ts
│   └── status.ts
│
├── features/
│   │
│   ├── auth/
│   │   ├── authApi.ts
│   │   ├── authSlice.ts
│   │   ├── authTypes.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   │
│   ├── patient/
│   ├── doctor/
│   ├── queue/
│   ├── appointment/
│   ├── report/
│   └── notification/
│
├── hooks/
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   └── useSocket.ts
│
├── layouts/
│   ├── RootLayout.tsx
│   ├── AuthLayout.tsx
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
│
├── pages/
│   │
│   ├── public/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Contact/
│   │   ├── Doctors/
│   │   ├── Treatments/
│   │   ├── BookToken/
│   │   └── LiveQueue/
│   │
│   ├── auth/
│   │   ├── Login/
│   │   ├── ForgotPassword/
│   │   └── ResetPassword/
│   │
│   └── dashboard/
│       ├── admin/
│       ├── doctor/
│       ├── reception/
│       └── patient/
│
├── services/
│   ├── socket.ts
│   └── storage.ts
│
├── styles/
│   ├── globals.css
│   └── variables.css
│
├── types/
│   ├── api.ts
│   ├── common.ts
│   └── index.ts
│
├── utils/
│   ├── formatDate.ts
│   ├── formatCurrency.ts
│   ├── cn.ts
│   ├── generateToken.ts
│   └── validators.ts
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts