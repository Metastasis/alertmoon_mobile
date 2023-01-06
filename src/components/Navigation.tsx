import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SmsReaderComponent} from '../features/sms-reader';
import Login from './Routes/Login';
import Registration from './Routes/Registration';
import Home from './Routes/Home';
import {AuthContext} from './AuthProvider';
import Settings from './Routes/Settings';
import {
  PageCreate as NotificationPattern,
  PageList as NotificationPatternList,
  PageView as NotificationPatternView,
  PageEdit as NotificationPatternEdit,
  usePatternList,
} from '../features/notification-pattern';
import FlashMessage from 'react-native-flash-message';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  // Text,
} from 'react-native';
import Header from './Layout/Header';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  Login: {
    refresh?: boolean;
    aal?: 'aal2';
  };
  Registration: undefined;
  Settings: undefined;
  NotificationPattern:
    | {
        id: string;
        sender: string;
        content?: string;
      }
    | undefined;
  NotificationPatternEdit: {
    id: string;
    sender: string;
    content?: string;
  };
  NotificationPatternView: {
    id: string;
    sender: string;
    content?: string;
  };
  NotificationPatternList: undefined;
};

const options = {
  header: () => <Header />,
};

const linking = {
  // This is only used for e2e testing.
  prefixes: ['http://127.0.0.1:4457/'],
};

// function Dummy() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Dummy</Text>
//     </View>
//   );
// }

export default () => {
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);
  const list = usePatternList({sessionToken});
  const stl = {flex: 1};
  return (
    <KeyboardAvoidingView
      style={stl}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={{
              headerShown: isAuthenticated,
            }}
          >
            <Stack.Screen name="Home" component={Home} options={options} />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={options}
            />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Login" component={Login} initialParams={{}} />
            <Stack.Screen
              name="NotificationPattern"
              component={NotificationPattern}
              initialParams={undefined}
            />
            <Stack.Screen
              name="NotificationPatternView"
              component={NotificationPatternView}
            />
            <Stack.Screen
              name="NotificationPatternEdit"
              component={NotificationPatternEdit}
            />
            <Stack.Screen
              name="NotificationPatternList"
              component={NotificationPatternList}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TouchableWithoutFeedback>
      <View data-testid={'flash-message'}>
        <FlashMessage position="top" floating />
      </View>
      <SmsReaderComponent
        patterns={list.data?.payload || []}
        beneficiaryId={session?.identity.id}
        sessionToken={sessionToken}
      />
    </KeyboardAvoidingView>
  );
};
