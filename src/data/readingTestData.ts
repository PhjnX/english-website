// src/data/readingTestData.ts
import Part1Img from "../assets/images/Part1.png";
import Part2Img from "../assets/images/Part2.png";
import Part3Img from "../assets/images/Part3.jpg";

export interface Question {
  id: number;
  question: string;
  questionType: "multiple-choice" | "select" | "input" | "true-false-notgiven";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  highlightSentence: string;
  sectionTitle?: string;
  subSectionTitle?: string;
}

export interface Part {
  partId: number;
  title: string;
  passage: string;
  questions: Question[];
  image?: string;
}

export const parts: Part[] = [
  {
    partId: 1,
    title: "Learning to Walk",
    image: Part1Img,
    passage: `These days the feet of a typical city dweller rarely encounter terrain any more uneven than a crack in the pavement. While that may not seem like a problem, it turns out that by flattening our urban environment we have put ourselves at risk of a surprising number of chronic illnesses and disabilities. Fortunately, the commercial market has come to the rescue with a choice of products. Research into the idea that flat floors could be detrimental to our health was pioneered back in the late 1960s in Long Beach, California. Podiatrist Charles Brantingham and physiologist Bruce Beekman were concerned with the growing epidemic of high blood pressure, varicose veins and deep-vein thromboses and reckoned they might be linked to the uniformity of the surfaces that we tend to stand and walk on.

The trouble, they believed, was that walking continuously on flat floors, sidewalks and streets concentrates forces on just a few areas of the foot. As a result, these surfaces are likely to be far more conducive to chronic stress syndromes than natural surfaces, where the foot meets the ground in a wide variety of orientations. They understood that the anatomy of the foot parallels that of the human hand - each having 26 bones, 33 joints and more than 100 muscles, tendons and ligaments - and that modern lifestyles waste all this potential flexibility.

Brantingham and Beekman became convinced that the damage could be rectified by making people wobble. To test their ideas, they got 65 factory workers to try standing on a variable terrain floor - spongy mats with varying degrees of resistance across the surface. This modest irregularity allowed the soles of the volunteers' feet to deviate slightly from the horizontal each time they shifted position. As the researchers hoped, this simple intervention made a huge difference, within a few weeks. Even if people were wobbling slightly, it activated a host of muscles in their legs, which in turn helped pump blood back to their hearts. The muscle action prevented the pooling of blood in their feet and legs, reducing the stress on the heart and circulation. Yet decades later, the flooring of the world's largest workplaces remains relentlessly smooth.

Earlier this year, however, the idea was revived when other researchers in the US announced findings from a similar experiment with people over 60. John Fisher and colleagues at the Oregon Research Institute in Eugene designed a mat intended to replicate the effect of walking on cobblestones*. In tests funded by the National Institute of Aging, they got some 50 adults to walk on the toots in their bare feet for less than an hour, three times a week. After 16 weeks, these people showed marked improvements in mobility, and even a significant reduction in blood pressure. People in a control group who walked on ordinary floors also improved but not as dramatically. The mats are now available for purchase and production is being scaled up. Even so, demand could exceed supply if this footstimulating activity really is a 'useful nonpharmacological approach for preventing or controlling hypertension of older adults, as the researchers believe. They are not alone in recognising the benefits of cobblestones. Reflexologists have long advocated walking on textured surfaces to stimulate so-called 'acupoints' on the soles of the feet. They believe that pressure applied to particular spots on the foot connects directly to particular organs of the body and somehow enhances their function. In China, spas, apartment blocks and even factories promote their cobblestone paths as healthful amenities. Fisher admits he got the concept from regular visits to the country. Here, city dwellers take daily walks along cobbled paths for five or ten minutes, perhaps several times a day, to improve their health. The idea is now taking off in Europe too.

People in Germany, Austria and Switzerland can now visit 'barefoot parks' and walk along 'paths of the senses - with mud, logs, stone and moss underfoot. And it is not difficult to construct your own path with simple everyday objects such as stones or bamboo poles. But if none of these solutions appeal, there is another option. A new shoe on the market claims to transform flat, hard, artificial surfaces into something like uneven ground. 'These shoes have an unbelievable effect,' says Benno Nigg, an exercise scientist at Calgary University in Canada.

Known as the Masai Barefoot Technology, the shoes have rounded soles that cause you to rock slightly when you stand still, exercising the small muscles around the ankle that are responsible for stability. Forces in the joint are reduced, putting less strain on the system, Nigg claims.

Some of these options may not appeal to all consumers and there is a far simpler alternative.

If the urban environment is detrimental to our health, then it is obvious where we should turn. A weekend or even a few hours spent in the countryside could help alleviate a sufferer's aches and pains, and would require only the spending of time.

However, for many modern citizens, the countryside is not as accessible as it once was and is in fact a dwindling resource. Our concrete cities are growing at a terrifying rate - perhaps at the same rate as our health problems.`,
    questions: [
      {
        id: 1,
        question:
          "Brantingham and Beekman were the first researchers to investigate the relationship between health problems and flat floors.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "True",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 2,
        question:
          "The subjects in Fisher's control group experienced a decline in their physical condition.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "False",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 3,
        question:
          "The manufacturers are increasing the number of cobblestone mats they are making.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "True",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 4,
        question:
          "Fisher based his ideas on what he saw during an overseas trip.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "True",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 5,
        question:
          "The Masai Barefoot Technology shoes are made to fit people of all ages.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "Not Given",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 6,
        question:
          "The writer suggests that Brantingham and Beekman's findings were",
        questionType: "multiple-choice",
        options: [
          "ignored by big companies.",
          "doubted by other researchers.",
          "applicable to a narrow range of people.",
          "surprising to them.",
        ],
        correctAnswer: "ignored by big companies.",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 7,
        question:
          'What claim is made by the designers of the cobblestone mats"?',
        questionType: "multiple-choice",
        options: [
          "They need to be used continuously in order to have a lasting effect.",
          "They would be as beneficial to younger people as to older people.",
          "They could be an effective alternative to medical intervention.",
          "Their effects may vary depending on individual users.",
        ],
        correctAnswer:
          "They could be an effective alternative to medical intervention.",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 8,
        question:
          "Which of the following points does the writer make in the final paragraph?",
        questionType: "multiple-choice",
        options: [
          "People should question new theories that scientists put forward.",
          "High prices do not necessarily equate to a quality product.",
          "People are setting up home in the country for health reasons.",
          "The natural environment is fast disappearing.",
        ],
        correctAnswer: "The natural environment is fast disappearing.",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 9,
        questionType: "input",
        question: `
          In their research, Brantingham and Beekman looked at the complex physical {{9}} of the foot and noted that the surfaces of modern environments restrict its movement. They invented a mat which they tried out on factory workers. Whenever the workers walked on it, the different levels of {{10}} in the mat would encourage greater muscle action. In turn, this lessened the effect of {{11}} on the cardiovascular system.
      
          Similar research was undertaken by John Fisher and colleagues in Oregon. As a result of their findings, they decided to market cobblestone mats to the elderly as a means of dealing with {{12}}. Reflexologists claim that by manipulating specific parts of the feet, the performance of certain {{13}} will also improve. Finally, Benno Nigg at Calgary University believes that specially shaped {{14}} on shoes should give health benefits.
        `,
        correctAnswer: "",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 10,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "levels",
        explanation:
          "The passage explains that different levels in the mat encourage muscle activity.",
        highlightSentence:
          "the different levels of X in the mat would encourage greater muscle action.",
      },
      {
        id: 11,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "pressure",
        explanation:
          "The mat's function is to reduce cardiovascular system pressure.",
        highlightSentence:
          "this lessened the effect of pressure on the cardiovascular system.",
      },
      {
        id: 12,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "pain",
        explanation:
          "It was used as a solution for elderly people suffering from pain.",
        highlightSentence: "to the elderly as a means of dealing with pain.",
      },
      {
        id: 13,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "organs",
        explanation:
          "Reflexologists claim that foot manipulation improves certain organs.",
        highlightSentence:
          "the performance of certain organs will also improve.",
      },
      {
        id: 14,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "patterns",
        explanation: "Specially shaped patterns on shoes may enhance health.",
        highlightSentence:
          "specially shaped patterns on shoes should give health benefits.",
      },
    ],
  },
  {
    partId: 2,
    title: "Australian artist Margaret Preston",
    image: Part2Img,
    passage: `Margaret Preston's vibrant paintings and prints of Australian flowers, animals and landscapes have delighted the Australian public since the early 1920s.

Margaret Preston was born Margaret Rose McPherson in Port Adelaide, South Australia in 1875, the daughter of David McPherson, a Scottish marine engineer and his wife Prudence Lyle. She and her sister were sent at first to a private school, but when family circumstances changed, her mother took the girls to Sydney where Margaret attended a public high school. She decided early in life to become an artist and took private art lessons. In 1888, she trained for several months with Sydney landscape painter William Lister, and in 1893 enrolled at the National Gallery of Victoria Art School, where she studied for just over four years.

In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner.

Margaret's first visit to Europe in 1904, and her studies in Paris, France had little impact on this naturalism that dominated her work from this early period. However some eight years later, after returning to Paris, she began to recognise the decorative possibilities of art.

With the outbreak of the First World War, Margaret traveled to England, where she had exhibitions and continued her studies of art. She was a student of pottery, but at some time developed her interest in various techniques of printmaking and design. In England's West Country, she taught basket weaving at a rehabilitation unit for servicemen. It was on board a boat returning to Australia that she met wealthy businessman William Preston, whom she married in 1919. Together Margaret and William settled in the Sydney harbourside suburb of Mosman. The most characteristic prints from her early years in Sydney are views of boats floating on Sydney Harbour and of houses clustered on foreshore hills. Although Sydney was their home, the couple traveled regularly, both overseas and within Australia.

Her first major showing in Australia was with her friend Thea Proctor, in exhibitions in Melbourne and Sydney in 1925. Many of Preston's prints were hand-coloured in rich scarlet reds, blues and greens, and all of them were set in Chinese red lacquer frames. Harbour views were again prominent, but in comparison with earlier artworks, they were compact and busy. using striking contrasts of black and white combined with elaborate patterns and repetitions. Other prints from this period featured native flora. It was with these still-life subjects that she convinced the public that Australian native flowers were equal in beauty to any exotic species.

From 1932 to 1939, Preston moved away from Sydney and lived with her husband at Berowra, on the upper reaches of the Hawkesbury River. The area was one of rugged natural beauty, and for the first time Preston found herself living in a home surrounded bush. Prior to this, the native flowers that featured in her paintings and prints had been purchased from local florists; they now grew in abundance around her home. Preston's prints became larger, less complex and less reliant on the use of bright colours. Flowers were no longer arranged in vases, and Preston began to concentrate instead on flowers that were growing wild.

While living at Berowra, and undoubtedly prompted by the Aboriginal' rock engravings found near her property, Preston also developed what was to he a lifelong interest in Aboriginal art. On returning to Sydney in 1939, she became a member of the Anthropological Society of New South Wales, and later visited many important Aboriginal sites throughout Australia. Preston believed that Aboriginal art provided the key to establishing a national body of art that reflected the vast and ancient continent of Australia.

During the 1940s, symbols used by Aboriginal people, together with dried, burnt colours found in traditional Aboriginal paintings, became increasingly prominent in her prints. The artist's titles from this period frequently acknowledge her sources, and reveal the extent to which she drew inspiration from traditional Aboriginal art to create her own art.

It was in 1953, at the age of 78, that Preston produced her most significant prints. The exhibition at Macquarie Galleries in Sydney included 29 prints made using the ancient technique known as stenciling. Many of the artworks in the exhibition incorporated her fusion of Aboriginal and Chinese concepts. Preston had admired Chinese art since 1915, when she acquired the first of her many books on the subject, and she had visited China on two occasions. Chinese elements may be found in several of her earlier paintings.

However, in her prints of the 1950s, Preston combined Chinese ideas with her understanding of the Dreamtime' creation stories of Aboriginal Australians. Preston did not let age alter her habit of working hard. As she got older, her love of painting, printmaking and travel continued. By the time of her death in 1963, when she was 88, she had produced over 400 paintings and prints. In a career spanning almost 60 years, she created a body of work that demonstrates her extraordinary originality and the intensity of her commitment to Australian art.`,
    questions: [
      {
        id: 15,
        question:
          "Artists in the German aesthetic tradition portrayed nature realistically.",
        questionType: "true-false-notgiven",
        correctAnswer: "True",
        explanation:
          "Theo bài, các nghệ sĩ trong trường phái Đức vẽ thiên nhiên một cách thực tế.",
        highlightSentence: "...",
      },
      {
        id: 16,
        question: "Margaret attended a famous art college in Paris.",
        questionType: "true-false-notgiven",
        correctAnswer: "Not Given",
        explanation: "Không có thông tin về việc học ở Paris.",
        highlightSentence: "...",
      },
      {
        id: 17,
        question:
          "Margaret met her husband William while teaching a craft at a rehabilitation unit.",
        questionType: "true-false-notgiven",
        correctAnswer: "False",
        explanation:
          "Họ gặp nhau trong hoàn cảnh khác (không tại trung tâm phục hồi chức năng).",
        highlightSentence: "...",
      },
      {
        id: 18,
        question:
          "Margaret Preston and Thea Proctor explored similar themes in their art.",
        questionType: "true-false-notgiven",
        correctAnswer: "Not Given",
        explanation: "Không có thông tin so sánh chủ đề giữa hai người.",
        highlightSentence: "...",
      },
      {
        id: 19,
        question:
          "Margaret's 1925 artworks of Sydney Harbour were simpler than her previous ones.",
        questionType: "true-false-notgiven",
        correctAnswer: "Not Given",
        explanation: "Không có so sánh nào được đề cập.",
        highlightSentence: "...",
      },
      {
        id: 20,
        question: "The colours in Margaret's Berowra prints were very bright.",
        questionType: "true-false-notgiven",
        correctAnswer: "False",
        explanation: "Màu sắc không được mô tả là sáng rõ.",
        highlightSentence: "...",
      },
      {
        id: 21,
        question:
          "When living in Berowra, Margaret painted flowers in their natural location.",
        questionType: "true-false-notgiven",
        correctAnswer: "True",
        explanation: "Bài có nói cô ấy vẽ hoa tại chính nơi chúng mọc.",
        highlightSentence: "...",
      },
      {
        id: 22,
        questionType: "input",
        question:
          "incorporated {} and colours from Aboriginal art in her own work",
        correctAnswer: "symbols",
        explanation:
          "She incorporated Aboriginal symbols and colours into her work.",
        highlightSentence: "...",
        sectionTitle: "Margaret Preston's later life",
        subSectionTitle: "Aboriginal influence",
      },
      {
        id: 23,
        questionType: "input",
        question:
          "often referred to Aboriginal sources in the {} she gave her artworks",
        correctAnswer: "titles",
        explanation:
          "She often used Aboriginal sources in the titles she gave her artworks.",
        highlightSentence: "...",
      },
      {
        id: 24,
        questionType: "input",
        question: "Very old method of {} was used for some prints",
        correctAnswer: "stenciling",
        explanation: "The prints used stenciling, an old traditional method.",
        highlightSentence: "...",
        subSectionTitle: "1953 exhibition",
      },
      {
        id: 25,
        questionType: "input",
        question:
          "Was inspired by {} about Chinese art that she had started collecting in 1915",
        correctAnswer: "books",
        explanation: "Books about Chinese art inspired her greatly.",
        highlightSentence: "...",
      },
      {
        id: 26,
        questionType: "input",
        question: "Still interested in {} and art",
        correctAnswer: "painting",
        explanation:
          "Even late in life, she was interested in painting and art.",
        highlightSentence: "...",
        subSectionTitle: "Old age",
      },
      {
        id: 27,
        questionType: "input",
        question: "Worked for nearly six decades making more than {} artworks",
        correctAnswer: "400",
        explanation: "She created more than 400 artworks in her lifetime.",
        highlightSentence: "...",
      },
    ],
  },
  {
    partId: 3,
    title: "Mind Music",
    image: Part3Img,
    passage: `Scientists investigate 'earworms', the music we can't get out of our head

A Ever had a song stuck in your head, playing on an endless loop? Scientists call them 'involuntary musical images', or 'earworms, and a wave of new research is shining light on why they occur and what can be learned from them. Some neuroscientists and cognitive psychologists are studying earworms to explore the mysteries of memory and the part of the brain that is beyond our conscious control. The idea that we have full control over our thought processes is an illusion,' says psychologist Lauren Stewart, who founded the master's program in music, mind and brain at Goldsmiths, University of London, UK, where recent research has taken place. Researchers haven't been able to watch what happens in the brain when earworms occur, because they happen unpredictably. Much of what is known about them comes from surveys, questionnaires, diaries and lab experiments.

B A Goldsmiths study published in the journal Memory and Cognition this year showed that the singing we hear in our heads tends to be true to actual recordings. Researchers had 17 volunteers tap to the beat of any earworm they heard during a four-day period while a device attached to their wrist recorded their movements. The tapping tempos were within 10% of the tempos of the original recordings. Another Goldsmiths study, published this year in Consciousness and Cognition, found that people who report hearing earworms often, and find them most intrusive, have slightly different brain structures, with more gray matter in areas associated with processing emotions.

C Studies also show that the music in our heads often starts playing during times of 'low cognitive load', such as while showering, getting dressed, walking, or doing chores. Dr Stewart likens earworms to 'sonic screen savers' that keep the mind entertained while it is otherwise unoccupied. She and her colleagues tested that theory by having volunteers listen to songs and giving them various tasks afterwards. The volunteers who sat idly for the next five minutes were the most likely to report hearing the music m their heads. Dr Stewart observed that the more challenging the activity, the less likely the volunteers were to hear the music. Diary studies also show songs tend to match people's moods and therefore they are not random. If you are energized and upbeat, an earworm that occurs is likely to be uptempo too.

D Songs the brain fixates on are usually those it has been exposed to recently, surveys show, which is why tunes getting heavy radio play frequently top the earworm charts. Even tunes you may have heard but didn't pay attention to can worm their way into your subconscious, says Ira Hyman, a psychologist at Western Washington University in Bellingham, USA. In an unpublished study there, participants who listened to music while doing other tasks were more likely to report that the songs returned as earworms later on, compared with participants who simply listened.

E Some earworms are just fragments of a song that repeat like a broken record. So, when the mind hits a part of a song it can't remember, it loops back rather than moving on. That could make an earworm even more entrenched, Dr Hyman says. According to a theory known as the Zeigarik effect, named for a Soviet psychologist, Bluma Zeigarnik, unfinished thoughts and activities weigh on the mind more heavily than those that are completed, although experiments exposing students to interrupted songs have yielded mixed results.

F Researchers say they can't pinpoint a spot in the brain where earworms live. Imaging studies by Andrea Halpern at Bucknell University, in Lewisburg, USA, have shown that deliberately imagining music and actually listening to music activate many of the same neurological networks. Dr Halpern's earlier studies showed that when subjects listened to the first few notes of familiar music, areas in the right frontal and superior temporal portions of the brain became activated, along with the supplementary motor area at the top, which is typically involved in remembering sequences. When the same subjects listened to unfamiliar music and were asked to recall it, there was activity in the left frontal portions of the brain instead.

G One factor that makes some songs stick might be repetition. 'Repetition leads to familiarity which leads to anticipation, which is satisfied by hearing the song,' says John Seabrook, author of The Song Machine: Inside the Hit Factory, about how producers pump pop songs full of aural "hooks', the punchy melodic phrases designed to target the brain and leave it wanting more. The researchers are comparing the melodic structure of 100 often-mentioned songs with 100 similarly popular songs that weren't cited as earworms, to assess the difference. Songs with earworm potential appear to share certain features: a repeating pattern of ups and downs in pitch, and an irregular musical interval.

H The researchers plan next to test their results in reverse, and play ringtones from songs of both the earworm and non earworm variety for volunteers several times a day to see which ones get stuck. Drs Stewart and Halper are now working together to recruit survey participants for a study looking at whether people at different stages of life experience earworms differently. 'You can argue that older people might get them more often because they know more songs,' Dr Halpern says. 'But the few responses we have so far indicate that they have earworms less often. It could be that they don't play music as often as younger people do.`,
    questions: [
      // Questions 28–31: Select A–H
      {
        id: 28,
        questionType: "select",
        question:
          "a description of the characteristics common to songs with earworms",
        correctAnswer: "A",
        options: ["A", "B", "C", "D", "E", "F", "G", "H"],
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 29,
        questionType: "select",
        question: "a justification for research into earworms",
        correctAnswer: "E",
        options: ["A", "B", "C", "D", "E", "F", "G", "H"],
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 30,
        questionType: "select",
        question:
          "a description of the brain's reaction to known and unknown songs",
        correctAnswer: "D",
        options: ["A", "B", "C", "D", "E", "F", "G", "H"],
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 31,
        questionType: "select",
        question:
          "details of proposed research into the frequency with which earworms occur in different age groups",
        correctAnswer: "H",
        options: ["A", "B", "C", "D", "E", "F", "G", "H"],
        explanation: "",
        highlightSentence: "",
      },

      // Questions 32–35: Summary Input (1 đoạn paragraph duy nhất)
      {
        id: 32,
        questionType: "input",
        question: `Researchers from Goldsmiths concluded that the music we imagine in our minds is quite similar to recordings. They proved this by asking volunteers to record the rhythm of music using a monitor on their {{32}}. Further research has demonstrated that those who hear earworms more frequently have brains that may deal with {{33}} differently from other people, Dr Stewart also believes that the brain is {{34}} by earworms when it is not focused on a task. In fact, a reduction in the occurrence of earworms was found to be directly related to how {{35}} the task was. Interestingly, volunteers' diaries revealed that the songs they heard inside their head reflected their moods, so the choice of music is not accidental.`,
        correctAnswer: "wrist",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 33,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "emotions",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 34,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "unoccupied",
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 35,
        questionType: "input",
        question: "{{paragraph}}",
        correctAnswer: "challenging",
        explanation: "",
        highlightSentence: "",
      },

      // Questions 36–40: Select A–D (matching researchers)
      {
        id: 36,
        questionType: "select",
        question:
          "Some musicians create music that is intentionally memorable.",
        correctAnswer: "C",
        options: ["A", "B", "C", "D"],
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 37,
        questionType: "select",
        question: "People are unable to completely regulate how they think.",
        correctAnswer: "A",
        options: ["A", "B", "C", "D"],
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 38,
        questionType: "select",
        question:
          "We can remember songs without knowing that we have heard them.",
        correctAnswer: "B",
        options: ["A", "B", "C", "D"],
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 39,
        questionType: "select",
        question:
          "Thinking about music has a similar effect on the brain to hearing music.",
        correctAnswer: "C",
        options: ["A", "B", "C", "D"],
        explanation: "",
        highlightSentence: "",
      },
      {
        id: 40,
        questionType: "select",
        question:
          "Earworms are more persistent when only a short section of the song is constantly replayed.",
        correctAnswer: "B",
        options: ["A", "B", "C", "D"],
        explanation: "",
        highlightSentence: "",
      },
    ],
  },
];
