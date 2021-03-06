import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { observer, inject } from "@tarojs/mobx";
import { Navbar } from "@components";
import "./bill.sass";

class bill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  config = {
    navigationStyle: "custom",
  };

  render() {
    return (
      <View className="body">
        <Navbar title="余额" weight={true}></Navbar>
        <View className="container">
          <View className="bill">
            余额:{"  "} <Text className="bill_number">2.5元</Text>
          </View>
          <View className="bill_btnipml at-row at-row__justify--around">
            <View className="bill_btn at-col at-col-4">
              <AtButton type="primary">提现</AtButton>
            </View>
            <View className="bill_btn at-col at-col-4">
              <AtButton type="primary">充值</AtButton>
            </View>
          </View>
        </View>
        <View className="tips">查看账户条款</View>
      </View>
    );
  }
}
