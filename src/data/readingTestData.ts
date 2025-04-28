// src/data/readingTestData.ts

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
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
        options: ["Internet", "Smoke signals", "Telegraph", "Telephone"],
        correctAnswer: "Smoke signals",
        explanation: "Line 2 mentions early humans used smoke signals.",
      },
      {
        id: 2,
        question: "Carrier pigeons were used to:",
        options: [
          "Send physical messages",
          "Transmit voice",
          "Broadcast news",
          "Deliver goods",
        ],
        correctAnswer: "Send physical messages",
        explanation: "Line 3: Carrier pigeons sent messages.",
      },
      {
        id: 3,
        question: "Who invented the telegraph?",
        options: [
          "Alexander Graham Bell",
          "Samuel Morse",
          "Thomas Edison",
          "Nikola Tesla",
        ],
        correctAnswer: "Samuel Morse",
        explanation: "Line 4: Samuel Morse invented the telegraph.",
      },
      {
        id: 4,
        question:
          "True or False: The telephone was invented before the telegraph.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "The telegraph came before the telephone.",
      },
      {
        id: 5,
        question: "What allowed voice communication across distances?",
        options: ["Radio", "Internet", "Telephone", "Pigeons"],
        correctAnswer: "Telephone",
        explanation: "Line 5: Telephone enabled voice communication.",
      },
      {
        id: 6,
        question: "The 20th century saw the rise of:",
        options: [
          "Cave paintings",
          "Carrier pigeons",
          "Radio and Television",
          "Smoke signals",
        ],
        correctAnswer: "Radio and Television",
        explanation: "Line 6: Radio and television became popular.",
      },
      {
        id: 7,
        question: "What transformed communication globally?",
        options: ["Telephone", "Radio", "Television", "Internet"],
        correctAnswer: "Internet",
        explanation: "Line 7: The internet transformed communication globally.",
      },
      {
        id: 8,
        question: "True or False: Samuel Morse invented the telephone.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Samuel Morse invented the telegraph, not telephone.",
      },
      {
        id: 9,
        question:
          "What technology allowed mass communication before the internet?",
        options: [
          "Telegraph",
          "Radio and Television",
          "Carrier pigeons",
          "Telephone",
        ],
        correctAnswer: "Radio and Television",
        explanation: "Line 6 mentions radio and television.",
      },
      {
        id: 10,
        question: "Which came first: radio or internet?",
        options: ["Radio", "Internet"],
        correctAnswer: "Radio",
        explanation: "Radio came before internet historically.",
      },
      {
        id: 11,
        question:
          "True or False: Cave paintings are still the main communication method today.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Cave paintings are ancient methods.",
      },
      {
        id: 12,
        question: "Which communication method followed the telegraph?",
        options: ["Smoke signals", "Telephone", "Internet", "Radio"],
        correctAnswer: "Telephone",
        explanation: "Line 5: Telephone followed telegraph.",
      },
      {
        id: 13,
        question: "Internet enabled communication across:",
        options: [
          "Short distances",
          "Local towns",
          "Global scale",
          "Villages only",
        ],
        correctAnswer: "Global scale",
        explanation: "Line 7 mentions global transformation.",
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
        options: ["Solar", "Wind", "Coal", "Geothermal"],
        correctAnswer: "Coal",
        explanation: "Line 5: Coal is a fossil fuel, not a renewable source.",
      },
      {
        id: 15,
        question: "Solar energy comes from:",
        options: ["Wind", "Water", "Earth's heat", "Sunlight"],
        correctAnswer: "Sunlight",
        explanation: "Line 2 mentions sunlight as the source of solar energy.",
      },
      {
        id: 16,
        question: "True or False: Hydropower uses the movement of air.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Hydropower uses water, not air. (Line 3)",
      },
      {
        id: 17,
        question: "What does geothermal energy utilize?",
        options: ["Sunlight", "Wind", "Water", "Earth's internal heat"],
        correctAnswer: "Earth's internal heat",
        explanation: "Line 4: Geothermal energy uses Earth's heat.",
      },
      {
        id: 18,
        question: "Fossil fuels primarily contribute to:",
        options: [
          "Reduced emissions",
          "Harmful carbon emissions",
          "Cleaner air",
          "Global cooling",
        ],
        correctAnswer: "Harmful carbon emissions",
        explanation: "Line 5: Fossil fuels release carbon emissions.",
      },
      {
        id: 19,
        question: "Renewable energy helps combat:",
        options: [
          "Urbanization",
          "Global warming",
          "Overpopulation",
          "Water scarcity",
        ],
        correctAnswer: "Global warming",
        explanation: "Line 6: Renewable energy combats climate change.",
      },
      {
        id: 20,
        question: "True or False: Fossil fuels are replenished quickly.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Fossil fuels are not quickly replenished.",
      },
      {
        id: 21,
        question: "Hydropower primarily uses:",
        options: ["Wind", "Sunlight", "Water", "Heat"],
        correctAnswer: "Water",
        explanation: "Line 3 mentions water flow for hydropower.",
      },
      {
        id: 22,
        question: "What energy source is linked with air movement?",
        options: ["Solar", "Wind", "Hydro", "Geothermal"],
        correctAnswer: "Wind",
        explanation: "Line 2: Wind energy is created by air movement.",
      },
      {
        id: 23,
        question: "Renewable energy is considered:",
        options: ["Limited", "Non-renewable", "Sustainable", "Depletable"],
        correctAnswer: "Sustainable",
        explanation: "Line 6: Renewable energy ensures a sustainable future.",
      },
      {
        id: 24,
        question: "Which energy taps into the Earth's heat?",
        options: ["Solar", "Wind", "Hydro", "Geothermal"],
        correctAnswer: "Geothermal",
        explanation: "Line 4 states geothermal uses Earth's internal heat.",
      },
      {
        id: 25,
        question: "Which is a major reason for investing in renewable energy?",
        options: [
          "Reducing oil production",
          "Combating climate change",
          "Creating pollution",
          "Producing fossil fuels",
        ],
        correctAnswer: "Combating climate change",
        explanation:
          "Line 6: Renewable energy investment combats climate change.",
      },
      {
        id: 26,
        question: "True or False: Wind and solar energy are finite resources.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "They are renewable and replenished naturally.",
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
        question: "Urbanization is associated with:",
        options: [
          "Decreasing city populations",
          "More people living in cities",
          "More rural areas being built",
          "Reduced innovation",
        ],
        correctAnswer: "More people living in cities",
        explanation:
          "Line 1 defines urbanization as population growth in cities.",
      },
      {
        id: 28,
        question: "When did significant urbanization begin?",
        options: [
          "During Ancient times",
          "During the Industrial Revolution",
          "In the 21st century",
          "After World War II",
        ],
        correctAnswer: "During the Industrial Revolution",
        explanation: "Line 2: Industrial Revolution sparked urbanization.",
      },
      {
        id: 29,
        question: "Today, urban areas are centers for:",
        options: [
          "Farming",
          "Manufacturing only",
          "Education, commerce, innovation",
          "Pollution control",
        ],
        correctAnswer: "Education, commerce, innovation",
        explanation: "Line 3 mentions education, commerce, and innovation.",
      },
      {
        id: 30,
        question: "True or False: Urbanization solves housing shortages.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Line 4: Urbanization causes housing shortages.",
      },
      {
        id: 31,
        question: "What is a major challenge caused by rapid urbanization?",
        options: [
          "Technological decline",
          "Housing shortages",
          "Rural development",
          "Space exploration",
        ],
        correctAnswer: "Housing shortages",
        explanation: "Line 4 clearly states housing shortage as a challenge.",
      },
      {
        id: 32,
        question: "How can future cities address urban issues?",
        options: [
          "Ignoring them",
          "Focusing on manufacturing",
          "Sustainable development",
          "Encouraging rural migration",
        ],
        correctAnswer: "Sustainable development",
        explanation: "Line 5 emphasizes sustainable development.",
      },
      {
        id: 33,
        question: "Future transportation should be:",
        options: [
          "Private vehicles",
          "Green public transportation",
          "Cargo ships",
          "Airplanes",
        ],
        correctAnswer: "Green public transportation",
        explanation: "Line 5 mentions green transportation.",
      },
      {
        id: 34,
        question: "Green spaces in cities help to:",
        options: [
          "Increase pollution",
          "Improve air quality",
          "Raise traffic congestion",
          "Expand urban heat islands",
        ],
        correctAnswer: "Improve air quality",
        explanation: "Green spaces improve air quality (Line 5).",
      },
      {
        id: 35,
        question: "Which technology is NOT mentioned for future cities?",
        options: [
          "Smart grids",
          "Renewable energy integration",
          "Space mining",
          "Intelligent waste management",
        ],
        correctAnswer: "Space mining",
        explanation:
          "Line 6 lists smart grids, renewable energy, and waste management.",
      },
      {
        id: 36,
        question: "Smart grids in cities will help to:",
        options: [
          "Distribute renewable energy efficiently",
          "Increase fossil fuel use",
          "Raise congestion",
          "Promote urban sprawl",
        ],
        correctAnswer: "Distribute renewable energy efficiently",
        explanation: "Line 6: Smart grids distribute renewable energy.",
      },
      {
        id: 37,
        question:
          "True or False: Pollution decreases naturally with urbanization.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Urbanization increases pollution (Line 4).",
      },
      {
        id: 38,
        question: "Future cities should prioritize:",
        options: [
          "Building more highways",
          "Reducing green spaces",
          "Environmental sustainability",
          "Manufacturing industries",
        ],
        correctAnswer: "Environmental sustainability",
        explanation: "Line 5: Focus is on sustainability.",
      },
      {
        id: 39,
        question:
          "Which of the following is a method for managing city waste intelligently?",
        options: [
          "Dumping in oceans",
          "Intelligent waste management systems",
          "Burning trash in the streets",
          "Shipping waste to rural areas",
        ],
        correctAnswer: "Intelligent waste management systems",
        explanation: "Line 6: Intelligent waste management is listed.",
      },
      {
        id: 40,
        question: "Public transportation improvements aim to:",
        options: [
          "Increase private car usage",
          "Reduce congestion and emissions",
          "Encourage city expansion",
          "Promote fossil fuel consumption",
        ],
        correctAnswer: "Reduce congestion and emissions",
        explanation:
          "Green transportation reduces congestion/emissions (Line 5).",
      },
    ],
  },
];
