import React, {useCallback, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ThemeProps, theme as themeGlobal} from '@ory/themes';
// @ts-ignore
import styled from 'styled-components/native';
import StyledText from '../Styled/StyledText';
import StyledButtonIcon from '../Styled/StyledButtonIcon';
import {AuthContext} from '../AuthProvider';
import Layout from '../Layout/Layout';
import StyledCard from '../Styled/StyledCard';

interface NotificationPattern {
  id: string;
  sender: string;
  content?: string;
}

const NotificationPatternList = () => {
  const navigation = useNavigation();
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);

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
      navigation.navigate('NotificationPattern', item);
    },
    [navigation],
  );

  if (!isAuthenticated || !session) {
    return null;
  }

  const items: NotificationPattern[] = [
    {id: '1', sender: 'Райф', content: undefined},
    {id: '2', sender: 'Сбербанк', content: undefined},
    {id: '3', sender: 'Оранжевый', content: undefined},
  ];
  const stl = {marginBottom: 14};
  return (
    <Layout>
      <StyledCard>
        <StyledText style={stl} variant="h1">
          Шаблоны уведомления
        </StyledText>
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
                icon={require('../../assets/icons8-delete-48.png')}
              />
            </PatternAction>
          </Pattern>
        ))}
      </StyledCard>
    </Layout>
  );
};

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
