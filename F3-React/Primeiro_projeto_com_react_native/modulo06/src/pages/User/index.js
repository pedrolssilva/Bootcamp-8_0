import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Loading,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  constructor() {
    super();
    this.state = {
      stars: [],
      loading: false,
      page: 1,
      totalPages: 1,
    };
  }

  async componentDidMount() {
    this.load();
  }

  setTotalPAges = async link => {
    if (link) {
      const lastPage = await link.split(',').find(value => {
        const stringValue = String(value);
        return String(stringValue).includes('last');
      });

      if (lastPage) {
        const myRegexp = /(?:=)([\d]+)/g;
        const match = myRegexp.exec(lastPage);
        this.setState({ totalPages: match[1] });
      }
    }
  };

  load = async (page = 1) => {
    const { stars } = this.state;

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });

    await this.setTotalPAges(response.headers.link);

    if (response.data) {
      this.setState({
        loading: false,
        stars: page > 1 ? [...stars, ...response.data] : response.data,
        page,
      });
    }
  };

  loadMore = async () => {
    const { page } = this.state;
    const nextPage = page + 1;
    await this.load(nextPage);
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, page, totalPages } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReached={page < totalPages ? this.loadMore : null}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
