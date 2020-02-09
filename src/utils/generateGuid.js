export default function generateGuid() {
  var now = Date.now();

  var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (ch) {
      var rand = (now + Math.random() * 16) % 16 | 0;
      now = Math.floor(now / 16);
      return (ch === 'x' ? rand : ((rand & 0x7) | 0x8)).toString(16);
  });

  return guid;
}