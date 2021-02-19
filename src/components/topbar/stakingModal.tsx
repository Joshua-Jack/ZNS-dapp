import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import { useDomainStore } from '../../lib/useDomainStore';
import { Modal, Button } from 'antd';
import Create from '../table/create';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import '../../css/subdomains.scss';

interface NestedProps {
  domain: string;
}

const Nestedview: FC<NestedProps> = ({ domain: _domain }) => {
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(true);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const location = useLocation();

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

  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  const showTransfer = () => {
    setTransferVisible(true);
  };

  const transferOk = () => {
    setTransferVisible(false);
  };

  const transferCancel = () => {
    setTransferVisible(false);
  };

  const showProfile = () => {
    setProfileVisible(true);
  };

  const profileOk = () => {
    setProfileVisible(false);
  };

  const profileCancel = () => {
    setProfileVisible(false);
  };

  //

  //
  if (domain.isNothing()) return null;
  return (
    <>
      <>
        {domain.isJust() && (
          <button className="nft-btn" onClick={showProfile}>
            Create NFT
          </button>
        )}
        <Modal
          style={{
            position: 'relative',
            margin: 0,
            padding: 0,
            // border: '2px solid red',
          }}
          bodyStyle={{ height: '80vh' }}
          closeIcon={null}
          centered
          width={'80vw'}
          visible={isProfileVisible}
          onOk={profileOk}
          onCancel={profileCancel}
          footer={null}
        ></Modal>
      </>
    </>
  );
};
export default Nestedview;