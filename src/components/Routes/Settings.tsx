import React, {useContext, useEffect, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {SelfServiceFlow} from '../Ory/Ui';
import {newKratosSdk} from '../../helpers/sdk';
import StyledCard from '../Styled/StyledCard';
import {AuthContext} from '../AuthProvider';
import Layout from '../Layout/Layout';
import StyledText from '../Styled/StyledText';
import {handleFormSubmitError} from '../../helpers/form';
import {
  SelfServiceSettingsFlow,
  SelfServiceSettingsFlowState,
  SubmitSelfServiceSettingsFlowBody,
} from '@ory/kratos-client';

const CardTitle = styled.View`
  margin-bottom: 15px;
`;

const Settings = () => {
  const navigation = useNavigation();
  const {isAuthenticated, sessionToken, setSession, syncSession} =
    useContext(AuthContext);
  const [flow, setFlow] = useState<SelfServiceSettingsFlow | undefined>(
    undefined,
  );

  const initializeFlow = (token: string) =>
    newKratosSdk()
      .initializeSelfServiceSettingsFlowWithoutBrowser(token)
      .then(({data: newFlow}) => {
        setFlow(newFlow);
      })
      .catch(console.error);

  useEffect(() => {
    if (sessionToken) {
      initializeFlow(sessionToken);
    }
  }, [sessionToken]);

  useEffect(() => {
    if (!isAuthenticated) {
      // @ts-ignore
      navigation.navigate('Login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!flow || !sessionToken) {
    return null;
  }

  const onSuccess = (result: SelfServiceSettingsFlow) => {
    if (result.state === SelfServiceSettingsFlowState.Success) {
      syncSession().then(() => {
        showMessage({
          message: 'Изменения сохранены',
          type: 'success',
        });
      });
    }
    setFlow(result);
  };

  const onSubmit = (payload: SubmitSelfServiceSettingsFlowBody) =>
    newKratosSdk()
      .submitSelfServiceSettingsFlow(flow.id, sessionToken, payload)
      .then(({data}: any) => {
        onSuccess(data);
      })
      .catch(
        handleFormSubmitError(
          setFlow,
          () => initializeFlow(sessionToken),
          () => setSession(null),
        ),
      );

  return (
    <Layout>
      <StyledCard testID={'settings-password'}>
        <CardTitle>
          <StyledText variant={'h2'}>Изменить пароль</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="password" onSubmit={onSubmit} />
      </StyledCard>

      <StyledCard testID={'settings-profile'}>
        <CardTitle>
          <StyledText variant={'h2'}>Профиль</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="profile" onSubmit={onSubmit} />
      </StyledCard>
    </Layout>
  );
};

export default Settings;
