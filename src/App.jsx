/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ import { AppShell } from './components/AppShell';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import { ErrorBoundary } from './components/ErrorBoundary';
export default function App() {
    return <ErrorBoundary>
      <ThemeProvider>
        <SmoothScrollProvider>
          <AppShell/>
        </SmoothScrollProvider>
      </ThemeProvider>
    </ErrorBoundary>;
}
