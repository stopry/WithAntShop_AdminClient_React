/**
 * @author wangxingkang
 * @date 2019-07-15 22:20
 * @description Analysis页面
 *
 * @last-modified-by wangxingkang
 * @last-modified-time 2019-07-15 22:20
 */
import React from 'react';
import IntroduceRow from './components/introduce-row';
import SalesCard from './components/sales-card';
import {withRouter} from 'react-router-dom'

const AnalysisPage: React.FC = () => {

  React.useEffect(()=>{
    
  })

  return (
    <div>
      <IntroduceRow />
      <SalesCard />
    </div>
  );
};

export default withRouter(AnalysisPage);
