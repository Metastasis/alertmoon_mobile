import React, {useCallback, useContext, useEffect} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import StyledText from '../Styled/StyledText';
import {AuthContext} from '../AuthProvider';
import Layout from '../Layout/Layout';
import StyledCard from '../Styled/StyledCard';
import StyledButton from '../Styled/StyledButton';
import {PageListSimple} from '../../features/notification-pattern';

const Home = () => {
  const navigation = useNavigation();
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || !session) {
      // @ts-ignore
      navigation.navigate('Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionToken]);

  const onNotificationPage = useCallback(() => {
    // @ts-ignore
    navigation.navigate('NotificationPattern');
  }, [navigation]);

  if (!isAuthenticated || !session) {
    return null;
  }

  // Get the name, or if it does not exist in the traits, use the
  // identity's ID
  const {name: {first = String(session.identity.traits.email)} = {}} = (
    session.identity.traits as any
  );
  const stl = {marginBottom: 14};
  return (
    <Layout>
      <View>
        <StyledCard>
          <StyledText style={stl} variant="h1">
            Добро пожаловать, {first}!
          </StyledText>
          <StyledButton onPress={onNotificationPage} title="Создать шаблон" />
        </StyledCard>
        <PageListSimple />
      </View>
    </Layout>
  );
};

export default Home;
