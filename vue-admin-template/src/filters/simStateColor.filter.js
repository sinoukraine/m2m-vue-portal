
export default function(value) {
  value = value ? value.toLowerCase() : 'none';

  const simStates = {
    none: 'info',
    stock: 'info',
    suspended: 'danger',
    test: 'warning',
    productive: 'success'
  }

  return simStates[value]
}
