import React from 'react';

function Fish() {
    const data = [{"player":"self", "message":"played card as a special card"}, {"player":"other", "message":"Played card as a value card"}];
    return (
      <div>
        <div className="whiteBox">
          <div className="message">
            <div className="bubble bubble-bottom-left">
              HELLO
              <img alt="cuttlefish" src="https://amazingcephalopods.weebly.com/uploads/4/3/3/5/43355237/518075933.jpg" className="cuttleFish"></img>
            </div>
          </div>
          <div className="message">
            <div className="bubble-right bubble-bottom-right">
              HI
              <img alt="cuttlefish" src="https://cms.qz.com/wp-content/uploads/2016/08/20160816-stubby-squid07.jpg?quality=75&strip=all&w=1200&h=900&crop=1" className="cuttleFishRight"></img>
            </div>
          </div>
          <div className="message">
            <div className="bubble bubble-bottom-left">
              HELLO
              <img alt="cuttlefish" src="https://amazingcephalopods.weebly.com/uploads/4/3/3/5/43355237/518075933.jpg" className="cuttleFish"></img>
            </div>
          </div>
          <div className="message">
            <div className="bubble-right bubble-bottom-right">
              HI
              <img alt="cuttlefish" src="https://cms.qz.com/wp-content/uploads/2016/08/20160816-stubby-squid07.jpg?quality=75&strip=all&w=1200&h=900&crop=1" className="cuttleFishRight"></img>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Fish;