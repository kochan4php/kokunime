const logger = {
  log: (...message: any[]) => {
    console.log(new Date(), ...message);
  },
};

export default logger;
