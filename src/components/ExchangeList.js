import React from "react";
import { Button } from "semantic-ui-react";

const ExchangeList = ({ exchanges }) => {
  return (
    <div className="exchanges-btns">
      {exchanges &&
        exchanges.map(exchange => {
          return <Button content={exchange.name} key={exchange.id} />;
        })}
    </div>
  );
};

export default ExchangeList;
