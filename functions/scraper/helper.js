module.exports = {
  countCoinNickname: function(text) {
    //Initialize coins object
    let coinObj = coins.reduce(function(result, item, index, array) {
      result[item] = 0;
      return result;
    }, {});
    return mapNicknameToCoin(coinObj, coinNicknames, text);
  }
};

function count(symbol, nickname, coinObj, text) {
  const regexp = RegExp("\\s" + nickname + "|\\n" + nickname, "g");

  let count = 0;
  if (text.substr(0, nickname.length) === nickname) {
    ++count;
  }
  if (text.match(regexp) !== null) {
    count += text.match(regexp).length;
  }
  coinObj[symbol] += count;
  return coinObj;
}

function mapNicknameToCoin(coinObj, nicknames, text) {
  nicknames.forEach(nickname => {
    if (text.indexOf(nickname) !== -1) {
      switch (nickname) {
        case "CPT":
          count("CPT", nickname, coinObj, text);
          return;
        case "콘텐츠프로토콜":
          count("CPT", nickname, coinObj, text);
          return;
        case "씨피티":
          count("CPT", nickname, coinObj, text);
          return;
        case "왓챠":
          count("CPT", nickname, coinObj, text);
          return;
        case "폴리매쓰":
          count("POLY", nickname, coinObj, text);
          return;
        case "폴리매스":
          count("POLY", nickname, coinObj, text);
          return;
        case "POLY":
          count("POLY", nickname, coinObj, text);
          return;
        case "폴리":
          count("POLY", nickname, coinObj, text);
          return;
        case "비트코인":
          count("BTC", nickname, coinObj, text);
          return;
        case "비티씨":
          count("BTC", nickname, coinObj, text);
          return;
        case "BTC":
          count("BTC", nickname, coinObj, text);
          return;
        case "비트":
          count("BTC", nickname, coinObj, text);
          return;
        case "대장":
          count("BTC", nickname, coinObj, text);
          return;
        case "머장":
          count("BTC", nickname, coinObj, text);
          return;
        case "에이다":
          count("ADA", nickname, coinObj, text);
          return;
        case "쎄타퓨엘":
          count("TFUEL", nickname, coinObj, text);
          return;
        case "쎄퓨":
          count("TFUEL", nickname, coinObj, text);
          return;
        case "세타퓨엘":
          count("TFUEL", nickname, coinObj, text);
          return;
        case "세퓨":
          count("TFUEL", nickname, coinObj, text);
          return;
        case "리플":
          count("XRP", nickname, coinObj, text);
          return;
        case "리또속":
          count("XRP", nickname, coinObj, text);
          return;
        case "코스모코인":
          count("COSM", nickname, coinObj, text);
          return;
        case "코스모":
          count("COSM", nickname, coinObj, text);
          return;
        case "비캐":
          count("BCH", nickname, coinObj, text);
          return;
        case "빗캐":
          count("BCH", nickname, coinObj, text);
          return;
        case "파워렛저":
          count("POWR", nickname, coinObj, text);
          return;
        case "렛저":
          count("POWR", nickname, coinObj, text);
          return;
        case "트론":
          count("TRX", nickname, coinObj, text);
          return;
        case "이더리움":
          count("ETH", nickname, coinObj, text);
          return;
        case "이더":
          count("ETH", nickname, coinObj, text);
          return;
        case "그로스톨코인":
          count("GRS", nickname, coinObj, text);
          return;
        case "그톨":
          count("GRS", nickname, coinObj, text);
          return;
        case "그로스톨":
          count("GRS", nickname, coinObj, text);
          return;
        case "제로엑스":
          count("ZRX", nickname, coinObj, text);
          return;
        case "제엑":
          count("ZRX", nickname, coinObj, text);
          return;
        case "이오스":
          count("EOS", nickname, coinObj, text);
          return;
        case "엔진코인":
          count("ENJ", nickname, coinObj, text);
          return;
        case "엔진":
          count("ENJ", nickname, coinObj, text);
          return;
        case "모스코인":
          count("MOC", nickname, coinObj, text);
          return;
        case "모스":
          count("MOC", nickname, coinObj, text);
          return;
        case "쿼크체인":
          count("QKC", nickname, coinObj, text);
          return;
        case "쿼크":
          count("QKC", nickname, coinObj, text);
          return;
        case "쿼체":
          count("QKC", nickname, coinObj, text);
          return;
        case "아인스타이늄":
          count("EMC2", nickname, coinObj, text);
          return;
        case "아인":
          count("EMC2", nickname, coinObj, text);
          return;
        case "비트토렌트":
          count("BTT", nickname, coinObj, text);
          return;
        case "비티티":
          count("BTT", nickname, coinObj, text);
          return;
        case "스팀":
          count("STEEM", nickname, coinObj, text);
          return;
        case "아이콘":
          count("ICX", nickname, coinObj, text);
          return;
        case "스텔라루멘":
          count("XLM", nickname, coinObj, text);
          return;
        case "스텔라":
          count("XLM", nickname, coinObj, text);
          return;
        case "스토리지":
          count("STORJ", nickname, coinObj, text);
          return;
        case "베이직어텐션토큰":
          count("BAT", nickname, coinObj, text);
          return;
        case "베이직어텐션":
          count("BAT", nickname, coinObj, text);
          return;
        case "베이직":
          count("BAT", nickname, coinObj, text);
          return;
        case "오미세고":
          count("OMG", nickname, coinObj, text);
          return;
        case "어미새":
          count("OMG", nickname, coinObj, text);
          return;
        case "아이오타":
          count("IOTA", nickname, coinObj, text);
          return;
        case "퀀텀":
          count("QTUM", nickname, coinObj, text);
          return;
        case "똥텀":
          count("QTUM", nickname, coinObj, text);
          return;
        case "큐텀":
          count("QTUM", nickname, coinObj, text);
          return;
        case "쎄타토큰":
          count("THETA", nickname, coinObj, text);
          return;
        case "쎄타":
          count("THETA", nickname, coinObj, text);
          return;
        case "세타":
          count("THETA", nickname, coinObj, text);
          return;
        case "질리카":
          count("ZIL", nickname, coinObj, text);
          return;
        case "메인프레임":
          count("MFT", nickname, coinObj, text);
          return;
        case "매프":
          count("MFT", nickname, coinObj, text);
          return;
        case "메프":
          count("MFT", nickname, coinObj, text);
          return;
        case "매인프레임":
          count("MFT", nickname, coinObj, text);
          return;
        case "엘프":
          count("ELF", nickname, coinObj, text);
          return;
        case "리퍼리움":
          count("RFR", nickname, coinObj, text);
          return;
        case "리퍼":
          count("RFR", nickname, coinObj, text);
          return;
        case "시린토큰":
          count("SRN", nickname, coinObj, text);
          return;
        case "시린":
          count("SRN", nickname, coinObj, text);
          return;
        case "메디블록":
          count("MEDX", nickname, coinObj, text);
          return;
        case "메디":
          count("MEDX", nickname, coinObj, text);
          return;
        case "스톰":
          count("STORM", nickname, coinObj, text);
          return;
        case "센티넬프로토콜":
          count("UPP", nickname, coinObj, text);
          return;
        case "센티넬":
          count("UPP", nickname, coinObj, text);
          return;
        case "디마켓":
          count("DMT", nickname, coinObj, text);
          return;
        case "엔도르":
          count("EDR", nickname, coinObj, text);
          return;
        case "애드엑스":
          count("ADX", nickname, coinObj, text);
          return;
        case "에드액스":
          count("ADX", nickname, coinObj, text);
          return;
        case "메탈":
          count("MTL", nickname, coinObj, text);
          return;
        case "온톨로지가스":
          count("ONG", nickname, coinObj, text);
          return;
        case "온톨가스":
          count("ONG", nickname, coinObj, text);
          return;
        case "온톨":
          count("ONT", nickname, coinObj, text);
          return;
        case "온톨로지":
          count("ONT", nickname, coinObj, text);
          return;
        case "에스브이":
          count("BSV", nickname, coinObj, text);
          return;
        case "sv":
          count("BSV", nickname, coinObj, text);
          return;
        case "기프토":
          count("GTO", nickname, coinObj, text);
          return;
        case "카이버네트워크":
          count("KNC", nickname, coinObj, text);
          return;
        case "카이버":
          count("KNC", nickname, coinObj, text);
          return;
        case "스트라티스":
          count("STRAT", nickname, coinObj, text);
          return;
        case "스트라":
          count("STRAT", nickname, coinObj, text);
          return;
        case "스테이터스":
          count("SNT", nickname, coinObj, text);
          return;
        case "슨트":
          count("SNT", nickname, coinObj, text);
          return;
        case "시아코인":
          count("SC", nickname, coinObj, text);
          return;
        case "시아":
          count("SC", nickname, coinObj, text);
          return;
        case "클래식":
          count("ETC", nickname, coinObj, text);
          return;
        case "이클":
          count("ETC", nickname, coinObj, text);
          return;
        case "에브리피디아":
          count("IQ", nickname, coinObj, text);
          return;
        case "에브리":
          count("IQ", nickname, coinObj, text);
          return;
        case "머큐리":
          count("MER", nickname, coinObj, text);
          return;
        case "네오":
          count("NEO", nickname, coinObj, text);
          return;
        case "아이오에스티":
          count("IOST", nickname, coinObj, text);
          return;
        case "이오스트":
          count("IOST", nickname, coinObj, text);
          return;
        case "라이트코인":
          count("LTC", nickname, coinObj, text);
          return;
        case "라코":
          count("LTC", nickname, coinObj, text);
          return;
        case "오에스티":
          count("OST", nickname, coinObj, text);
          return;
        case "피벡스":
          count("PIVX", nickname, coinObj, text);
          return;
        case "피벡":
          count("PIVX", nickname, coinObj, text);
          return;
        case "지캐시":
          count("ZEC", nickname, coinObj, text);
          return;
        case "지캐쉬":
          count("ZEC", nickname, coinObj, text);
          return;
        case "넴":
          count("XEM", nickname, coinObj, text);
          return;
        case "버트":
          count("VTC", nickname, coinObj, text);
          return;
        case "아크":
          count("ARK", nickname, coinObj, text);
          return;
        case "룸":
          count("LOOM", nickname, coinObj, text);
          return;
        case "시빅":
          count("CVC", nickname, coinObj, text);
          return;
        case "아더":
          count("ARDR", nickname, coinObj, text);
          return;
        case "애드토큰":
          count("ADT", nickname, coinObj, text);
          return;
        case "가스":
          count("GAS", nickname, coinObj, text);
          return;
        case "스팀달러":
          count("SBD", nickname, coinObj, text);
          return;
        case "스팀":
          count("STEEM", nickname, coinObj, text);
          return;
        case "웨이브":
          count("WAVES", nickname, coinObj, text);
          return;
        case "왁스":
          count("WAX", nickname, coinObj, text);
          return;
        case "골렘":
          count("GNT", nickname, coinObj, text);
          return;
        case "이그니스":
          count("IGNIS", nickname, coinObj, text);
          return;
        case "비골":
          count("BTG", nickname, coinObj, text);
          return;
        case "리스크":
          count("LSK", nickname, coinObj, text);
          return;
        case "모네로":
          count("XMR", nickname, coinObj, text);
          return;
        case "어거":
          count("REP", nickname, coinObj, text);
          return;
        case "대시":
          count("DASH", nickname, coinObj, text);
          return;
        case "코모도":
          count("KMD", nickname, coinObj, text);
          return;
        case "크립토닷컴":
          count("MCO", nickname, coinObj, text);
          return;
        case "디크레드":
          count("DCR", nickname, coinObj, text);
          return;
        case "ADA":
          count("ADA", nickname, coinObj, text);
          return;
        case "TFUEL":
          count("TFUEL", nickname, coinObj, text);
          return;
        case "XRP":
          count("XRP", nickname, coinObj, text);
          return;
        case "COSM":
          count("COSM", nickname, coinObj, text);
          return;
        case "BCH":
          count("BCH", nickname, coinObj, text);
          return;
        case "POWR":
          count("POWR", nickname, coinObj, text);
          return;
        case "TRX":
          count("TRX", nickname, coinObj, text);
          return;
        case "ETH":
          count("ETH", nickname, coinObj, text);
          return;
        case "GRS":
          count("GRS", nickname, coinObj, text);
          return;
        case "ZRX":
          count("ZRX", nickname, coinObj, text);
          return;
        case "EOS":
          count("EOS", nickname, coinObj, text);
          return;
        case "ENJ":
          count("ENJ", nickname, coinObj, text);
          return;
        case "MOC":
          count("MOC", nickname, coinObj, text);
          return;
        case "QKC":
          count("QKC", nickname, coinObj, text);
          return;
        case "EMC2":
          count("EMC2", nickname, coinObj, text);
          return;
        case "BTT":
          count("BTT", nickname, coinObj, text);
          return;
        case "STEEM":
          count("STEEM", nickname, coinObj, text);
          return;
        case "ICX":
          count("ICX", nickname, coinObj, text);
          return;
        case "XLM":
          count("XLM", nickname, coinObj, text);
          return;
        case "STORJ":
          count("STORJ", nickname, coinObj, text);
          return;
        case "BAT":
          count("BAT", nickname, coinObj, text);
          return;
        case "OMG":
          count("OMG", nickname, coinObj, text);
          return;
        case "IOTA":
          count("IOTA", nickname, coinObj, text);
          return;
        case "QTUM":
          count("QTUM", nickname, coinObj, text);
          return;
        case "THETA":
          count("THETA", nickname, coinObj, text);
          return;
        case "ZIL":
          count("ZIL", nickname, coinObj, text);
          return;
        case "MFT":
          count("MFT", nickname, coinObj, text);
          return;
        case "ELF":
          count("ELF", nickname, coinObj, text);
          return;
        case "RFR":
          count("RFR", nickname, coinObj, text);
          return;
        case "SRN":
          count("SRN", nickname, coinObj, text);
          return;
        case "MEDX":
          count("MEDX", nickname, coinObj, text);
          return;
        case "STORM":
          count("STORM", nickname, coinObj, text);
          return;
        case "UPP":
          count("UPP", nickname, coinObj, text);
          return;
        case "DMT":
          count("DMT", nickname, coinObj, text);
          return;
        case "EDR":
          count("EDR", nickname, coinObj, text);
          return;
        case "ADX":
          count("ADX", nickname, coinObj, text);
          return;
        case "MTL":
          count("MTL", nickname, coinObj, text);
          return;
        case "ONG":
          count("ONG", nickname, coinObj, text);
          return;
        case "BSV":
          count("BSV", nickname, coinObj, text);
          return;
        case "GTO":
          count("GTO", nickname, coinObj, text);
          return;
        case "KNC":
          count("KNC", nickname, coinObj, text);
          return;
        case "STRAT":
          count("STRAT", nickname, coinObj, text);
          return;
        case "SNT":
          count("SNT", nickname, coinObj, text);
          return;
        case "SC":
          count("SC", nickname, coinObj, text);
          return;
        case "ETC":
          count("ETC", nickname, coinObj, text);
          return;
        case "IQ":
          count("IQ", nickname, coinObj, text);
          return;
        case "MER":
          count("MER", nickname, coinObj, text);
          return;
        case "NEO":
          count("NEO", nickname, coinObj, text);
          return;
        case "IOST":
          count("IOST", nickname, coinObj, text);
          return;
        case "LTC":
          count("LTC", nickname, coinObj, text);
          return;
        case "OST":
          count("OST", nickname, coinObj, text);
          return;
        case "PIVX":
          count("PIVX", nickname, coinObj, text);
          return;
        case "ONT":
          count("ONT", nickname, coinObj, text);
          return;
        case "ZEC":
          count("ZEC", nickname, coinObj, text);
          return;
        case "XEM":
          count("XEM", nickname, coinObj, text);
          return;
        case "VTC":
          count("VTC", nickname, coinObj, text);
          return;
        case "ARK":
          count("ARK", nickname, coinObj, text);
          return;
        case "LOOM":
          count("LOOM", nickname, coinObj, text);
          return;
        case "CVC":
          count("CVC", nickname, coinObj, text);
          return;
        case "ARDR":
          count("ARDR", nickname, coinObj, text);
          return;
        case "ADT":
          count("ADT", nickname, coinObj, text);
          return;
        case "GAS":
          count("GAS", nickname, coinObj, text);
          return;
        case "SBD":
          count("SBD", nickname, coinObj, text);
          return;
        case "WAVES":
          count("WAVES", nickname, coinObj, text);
          return;
        case "WAX":
          count("WAX", nickname, coinObj, text);
          return;
        case "GNT":
          count("GNT", nickname, coinObj, text);
          return;
        case "IGNIS":
          count("IGNIS", nickname, coinObj, text);
          return;
        case "BTG":
          count("BTC", nickname, coinObj, text);
          return;
        case "LSK":
          count("LSK", nickname, coinObj, text);
          return;
        case "XMR":
          count("XMR", nickname, coinObj, text);
          return;
        case "REP":
          count("REP", nickname, coinObj, text);
          return;
        case "DASH":
          count("DASH", nickname, coinObj, text);
          return;
        case "KMD":
          count("KMD", nickname, coinObj, text);
          return;
        case "MCO":
          count("MCO", nickname, coinObj, text);
          return;
        case "DCR":
          count("DCR", nickname, coinObj, text);
          return;
        case "GVT":
          count("GVT", nickname, coinObj, text);
          return;
        case "제네시스":
          count("GVT", nickname, coinObj, text);
          return;
        case "대시":
          count("DASH", nickname, coinObj, text);
          return;
        case "DASH":
          count("DASH", nickname, coinObj, text);
          return;
        case "대쉬":
          count("DASH", nickname, coinObj, text);
          return;
        case "크론":
          count("KREX", nickname, coinObj, text);
          return;
        case "KREX":
          count("KREX", nickname, coinObj, text);
          return;
        case "비앤비":
          count("BNB", nickname, coinObj, text);
          return;
        case "BNB":
          count("BNB", nickname, coinObj, text);
          return;
        case "FNB":
          count("FNB", nickname, coinObj, text);
          return;
        case "엑스탁":
          count("XTX", nickname, coinObj, text);
          return;
        case "XTX":
          count("XTX", nickname, coinObj, text);
          return;
        case "엑탁":
          count("XTX", nickname, coinObj, text);
          return;
        case "탁탁":
          count("XTX", nickname, coinObj, text);
          return;
        case "아티스타":
          count("ARTS", nickname, coinObj, text);
          return;
        case "ARTS":
          count("ARTS", nickname, coinObj, text);
          return;
        case "이브이지":
          count("EVZ", nickname, coinObj, text);
          return;
        case "EVZ":
          count("EVZ", nickname, coinObj, text);
          return;
        case "드림캐쳐":
          count("DRC", nickname, coinObj, text);
          return;
        case "드림캐처":
          count("DRC", nickname, coinObj, text);
          return;
        case "DRC":
          count("DRC", nickname, coinObj, text);
          return;
        case "알파콘":
          count("ALP", nickname, coinObj, text);
          return;
        case "ALP":
          count("ALP", nickname, coinObj, text);
          return;
        case "볼트":
          count("BOLT", nickname, coinObj, text);
          return;
        case "BOLT":
          count("BOLT", nickname, coinObj, text);
          return;
        case "게임엑스":
          count("GXC", nickname, coinObj, text);
          return;
        case "GXC":
          count("GXC", nickname, coinObj, text);
          return;
        case "클라우드브릭":
          count("CLB", nickname, coinObj, text);
          return;
        case "CLB":
          count("CLB", nickname, coinObj, text);
          return;
        case "리얼트랙트":
          count("RET", nickname, coinObj, text);
          return;
        case "RET":
          count("RET", nickname, coinObj, text);
          return;
        case "유니오":
          count("UUNIO", nickname, coinObj, text);
          return;
        case "UUNIO":
          count("UUNIO", nickname, coinObj, text);
          return;
        case "딜":
          count("DEAL", nickname, coinObj, text);
          return;
        case "DEAL":
          count("DEAL", nickname, coinObj, text);
          return;
        case "콘뉴":
          count("CNN", nickname, coinObj, text);
          return;
        case "콘텐츠뉴트럴리티":
          count("CNN", nickname, coinObj, text);
          return;
        case "CNN":
          count("CNN", nickname, coinObj, text);
          return;
        case "레이븐":
          count("RVN", nickname, coinObj, text);
          return;
        case "RVN":
          count("RVN", nickname, coinObj, text);
          return;
        case "덱스터":
          count("DXR", nickname, coinObj, text);
          return;
        case "덱스":
          count("DEX", nickname, coinObj, text);
          return;
        case "덱지":
          count("DXG", nickname, coinObj, text);
          return;
        case "아비":
          count("ARBI", nickname, coinObj, text);
          return;
        case "ARBI":
          count("ARBI", nickname, coinObj, text);
          return;
        case "ZPR":
          count("ZPR", nickname, coinObj, text);
          return;
        case "지퍼":
          count("ZPR", nickname, coinObj, text);
          return;
        case "피오에이":
          count("POA", nickname, coinObj, text);
          return;
        case "POA":
          count("POA", nickname, coinObj, text);
          return;
        case "인슈어리움":
          count("ISR", nickname, coinObj, text);
          return;
        case "ISR":
          count("ISR", nickname, coinObj, text);
          return;
        case "디스트릭트":
          count("DNT", nickname, coinObj, text);
          return;
        case "DNT":
          count("DNT", nickname, coinObj, text);
          return;
        case "MVL":
          count("MVL", nickname, coinObj, text);
          return;
        case "엠블":
          count("MVL", nickname, coinObj, text);
          return;
        case "펀디":
          count("NPXS", nickname, coinObj, text);
          return;
        case "NPXS":
          count("NPXS", nickname, coinObj, text);
          return;
        case "에이팟":
          count("APOT", nickname, coinObj, text);
          return;
        case "APOT":
          count("APOT", nickname, coinObj, text);
          return;
        case "비아":
          count("VIA", nickname, coinObj, text);
          return;
        case "VIA":
          count("VIA", nickname, coinObj, text);
          return;
        case "완체인":
          count("WAN", nickname, coinObj, text);
          return;
        case "WAN":
          count("WAN", nickname, coinObj, text);
          return;
        case "뉴클리어스":
          count("NCASH", nickname, coinObj, text);
          return;
        case "NCASH":
          count("NCASH", nickname, coinObj, text);
          return;
        case "ROM":
          count("ROM", nickname, coinObj, text);
          return;
        case "롬":
          count("ROM", nickname, coinObj, text);
          return;
        case "모에다":
          count("MDA", nickname, coinObj, text);
          return;
        case "MDA":
          count("MDA", nickname, coinObj, text);
          return;
        case "펀페어":
          count("FUN", nickname, coinObj, text);
          return;
        case "FUN":
          count("FUN", nickname, coinObj, text);
          return;
        case "레드펄스":
          count("PHX", nickname, coinObj, text);
          return;
        case "PHX":
          count("PHX", nickname, coinObj, text);
          return;
        case "피닉스":
          count("PHX", nickname, coinObj, text);
          return;
        case "애론":
          count("ARN", nickname, coinObj, text);
          return;
        case "ARN":
          count("ARN", nickname, coinObj, text);
          return;
        case "이더파티":
          count("FUEL", nickname, coinObj, text);
          return;
        case "고체인":
          count("GO", nickname, coinObj, text);
          return;
        case "렌드":
          count("LEND", nickname, coinObj, text);
          return;
        case "독":
          count("DOCK", nickname, coinObj, text);
          return;
        case "나노":
          count("NANO", nickname, coinObj, text);
          return;
        case "팍소스":
          count("PAX", nickname, coinObj, text);
          return;
        case "월튼":
          count("WTC", nickname, coinObj, text);
          return;
        case "아이오텍스":
          count("IOTX", nickname, coinObj, text);
          return;
        case "LEND":
          count("LEND", nickname, coinObj, text);
          return;
        case "GO":
          count("GO", nickname, coinObj, text);
          return;
        case "WTC":
          count("WTC", nickname, coinObj, text);
          return;
        case "PAX":
          count("PAX", nickname, coinObj, text);
          return;
        case "IOTX":
          count("IOTX", nickname, coinObj, text);
          return;
        case "셀프키":
          count("KEY", nickname, coinObj, text);
          return;
        case "KEY":
          count("KEY", nickname, coinObj, text);
          return;
        case "페미":
          count("FEMI", nickname, coinObj, text);
          return;
        case "FEMI":
          count("FEMI", nickname, coinObj, text);
          return;
        case "유니":
          count("IUC", nickname, coinObj, text);
          return;
        case "썬체인":
          count("SUNC", nickname, coinObj, text);
          return;
        case "튜다":
          count("TUDA", nickname, coinObj, text);
          return;
        case "프론티어":
          count("FRNT", nickname, coinObj, text);
          return;
        case "오투오":
          count("O2O", nickname, coinObj, text);
          return;
        case "비체인":
          count("VET", nickname, coinObj, text);
          return;
        case "앱코인즈":
          count("APPC", nickname, coinObj, text);
          return;
        case "APPC":
          count("APPC", nickname, coinObj, text);
          return;
        case "신디케이터":
          count("CND", nickname, coinObj, text);
          return;
        case "CND":
          count("CND", nickname, coinObj, text);
          return;
        case "VET":
          count("VET", nickname, coinObj, text);
          return;
        case "AION":
          count("AION", nickname, coinObj, text);
          return;
        case "체인링크":
          count("LINK", nickname, coinObj, text);
          return;
        case "오에스티":
          count("OST", nickname, coinObj, text);
          return;
        case "요요":
          count("YOYO", nickname, coinObj, text);
          return;
        case "YOYO":
          count("YOYO", nickname, coinObj, text);
          return;
        case "스카이코인":
          count("SKY", nickname, coinObj, text);
          return;
        case "SKY":
          count("SKY", nickname, coinObj, text);
          return;
        case "하이퍼캐쉬":
          count("HC", nickname, coinObj, text);
          return;
        case "HC":
          count("HC", nickname, coinObj, text);
          return;
        case "모던토큰":
          count("MOD", nickname, coinObj, text);
          return;
        case "다이아몬드":
          count("BCD", nickname, coinObj, text);
          return;
        case "엠브로서스":
          count("AMB", nickname, coinObj, text);
          return;
        case "넥서스":
          count("NXS", nickname, coinObj, text);
          return;
        case "큐링크":
          count("QLC", nickname, coinObj, text);
          return;
        case "타임뉴뱅크":
          count("TNB", nickname, coinObj, text);
          return;
        case "포엣":
          count("POE", nickname, coinObj, text);
          return;
        case "사이버마일즈":
          count("CMT", nickname, coinObj, text);
          return;
        case "바이버":
          count("VIB", nickname, coinObj, text);
          return;
        case "VIB":
          count("VIB", nickname, coinObj, text);
          return;
        case "에이치닥":
          count("HDAC", nickname, coinObj, text);
          return;
        case "아피스":
          count("APIS", nickname, coinObj, text);
          return;
        case "미스릴":
          count("MITH", nickname, coinObj, text);
          return;
        case "MITH":
          count("MITH", nickname, coinObj, text);
          return;
        case "에토스":
          count("ETHOS", nickname, coinObj, text);
          return;
        case "ETHOS":
          count("ETHOS", nickname, coinObj, text);
          return;
        case "텐엑스":
          count("PAY", nickname, coinObj, text);
          return;
        case "루프링":
          count("LRC", nickname, coinObj, text);
          return;
        case "파퓰러스":
          count("PPT", nickname, coinObj, text);
          return;
        case "코르텍스":
          count("CTXC", nickname, coinObj, text);
          return;
        case "애터니티":
          count("AE", nickname, coinObj, text);
          return;
        case "트루체인":
          count("TRUE", nickname, coinObj, text);
          return;
        case "아크블록":
          count("ABT", nickname, coinObj, text);
          return;
        case "원루트":
          count("RNT", nickname, coinObj, text);
          return;
        case "플레이":
          count("PLY", nickname, coinObj, text);
          return;
        case "프리마스":
          count("PST", nickname, coinObj, text);
          return;
        case "솔트":
          count("SALT", nickname, coinObj, text);
          return;
        case "레이든":
          count("RDN", nickname, coinObj, text);
          return;
        case "아이앤에스":
          count("INS", nickname, coinObj, text);
          return;
        case "베잔트":
          count("BZNT", nickname, coinObj, text);
          return;
        case "오디세이":
          count("OCN", nickname, coinObj, text);
          return;
        case "위쇼":
          count("WET", nickname, coinObj, text);
          return;
        case "아모":
          count("AMO", nickname, coinObj, text);
          return;
        case "이더제로":
          count("ETZ", nickname, coinObj, text);
          return;
        case "에어론":
          count("ARN", nickname, coinObj, text);
          return;
        case "디에이씨씨":
          count("DACC", nickname, coinObj, text);
          return;
        case "다빈치":
          count("DAC", nickname, coinObj, text);
          return;
        case "비에이치피":
          count("BHP", nickname, coinObj, text);
          return;
        case "마이다스":
          count("TMTG", nickname, coinObj, text);
          return;
        case "큐브":
          count("AUTO", nickname, coinObj, text);
          return;
        case "지엑스체인":
          count("GXC", nickname, coinObj, text);
          return;
        case "KIN":
          count("KIN", nickname, coinObj, text);
          return;
        case "킨":
          count("KIN", nickname, coinObj, text);
          return;
        case "MXM":
          count("MXM", nickname, coinObj, text);
          return;
        case "맥시마인":
          count("MXM", nickname, coinObj, text);
          return;
        case "R":
          count("R", nickname, coinObj, text);
          return;
        case "리베인":
          count("R", nickname, coinObj, text);
          return;
        case "ROMTV":
          count("ROMTV", nickname, coinObj, text);
          return;
        case "롬티비":
          count("ROMTV", nickname, coinObj, text);
          return;
        case "NXT":
          count("NXT", nickname, coinObj, text);
          return;
        case "엔엑":
          count("NXT", nickname, coinObj, text);
          return;
        case "NEXO":
          count("NEXO", nickname, coinObj, text);
          return;
        case "넥소":
          count("NEXO", nickname, coinObj, text);
          return;
        case "NET":
          count("NET", nickname, coinObj, text);
          return;
        case "넥스트":
          count("NET", nickname, coinObj, text);
          return;
        case "BLINK":
          count("BLINK", nickname, coinObj, text);
          return;
        case "블록메이슨":
          count("BLINK", nickname, coinObj, text);
          return;
        case "블메":
          count("BLINK", nickname, coinObj, text);
          return;
        case "블링크":
          count("BLINK", nickname, coinObj, text);
          return;
        case "이그드라시":
          count("YEED", nickname, coinObj, text);
          return;
        case "YEED":
          count("YEED", nickname, coinObj, text);
          return;
        case "디센트럴":
          count("MANA", nickname, coinObj, text);
          return;
        case "MANA":
          count("MANA", nickname, coinObj, text);
          return;
        default:
          return;
      }
    }
  });
  return coinObj;
}

