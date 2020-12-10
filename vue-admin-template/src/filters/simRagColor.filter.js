
export default function(value) {
  value = value ? parseInt(value) : 1

  const ragColors = {
    1: 'bg-color-red',
    2: 'bg-color-yellow',
    3: 'bg-color-green'
  }

  return ragColors[value]
}
