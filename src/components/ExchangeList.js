import React from "react";
import { Button } from "semantic-ui-react";

const ExchangeList = props => {
  const { exchanges, selectedExchange, isSearching } = props;
  let btns;
  if (exchanges.length === 1) {
    btns = (
      <Button
        content={exchanges[0].name}
        key={exchanges[0].id}
        className="selected full"
      />
    );
  } else {
    btns =
      exchanges.length > 0 && !isSearching ? (
        exchanges.map(exchange => {
          const divClass = selectedExchange === exchange.name ? "selected" : "";
          return (
            <Button
              content={exchange.name}
              key={exchange.id}
              className={divClass}
              onClick={props.handleClick}
            />
          );
        })
      ) : (
        <div className="no-coin-selected" />
      );
  }
  return <div className="exchanges-btns">{btns}</div>;
};

export default ExchangeList;
