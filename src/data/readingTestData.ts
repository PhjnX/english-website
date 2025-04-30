// src/data/readingTestData.ts

export interface Question {
  id: number;
  question: string;
  questionType: "multiple-choice" | "select" | "input" | "true-false-notgiven";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  highlightSentence: string;
}

export interface Part {
  partId: number;
  title: string;
  passage: string;
  questions: Question[];
}

export const parts: Part[] = [
  {
    partId: 1,
    title: "Part 1: The History of Communication",
    passage: `Throughout history, communication has played a crucial role. 
Early humans communicated through cave paintings and smoke signals. 
Later, carrier pigeons became a method to send messages. 
The telegraph, invented by Samuel Morse in the 19th century, revolutionized long-distance communication. 
This was followed by the telephone, introduced by Alexander Graham Bell, allowing voice communication across great distances. 
In the 20th century, radio and television changed mass communication. 
Finally, the internet has transformed global communication in unprecedented ways.`,
    questions: [
      {
        id: 1,
        question: "Which was one of the earliest forms of communication?",
        questionType: "multiple-choice",
        options: ["Internet", "Smoke signals", "Telegraph", "Telephone"],
        correctAnswer: "Smoke signals",
        explanation: "Con người cổ đại sử dụng tín hiệu khói để giao tiếp.",
        highlightSentence:
          "Early humans communicated through cave paintings and smoke signals.",
      },
      {
        id: 2,
        question: "Carrier pigeons were used to:",
        questionType: "multiple-choice",
        options: [
          "Send physical messages",
          "Transmit voice",
          "Broadcast news",
          "Deliver goods",
        ],
        correctAnswer: "Send physical messages",
        explanation: "Bồ câu đưa thư được dùng để gửi tin nhắn.",
        highlightSentence:
          "Later, carrier pigeons became a method to send messages.",
      },
      {
        id: 3,
        question: "The telegraph was invented by:",
        questionType: "select",
        options: [
          "Alexander Graham Bell",
          "Samuel Morse",
          "Thomas Edison",
          "Nikola Tesla",
        ],
        correctAnswer: "Samuel Morse",
        explanation: "Samuel Morse phát minh ra điện báo.",
        highlightSentence:
          "The telegraph, invented by Samuel Morse in the 19th century, revolutionized long-distance communication.",
      },
      {
        id: 4,
        question: "The telephone allowed what type of communication?",
        questionType: "multiple-choice",
        options: ["Visual", "Voice", "Written", "Digital"],
        correctAnswer: "Voice",
        explanation: "Điện thoại cho phép liên lạc bằng giọng nói.",
        highlightSentence:
          "This was followed by the telephone, introduced by Alexander Graham Bell, allowing voice communication across great distances.",
      },
      {
        id: 5,
        question: "Radio and television impacted mass communication.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "True",
        explanation: "Radio và truyền hình thay đổi giao tiếp đại chúng.",
        highlightSentence:
          "In the 20th century, radio and television changed mass communication.",
      },
      {
        id: 6,
        question: "The internet has transformed _____ communication.",
        questionType: "input",
        correctAnswer: "global",
        explanation: "Internet đã biến đổi giao tiếp toàn cầu.",
        highlightSentence:
          "Finally, the internet has transformed global communication in unprecedented ways.",
      },
      {
        id: 7,
        question: "Which communication method is oldest?",
        questionType: "select",
        options: ["Internet", "Carrier pigeons", "Smoke signals", "Radio"],
        correctAnswer: "Smoke signals",
        explanation: "Tín hiệu khói là phương pháp lâu đời nhất.",
        highlightSentence:
          "Early humans communicated through cave paintings and smoke signals.",
      },
      {
        id: 8,
        question: "True or False: Television came before the telegraph.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation: "Điện báo xuất hiện trước truyền hình.",
        highlightSentence:
          "The telegraph, invented by Samuel Morse in the 19th century, revolutionized long-distance communication.",
      },
      {
        id: 9,
        question: "Carrier pigeons are mainly used for:",
        questionType: "input",
        correctAnswer: "messages",
        explanation: "Bồ câu đưa thư dùng để gửi tin nhắn.",
        highlightSentence:
          "Later, carrier pigeons became a method to send messages.",
      },
      {
        id: 10,
        question:
          "The invention that revolutionized long-distance communication is:",
        questionType: "select",
        options: ["Internet", "Telephone", "Telegraph", "Radio"],
        correctAnswer: "Telegraph",
        explanation: "Điện báo đã cách mạng hóa liên lạc đường dài.",
        highlightSentence:
          "The telegraph, invented by Samuel Morse in the 19th century, revolutionized long-distance communication.",
      },
      {
        id: 11,
        question: "Alexander Graham Bell is associated with which invention?",
        questionType: "multiple-choice",
        options: ["Internet", "Radio", "Telegraph", "Telephone"],
        correctAnswer: "Telephone",
        explanation: "Alexander Graham Bell phát minh ra điện thoại.",
        highlightSentence:
          "This was followed by the telephone, introduced by Alexander Graham Bell.",
      },
      {
        id: 12,
        question:
          "Which technology changed global communication most recently?",
        questionType: "multiple-choice",
        options: ["Telegraph", "Telephone", "Radio", "Internet"],
        correctAnswer: "Internet",
        explanation: "Internet thay đổi giao tiếp toàn cầu gần đây nhất.",
        highlightSentence:
          "Finally, the internet has transformed global communication in unprecedented ways.",
      },
      {
        id: 13,
        question:
          "True or False: Carrier pigeons are still a major communication tool.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation:
          "Ngày nay bồ câu đưa thư không còn là công cụ liên lạc chính.",
        highlightSentence:
          "Later, carrier pigeons became a method to send messages.",
      },
    ],
  },
  {
    partId: 2,
    title: "Part 2: Renewable Energy Resources",
    passage: `Renewable energy refers to energy from natural sources that are constantly replenished. 
Solar energy comes from sunlight, while wind energy is generated by air movement. 
Hydropower utilizes water flow to create energy, and geothermal energy taps into the Earth's internal heat. 
These sources offer cleaner alternatives to fossil fuels, which release harmful carbon emissions into the atmosphere.
Countries worldwide are increasingly investing in renewable energy to combat climate change and ensure a sustainable future.`,
    questions: [
      {
        id: 14,
        question: "Which of the following is NOT a renewable energy source?",
        questionType: "multiple-choice",
        options: ["Solar", "Wind", "Coal", "Geothermal"],
        correctAnswer: "Coal",
        explanation: "Coal là nhiên liệu hóa thạch, không tái tạo.",
        highlightSentence:
          "These sources offer cleaner alternatives to fossil fuels.",
      },
      {
        id: 15,
        question: "Solar energy comes from:",
        questionType: "input",
        correctAnswer: "Sunlight",
        explanation: "Năng lượng mặt trời đến từ ánh sáng mặt trời.",
        highlightSentence: "Solar energy comes from sunlight.",
      },
      {
        id: 16,
        question: "True or False: Hydropower uses air movement.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation: "Thủy điện dùng nước, không dùng không khí.",
        highlightSentence: "Hydropower utilizes water flow to create energy.",
      },
      {
        id: 17,
        question: "Geothermal energy utilizes:",
        questionType: "select",
        options: ["Sunlight", "Wind", "Water", "Earth's heat"],
        correctAnswer: "Earth's heat",
        explanation: "Địa nhiệt khai thác nhiệt trong lòng đất.",
        highlightSentence:
          "Geothermal energy taps into the Earth's internal heat.",
      },
      {
        id: 18,
        question: "Fossil fuels release ______ emissions.",
        questionType: "input",
        correctAnswer: "harmful carbon",
        explanation: "Nhiên liệu hóa thạch thải khí carbon có hại.",
        highlightSentence: "Fossil fuels release harmful carbon emissions.",
      },
      {
        id: 19,
        question: "Renewable energy combats:",
        questionType: "multiple-choice",
        options: [
          "Urbanization",
          "Climate change",
          "Population growth",
          "Water shortage",
        ],
        correctAnswer: "Climate change",
        explanation: "Năng lượng tái tạo giúp chống biến đổi khí hậu.",
        highlightSentence:
          "Countries worldwide are increasingly investing in renewable energy to combat climate change.",
      },
      {
        id: 20,
        question: "True or False: Fossil fuels are quickly replenished.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation: "Nhiên liệu hóa thạch mất hàng triệu năm mới hình thành.",
        highlightSentence:
          "Renewable energy refers to natural sources constantly replenished.",
      },
      {
        id: 21,
        question: "Which resource utilizes water?",
        questionType: "select",
        options: ["Solar", "Wind", "Hydropower", "Geothermal"],
        correctAnswer: "Hydropower",
        explanation: "Thủy điện dùng dòng chảy nước để phát điện.",
        highlightSentence: "Hydropower utilizes water flow to create energy.",
      },
      {
        id: 22,
        question: "Wind energy is generated by _____.",
        questionType: "input",
        correctAnswer: "air movement",
        explanation: "Năng lượng gió sinh ra từ sự di chuyển của không khí.",
        highlightSentence: "Wind energy is generated by air movement.",
      },
      {
        id: 23,
        question:
          "True or False: Renewable energy ensures a sustainable future.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "True",
        explanation: "Năng lượng tái tạo đảm bảo tương lai bền vững.",
        highlightSentence:
          "Countries are investing to ensure a sustainable future.",
      },
      {
        id: 24,
        question: "Which energy uses Earth's internal heat?",
        questionType: "multiple-choice",
        options: ["Solar", "Wind", "Hydro", "Geothermal"],
        correctAnswer: "Geothermal",
        explanation: "Địa nhiệt sử dụng nhiệt từ bên trong trái đất.",
        highlightSentence: "Geothermal energy taps into Earth's internal heat.",
      },
      {
        id: 25,
        question: "Investment in renewable energy aims to:",
        questionType: "select",
        options: [
          "Fight climate change",
          "Increase fossil fuel use",
          "Pollute",
          "Export oil",
        ],
        correctAnswer: "Fight climate change",
        explanation: "Đầu tư năng lượng tái tạo để chống biến đổi khí hậu.",
        highlightSentence:
          "Countries are increasingly investing in renewable energy to combat climate change.",
      },
      {
        id: 26,
        question: "True or False: Solar energy is depletable.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation: "Năng lượng mặt trời là vô tận.",
        highlightSentence:
          "Renewable energy refers to natural sources constantly replenished.",
      },
    ],
  },
  {
    partId: 3,
    title: "Part 3: Urbanization and Future Cities",
    passage: `Urbanization is the process where an increasing percentage of a population lives in cities and suburbs. 
It began significantly during the Industrial Revolution, as workers moved towards manufacturing hubs. 
Today, urban areas are centers for education, commerce, and innovation. 
However, rapid urbanization presents challenges such as housing shortages, traffic congestion, and pollution. 
To address these issues, future cities must embrace sustainable development, invest in green public transportation, and create more green spaces. 
Technologies like smart grids, renewable energy integration, and intelligent waste management are expected to play crucial roles.`,
    questions: [
      {
        id: 27,
        question: "Urbanization refers to:",
        questionType: "select",
        options: [
          "More rural areas",
          "Less cities",
          "More people in cities",
          "Decreased population",
        ],
        correctAnswer: "More people in cities",
        explanation: "Urbanization là sự gia tăng dân số tại các thành phố.",
        highlightSentence:
          "Urbanization is the process where an increasing percentage of a population lives in cities and suburbs.",
      },
      {
        id: 28,
        question: "Industrial Revolution contributed to:",
        questionType: "input",
        correctAnswer: "urbanization",
        explanation: "Cách mạng Công nghiệp thúc đẩy đô thị hóa.",
        highlightSentence:
          "It began significantly during the Industrial Revolution.",
      },
      {
        id: 29,
        question: "Urban areas today are centers for:",
        questionType: "multiple-choice",
        options: [
          "Agriculture",
          "Education, commerce, innovation",
          "Manufacturing",
          "Tourism",
        ],
        correctAnswer: "Education, commerce, innovation",
        explanation:
          "Đô thị ngày nay là trung tâm giáo dục, thương mại, đổi mới.",
        highlightSentence:
          "Today, urban areas are centers for education, commerce, and innovation.",
      },
      {
        id: 30,
        question: "True or False: Urbanization solves traffic congestion.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation: "Đô thị hóa làm tăng kẹt xe chứ không giải quyết.",
        highlightSentence:
          "However, rapid urbanization presents challenges such as traffic congestion.",
      },
      {
        id: 31,
        question: "Which is NOT a challenge from urbanization?",
        questionType: "select",
        options: [
          "Pollution",
          "Housing shortages",
          "Farming",
          "Traffic congestion",
        ],
        correctAnswer: "Farming",
        explanation:
          "Canh tác nông nghiệp không phải là thách thức đô thị hóa.",
        highlightSentence:
          "However, rapid urbanization presents challenges such as housing shortages, traffic congestion, and pollution.",
      },
      {
        id: 32,
        question: "Future cities must invest in:",
        questionType: "input",
        correctAnswer: "sustainable development",
        explanation: "Các thành phố tương lai phải phát triển bền vững.",
        highlightSentence:
          "Future cities must embrace sustainable development.",
      },
      {
        id: 33,
        question: "Smart grids help with:",
        questionType: "multiple-choice",
        options: ["Congestion", "Pollution", "Renewable energy", "Housing"],
        correctAnswer: "Renewable energy",
        explanation: "Lưới điện thông minh hỗ trợ năng lượng tái tạo.",
        highlightSentence:
          "Technologies like smart grids are expected to play crucial roles.",
      },
      {
        id: 34,
        question: "True or False: Green spaces reduce pollution.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "True",
        explanation: "Không gian xanh giúp giảm ô nhiễm.",
        highlightSentence: "Future cities must create more green spaces.",
      },
      {
        id: 35,
        question: "Which technology manages city waste intelligently?",
        questionType: "select",
        options: [
          "Smart grids",
          "Geothermal",
          "Wind turbines",
          "Intelligent waste management",
        ],
        correctAnswer: "Intelligent waste management",
        explanation: "Quản lý rác thải thông minh bảo vệ môi trường đô thị.",
        highlightSentence:
          "Technologies like intelligent waste management are expected to play crucial roles.",
      },
      {
        id: 36,
        question: "Cities investing in green transport are fighting _____.",
        questionType: "input",
        correctAnswer: "pollution",
        explanation: "Giao thông xanh giảm ô nhiễm.",
        highlightSentence: "Invest in green public transportation.",
      },
      {
        id: 37,
        question: "Future urban development focuses on:",
        questionType: "multiple-choice",
        options: [
          "Private vehicles",
          "Environmental sustainability",
          "Suburban sprawl",
          "Farming",
        ],
        correctAnswer: "Environmental sustainability",
        explanation: "Đô thị tương lai tập trung vào phát triển bền vững.",
        highlightSentence:
          "Future cities must embrace sustainable development.",
      },
      {
        id: 38,
        question: "Public transport improvements aim to reduce:",
        questionType: "select",
        options: ["Pollution", "Congestion", "Both", "Neither"],
        correctAnswer: "Both",
        explanation: "Giao thông công cộng giúp giảm ô nhiễm và kẹt xe.",
        highlightSentence: "Invest in green public transportation.",
      },
      {
        id: 39,
        question: "Urbanization often increases ______.",
        questionType: "input",
        correctAnswer: "pollution",
        explanation: "Đô thị hóa làm tăng ô nhiễm.",
        highlightSentence:
          "Urbanization presents challenges such as pollution.",
      },
      {
        id: 40,
        question:
          "True or False: Urbanization encourages green living automatically.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation: "Đô thị hóa không tự động khuyến khích lối sống xanh.",
        highlightSentence:
          "Urbanization presents challenges such as pollution.",
      },
    ],
  },
];
