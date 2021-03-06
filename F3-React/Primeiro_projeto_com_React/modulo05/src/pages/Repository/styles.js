import styled from 'styled-components';

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Owner = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    color: #7159c1;
    font-size: 16px;
    text-decoration: none;
    align-self: flex-end;
  }

  img {
    width: 120px;
    border-radius: 50%;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    margin-top: 10px;
  }

  p {
    margin-top: 5px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    text-align: center;
    max-width: 400px;
  }
`;

export const IssueList = styled.ul`
  padding-top: 20px;
  margin-top: 30px;
  border-top: 1px solid #eee;
  list-style: none;

  li {
    display: flex;
    padding: 15px 10px;
    border: 1px solid #eee;
    border-radius: 4px;

    & + li {
      margin-top: 10px;
    }

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #eee;
    }

    div {
      flex: 1;
      margin-left: 15px;

      strong {
        font-size: 16px;

        a {
          text-decoration: #333;
          color: #333;

          &:hover {
            color: #7159c1;
          }
        }
      }

      span {
        background: #eee;
        color: #333;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        height: 20px;
        padding: 3px 4px;
        margin-left: 10px;
      }

      p {
        margin-top: 5px;
        font-size: 12px;
        color: #999;
      }
    }
  }
`;

export const IssueFilter = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 10px;

  p {
    align-self: center;
    font-size: 14px;
    color: #999;
  }

  button {
    margin: 0 0.25rem;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    background: #7159c1;
    color: #fff;

    &:nth-child(${props => props.active + 2}) {
      background: #576574;
      font-weight: bold;
      font-style: italic;
    }
  }
`;

export const PaginationControl = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  height: 20px;

  button {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    display: flex;
    border: none;
    border-radius: 4px;
    padding: 0 5px;
    align-items: center;
    color: #7159c1;
    background: none;

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  span {
    margin: 0 5px;
    align-self: center;
    color: #7159c1;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
  }
`;
