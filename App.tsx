import 'react-native-gesture-handler';
// https://github.com/facebook/react-native/issues/23922
import 'react-native-url-polyfill/auto';
import React from 'react';
import {ThemeProvider} from 'styled-components';
// @ts-ignore
import {ThemeProvider as NativeThemeProvider} from 'styled-components/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {theme} from '@ory/themes';

import Navigation from './src/components/Navigation';
import ErrorBoundary from './src/components/ErrorBoundary';
import AuthProvider from './src/components/AuthProvider';
import ForkMe from './src/components/Styled/ForkMe';

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

  return (
    <ThemeProvider theme={hydratedTheme}>
      <NativeThemeProvider theme={hydratedTheme}>
        <SafeAreaProvider>
          <SafeAreaView edges={['top', 'left', 'right']} style={stl}>
            <AuthProvider>
              <ErrorBoundary>
                <Navigation />
                <ForkMe />
              </ErrorBoundary>
            </AuthProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </NativeThemeProvider>
    </ThemeProvider>
  );
}
