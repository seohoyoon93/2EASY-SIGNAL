import React from "react";
import { Button } from "semantic-ui-react";

const ExchangeList = props => {
  const { exchanges, selectedExchange } = props;
  const btns =
    exchanges.length > 0 ? (
      exchanges.map(exchange => {
        const divClass = selectedExchange == exchange.name ? "selected" : "";
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
      <div className="no-coin-selected">코인을 선택해야 거래소가 보입니다.</div>
    );
  return <div className="exchanges-btns">{btns}</div>;
};

export default ExchangeList;
