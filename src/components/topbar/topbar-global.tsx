import React, { FC, useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../lib/useDomainCache';
import { Link, Route, useLocation } from 'react-router-dom';
import useScrollPosition from '@react-hook/window-scroll';
import Owned from './shop/owned';
import { Layout, Menu, Modal } from 'antd';
import Wallet from './wallet';
import '../css/topbar-global.scss';
import downarrow from '../css/img/down-arrow.png';
import nightmoon from '../css/img/night-moon-2.png';
import elon from '../css/img/elon.jpg';
import Profile from './profile/profile';
import NFTview from '../table/NFT-View/nft-view';
import Create from './create';
import SetImage from './forms/set-image';
import Shop from './shop/shop';
import { domainToASCII } from 'url';
import { any, string } from 'zod';
import Stakingview from './stakingModal';
import usePrevious from '../../lib/hooks/usePrevious';

interface TopbarProps {
  domain: string;
}

const TopbarGlobal: FC<TopbarProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account, active } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const location = useLocation();
  const previousAccount = usePrevious(account);

  const scrollY = useScrollPosition(60);

  const routes = _.transform(
    location.pathname
      .substr(1)
      .split('.')
      .filter((s) => s !== ''),
    (acc: [string, string][], val, i) => {
      let next = 0 < i ? acc[i - 1][1] + '.' + val : val;
      acc.push([val, next]);
    },
  );
  const [connect, setConnect] = useState(false);
  const [isWalletVisible, setWalletVisible] = useState(false);
  const [isShopVisible, setShopVisible] = useState(false);
  const [isStakingVisible, setStakingVisible] = useState(false);

  const showStaking = () => {
    setStakingVisible(true);
  };

  const stakingOk = () => {
    setStakingVisible(false);
  };

  const stakingCancel = () => {
    setStakingVisible(false);
  };

  const onClick = () => {
    setConnect(!connect);
  };
  const showWallet = () => {
    setWalletVisible(true);
  };
  const walletOk = () => {
    setWalletVisible(false);
  };
  const walletCancel = () => {
    setWalletVisible(false);
  };

  const showShop = () => {
    setWalletVisible(true);
  };
  const shopOk = () => {
    setShopVisible(false);
  };
  const shopCancel = () => {
    setShopVisible(false);
  };

  if (domain.isNothing()) return null;
  return (
    <div
      className={`
    topbarContainer 
    ${scrollY > 1 && 'topbarBackgroundFade'}
    `}
    >
      <div className="topbarLeft">
        <Link className="" to={'/'}>
          <img
            className="topbarLogo"
            src={'ipfs://QmS2G8rZiXVhGYuEPxdeFpYnxwbERh1e538MUfXe9Vghw8'.replace(
              'ipfs://',
              'https://ipfs.io/ipfs/',
            )}
            alt=""
          />
        </Link>

        <div className="route-nav">
          <div className="route-nav-link">
            <Link className="route-nav-text" to={'/'}>
              0::/
            </Link>
          </div>
          {routes.length > 0 ? (
            <div className="route-nav-link">
              <Link className="route-nav-text-sub" to={`/${routes[0][0]}`}>
                {routes[0][0]}
              </Link>
            </div>
          ) : null}
        </div>
        <div></div>
      </div>
      <div className="search-bar">
        <input className="search-bar-input" type="text" placeholder="Search" />
        <button className="search-bar-button"></button>
      </div>
      <div className="topbarRight">
        <div className="shop-btn">
          <Shop domain={_domain} />
          {/* <Stakingview domain={_domain} /> */}
        </div>

        <button className="connect-btn" onClick={showWallet}>
          {' '}
          {active ? 'Connected 🟢' : 'Connect 🔴'}{' '}
        </button>
        <button
          className="create-network"
          onClick={active ? showStaking : showWallet}
        >
          <span style={{ width: '20px' }}></span>
          MINT NFT
          <span style={{ width: '16px' }}></span>
          <span style={{ width: '16px' }}></span>
        </button>
        <div style={{ width: '50px' }}>
          {active ? (
            <div className="profile-btn">
              <Profile />
            </div>
          ) : null}
        </div>

        {/* <img src={elon} alt="" className="profilepic" /> */}
      </div>

      <Modal
        visible={isStakingVisible}
        onOk={stakingOk}
        onCancel={stakingCancel}
        footer={null}
        width={'65vw'}
        bodyStyle={{}}
        closable={false}
        className="noModalPadding"
      >
        <Stakingview domain={_domain} />
      </Modal>

      <Modal
        visible={isWalletVisible}
        onOk={walletOk}
        onCancel={walletCancel}
        footer={null}
      >
        <Wallet />
        <hr />
        <div className="new-ETH">
          <div className="ETH"> New to Ethereum?</div>{' '}
          <a href="https://ethereum.org/en/wallets/">
            Learn more about wallets
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default TopbarGlobal;
