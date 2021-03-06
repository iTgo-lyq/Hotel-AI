import Taro, { Component } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import { observer, inject } from "@tarojs/mobx";
import { AtButton, AtInput } from "taro-ui";
import { Register, Sms } from "@actions/api";
import { HCinterval, HCerror, Navbar } from "@components";
import "./login.sass";

class Login extends Component {
  config = {
    navigationStyle: "custom"
  };
  constructor() {
    super();
    this.state = {
      phone: "", //电话
      captcha: "", //验证码
      finalPhone: "", //获取验证码时确认的电话
      errorCap: 0, //错误代码
      rand: "", //rand值
      showResBtn: false, //登录按钮是否可点击
      smsStatus: 0 //验证码按钮状态~
    };
  }
  /**
   * 电话号码改变时触发
   * @event
   * @param {number} value 默认
   */
  phoneChange(value) {
    this.setState({
      phone: value,
      errorCap: 0
    });
    if (value.length == 11) {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        //电话号码格式判断
        this.setState({
          errorCap: 2
        });
        return;
      }
      if (this.state.smsStatus == 0) {
        this.setState({
          smsStatus: 1
        });
      }
    }
    return value;
  }

  /**
   * 验证码改变时触发
   * @event
   * @param {number} value 默认
   */
  captchaChange(value) {
    this.setState({
      captcha: value,
      showResBtn: false,
      errorCap: 0
    });
    if (value.length == 5 && (this.state.smsStatus == 1 || 2)) {
      //判断验证码个数和可点击状态来改变登录按钮
      this.setState({
        showResBtn: true
      });
    }
    return value;
  }

  /**
   * 快捷注册登录按钮
   * @event
   * @param event对象
   */
  resginer(event) {
    const param = {
      phone: this.state.finalPhone,
      code: this.state.captcha,
      rand: this.state.rand
    };
    //快捷注册登录接口
    Register(param).then(res => {
      if (res.data.status == -4) {
        this.setState({
          errorCap: 1
        });
      } else if (res.data.status == 0) {
        Taro.setStorage({
          key: "token",
          data: res.data.data.token
        });
        //若传参的路由不存在，则跳转到个人中心界面
        if (!this.props.navigate) {
          Taro.reLaunch({
            url: "/pages/account/account"
          });
        } else {
          Taro.redirectTo({
            url: this.props.navigate
          });
        }
      }
    });
  }
  /**
   * 获取验证码
   */
  smsCaptcha() {
    if (this.state.phone.length !== 11) {
      return 1;
    } else if (this.state.phone.length == 11) {
      //幕布
      Taro.showLoading({
        title: "loading",
        mask: true
      });
      this.setState(
        {
          finalPhone: this.state.phone
        },
        () => {
          // smsStatus是false时会出现灰色按钮，当倒计时结束又变成可以触发的按钮
          //验证码接口
          Sms(this.state.phone).then(res => {
            console.log(res);
            if (res.data.status == 0) {
              this.setState(
                {
                  rand: res.data.data.rand,
                  smsStatus: 2
                },
                () => {
                  Taro.hideLoading();
                  Taro.showToast({
                    title: "验证码发送成功",
                    icon: "none",
                    duration: 2000,
                    mask: true
                  });
                }
              );
            } else if (res.data.status == 1016) {
              this.setState({
                errorCap: 1
              });
            }
          });
        }
      );
    }
  }

  /**
   * 计时器函数
   */
  changeIntervalStatus() {
    this.setState({
      smsStatus: 1
    });
  }

  /**
   * 路由转跳
   * @param {string} url
   */
  navigateTo(url) {
    Taro.navigateTo({
      url: url
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
  componentWillMount() { }

  componentWillReact() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  renderA() {
    const {
      phone,
      captcha,
      selector,
      selectorChecked,
      numberChecked,
      showResBtn,
      smsStatus,
      errorCap
    } = this.state;
    return (
      <View>
        <View className="at-row">
          <View className="quickLogin_title at-col">快捷登录</View>
        </View>
        <View className="at-row">
          <View className="quickLogin_subtitle at-col">
            未注册手机验证后自动登录
          </View>
        </View>
        <View className="phone_input at-row at-row__align--center">
          <View className="at-col">
            <AtInput
              name="value6"
              border={true}
              maxLength="13"
              type="phone"
              placeholder="输入手机号码"
              value={phone}
              onChange={this.phoneChange.bind(this)}
            />
          </View>
        </View>
        <View className="at-row at-row__align--center">
          <View className="at-col at-col-9">
            <AtInput
              clear
              type="text"
              border={false}
              maxLength="5"
              placeholder="输入验证码"
              value={captcha}
              onChange={this.captchaChange.bind(this)}
            ></AtInput>
          </View>
          <View className="btn-sendCap at-col at-col-3">
            {
              {
                0: (
                  <AtButton size="small" circle={true} disabled={true}>
                    发送验证码
                  </AtButton>
                ),
                1: (
                  <AtButton
                    size="small"
                    type="secondary"
                    circle={true}
                    onClick={this.smsCaptcha.bind(this)}
                  >
                    发送验证码
                  </AtButton>
                ),
                2: (
                  <AtButton
                    disabled={true}
                    size="small"
                    type="secondary"
                    circle={true}
                  >
                    <HCinterval
                      changeIntervalStatus={this.changeIntervalStatus}
                    />
                  </AtButton>
                )
              }[smsStatus]
            }
          </View>
        </View>
        <HCerror error={errorCap} />
        <View className="phone_btn at-row">
          <View className="phone_input at-col">
            {showResBtn ? (
              <AtButton
                type="primary"
                circle
                size="normal"
                onClick={this.resginer.bind(this)}
              >
                登录/注册
              </AtButton>
            ) : (
                <AtButton type="primary" circle size="normal" disabled={true}>
                  登录/注册
                </AtButton>
              )}
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View className="login-container">
        <Navbar title="登录" isBackBtn={false} weight={true}></Navbar>
        {this.renderA()}
        <View className="toPsw at-row">
          <View
            className="at-col"
            onClick={this.navigateTo.bind(this, "/packageA/login/loginByPsw")}
          >
            密码登录
          </View>
        </View>
        <View className="toPsw at-row">
          <View
            className="at-col"
            onClick={this.navigateTo.bind(
              this,
              "/packageA/login/registerByPsw"
            )}
          >
            密码注册
          </View>
        </View>
      </View>
    );
  }
}
export default Login;
