import React from 'react';
import { connect } from 'dva';
import store from 'store';
import { STORAGE_KEY_DEFAULT_CONFIG } from '@/config';
import { TLoginType } from '@/models/login';
import { ConnectState } from '@/models/connect';
import PasswordLoginForm from './components/password-login-form';
import SMSLoginForm from './components/sms-login-form';
import './login.less';
import {withRouter} from 'react-router-dom'
import router from 'umi/router';

interface IProps {
  prefixCls?: string;
  loginType: TLoginType;
  loading: boolean;
  dispatch: (args: any) => void;
}

//@ts-ignore
// @connect(({ login, loading }:ConnectState) => {
//   return ({
//     loginType: login.type,
//     loading: loading.effects['login/fetchLogin'],
//   })
// })
class LoginPage extends React.Component<IProps, any> {

  static defaultProps = {
    prefixCls: 'login-page',
  };

  handleLogin = values => {
    const { dispatch } = this.props;

    dispatch({
      type: 'login/fetchLogin',
      payload: values,
    });
  };

  componentDidMount () {
    console.log('监听成功')
  }

  componentWillReceiveProps(nextProps){
    let key = nextProps.match.params.key;
    this.setState({
        key:key
    })
  }

  handleChangeType = type => {
    const { dispatch } = this.props;
    const { loginType } = STORAGE_KEY_DEFAULT_CONFIG;

    store.set(loginType, type);

    dispatch({
      type: 'login/changeLoginType',
      payload: type,
    });
  };

  render() {
    const { prefixCls, loginType, loading } = this.props;
    console.log(this.props,'这个页面的属性')

    return (
      <div className={prefixCls}>
        {/** 账户密码登录 */}
        {loginType === 'password' && (
          <PasswordLoginForm
            prefixCls={prefixCls}
            loading={loading}
            onLogin={this.handleLogin}
            onChangeType={this.handleChangeType}
          />
        )}

        {/** 短信验证码登录 */}
        {loginType === 'sms' && (
          <SMSLoginForm
            prefixCls={prefixCls}
            loading={loading}
            onLogin={this.handleLogin}
            onChangeType={this.handleChangeType}
          />
        )}
      </div>
    );
  }
}
// export default LoginPage;
// withRouter
export default withRouter(
  connect(({ login, loading }: ConnectState) => ({
    loginType: login.type,
    loading: loading.effects['login/fetchLogin'],
  }))(LoginPage)
);
