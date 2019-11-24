import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import api from '../../services/api';
import Container from '../../components/Container';

import {
  Loading,
  Owner,
  IssueList,
  IssueFilter,
  PaginationControl,
} from './styles';

export default class Repository extends Component {
  constructor() {
    super();
    this.state = {
      repository: {},
      issues: [],
      loading: true,
      filters: [
        { state: 'all', label: 'Todas' },
        { state: 'open', label: 'Abertas' },
        { state: 'closed', label: 'Fechadas' },
      ],
      filterIndex: 0,
      page: 1,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { filters, filterIndex, page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filters[filterIndex].state,
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  loadIssues = async () => {
    const { match } = this.props;
    const { filters, filterIndex, page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filters[filterIndex].state,
        per_page: 5,
        page,
      },
    });

    this.setState({
      issues: response.data,
    });
  };

  handleOnClickFilter = async optionIndex => {
    const { filterIndex } = this.state;
    if (filterIndex !== optionIndex) {
      this.setState({ page: 1 });
    }
    await this.setState({ filterIndex: optionIndex });
    this.loadIssues();
  };

  handlePaginateClick = async action => {
    const { page } = this.state;
    await this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });
    this.loadIssues();
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filters,
      filterIndex,
      page,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueList>
          <IssueFilter active={filterIndex}>
            <p>Filtrar por: </p>
            {filters.map((filter, index) => (
              <button
                type="button"
                key={filter.label}
                onClick={() => this.handleOnClickFilter(index)}
              >
                {filter.label}
              </button>
            ))}
          </IssueFilter>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        {issues.length > 0 && (
          <PaginationControl>
            <button
              disabled={page === 1}
              type="button"
              onClick={() => {
                this.handlePaginateClick('back');
              }}
            >
              <FaArrowLeft />
            </button>
            <span>{page}</span>
            <button
              type="button"
              onClick={() => {
                this.handlePaginateClick('next');
              }}
            >
              <FaArrowRight />
            </button>
          </PaginationControl>
        )}
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
