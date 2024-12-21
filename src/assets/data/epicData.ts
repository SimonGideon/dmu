const getRandomDate = (startDate: Date, endDate: Date): string => {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();

    const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;
    return new Date(randomTimestamp).toLocaleString(); 
  };
  
  const currentDate = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

  const chatData = [
    {
      title: "AI Chatbot Overview",
      message: "Learn about the latest advancements in AI-powered chatbots and their capabilities.",
      createdOn: getRandomDate(oneYearAgo, currentDate),
    },
    {
      title: "The Future of AI in Business",
      message: "Discover how artificial intelligence is transforming the way businesses operate and compete.",
      createdOn: getRandomDate(oneYearAgo, currentDate),
    },
    {
      title: "Machine Learning Trends 2024",
      message: "Discover the cutting-edge trends and technologies shaping the future of machine learning.",
      createdOn: getRandomDate(oneYearAgo, currentDate),
    },
    {
      title: "AI in Healthcare",
      message: "Explore how artificial intelligence is revolutionizing the healthcare industry.",
      createdOn: getRandomDate(oneYearAgo, currentDate),
    },
    {
      title: "Deep Learning Basics",
      message: "A beginner's guide to understanding the core concepts of deep learning and neural networks.",
      createdOn: getRandomDate(oneYearAgo, currentDate),
    },
    {
      title: "What's New in AI Research?",
      message: "A roundup of the most recent breakthroughs in artificial intelligence research and development.",
      createdOn: getRandomDate(oneYearAgo, currentDate),
    },
  ];
  
  export { chatData };
  