process.on('unhandledRejection', (err) => {
  console.error(err);
  if (module.exports.abort) {
    process.abort();
  }
  process.exit(1);
});
