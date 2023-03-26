import 'react-native-gesture-handler';
// https://github.com/facebook/react-native/issues/23922
import 'react-native-url-polyfill/auto';
import React from 'react';
import {AppState} from 'react-native';
import {SWRConfig} from 'swr';
import {ThemeProvider} from 'styled-components';
import {ThemeProvider as NativeThemeProvider} from 'styled-components/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {theme} from './src/components/Ory/theme/helpers';
import Navigation from './src/components/Navigation';
import ErrorBoundary from './src/components/ErrorBoundary';
import AuthProvider from './src/components/AuthProvider';

// Sentry.init({
//   dsn: 'https://8be94c41dbe34ce1b244935c68165eab@o481709.ingest.sentry.io/5530799',
//   enableInExpoDevelopment: true,
//   debug: false,
//   integrations: [
//     new CaptureConsole({
//       levels: ['error', 'warn', 'log'],
//     }),
//   ],
// });

export default function App() {
  // const [robotoLoaded] = useFontsRoboto({Roboto_400Regular});
  // const [rubikLoaded] = useFontsRubik({
  //   Rubik_300Light,
  //   Rubik_400Regular,
  //   Rubik_500Medium,
  // });

  const hydratedTheme = {
    ...theme,
    regularFont300: 'Arial',
    regularFont400: 'Arial',
    regularFont500: 'Arial',
    codeFont400: 'Arial',
    platform: 'react-native',
  };
  const stl = {
    flex: 1,
    backgroundColor: theme.grey5,
  };
  const swrCfg = {
    provider: () => new Map(),
    isVisible: () => {
      return true;
    },
    initFocus(callback: any) {
      let appState = AppState.currentState;
      const onAppStateChange = (nextAppState: any) => {
        /* If it's resuming from background or inactive mode to active one */
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          callback();
        }
        appState = nextAppState;
      };
      // Subscribe to the app state change events
      const subscription = AppState.addEventListener(
        'change',
        onAppStateChange,
      );
      return () => {
        subscription.remove();
      };
    },
  };
  return (
    <ThemeProvider theme={hydratedTheme}>
      <NativeThemeProvider theme={hydratedTheme}>
        <SafeAreaProvider>
          <SafeAreaView edges={['top', 'left', 'right']} style={stl}>
            <SWRConfig value={swrCfg}>
              <AuthProvider>
                <ErrorBoundary>
                  <Navigation />
                </ErrorBoundary>
              </AuthProvider>
            </SWRConfig>
          </SafeAreaView>
        </SafeAreaProvider>
      </NativeThemeProvider>
    </ThemeProvider>
  );
}
