import React, {useCallback, useContext, useEffect, useState} from 'react';
import StyledText from '../Styled/StyledText';
import {AuthContext} from '../AuthProvider';
import Layout from '../Layout/Layout';
// @ts-ignore
import styled from 'styled-components/native';
import StyledCard from '../Styled/StyledCard';
import {Input} from '../UI';
import {RootStackParamList} from '../Navigation';
import {StackScreenProps} from '@react-navigation/stack';
import {theme as themeGlobal, ThemeProps} from '@ory/themes';
import StyledButtonIcon from '../Styled/StyledButtonIcon';

type Props = StackScreenProps<RootStackParamList, 'NotificationPatternView'>;
type Message = {text: string; id: string; type: string};
type Validation = {email?: Message[]};

const NotificationPatternView = ({navigation, route}: Props) => {
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState<Validation>({
    email: undefined,
  });
  const [inProgress, setInProgress] = useState(false);

  const onSubmit = useCallback((data: any) => {
    return Promise.resolve(data).then(console.log);
  }, []);
  const onGrantAccess = useCallback(() => {
    const values = {email};
    const msgEmail = onValidateEmail(email);
    const emailError = msgEmail
      ? [{text: msgEmail, id: 'email-error', type: 'error'}]
      : undefined;
    setMessages({
      email: emailError,
    });
    if (emailError) {
      return;
    }
    setInProgress(true);
    onSubmit({...values}).finally(() => {
      setInProgress(false);
    });
  }, [onSubmit, setMessages, setInProgress, email]);
  const onDelete = useCallback((access: {email: string}) => {
    console.log(access);
  }, []);
  useEffect(() => {
    if (!isAuthenticated || !session) {
      // @ts-ignore
      navigation.navigate('Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionToken]);

  if (!isAuthenticated || !session) {
    return null;
  }

  const {sender, content} = route.params;
  const stl = {marginBottom: 14};
  const accesses = [
    {email: 'test@gmail.com'},
    {email: 'detox@gmail.com'},
    {email: 'warmup@gmail.com'},
  ];
  return (
    <Layout>
      <StyledCard>
        <StyledText style={stl} variant="h1">
          {sender}
        </StyledText>
        {content && (
          <>
            <StyledText variant="p">Контент</StyledText>
            <StyledText variant="p">{content}</StyledText>
          </>
        )}
        <StyledText variant="h2">Добавить E-mail</StyledText>
        <InputWithButton>
          <Input
            name="email"
            title="E-mail"
            onChange={setEmail}
            value={email}
            disabled={inProgress}
            messages={messages.email}
            style={{width: '80%'}}
          />
          <CustomButton
            testID="submit-form"
            disabled={inProgress}
            onPress={onGrantAccess}
            icon={require('../../assets/icons8-add-new-48.png')}
          />
        </InputWithButton>
        <StyledText variant="h2">Кому доступен шаблон</StyledText>
        {accesses.map(access => (
          <Pattern key={access.email}>
            <PatternContent>
              <StyledText style={{color: themeGlobal.grey100}}>
                {access.email}
              </StyledText>
            </PatternContent>
            <PatternAction>
              <StyledButtonIcon
                onPress={() => onDelete(access)}
                icon={require('../../assets/icons8-delete-48.png')}
              />
            </PatternAction>
          </Pattern>
        ))}
      </StyledCard>
    </Layout>
  );
};

export default NotificationPatternView;

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
const InputWithButton = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  vertical-align: middle;
  line-height: 0;
`;
const CustomButton = styled(StyledButtonIcon)`
  opacity: 0.5;
`;

function onValidateEmail(value: string) {
  if (!value || !value.trim()) return 'Поле обязательно';
  return null;
}
