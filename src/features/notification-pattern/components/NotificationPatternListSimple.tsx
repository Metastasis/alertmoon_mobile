import React, {useCallback, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ThemeProps, theme as themeGlobal} from '@ory/themes';
import styled from 'styled-components/native';
import StyledText from '../../../components/Styled/StyledText';
import StyledButtonIcon from '../../../components/Styled/StyledButtonIcon';
import {AuthContext} from '../../../components/AuthProvider';
import Layout from '../../../components/Layout/Layout';
import StyledCard from '../../../components/Styled/StyledCard';
import {NotificationPattern} from '../api';
import {usePatternList} from '../state';

const NotificationPatternList = () => {
  const navigation = useNavigation();
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);
  const list = usePatternList({sessionToken});
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

  if (!isAuthenticated || !session) {
    return null;
  }
  if (list.isLoading) {
    return (
      <Layout>
        <StyledCard>
          <Title>
            <StyledText variant="h1">Список шаблонов</StyledText>
          </Title>
          <StyledText variant="p">Загрузка списка...</StyledText>
        </StyledCard>
      </Layout>
    );
  }
  if (list.isLoading || !list.data) {
    return (
      <Layout>
        <StyledCard>
          <Title>
            <StyledText variant="h1">Список шаблонов</StyledText>
          </Title>
          <StyledText variant="p">
            Список пуст, попробуйте создать шаблон
          </StyledText>
        </StyledCard>
      </Layout>
    );
  }
  return (
    <StyledCard>
      <Title>
        <StyledText variant="h1">Список шаблонов</StyledText>
      </Title>
      {list.data.payload.map(item => (
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
