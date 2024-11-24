module.exports = (message, client, handler) => {
    if (message.content === 'hey') {
         message.reply('Hi!');
      }
  };