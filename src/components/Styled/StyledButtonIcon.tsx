import React from 'react';
// @ts-ignore
import styled from 'styled-components/native';
import {NativeSyntheticEvent, NativeTouchEvent} from 'react-native';

const StyledContainer = styled.TouchableOpacity`
  opacity: ${({disabled}: StyleProps) => (disabled ? 0.5 : 1)};
`;

const StyledImage = styled.Image`
  height: 24px;
  width: 24px;
`;

interface StyleProps {
  disabled?: boolean;
  testID?: string;
}

interface ButtonProps extends StyleProps {
  icon: any;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

const StyledButtonIcon = ({onPress, testID, icon, disabled}: ButtonProps) => (
  <StyledContainer testID={testID} disabled={disabled} onPress={onPress}>
    <StyledImage disabled={disabled} source={icon} />
  </StyledContainer>
);

export default StyledButtonIcon;
