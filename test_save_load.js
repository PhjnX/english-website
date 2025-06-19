// Test Script để verify toàn bộ flow save/load data
// Chạy trong console để test

console.log("🧪 === Testing Save/Load Flow ===");

// 1. Clear existing data
localStorage.removeItem("user_completed_exercises");
console.log("✅ Cleared existing data");

// 2. Simulate saving a result
const testResult = {
  level: 4,
  readingNum: 1,
  title: "Reading 1",
  score: 25,
  totalQuestions: 40
};

console.log("🧪 Testing saveReadingPracticeResult with:", testResult);

// Mock the saveReadingPracticeResult function inline for testing
function testSaveReadingPracticeResult(result) {
  console.log("🔵 testSaveReadingPracticeResult called with:", result);
  
  try {
    const existingData = localStorage.getItem("user_completed_exercises");
    let exercises = existingData ? JSON.parse(existingData) : [];
    
    console.log("🔵 Current exercises in localStorage:", exercises.length);

    const exerciseId = `read_${result.level}_${result.readingNum}`;
    const standardizedTitle = `Reading ${result.readingNum}`;

    const existingIndex = exercises.findIndex(
      (ex) => ex.level === result.level && ex.readingNum === result.readingNum
    );

    const newExercise = {
      id: exerciseId,
      title: standardizedTitle,
      level: result.level,
      readingNum: result.readingNum,
      score: result.score,
      totalQuestions: result.totalQuestions,
      dateCompleted: new Date().toISOString(),
      type: "reading-practice",
    };

    console.log("🔵 New exercise object:", newExercise);

    if (existingIndex >= 0) {
      exercises[existingIndex] = newExercise;
      console.log("🟢 Updated existing exercise");
    } else {
      exercises.push(newExercise);
      console.log("🟢 Added new exercise");
    }

    localStorage.setItem("user_completed_exercises", JSON.stringify(exercises));
    console.log("✅ Saved to localStorage");
    
    return exercises;
  } catch (error) {
    console.error("❌ Error:", error);
    return null;
  }
}

// Test save
const savedExercises = testSaveReadingPracticeResult(testResult);

// 3. Verify save
const retrievedData = localStorage.getItem("user_completed_exercises");
if (retrievedData) {
  const parsed = JSON.parse(retrievedData);
  console.log("✅ Successfully retrieved from localStorage:", parsed.length, "exercises");
  console.log("📄 Data:", parsed);
  
  // 4. Test loading like Dashboard does
  console.log("🧪 Testing Dashboard fetchCompletedExercises logic");
  
  const uniqueExercises = parsed.filter((exercise, index, self) => {
    return index === self.findIndex((ex) => 
      ex.level === exercise.level && 
      ex.readingNum === exercise.readingNum &&
      ex.type === exercise.type
    );
  });

  const normalizedExercises = uniqueExercises.map((ex) => ({
    ...ex,
    title: ex.type === "reading-practice" ? `Reading ${ex.readingNum}` : ex.title
  }));

  console.log("✅ Dashboard processing result:", normalizedExercises.length, "exercises");
  console.log("📄 Normalized data:", normalizedExercises);
  
} else {
  console.error("❌ No data found in localStorage after save!");
}

console.log("🧪 === Test Complete ===");