const coinNicknames = [
  "CPT",
  "콘텐츠프로토콜",
  "씨피티",
  "왓챠",
  "폴리매쓰",
  "폴리매스",
  "POLY",
  "폴리",
  "비트코인",
  "비티씨",
  "BTC",
  "비트",
  "대장",
  "머장",
  "에이다",
  "쎄타퓨엘",
  "쎄퓨",
  "세타퓨엘",
  "세퓨",
  "리플",
  "리또속",
  "코스모코인",
  "코스모",
  "비캐",
  "빗캐",
  "파워렛저",
  "렛저",
  "트론",
  "이더리움",
  "이더",
  "그로스톨코인",
  "그톨",
  "그로스톨",
  "제로엑스",
  "제엑",
  "이오스",
  "엔진코인",
  "엔진",
  "모스코인",
  "모스",
  "쿼크체인",
  "쿼크",
  "쿼체",
  "아인스타이늄",
  "아인",
  "비트토렌트",
  "비티티",
  "스팀",
  "아이콘",
  "스텔라루멘",
  "스텔라",
  "스토리지",
  "베이직어텐션토큰",
  "베이직어텐션",
  "베이직",
  "오미세고",
  "어미새",
  "아이오타",
  "퀀텀",
  "똥텀",
  "큐텀",
  "쎄타토큰",
  "쎄타",
  "세타",
  "질리카",
  "메인프레임",
  "매프",
  "메프",
  "매인프레임",
  "엘프",
  "리퍼리움",
  "리퍼",
  "시린토큰",
  "시린",
  "메디블록",
  "메디",
  "스톰",
  "센티넬프로토콜",
  "센티넬",
  "디마켓",
  "엔도르",
  "애드엑스",
  "에드액스",
  "메탈",
  "온톨로지가스",
  "온톨",
  "온톨로지",
  "온톨가스",
  "에스브이",
  "sv",
  "기프토",
  "카이버네트워크",
  "카이버",
  "스트라티스",
  "스트라",
  "스테이터스",
  "슨트",
  "시아코인",
  "시아",
  "클래식",
  "이클",
  "에브리피디아",
  "에브리",
  "머큐리",
  "네오",
  "아이오에스티",
  "이오스트",
  "라이트코인",
  "라코",
  "오에스티",
  "피벡스",
  "피벡",
  "지캐시",
  "지캐쉬",
  "넴",
  "버트",
  "아크",
  "룸",
  "시빅",
  "아더",
  "애드토큰",
  "가스",
  "스팀달러",
  "스팀",
  "웨이브",
  "왁스",
  "골렘",
  "이그니스",
  "비골",
  "리스크",
  "모네로",
  "어거",
  "대시",
  "코모도",
  "크립토닷컴",
  "디크레드",
  "ADA",
  "TFUEL",
  "XRP",
  "COSM",
  "BCH",
  "POWR",
  "TRX",
  "ETH",
  "GRS",
  "ZRX",
  "EOS",
  "ENJ",
  "MOC",
  "QKC",
  "EMC2",
  "BTT",
  "STEEM",
  "ICX",
  "XLM",
  "STORJ",
  "BAT",
  "OMG",
  "IOTA",
  "QTUM",
  "THETA",
  "ZIL",
  "MFT",
  "ELF",
  "RFR",
  "SRN",
  "MEDX",
  "STORM",
  "UPP",
  "DMT",
  "EDR",
  "ADX",
  "MTL",
  "ONG",
  "BSV",
  "GTO",
  "KNC",
  "STRAT",
  "SNT",
  "SC",
  "ETC",
  "IQ",
  "MER",
  "NEO",
  "IOST",
  "LTC",
  "OST",
  "PIVX",
  "ONT",
  "ZEC",
  "XEM",
  "VTC",
  "ARK",
  "LOOM",
  "CVC",
  "ARDR",
  "ADT",
  "GAS",
  "SBD",
  "WAVES",
  "WAX",
  "GNT",
  "IGNIS",
  "BTG",
  "LSK",
  "XMR",
  "REP",
  "DASH",
  "KMD",
  "MCO",
  "DCR",
  "GVT",
  "제네시스",
  "대시",
  "DASH",
  "대쉬",
  "크론",
  "비앤비",
  "FNB",
  "BNB",
  "KREX",
  "엑스탁",
  "XTX",
  "엑탁",
  "탁탁",
  "아티스타",
  "ARTS",
  "이브이지",
  "EVZ",
  "드림캐쳐",
  "드림캐처",
  "DRC",
  "알파콘",
  "ALP",
  "볼트",
  "BOLT",
  "게임엑스",
  "GXC",
  "클라우드브릭",
  "CLB",
  "리얼트랙트",
  "RET",
  "유니오",
  "UUNIO",
  "딜",
  "DEAL",
  "콘뉴",
  "콘텐츠뉴트럴리티",
  "CNN",
  "레이븐",
  "RVN",
  "덱스터",
  "트론",
  "덱스",
  "TRX",
  "덱지",
  "아비",
  "ARBI",
  "ZPR",
  "지퍼",
  "피오에이",
  "POA",
  "인슈어리움",
  "ISR",
  "디스트릭트",
  "DNT",
  "MVL",
  "엠블",
  "펀디",
  "NPXS",
  "에이팟",
  "APOT",
  "비아",
  "VIA",
  "완체인",
  "WAN",
  "뉴클리어스",
  "NCASH",
  "ROM",
  "롬",
  "모에다",
  "MDA",
  "펀페어",
  "FUN",
  "레드펄스",
  "PHX",
  "피닉스",
  "애론",
  "ARN",
  "이더파티",
  "고체인",
  "렌드",
  "독",
  "나노",
  "팍소스",
  "월튼",
  "아이오텍스",
  "LEND",
  "GO",
  "WTC",
  "PAX",
  "IOTX",
  "셀프키",
  "KEY",
  "페미",
  "FEMI",
  "유니",
  "썬체인",
  "튜다",
  "프론티어",
  "오투오",
  "비체인",
  "앱코인즈",
  "신디케이터",
  "CND",
  "APPC",
  "VET",
  "AION",
  "체인링크",
  "오에스티",
  "요요",
  "스카이코인",
  "YOYO",
  "SKY",
  "하이퍼캐쉬",
  "HC",
  "모던토큰",
  "다이아몬드",
  "엠브로서스",
  "넥서스",
  "큐링크",
  "타임뉴뱅크",
  "포엣",
  "사이버마일즈",
  "바이버",
  "VIB",
  "에이치닥",
  "아피스",
  "미스릴",
  "MITH",
  "에토스",
  "ETHOS",
  "텐엑스",
  "루프링",
  "파퓰러스",
  "코르텍스",
  "애터니티",
  "트루체인",
  "아크블록",
  "원루트",
  "플레이",
  "프리마스",
  "솔트",
  "레이든",
  "아이앤에스",
  "베잔트",
  "오디세이",
  "위쇼",
  "아모",
  "이더제로",
  "에어론",
  "디에이씨씨",
  "다빈치",
  "비에이치피",
  "마이다스",
  "큐브",
  "지엑스체인",
  "KIN",
  "킨",
  "MXM",
  "맥시마인",
  "R",
  "리베인",
  "ROMTV",
  "롬티비",
  "NXT",
  "엔엑",
  "NEXO",
  "넥소",
  "NET",
  "넥스트",
  "BLINK",
  "블록메이슨",
  "블메",
  "블링크",
  "이그드라시",
  "YEED",
  "디센트럴",
  "MANA"
];
const coins = [
  "CPT",
  "POLY",
  "BTC",
  "ADA",
  "TFUEL",
  "XRP",
  "COSM",
  "BCH",
  "POWR",
  "TRX",
  "ETH",
  "GRS",
  "ZRX",
  "EOS",
  "ENJ",
  "MOC",
  "QKC",
  "EMC2",
  "BTT",
  "STEEM",
  "ICX",
  "XLM",
  "STORJ",
  "BAT",
  "OMG",
  "IOTA",
  "QTUM",
  "THETA",
  "ZIL",
  "MFT",
  "ELF",
  "RFR",
  "SRN",
  "MEDX",
  "STORM",
  "UPP",
  "DMT",
  "EDR",
  "ADX",
  "MTL",
  "ONG",
  "BSV",
  "GTO",
  "KNC",
  "STRAT",
  "SNT",
  "SC",
  "ETC",
  "IQ",
  "MER",
  "NEO",
  "IOST",
  "LTC",
  "OST",
  "PIVX",
  "ONT",
  "ZEC",
  "XEM",
  "VTC",
  "ARK",
  "LOOM",
  "CVC",
  "ARDR",
  "ADT",
  "GAS",
  "SBD",
  "WAVES",
  "WAX",
  "GNT",
  "IGNIS",
  "BTG",
  "LSK",
  "XMR",
  "REP",
  "DASH",
  "KMD",
  "MCO",
  "DCR",
  "GVT",
  "KREX",
  "BNB",
  "FNB",
  "XTX",
  "ARTS",
  "EVZ",
  "DRC",
  "ALP",
  "BOLT",
  "GXC",
  "CLB",
  "RET",
  "UUNIO",
  "DEAL",
  "CNN",
  "RVN",
  "DXR",
  "ARBI",
  "ZPR",
  "ZEN",
  "HOT",
  "BSC",
  "XVG",
  "DXG",
  "YEED",
  "MANA",
  "POA",
  "ISR",
  "DNT",
  "MVL",
  "APOT",
  "NPXS",
  "VIA",
  "WAN",
  "NCASH",
  "ROM",
  "MDA",
  "FUN",
  "PHX",
  "ARN",
  "FUEL",
  "CDT",
  "RCN",
  "GO",
  "LEND",
  "DOCK",
  "NANO",
  "PAX",
  "WTC",
  "IOTX",
  "KEY",
  "VET",
  "APPC",
  "AION",
  "CND",
  "NEBL",
  "LINK",
  "YOYO",
  "SKY",
  "HC",
  "MOD",
  "BCD",
  "AMB",
  "NXS",
  "QLC",
  "BCPT",
  "TNB",
  "POE",
  "CMT",
  "VIB",
  "MITH",
  "ETHOS",
  "PAY",
  "LRC",
  "AE",
  "PPT",
  "CTXC",
  "ITC",
  "TRUE",
  "ABT",
  "RNT",
  "PLY",
  "PST",
  "SALT",
  "RDN",
  "INS",
  "BZNT",
  "OCN",
  "TMTG",
  "WET",
  "AMO",
  "ETZ",
  "APIS",
  "DACC",
  "DAC",
  "BHP",
  "HDAC",
  "AUTO",
  "DEX",
  "O2O",
  "FEMI",
  "IUC",
  "SUNC",
  "TUDA",
  "FRNT",
  "LSK",
  "KIN",
  "MXM",
  "R",
  "ROMTV",
  "NXT",
  "NEXO",
  "NET",
  "BLINK"
];
