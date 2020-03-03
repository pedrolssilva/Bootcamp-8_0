import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Wrapper,
  Container,
  LogoContainer,
  Logo,
  BasketContainer,
  ItemCount,
} from './styles';

function Header({ navigation, cartSize }) {
  console.tron.log(`[Header] =>`, navigation);
  return (
    <Wrapper>
      <Container>
        <LogoContainer onPress={() => navigation.navigate('Home')}>
          <Logo />
        </LogoContainer>
        <BasketContainer onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-basket" color="#FFF" size={24} />
          <ItemCount>{cartSize || 0}</ItemCount>
        </BasketContainer>
      </Container>
    </Wrapper>
  );
}

export default Header;
