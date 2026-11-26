import React, { ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-dvh place-items-center bg-bg px-4 text-ink">
          <div className="max-w-sm text-center">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-ink-muted">The page hit an unexpected error. Reloading usually fixes it.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
