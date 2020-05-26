import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  return (
    <Wrapper>
      <Container>
        <LogoContainer
          onPress={() => {
            const { routeName } = navigation.state;
            if (routeName && !routeName.includes('Home'))
              navigation.replace('Home');
          }}
        >
          <Logo />
        </LogoContainer>
        <BasketContainer onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-basket" color="#FFF" size={24} />
          <ItemCount>{cartSize}</ItemCount>
        </BasketContainer>
      </Container>
    </Wrapper>
  );
}

Header.defaultProps = {
  cartSize: 0,
};

Header.propTypes = {
  navigation: PropTypes.shape().isRequired,
  cartSize: PropTypes.number,
};

export default connect(state => ({
  cartSize: state.cart.length,
}))(Header);
