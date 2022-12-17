import React, {useCallback, useContext, useEffect, useState} from 'react';
import StyledText from '../../../components/Styled/StyledText';
import {AuthContext} from '../../../components/AuthProvider';
import Layout from '../../../components/Layout/Layout';
import StyledCard from '../../../components/Styled/StyledCard';
import Button from '../../../components/Styled/StyledButton';
import {Input} from '../../../components/UI';
import {RootStackParamList} from '../../../components/Navigation';
import {StackScreenProps} from '@react-navigation/stack';
import {createPattern} from '../api';

type Message = {text: string; id: string; type: string};
type Validation = {sender?: Message[]; content?: Message[]};
type Props = StackScreenProps<RootStackParamList, 'NotificationPattern'>;

const NotificationPattern = ({navigation, route}: Props) => {
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || !session) {
      // @ts-ignore
      navigation.navigate('Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionToken]);

  const [sender, setSender] = useState(route.params?.sender || '');
  const [content, setContent] = useState(route.params?.content || '');
  const [messages, setMessages] = useState<Validation>({
    sender: undefined,
    content: undefined,
  });
  const [inProgress, setInProgress] = useState(false);
  const onSubmit = useCallback(
    (data: any) => {
      return createPattern({...data, sessionToken});
    },
    [sessionToken],
  );
  const onPress = () => {
    const values = {sender, content};
    const msgSender = onValidateSender(sender);
    const msgContent = onValidateContent(content);
    const senderError = msgSender
      ? [{text: msgSender, id: 'sender-error', type: 'error'}]
      : undefined;
    const contentError = msgContent
      ? [{text: msgContent, id: 'content-error', type: 'error'}]
      : undefined;
    setMessages({
      sender: senderError,
      content: contentError,
    });
    if (senderError || contentError) {
      return;
    }
    setInProgress(true);
    onSubmit({...values}).finally(() => {
      setInProgress(false);
      // @ts-ignore
      navigation.navigate('NotificationPatternList');
    });
  };

  if (!isAuthenticated || !session) {
    return null;
  }

  const stl = {marginBottom: 14};
  return (
    <Layout>
      <StyledCard>
        <StyledText style={stl} variant="h1">
          Новый шаблон
        </StyledText>
        <Input
          name="sender"
          title="Отправитель"
          onChange={setSender}
          value={sender}
          disabled={inProgress}
          messages={messages.sender}
        />
        <Input
          name="content"
          title="Контент"
          onChange={setContent}
          value={content}
          disabled={inProgress}
          messages={messages.content}
        />
        <Button
          testID="submit-form"
          disabled={inProgress}
          title="Создать"
          onPress={onPress}
        />
      </StyledCard>
    </Layout>
  );
};

export default NotificationPattern;

function onValidateSender(value: string) {
  if (!value || !value.trim()) return 'Поле обязательно';
  return null;
}

function onValidateContent(_value: string) {
  return null;
}
