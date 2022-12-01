import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import StyledText from '../Styled/StyledText';
import {AuthContext} from '../AuthProvider';
import Layout from '../Layout/Layout';
import StyledCard from '../Styled/StyledCard';
import Button from '../Styled/StyledButton';
import {Input} from '../UI';

const NotificationPattern = () => {
  const navigation = useNavigation();
  const {isAuthenticated, session, sessionToken} = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || !session) {
      // @ts-ignore
      navigation.navigate('Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionToken]);

  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const onSubmit = useCallback((data: any) => {
    return Promise.resolve(data).then(console.log);
  }, []);
  const onPress = () => {
    setInProgress(true);
    const values = {sender, content};
    onSubmit({...values}).finally(() => {
      setInProgress(false);
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
          Уведомления
        </StyledText>
        <Input
          name="sender"
          title="Отправитель"
          onChange={setSender}
          value={sender}
          disabled={inProgress}
        />
        <Input
          name="content"
          title="Контент"
          onChange={setContent}
          value={content}
          disabled={inProgress}
        />
        <Button
          testID="submit-form"
          disabled={inProgress}
          title="Создать шаблон"
          onPress={() => {
            onPress();
          }}
        />
      </StyledCard>
    </Layout>
  );
};

export default NotificationPattern;
