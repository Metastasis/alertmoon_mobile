import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ThemeProps} from '@ory/themes';
import StyledText from '../../../components/Styled/StyledText';
import {AuthContext} from '../../../components/AuthProvider';
import Layout from '../../../components/Layout/Layout';
// @ts-ignore
import styled from 'styled-components/native';
import StyledCard from '../../../components/Styled/StyledCard';
import {Input} from '../../../components/UI';
import {RootStackParamList} from '../../../components/Navigation';
import {StackScreenProps} from '@react-navigation/stack';
import StyledButtonIcon from '../../../components/Styled/StyledButtonIcon';
import {listConfidants, grantAccess, revokeAccess, Confidant} from '../api';

type Props = StackScreenProps<RootStackParamList, 'NotificationPatternView'>;
type Message = {text: string; id: string; type: string};
type Validation = {confidantEmail?: Message[]};

const NotificationPatternView = ({navigation, route}: Props) => {
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);
  const [confidantEmail, setEmail] = useState('');
  const [accesses, setAccesses] = useState<Confidant[]>([]);
  const [messages, setMessages] = useState<Validation>({
    confidantEmail: undefined,
  });
  const [inProgress, setInProgress] = useState(false);

  const onSubmit = useCallback(
    (data: any) => {
      return grantAccess({...data, patternId: route.params.id, sessionToken});
    },
    [sessionToken, route.params],
  );
  const onGrantAccess = useCallback(() => {
    const values = {confidantEmail};
    const msgEmail = onValidateEmail(confidantEmail);
    const emailError = msgEmail
      ? [{text: msgEmail, id: 'email-error', type: 'error'}]
      : undefined;
    setMessages({
      confidantEmail: emailError,
    });
    if (emailError) {
      return;
    }
    setInProgress(true);
    onSubmit({...values}).finally(() => {
      setInProgress(false);
    });
  }, [onSubmit, setMessages, setInProgress, confidantEmail]);
  const onDelete = useCallback(
    (access: {patternId: string; confidantEmail: string}) => {
      revokeAccess({...access, sessionToken});
    },
    [sessionToken],
  );
  const onListConfidants = useCallback(() => {
    return listConfidants({sessionToken, patternId: route.params.id}).then(
      res => {
        setAccesses(res.data?.payload || []);
      },
    );
  }, [sessionToken, route.params]);
  useEffect(() => {
    if (!isAuthenticated || !session) {
      // @ts-ignore
      navigation.navigate('Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionToken]);
  useEffect(() => {
    onListConfidants();
  }, [onListConfidants]);
  if (!isAuthenticated || !session) {
    return null;
  }

  const {sender, content} = route.params;
  return (
    <Layout>
      <StyledCard>
        <Title>
          <StyledText variant="h1">{sender}</StyledText>
        </Title>
        {content && (
          <>
            <StyledText variant="p">Контент</StyledText>
            <StyledText variant="p">{content}</StyledText>
          </>
        )}
        <InputWithButton>
          <Input
            name="confidantEmail"
            title="Добавить E-mail"
            onChange={setEmail}
            value={confidantEmail}
            disabled={inProgress}
            messages={messages.confidantEmail}
            style={{width: '80%'}}
          />
          <CustomButton
            testID="submit-form"
            disabled={inProgress}
            onPress={onGrantAccess}
            icon={require('../../../assets/icons8-add-new-48.png')}
          />
        </InputWithButton>
        <StyledText variant="h2">Кому доступен шаблон</StyledText>
        {accesses.map(access => (
          <Pattern key={access.confidantEmail}>
            <PatternContent>
              <PatternTitle>{access.confidantEmail}</PatternTitle>
            </PatternContent>
            <PatternAction>
              <StyledButtonIcon
                onPress={() => onDelete(access)}
                icon={require('../../../assets/icons8-delete-48.png')}
              />
            </PatternAction>
          </Pattern>
        ))}
      </StyledCard>
    </Layout>
  );
};

export default NotificationPatternView;

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
const PatternTitle = styled(StyledText)`
  color: ${({theme}: ThemeProps) => theme.grey100};
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
  align-items: flex-start;
  justify-content: space-between;
`;
const CustomButton = styled(StyledButtonIcon)`
  margin-top: 35px;
`;

function onValidateEmail(value: string) {
  if (!value || !value.trim()) return 'Поле обязательно';
  return null;
}
