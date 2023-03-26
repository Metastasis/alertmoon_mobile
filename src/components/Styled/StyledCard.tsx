import React, {ReactNode} from 'react';
import styled from 'styled-components/native';
import {GridRow} from '../Layout/Grid';
import {ViewProps} from 'react-native';
import {ThemeProps} from '@ory/themes';

const StyledCard = styled.View`
  padding: 12px;

  background-color: ${({theme}: ThemeProps) => theme.grey0};
  border: 1px solid ${({theme}: ThemeProps) => theme.grey10};
`;

interface Props extends ViewProps {
  children: ReactNode;
  testID?: string;
}

export default ({testID, ...props}: Props) => (
  <GridRow testID={testID}>
    <StyledCard {...props} />
  </GridRow>
);
