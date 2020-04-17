import intl from 'react-native-intl';

export const { format: formatPrice } = new intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
