import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ThemeProps, theme as themeGlobal} from '@ory/themes';
// @ts-ignore
import styled from 'styled-components/native';
import StyledText from '../../../components/Styled/StyledText';
import StyledButtonIcon from '../../../components/Styled/StyledButtonIcon';
import StyledButton from '../../../components/Styled/StyledButton';
import {AuthContext} from '../../../components/AuthProvider';
import Layout from '../../../components/Layout/Layout';
import StyledCard from '../../../components/Styled/StyledCard';
import {search, NotificationPattern} from '../api';

const NotificationPatternList = () => {
  const navigation = useNavigation();
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);
  const [status, setStatus] = useState<'' | 'loading' | 'error' | 'ready'>('');
  const [items, setItems] = useState<NotificationPattern[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !session) {
      // @ts-ignore
      navigation.navigate('Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionToken]);

  const onNotificationPage = useCallback(
    (item: NotificationPattern) => {
      // @ts-ignore
      navigation.navigate('NotificationPatternView', item);
    },
    [navigation],
  );

  const onCreate = useCallback(() => {
    // @ts-ignore
    navigation.navigate('NotificationPattern');
  }, [navigation]);

  useEffect(() => {
    async function callApi() {
      setStatus('loading');
      const result = await search({sessionToken}).catch(e => {
        setStatus('error');
        console.error(e);
        return Promise.reject(e);
      });
      setStatus('ready');
      if (result.data?.status === 'ok') {
        setItems(result.data.payload);
      }
    }
    callApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated || !session) {
    return null;
  }
  if (status !== 'ready') {
    return (
      <Layout>
        <StyledCard>
          <Title>
            <StyledText variant="h1">Шаблоны уведомлений</StyledText>
          </Title>
          <StyledButton onPress={onCreate} title="Создать шаблон" />
          {status === 'loading' && (
            <StyledText variant="p">Загрузка списка...</StyledText>
          )}
          {status === 'error' && (
            <StyledText variant="p">
              Произошла ошибка, попробуйте позже
            </StyledText>
          )}
        </StyledCard>
      </Layout>
    );
  }
  return (
    <Layout>
      <StyledCard>
        <Title>
          <StyledText variant="h1">Шаблоны уведомлений</StyledText>
        </Title>
        <StyledButton onPress={onCreate} title="Создать шаблон" />
        {items.map(item => (
          <Pattern key={item.id}>
            <PatternContent>
              <StyledItemButton onPress={() => onNotificationPage(item)}>
                <StyledText style={{color: themeGlobal.grey100}}>
                  {item.sender}
                </StyledText>
              </StyledItemButton>
            </PatternContent>
            <PatternAction>
              <StyledButtonIcon
                onPress={() => console.log('pressed')}
                icon={require('../../../assets/icons8-delete-48.png')}
              />
            </PatternAction>
          </Pattern>
        ))}
      </StyledCard>
    </Layout>
  );
};

const Title = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 16px;
`;
const Pattern = styled.View`
  margin-top: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}: ThemeProps) => theme.grey10};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const PatternContent = styled.View`
  flex-grow: 1;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const PatternAction = styled.View`
  margin-left: 16px;
`;

const StyledItemButton = styled.TouchableOpacity``;

export default NotificationPatternList;
