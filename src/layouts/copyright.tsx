import React from 'react';
import { Icon } from 'antd';
import defaultSettings from '@/config/default-settings';

const { company } = defaultSettings;

const Copyright = () => {
  return (
    <div>
      Copyright <Icon type="copyright" /> 2020{company}
    </div>
  )
};

export default Copyright;
