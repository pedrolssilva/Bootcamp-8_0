import React from 'react';
import { View, Text } from 'react-native';

// import { Container } from './styles';

const viewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const textStyle = {
  color: '#fff',
};

export default function Cart() {
  console.tron.log(`[Cart]`);
  return (
    <View style={viewStyle}>
      <Text style={textStyle}>Cart</Text>
    </View>
  );
}
