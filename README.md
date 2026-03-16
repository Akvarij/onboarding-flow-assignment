## Tech Stack

| Tool                | Purpose                                       |
| ------------------- | --------------------------------------------- |
| **React 19**        | UI library                                    |
| **TypeScript**      | Type safety throughout                        |
| **Vite**            | Dev server and bundler                        |
| **Tailwind CSS v3** | Utility-first styling                         |
| **Framer Motion**   | Page entrance animations                      |
| **React Hook Form** | Form state, validation, and controlled inputs |

## Project Structure

```
src/
├── context/
│   └── OnboardingContext.tsx   # Global state (Context + useReducer)
├── hooks/
│   └── useOnboarding.ts        # Consumer hook
├── components/
│   └── AuthLayout.tsx          # Shared two-panel page layout
├── pages/
│   ├── JoinUsPage.tsx          # Step 0 – account type selection
│   ├── RegisterPage.tsx        # Step 1 – personal info
│   ├── CompleteProfilePage.tsx # Step 2 – residency info
│   ├── InviteTeamPage.tsx      # Step 3 – invite teammates
│   └── SuccessPage.tsx         # Step 4 – confirmation
└── App.tsx                     # Step router
```

## How Routing Works

There is no React Router. `App.tsx` wraps the app in `OnboardingProvider` and renders an `OnboardingRouter` that simply picks the right page by index:

```tsx
const steps = [
  <JoinUsScreen />,
  <RegisterScreen />,
  <CompleteProfileScreen />,
  <InviteTeamScreen />,
  <SuccessScreen />,
];
return steps[state.step] ?? <SuccessScreen />;
```

`nextStep` / `prevStep` increment or decrement `state.step`, which causes the router to swap the rendered page. Simple and avoids URL-based routing for a self-contained flow.

## OnboardingContext

`src/context/OnboardingContext.tsx`

The context holds all onboarding data in one place using React's built-in `useReducer`. This keeps state transitions explicit and predictable — every change goes through a typed action.

### State shape

```ts
interface OnboardingState {
  accountType: "individual" | "business" | null;
  registration: Record<string, unknown>; // fullName, email, hashed password
  profile: Record<string, unknown>; // address, country
  members: { id: string; address: string }[];
  step: number;
  completed: boolean;
}
```

### Actions

| Action                | What it does                        |
| --------------------- | ----------------------------------- |
| `SET_ACCOUNT_TYPE`    | Stores individual / business choice |
| `UPDATE_REGISTRATION` | Merges registration form data       |
| `UPDATE_PROFILE`      | Merges profile form data            |
| `ADD_MEMBER`          | Appends a new empty member row      |
| `UPDATE_MEMBER`       | Updates a single member by id       |
| `REMOVE_MEMBER`       | Removes a member by id              |
| `NEXT_STEP`           | Advances to the next step           |
| `PREV_STEP`           | Goes back (floors at 0)             |
| `COMPLETE`            | Marks the flow as finished          |

### Session persistence

The provider uses a lazy initializer to rehydrate state from `sessionStorage` on first render, and syncs back on every state change via `useEffect`. This means refreshing the page mid-flow does not lose progress.

```ts
const [state, dispatch] = useReducer(onboardingReducer, initialState, () => {
  const saved = sessionStorage.getItem("onboarding");
  return saved ? JSON.parse(saved) : initialState;
});

useEffect(() => {
  sessionStorage.setItem("onboarding", JSON.stringify(state));
}, [state]);
```

### Context value

In addition to raw `state` and `dispatch`, the provider exposes named action helpers (`setAccountType`, `nextStep`, `addMember`, etc.) so pages don't need to import action type strings.

## useOnboarding

`src/hooks/useOnboarding.ts`

A thin wrapper around `useContext` that provides a safe access pattern:

```ts
export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
```

The null-check means forgetting to wrap a component in `OnboardingProvider` surfaces a clear error immediately rather than silently failing with undefined values. Every page uses this hook to read state and call actions — no page talks to the context directly.

## Running Locally

```bash
npm install
npm run dev
```
