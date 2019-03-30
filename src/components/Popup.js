import React from "react";

const Popup = props => {
  const { isHidden } = props;

  const divClass = isHidden ? "signal-info popup hidden" : "signal-info popup";
  return (
    <div className={divClass}>
      <div className="background" />
      <div className="btn-close" onClick={props.togglePopup}>
        Close
      </div>
      <div className="signal-info-content">
        <div className="paragraphs">
          <div className="paragraph">
            <p className="bold">EGG SIGNAL은 다음과 같은</p>
            <p className="bold">가공된 DATA를 제공하여 투자자 여러분이</p>
            <p className="bold">시세 급등, 급락에 대비할 수 있도록 돕습니다.</p>
          </div>
          <div className="paragraph">
            <p>- 최대 암호화폐 커뮤니티들의 암호화폐 언급비율,</p>
            <p>- 시간별 거래대금/시세 변동률,</p>
            <p>- 최근체결 매수/매도 비율</p>
          </div>
          <div className="paragraph">
            <p className="bold underlined">EGG SIGNAL은 특정 코인의</p>
            <p className="bold underlined">
              급등, 급락 상황에서 빛을 발합니다.
            </p>
            <p className="bold">
              투자자 여러분 모두 본 서비스를 통해 황금알을 얻는
            </p>
            <p className="bold">
              계기가 되기를 바라는 마음으로 서비스를 지속적으로
            </p>
            <p className="bold">업데이트 해나가도록 하겠습니다.</p>
          </div>
          <p className="small">
            추가 기능 요청 및 제휴 문의는 하단 텔레그램 및 이메일을
            참고해주세요.
          </p>
          <div className="links">
            <div>
              <img
                className="telegram-link"
                src="/images/telegram-logo.svg"
                alt="telegram"
              />
              @eggsignal
            </div>
            <div>
              <img
                className="mail-link"
                src="/images/icon_mail.svg"
                alt="mail"
              />
              contact@eggsignal.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
