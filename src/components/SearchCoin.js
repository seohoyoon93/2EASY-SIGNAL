import React, { Component } from "react";
import { Table, Search } from "semantic-ui-react";
import _ from "lodash";
import { connect } from "react-redux";
import { selectCoin } from "../store/actions/coinActions";

class SearchCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      value: "",
      results: []
    };
  }

  componentWillMount() {
    this.resetComponent();
  }

  componentDidMount() {
    this.setState({
      results: this.props.coins
    });
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleResultSelect = (e, { result }) => {
    this.props.selectCoin({
      symbol: result.symbol,
      nameKo: result.nameKo
    });
  };

  handleSearchChange = (e, data) => {
    console.log(data);
    let value = data.value;
    this.setState({ value }, () => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.state.results, isMatch)
      });
    });
  };

  handleClick = (e, data) => {
    console.log(e.target.getAttribute("data-item"));
  };

  render() {
    const { isLoading, value, results } = this.state;
    const rows =
      this.state.results !== undefined ? (
        this.state.results.map(item => {
          const divClass = item.priceChange >= 0 ? "up" : "down";
          return (
            <Table.Row>
              <Table.Cell>{`${item.nameKo} (${item.symbol})`}</Table.Cell>
              <Table.Cell>
                {`${item.mentionsPercentage}%`}
                <div className="cell-bottom">{`${item.mentions}회`}</div>
              </Table.Cell>
              <Table.Cell>
                <div className={divClass}>
                  {`${item.priceChange}%`}
                  <div className="cell-bottom">{`₩${item.price}%`}</div>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })
      ) : (
        <Table.Row onClick={this.handleClick} data-item="trclicked">
          <Table.Cell data-item="trclicked1">hey1</Table.Cell>
          <Table.Cell data-item="trclicked2">hey2</Table.Cell>
          <Table.Cell data-item="trclicked3">hey3</Table.Cell>
        </Table.Row>
      );
    return (
      <div className="search-coin">
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 50, {
            leading: true
          })}
          results={results}
          value={value}
        />
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>이름(심볼)</Table.HeaderCell>
              <Table.HeaderCell>최근 커뮤니티 언급비율</Table.HeaderCell>
              <Table.HeaderCell>전일대비/시세</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectCoin: coin => dispatch(selectCoin(coin))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SearchCoin);
